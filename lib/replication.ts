import { AnyObject, type EqualityFilter } from "./filters";
import {
  CHANNEL_PREFIX,
  fromEntries,
  getEntries,
  getJSONBSchemaValidationError,
  getSerialisableError,
  isDefined,
  isObject,
  stableStringify,
  type FieldFilter,
  type JSONB,
  type MaybePromise,
} from "./index";

/**
 * Response from server to set up a sync channel
 */
export type SyncConfig = {
  id_fields: string[];
  synced_field: string;
  channelName: string;
};

/**
 * If no data on client then will return { c_count: 0 }
 */
export type ClientSyncInfo = {
  c_fr?: AnyObject;
  c_lr?: AnyObject;
  /**
   * PG count is usually string due to bigint
   */
  c_count: number;
};

export type onUpdatesParams =
  | {
      err?: AnyObject;
    }
  | {
      /**
       * TRUE after server had sent/pulled all data and both databases are in sync now.
       * Client will notify listeners with all data items
       */
      isSynced: boolean;
    }
  | {
      /**
       * Ordered data
       */
      data: AnyObject[];
    };

export type ClientExpressData = Required<ClientSyncInfo> & {
  data: AnyObject[];
};

export type ClientSyncPullResponse =
  | {
      data: AnyObject[];
    }
  | {
      err: AnyObject;
    };

/**
 * Query sent from server to sync a batch of data
 * data must be sorted by
 */
export type SyncBatchParams = {
  /**
   * Minimum value of the synced field. If missing then take from the lowest available (if no offset)
   * Must take >= from_synced
   */
  from_synced?: number;

  /**
   * maximum value of the synced field. If missing then take up to highest available (if no limit and offset)
   * Must take <= to_synced
   */
  to_synced?: number;

  /**
   * Number of rows to skip from from_synced value.
   */
  offset?: number;

  /**
   * Maximum number of rows to take
   */
  limit?: number;
};

export type ClientSyncHandles = {
  /**
   * Used by client to notify server that data has changed (and send express data if necessary)
   * Also used by server to request client ClientSyncInfo
   */
  onSyncRequest: (
    params: SyncBatchParams,
  ) => ClientSyncInfo | ClientExpressData | Promise<ClientSyncInfo | ClientExpressData>;

  /**
   * Used to respond to server with the requested data
   * @description: server will send { onPullRequest: { from_synced, limit, ...etc } }
   */
  onPullRequest: (
    params: SyncBatchParams,
  ) => ClientSyncPullResponse | Promise<ClientSyncPullResponse>;

  /**
   * Used to set the data sent by server.
   * Must acknowledge so server can send next batch if necessary
   * @description: server will send { onUpdates: { data } }
   */
  onUpdates: (params: onUpdatesParams) => Promise<true>;
};

export const getSyncChannelName = ({
  tableName,
  filter = {},
  select = "*",
}: {
  tableName: string;
  filter: EqualityFilter<AnyObject> | undefined;
  select: FieldFilter | undefined;
}) =>
  [
    CHANNEL_PREFIX,
    tableName,
    "sync",
    stableStringify(filter),
    typeof select === "string" ? select : stableStringify(select),
  ].join(".");

export type SocketCallback = (err?: unknown, res?: unknown) => void;

type RequestBase = {
  name: string;
  source: "client" | "server";
  request: Omit<JSONB.FieldTypeObj, "optional">;
  response: Omit<JSONB.FieldTypeObj, "optional">;
};
export namespace ReplicationProtocol {
  export const CreateSchema = {
    name: "Create",
    source: "client",
    request: {
      type: {
        tableName: "string",
        command: { enum: ["sync"] },
        /** Filter */
        param1: {
          record: { values: "unknown" },
        },
        /** Select */
        param2: { type: { select: "unknown" } },
      },
    },
    response: {
      type: {
        id_fields: "string[]",
        synced_field: "string",
        channelName: "string",
        data: "any[]",
        isSynced: "boolean",
      },
    },
  } as const satisfies RequestBase;

  export type CreateSchemaRequest = JSONB.GetType<typeof CreateSchema.request>;
  export type CreateSchemaResponse = JSONB.GetType<typeof CreateSchema.response>;

  const ClientSyncInfoSchema = {
    state: { enum: ["syncing"] },
    c_fr: { optional: true, record: { values: "unknown" } },
    c_lr: { optional: true, record: { values: "unknown" } },
    c_count: "number",
  } as const satisfies JSONB.ObjectType["type"];

  const ClientExpressDataSchema = {
    state: { enum: ["syncing-data"] },
    c_fr: { record: { values: "unknown" } },
    c_lr: { record: { values: "unknown" } },
    c_count: "number",
    data: {
      arrayOf: {
        record: { values: "unknown" },
      },
    },
  } as const satisfies JSONB.ObjectType["type"];

  export const ServerSyncRequest = {
    name: "ServerSyncRequest",
    source: "server",
    request: {
      type: {
        from_synced: { oneOf: ["string", { enum: [null] }] },
        to_synced: { oneOf: ["string", { enum: [null] }] },
        end_offset: { oneOf: ["number", { enum: [null] }] },
      },
    },
    response: {
      oneOfType: [
        ClientSyncInfoSchema,
        ClientExpressDataSchema,
        {
          state: { enum: ["error"] },
          err: "unknown",
        },
      ],
    },
  } as const satisfies RequestBase;

