import { AnyObject, type EqualityFilter } from "./filters";
import { type FieldFilter, type JSONB, type MaybePromise } from "./index";
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
export type onUpdatesParams = {
    err?: AnyObject;
} | {
    /**
     * TRUE after server had sent/pulled all data and both databases are in sync now.
     * Client will notify listeners with all data items
     */
    isSynced: boolean;
} | {
    /**
     * Ordered data
     */
    data: AnyObject[];
};
export type ClientExpressData = Required<ClientSyncInfo> & {
    data: AnyObject[];
};
export type ClientSyncPullResponse = {
    data: AnyObject[];
} | {
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
    onSyncRequest: (params: SyncBatchParams) => ClientSyncInfo | ClientExpressData | Promise<ClientSyncInfo | ClientExpressData>;
    /**
     * Used to respond to server with the requested data
     * @description: server will send { onPullRequest: { from_synced, limit, ...etc } }
     */
    onPullRequest: (params: SyncBatchParams) => ClientSyncPullResponse | Promise<ClientSyncPullResponse>;
    /**
     * Used to set the data sent by server.
     * Must acknowledge so server can send next batch if necessary
     * @description: server will send { onUpdates: { data } }
     */
    onUpdates: (params: onUpdatesParams) => Promise<true>;
};
export declare const getSyncChannelName: ({ tableName, filter, select, }: {
    tableName: string;
    filter: EqualityFilter<AnyObject> | undefined;
    select: FieldFilter | undefined;
}) => string;
export type SocketCallback = (err?: unknown, res?: unknown) => void;
type RequestBase = {
    name: string;
    source: "client" | "server";
    request: Omit<JSONB.FieldTypeObj, "optional">;
    response: Omit<JSONB.FieldTypeObj, "optional">;
};
export declare namespace ReplicationProtocol {
    export const CreateSchema: {
        readonly name: "Create";
        readonly source: "client";
        readonly request: {
            readonly type: {
                readonly tableName: "string";
                readonly command: {
                    readonly enum: readonly ["sync"];
                };
                /** Filter */
                readonly param1: {
                    readonly record: {
                        readonly values: "unknown";
                    };
                };
                /** Select */
                readonly param2: {
                    readonly type: {
                        readonly select: "unknown";
                    };
                };
            };
        };
        readonly response: {
            readonly type: {
                readonly id_fields: "string[]";
                readonly synced_field: "string";
                readonly channelName: "string";
                readonly data: "any[]";
                readonly isSynced: "boolean";
            };
        };
    };
    export const ServerSyncRequest: {
        readonly name: "ServerSyncRequest";
        readonly source: "server";
        readonly request: {
            readonly type: {
                readonly from_synced: {
                    readonly oneOf: readonly ["string", {
                        readonly enum: readonly [null];
                    }];
                };
                readonly to_synced: {
                    readonly oneOf: readonly ["string", {
                        readonly enum: readonly [null];
                    }];
                };
                readonly end_offset: {
                    readonly oneOf: readonly ["number", {
                        readonly enum: readonly [null];
                    }];
                };
            };
        };
        readonly response: {
            readonly oneOfType: readonly [{
                readonly state: {
                    readonly enum: readonly ["syncing"];
                };
                readonly c_fr: {
                    readonly optional: true;
                    readonly record: {
                        readonly values: "unknown";
                    };
                };
                readonly c_lr: {
                    readonly optional: true;
                    readonly record: {
                        readonly values: "unknown";
                    };
                };
                readonly c_count: "number";
            }, {
                readonly state: {
                    readonly enum: readonly ["syncing-data"];
                };
                readonly c_fr: {
                    readonly record: {
                        readonly values: "unknown";
                    };
                };
                readonly c_lr: {
                    readonly record: {
                        readonly values: "unknown";
                    };
                };
                readonly c_count: "number";
                readonly data: {
                    readonly arrayOf: {
                        readonly record: {
                            readonly values: "unknown";
                        };
                    };
                };
            }, {
                readonly state: {
                    readonly enum: readonly ["error"];
                };
                readonly err: "unknown";
            }];
        };
    };
    export const ClientSyncRequest: {
        readonly name: "ClientSyncRequest";
        readonly source: "client";
        readonly request: {
            readonly oneOfType: readonly [{
                readonly state: {
                    readonly enum: readonly ["syncing"];
                };
                readonly c_fr: {
                    readonly optional: true;
                    readonly record: {
                        readonly values: "unknown";
                    };
                };
                readonly c_lr: {
                    readonly optional: true;
                    readonly record: {
                        readonly values: "unknown";
                    };
                };
                readonly c_count: "number";
            }, {
                readonly state: {
                    readonly enum: readonly ["syncing-data"];
                };
                readonly c_fr: {
                    readonly record: {
                        readonly values: "unknown";
                    };
                };
                readonly c_lr: {
                    readonly record: {
                        readonly values: "unknown";
                    };
                };
                readonly c_count: "number";
                readonly data: {
                    readonly arrayOf: {
                        readonly record: {
                            readonly values: "unknown";
                        };
                    };
                };
            }];
        };
        readonly response: {
            readonly oneOfType: readonly [{
                readonly state: {
                    readonly enum: readonly ["syncing"];
                };
                readonly c_fr: {
                    readonly optional: true;
                    readonly record: {
                        readonly values: "unknown";
                    };
                };
                readonly c_lr: {
                    readonly optional: true;
                    readonly record: {
                        readonly values: "unknown";
                    };
                };
                readonly c_count: "number";
            }, {
                readonly state: {
                    readonly enum: readonly ["syncing-data"];
                };
                readonly c_fr: {
                    readonly record: {
                        readonly values: "unknown";
                    };
                };
                readonly c_lr: {
                    readonly record: {
                        readonly values: "unknown";
                    };
                };
                readonly c_count: "number";
                readonly data: {
                    readonly arrayOf: {
                        readonly record: {
                            readonly values: "unknown";
                        };
                    };
                };
            }, {
                readonly state: {
                    readonly enum: readonly ["error"];
                };
                readonly err: "unknown";
            }];
        };
    };
    export const PullRequest: {
        readonly name: "PullRequest";
        readonly source: "server";
        readonly request: {
            readonly type: {
                readonly from_synced: {
                    readonly oneOf: readonly ["string", {
                        readonly enum: readonly [undefined];
                    }];
                };
                readonly to_synced: {
                    readonly oneOf: readonly ["string", {
                        readonly enum: readonly [undefined];
                    }];
                };
                readonly offset: {
                    readonly oneOf: readonly ["number", {
                        readonly enum: readonly [undefined];
                    }];
                };
                readonly limit: {
                    readonly oneOf: readonly ["number", {
                        readonly enum: readonly [undefined];
                    }];
                };
            };
        };
        readonly response: {
            readonly oneOfType: readonly [{
                readonly success: {
                    readonly enum: readonly [true];
                };
                readonly data: {
                    readonly arrayOf: {
                        readonly record: {
                            readonly values: "unknown";
                        };
                    };
                };
            }, {
                readonly success: {
                    readonly enum: readonly [false];
                };
                readonly err: "unknown";
            }];
        };
    };
    export const UpdateRequest: {
        readonly name: "UpdateRequest";
        readonly source: "server";
        readonly request: {
            readonly oneOfType: readonly [{
                readonly state: {
                    readonly enum: readonly ["error"];
                };
                readonly err: "unknown";
            }, {
                readonly state: {
                    readonly enum: readonly ["synced"];
                };
                readonly isSynced: "boolean";
            }, {
                readonly state: {
                    readonly enum: readonly ["syncing"];
                };
                readonly data: {
                    readonly arrayOf: {
                        readonly record: {
                            readonly values: "unknown";
                        };
                    };
                };
            }];
        };
        readonly response: {
            readonly oneOfType: readonly [{
                readonly success: {
                    readonly enum: readonly [true];
                };
            }, {
                readonly success: {
                    readonly enum: readonly [false];
                };
                readonly err: "unknown";
            }];
        };
    };
    const Schemas: {
        readonly ClientSyncRequest: {
            readonly name: "ClientSyncRequest";
            readonly source: "client";
            readonly request: {
                readonly oneOfType: readonly [{
                    readonly state: {
                        readonly enum: readonly ["syncing"];
                    };
                    readonly c_fr: {
                        readonly optional: true;
                        readonly record: {
                            readonly values: "unknown";
                        };
                    };
                    readonly c_lr: {
                        readonly optional: true;
                        readonly record: {
                            readonly values: "unknown";
                        };
                    };
                    readonly c_count: "number";
                }, {
                    readonly state: {
                        readonly enum: readonly ["syncing-data"];
                    };
                    readonly c_fr: {
                        readonly record: {
                            readonly values: "unknown";
                        };
                    };
                    readonly c_lr: {
                        readonly record: {
                            readonly values: "unknown";
                        };
                    };
                    readonly c_count: "number";
                    readonly data: {
                        readonly arrayOf: {
                            readonly record: {
                                readonly values: "unknown";
                            };
                        };
                    };
                }];
            };
            readonly response: {
                readonly oneOfType: readonly [{
                    readonly state: {
                        readonly enum: readonly ["syncing"];
                    };
                    readonly c_fr: {
                        readonly optional: true;
                        readonly record: {
                            readonly values: "unknown";
                        };
                    };
                    readonly c_lr: {
                        readonly optional: true;
                        readonly record: {
                            readonly values: "unknown";
                        };
                    };
                    readonly c_count: "number";
                }, {
                    readonly state: {
                        readonly enum: readonly ["syncing-data"];
                    };
                    readonly c_fr: {
                        readonly record: {
                            readonly values: "unknown";
                        };
                    };
                    readonly c_lr: {
                        readonly record: {
                            readonly values: "unknown";
                        };
                    };
                    readonly c_count: "number";
                    readonly data: {
                        readonly arrayOf: {
                            readonly record: {
                                readonly values: "unknown";
                            };
                        };
                    };
                }, {
                    readonly state: {
                        readonly enum: readonly ["error"];
                    };
                    readonly err: "unknown";
                }];
            };
        };
        readonly ServerSyncRequest: {
            readonly name: "ServerSyncRequest";
            readonly source: "server";
            readonly request: {
                readonly type: {
                    readonly from_synced: {
                        readonly oneOf: readonly ["string", {
                            readonly enum: readonly [null];
                        }];
                    };
                    readonly to_synced: {
                        readonly oneOf: readonly ["string", {
                            readonly enum: readonly [null];
                        }];
                    };
                    readonly end_offset: {
                        readonly oneOf: readonly ["number", {
                            readonly enum: readonly [null];
                        }];
                    };
                };
            };
            readonly response: {
                readonly oneOfType: readonly [{
                    readonly state: {
                        readonly enum: readonly ["syncing"];
                    };
                    readonly c_fr: {
                        readonly optional: true;
                        readonly record: {
                            readonly values: "unknown";
                        };
                    };
                    readonly c_lr: {
                        readonly optional: true;
                        readonly record: {
                            readonly values: "unknown";
                        };
                    };
                    readonly c_count: "number";
                }, {
                    readonly state: {
                        readonly enum: readonly ["syncing-data"];
                    };
                    readonly c_fr: {
                        readonly record: {
                            readonly values: "unknown";
                        };
                    };
                    readonly c_lr: {
                        readonly record: {
                            readonly values: "unknown";
                        };
                    };
                    readonly c_count: "number";
                    readonly data: {
                        readonly arrayOf: {
                            readonly record: {
                                readonly values: "unknown";
                            };
                        };
                    };
                }, {
                    readonly state: {
                        readonly enum: readonly ["error"];
                    };
                    readonly err: "unknown";
                }];
            };
        };
        readonly PullRequest: {
            readonly name: "PullRequest";
            readonly source: "server";
            readonly request: {
                readonly type: {
                    readonly from_synced: {
                        readonly oneOf: readonly ["string", {
                            readonly enum: readonly [undefined];
                        }];
                    };
                    readonly to_synced: {
                        readonly oneOf: readonly ["string", {
                            readonly enum: readonly [undefined];
                        }];
                    };
                    readonly offset: {
                        readonly oneOf: readonly ["number", {
                            readonly enum: readonly [undefined];
                        }];
                    };
                    readonly limit: {
                        readonly oneOf: readonly ["number", {
                            readonly enum: readonly [undefined];
                        }];
                    };
                };
            };
            readonly response: {
                readonly oneOfType: readonly [{
                    readonly success: {
                        readonly enum: readonly [true];
                    };
                    readonly data: {
                        readonly arrayOf: {
                            readonly record: {
                                readonly values: "unknown";
                            };
                        };
                    };
                }, {
                    readonly success: {
                        readonly enum: readonly [false];
                    };
                    readonly err: "unknown";
                }];
            };
        };
        readonly UpdateRequest: {
            readonly name: "UpdateRequest";
            readonly source: "server";
            readonly request: {
                readonly oneOfType: readonly [{
                    readonly state: {
                        readonly enum: readonly ["error"];
                    };
                    readonly err: "unknown";
                }, {
                    readonly state: {
                        readonly enum: readonly ["synced"];
                    };
                    readonly isSynced: "boolean";
                }, {
                    readonly state: {
                        readonly enum: readonly ["syncing"];
                    };
                    readonly data: {
                        readonly arrayOf: {
                            readonly record: {
                                readonly values: "unknown";
                            };
                        };
                    };
                }];
            };
            readonly response: {
                readonly oneOfType: readonly [{
                    readonly success: {
                        readonly enum: readonly [true];
                    };
                }, {
                    readonly success: {
                        readonly enum: readonly [false];
                    };
                    readonly err: "unknown";
                }];
            };
        };
    };
    type SchemasType = typeof Schemas;
    export const getHandlers: <Side extends RequestBase["source"]>(channelName: string, socket: {
        on: (channelName: string, request: (data: unknown, cb: SocketCallback) => MaybePromise<void>) => void;
        emit: (channelName: string, request: unknown, response: (response: unknown) => MaybePromise<void>) => void;
        removeAllListeners: (channelName: string) => void;
    }, side: Side, onResponse: { [K in keyof SchemasType as SchemasType[K]["source"] extends Side ? never : K]: (params: JSONB.GetType<SchemasType[K]["request"]>) => Promise<JSONB.GetType<SchemasType[K]["response"]>>; }) => { [K in keyof SchemasType as SchemasType[K]["source"] extends Side ? K : never]: (params: JSONB.GetType<SchemasType[K]["request"]>) => Promise<JSONB.GetType<SchemasType[K]["response"]>>; };
    export {};
}
export {};
//# sourceMappingURL=replication.d.ts.map