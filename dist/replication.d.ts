import { AnyObject } from "./filters";
export type SyncConfig = {
    id_fields: string[];
    synced_field: string;
    channelName: string;
};
export type ClientSyncInfo = {
    c_fr?: AnyObject;
    c_lr?: AnyObject;
    c_count: number;
};
export type onUpdatesParams = {
    err?: AnyObject;
} | {
    isSynced: boolean;
} | {
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
export type SyncBatchParams = {
    from_synced?: number;
    to_synced?: number;
    offset?: number;
    limit?: number;
};
export type ClientSyncHandles = {
    onSyncRequest: (params: SyncBatchParams) => ClientSyncInfo | ClientExpressData | Promise<ClientSyncInfo | ClientExpressData>;
    onPullRequest: (params: SyncBatchParams) => ClientSyncPullResponse | Promise<ClientSyncPullResponse>;
    onUpdates: (params: onUpdatesParams) => Promise<true>;
};
//# sourceMappingURL=replication.d.ts.map