  export const ClientSyncRequest = {
    name: "ClientSyncRequest",
    source: "client",
    request: {
      oneOfType: [ClientSyncInfoSchema, ClientExpressDataSchema],
    },
    response: {
      type: { ok: { enum: [true] } },
    },
  } as const satisfies RequestBase;

  export const PullRequest = {
    name: "PullRequest",
    source: "server",
    request: {
      type: {
        from_synced: { oneOf: ["string", { enum: [undefined] }] },
        to_synced: { oneOf: ["string", { enum: [undefined] }] },
        offset: { oneOf: ["number", { enum: [undefined] }] },
        limit: { oneOf: ["number", { enum: [undefined] }] },
      },
    },
    response: {
      oneOfType: [
        {
          success: { enum: [true] },
          data: { arrayOf: { record: { values: "unknown" } } },
        },
        {
          success: { enum: [false] },
          err: "unknown",
        },
      ],
    },
  } as const satisfies RequestBase;

  export const UpdateRequest = {
    name: "UpdateRequest",
    source: "server",
    request: {
      oneOfType: [
        {
          state: { enum: ["error"] },
          err: "unknown",
        },
        {
          state: { enum: ["synced"] },
          isSynced: "boolean",
        },
        {
          state: { enum: ["syncing"] },
          data: { arrayOf: { record: { values: "unknown" } } },
        },
      ],
    },
    response: {
      oneOfType: [
        {
          success: { enum: [true] },
        },
        {
          success: { enum: [false] },
          err: "unknown",
        },
      ],
    },
  } as const satisfies RequestBase;

  const Schemas = { ClientSyncRequest, ServerSyncRequest, PullRequest, UpdateRequest } as const;
  type SchemasType = typeof Schemas;
  const SchemasList = Object.values(Schemas);

  type IncomingHandlers<Side extends RequestBase["source"]> = {
    [K in keyof SchemasType as SchemasType[K]["source"] extends Side ? never : K]: (
      params: JSONB.GetType<SchemasType[K]["request"]>,
    ) => Promise<JSONB.GetType<SchemasType[K]["response"]>>;
  };

  type OutgoingHandlers<Side extends RequestBase["source"]> = {
    [K in keyof SchemasType as SchemasType[K]["source"] extends Side ? K : never]: (
      params: JSONB.GetType<SchemasType[K]["request"]>,
    ) => Promise<JSONB.GetType<SchemasType[K]["response"]>>;
  };

  const getHandlers = <Side extends RequestBase["source"]>(
    channelName: string,
    socket: {
      on: (
        channelName: string,
        request: (data: unknown, cb: SocketCallback) => MaybePromise<void>,
      ) => void;
      emit: (
        channelName: string,
        request: unknown,
        response: (response: unknown) => MaybePromise<void>,
      ) => void;
      removeAllListeners: (channelName: string) => void;
    },
    side: Side,
    onResponse: IncomingHandlers<Side>,
  ): OutgoingHandlers<Side> => {
    socket.removeAllListeners(channelName);
    socket.on(channelName, async (requestRaw, cb) => {
      const { type, request } = isObject(requestRaw) ? requestRaw : {};
      if (typeof type !== "string" || !request) {
        cb("Unexpected data");
        return;
      }

      const schema = SchemasList.find((s) => s.name === type && s.source !== side);
      if (!schema) {
        cb("Invalid data.type");
        return;
      }

      if (schema.source === side) {
        cb("Invalid schema.source");
        return;
      }

      /** Must validate incoming data */
      if (side === "server") {
        if (schema.source === "server") {
          const validationResult = getJSONBSchemaValidationError(schema.request, request);
          if (validationResult.error !== undefined) {
            console.error("Invalid request from client", validationResult.error, request);
            cb(validationResult.error);
            return;
          }
        }
      }
      const schemaName = schema.name as keyof typeof onResponse;
      try {
        const response = await onResponse[schemaName](request);
        cb(undefined, response);
      } catch (err) {
        cb(getSerialisableError(err));
      }
    });

    const outgoingSchemas = fromEntries(
      getEntries(Schemas)
        .map(([key, schema]) => {
          if (schema.source !== side) {
            return undefined;
          }
          return [
            key,
            (request: unknown) => {
              return new Promise((resolve, reject) => {
                socket.emit(channelName, { type: schema.name, request }, (response: unknown) => {
                  if (side === "server") {
                    const validationResult = getJSONBSchemaValidationError(
                      schema.response,
                      response,
                    );
                    if (validationResult.error !== undefined) {
                      console.error(
                        "Invalid response from client",
                        validationResult.error,
                        response,
                      );
                      reject(validationResult.error);
                      return;
                    }
                  }
                  resolve(response);
                });
              });
            },
          ] as const;
        })
        .filter(isDefined),
    );

    return outgoingSchemas as OutgoingHandlers<Side>;
  };

  export const getServerHandlers = (
    channelName: string,
    socket: Parameters<typeof getHandlers>[1],
    onResponse: IncomingHandlers<"server">,
  ) => getHandlers(channelName, socket, "server", onResponse);

  export const getClientHandlers = (
    channelName: string,
    socket: Parameters<typeof getHandlers>[1],
    onResponse: IncomingHandlers<"client">,
  ) => getHandlers(channelName, socket, "client", onResponse);
}
