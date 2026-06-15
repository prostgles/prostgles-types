"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReplicationProtocol = exports.getSyncChannelName = void 0;
const index_1 = require("./index");
const getSyncChannelName = ({ tableName, filter = {}, select = "*", }) => [
    index_1.CHANNEL_PREFIX,
    tableName,
    "sync",
    (0, index_1.stableStringify)(filter),
    typeof select === "string" ? select : (0, index_1.stableStringify)(select),
].join(".");
exports.getSyncChannelName = getSyncChannelName;
var ReplicationProtocol;
(function (ReplicationProtocol) {
    ReplicationProtocol.CreateSchema = {
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
    };
    const ClientSyncInfoSchema = {
        state: { enum: ["syncing"] },
        c_fr: { optional: true, record: { values: "unknown" } },
        c_lr: { optional: true, record: { values: "unknown" } },
        c_count: "number",
    };
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
    };
    ReplicationProtocol.ServerSyncRequest = {
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
    };
    ReplicationProtocol.ClientSyncRequest = {
        name: "ClientSyncRequest",
        source: "client",
        request: {
            oneOfType: [ClientSyncInfoSchema, ClientExpressDataSchema],
        },
        response: ReplicationProtocol.ServerSyncRequest.response,
    };
    ReplicationProtocol.PullRequest = {
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
    };
    ReplicationProtocol.UpdateRequest = {
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
    };
    const Schemas = { ClientSyncRequest: ReplicationProtocol.ClientSyncRequest, ServerSyncRequest: ReplicationProtocol.ServerSyncRequest, PullRequest: ReplicationProtocol.PullRequest, UpdateRequest: ReplicationProtocol.UpdateRequest };
    const SchemasList = Object.values(Schemas);
    ReplicationProtocol.getHandlers = (channelName, socket, side, onResponse) => {
        socket.removeAllListeners(channelName);
        socket.on(channelName, async (requestRaw, cb) => {
            const { type, request } = (0, index_1.isObject)(requestRaw) ? requestRaw : {};
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
                    const validationResult = (0, index_1.getJSONBSchemaValidationError)(schema.request, request);
                    if (validationResult.error !== undefined) {
                        console.error("Invalid request from client", validationResult.error, request);
                        cb(validationResult.error);
                        return;
                    }
                }
            }
            const schemaName = schema.name;
            try {
                const response = await onResponse[schemaName](request);
                cb(undefined, response);
            }
            catch (err) {
                cb((0, index_1.getSerialisableError)(err));
            }
        });
        const outgoingSchemas = (0, index_1.fromEntries)((0, index_1.getEntries)(Schemas)
            .map(([key, schema]) => {
            if (schema.source !== side) {
                return undefined;
            }
            return [
                key,
                (request) => {
                    return new Promise((resolve, reject) => {
                        socket.emit(channelName, { type: schema.name, request }, (response) => {
                            if (side === "server") {
                                const validationResult = (0, index_1.getJSONBSchemaValidationError)(schema.response, response);
                                if (validationResult.error !== undefined) {
                                    console.error("Invalid response from client", validationResult.error, response);
                                    reject(validationResult.error);
                                    return;
                                }
                            }
                            resolve(response);
                        });
                    });
                },
            ];
        })
            .filter(index_1.isDefined));
        return outgoingSchemas;
    };
})(ReplicationProtocol || (exports.ReplicationProtocol = ReplicationProtocol = {}));
//# sourceMappingURL=replication.js.map