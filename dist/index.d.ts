import { FullFilter, AnyObject, FullFilterBasic } from "./filters";
export declare type ColumnInfo = {
    name: string;
    comment: string;
    ordinal_position: number;
    is_nullable: boolean;
    data_type: string;
    udt_name: string;
    element_type: string;
    is_pkey: boolean;
};
export declare type TS_DATA_TYPE = "string" | "number" | "boolean" | "Object" | "Date" | "Array<number>" | "Array<boolean>" | "Array<string>" | "Array<Object>" | "Array<Date>" | "any";
export declare type ValidatedColumnInfo = ColumnInfo & {
    tsDataType: TS_DATA_TYPE;
    select: boolean;
    filter: boolean;
    insert: boolean;
    update: boolean;
    delete: boolean;
};
export declare type FieldFilter = {} | string[] | "*" | "" | {
    [key: string]: (1 | 0 | boolean);
};
export declare type AscOrDesc = 1 | -1 | boolean;
export declare type _OrderBy<T = AnyObject> = {
    [K in keyof Partial<T>]: AscOrDesc;
} | {
    [K in keyof Partial<T>]: AscOrDesc;
}[] | {
    key: keyof T;
    asc: AscOrDesc;
}[] | Array<keyof T> | keyof T;
export declare type OrderBy<T = AnyObject> = _OrderBy<T> | _OrderBy<AnyObject>;
export declare type Select<T = AnyObject> = {
    [K in keyof Partial<T>]: any;
} | {} | undefined | "" | "*" | AnyObject | Array<keyof T>;
export declare type SelectBasic = {
    [key: string]: any;
} | {} | undefined | "" | "*";
export declare type SelectParams<T = AnyObject> = {
    select?: Select<T>;
    limit?: number;
    offset?: number;
    orderBy?: OrderBy<T>;
    expectOne?: boolean;
};
export declare type SubscribeParams<T = AnyObject> = SelectParams<T> & {
    throttle?: number;
};
export declare type UpdateParams<T = AnyObject> = {
    returning?: Select<T>;
    onConflictDoNothing?: boolean;
    fixIssues?: boolean;
    multi?: boolean;
};
export declare type InsertParams<T = AnyObject> = {
    returning?: Select<T>;
    onConflictDoNothing?: boolean;
    fixIssues?: boolean;
};
export declare type DeleteParams<T = AnyObject> = {
    returning?: Select<T>;
};
export declare type SelectParamsBasic = {
    select?: SelectBasic;
    limit?: number;
    offset?: number;
    orderBy?: OrderBy;
    expectOne?: boolean;
};
export declare type SubscribeParamsBasic = SelectParamsBasic & {
    throttle?: number;
};
export declare type UpdateParamsBasic = {
    returning?: SelectBasic;
    onConflictDoNothing?: boolean;
    fixIssues?: boolean;
    multi?: boolean;
};
export declare type InsertParamsBasic = {
    returning?: SelectBasic;
    onConflictDoNothing?: boolean;
    fixIssues?: boolean;
};
export declare type DeleteParamsBasic = {
    returning?: SelectBasic;
};
export declare type PartialLax<T = AnyObject> = Partial<T> & AnyObject;
export declare type TableInfo = {
    oid: number;
    comment: string;
};
export declare type OnError = (err: any) => void;
export declare type ViewHandler<TT = AnyObject> = {
    getInfo?: () => Promise<TableInfo>;
    getColumns?: () => Promise<ValidatedColumnInfo[]>;
    find: <TD = TT>(filter?: FullFilter<TD>, selectParams?: SelectParams<TD>) => Promise<PartialLax<TD>[]>;
    findOne: <TD = TT>(filter?: FullFilter<TD>, selectParams?: SelectParams<TD>) => Promise<PartialLax<TD>>;
    subscribe: <TD = TT>(filter: FullFilter<TD>, params: SubscribeParams<TD>, onData: (items: PartialLax<TD>[], onError?: OnError) => any) => Promise<{
        unsubscribe: () => any;
    }>;
    subscribeOne: <TD = TT>(filter: FullFilter<TD>, params: SubscribeParams<TD>, onData: (item: PartialLax<TD>) => any, onError?: OnError) => Promise<{
        unsubscribe: () => any;
    }>;
    count: <TD = TT>(filter?: FullFilter<TD>) => Promise<number>;
};
export declare type TableHandler<TT = AnyObject> = ViewHandler<TT> & {
    update: <TD = TT>(filter: FullFilter<TD>, newData: PartialLax<TD>, params?: UpdateParams<TD>) => Promise<PartialLax<TD> | void>;
    updateBatch: <TD = TT>(data: [FullFilter<TD>, PartialLax<TD>][], params?: UpdateParams<TD>) => Promise<PartialLax<TD> | void>;
    upsert: <TD = TT>(filter: FullFilter<TD>, newData: PartialLax<TD>, params?: UpdateParams<TD>) => Promise<PartialLax<TD> | void>;
    insert: <TD = TT>(data: (PartialLax<TD> | PartialLax<TD>[]), params?: InsertParams<TD>) => Promise<PartialLax<TD> | void>;
    delete: <TD = TT>(filter?: FullFilter<TD>, params?: DeleteParams<TD>) => Promise<PartialLax<TD> | void>;
};
export declare type ViewHandlerBasic = {
    getInfo?: () => Promise<TableInfo>;
    getColumns?: () => Promise<ValidatedColumnInfo[]>;
    find: <TD = AnyObject>(filter?: FullFilterBasic, selectParams?: SelectParamsBasic) => Promise<PartialLax<TD>[]>;
    findOne: <TD = AnyObject>(filter?: FullFilterBasic, selectParams?: SelectParamsBasic) => Promise<PartialLax<TD>>;
    subscribe: <TD = AnyObject>(filter: FullFilterBasic, params: SubscribeParamsBasic, onData: (items: PartialLax<TD>[], onError?: OnError) => any) => Promise<{
        unsubscribe: () => any;
    }>;
    subscribeOne: <TD = AnyObject>(filter: FullFilterBasic, params: SubscribeParamsBasic, onData: (item: PartialLax<TD>, onError?: OnError) => any) => Promise<{
        unsubscribe: () => any;
    }>;
    count: (filter?: FullFilterBasic) => Promise<number>;
};
export declare type TableHandlerBasic = ViewHandlerBasic & {
    update: <TD = AnyObject>(filter: FullFilterBasic, newData: PartialLax<TD>, params?: UpdateParamsBasic) => Promise<PartialLax<TD> | void>;
    updateBatch: <TD = AnyObject>(data: [FullFilterBasic, PartialLax<TD>][], params?: UpdateParamsBasic) => Promise<PartialLax<TD> | void>;
    upsert: <TD = AnyObject>(filter: FullFilterBasic, newData: PartialLax<TD>, params?: UpdateParamsBasic) => Promise<PartialLax<TD> | void>;
    insert: <TD = AnyObject>(data: (PartialLax<TD> | PartialLax<TD>[]), params?: InsertParamsBasic) => Promise<PartialLax<TD> | void>;
    delete: <TD = AnyObject>(filter?: FullFilterBasic, params?: DeleteParamsBasic) => Promise<PartialLax<TD> | void>;
};
export declare type JoinMaker<TT = AnyObject> = (filter?: FullFilter<TT>, select?: Select<TT>, options?: SelectParams<TT>) => any;
export declare type JoinMakerBasic = (filter?: FullFilterBasic, select?: SelectBasic, options?: SelectParamsBasic) => any;
export declare type TableJoin = {
    [key: string]: JoinMaker;
};
export declare type TableJoinBasic = {
    [key: string]: JoinMakerBasic;
};
export declare type DbJoinMaker = {
    innerJoin: TableJoin;
    leftJoin: TableJoin;
    innerJoinOne: TableJoin;
    leftJoinOne: TableJoin;
};
export declare type DBHandler = {
    [key: string]: Partial<TableHandler>;
} & DbJoinMaker;
export declare type DBHandlerBasic = {
    [key: string]: Partial<TableHandlerBasic>;
} & {
    innerJoin: TableJoinBasic;
    leftJoin: TableJoinBasic;
    innerJoinOne: TableJoinBasic;
    leftJoinOne: TableJoinBasic;
};
export declare type DBNoticeConfig = {
    socketChannel: string;
    socketUnsubChannel: string;
};
export declare type DBNotifConfig = DBNoticeConfig & {
    notifChannel: string;
};
export declare type SQLOptions = {
    returnType: "statement" | "rows" | "noticeSubscription";
};
export declare type SQLRequest = {
    query: string;
    params?: any | any[];
    options?: SQLOptions;
};
export declare type NotifSubscription = {
    socketChannel: string;
    socketUnsubChannel: string;
    notifChannel: string;
};
export declare type NoticeSubscription = {
    socketChannel: string;
    socketUnsubChannel: string;
};
export declare const CHANNELS: {
    SCHEMA_CHANGED: string;
    SCHEMA: string;
    DEFAULT: string;
    SQL: string;
    METHOD: string;
    NOTICE_EV: string;
    LISTEN_EV: string;
    REGISTER: string;
    LOGIN: string;
    LOGOUT: string;
    _preffix: string;
};
export * from "./util";
export * from "./filters";
//# sourceMappingURL=index.d.ts.map