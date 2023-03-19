import { FullFilter, AnyObject, FullFilterBasic, ValueOf, ComplexFilter, CastFromTSToPG } from "./filters";
import { FileColumnConfig } from "./files";
import { JSONB } from "./jsonb";
export declare const _PG_strings: readonly ["bpchar", "char", "varchar", "text", "citext", "uuid", "bytea", "time", "timetz", "interval", "name", "cidr", "inet", "macaddr", "macaddr8", "int4range", "int8range", "numrange", "tsvector"];
export declare const _PG_numbers: readonly ["int2", "int4", "int8", "float4", "float8", "numeric", "money", "oid"];
export declare const _PG_json: readonly ["json", "jsonb"];
export declare const _PG_bool: readonly ["bool"];
export declare const _PG_date: readonly ["date", "timestamp", "timestamptz"];
export declare const _PG_postgis: readonly ["geometry", "geography"];
export declare const _PG_geometric: readonly ["point", "line", "lseg", "box", "path", "polygon", "circle"];
export type PG_COLUMN_UDT_DATA_TYPE = typeof _PG_strings[number] | typeof _PG_numbers[number] | typeof _PG_geometric[number] | typeof _PG_json[number] | typeof _PG_bool[number] | typeof _PG_date[number] | typeof _PG_postgis[number];
export declare const TS_PG_Types: {
    readonly "number[]": ("_numeric" | "_int2" | "_int4" | "_int8" | "_float4" | "_float8" | "_money" | "_oid")[];
    readonly "boolean[]": "_bool"[];
    readonly "string[]": ("_name" | "_text" | "_bpchar" | "_char" | "_varchar" | "_citext" | "_uuid" | "_bytea" | "_time" | "_timetz" | "_interval" | "_cidr" | "_inet" | "_macaddr" | "_macaddr8" | "_int4range" | "_int8range" | "_numrange" | "_tsvector" | "_date" | "_timestamp" | "_timestamptz" | "_lseg")[];
    readonly "any[]": ("_json" | "_jsonb")[];
    readonly string: readonly ["bpchar", "char", "varchar", "text", "citext", "uuid", "bytea", "time", "timetz", "interval", "name", "cidr", "inet", "macaddr", "macaddr8", "int4range", "int8range", "numrange", "tsvector", "date", "timestamp", "timestamptz", "lseg"];
    readonly number: readonly ["int2", "int4", "int8", "float4", "float8", "numeric", "money", "oid"];
    readonly boolean: readonly ["bool"];
    readonly any: readonly ["json", "jsonb"];
};
export type TS_COLUMN_DATA_TYPES = keyof typeof TS_PG_Types;
export type DBTableSchema = {
    is_view?: boolean;
    select?: boolean;
    insert?: boolean;
    update?: boolean;
    delete?: boolean;
    columns: AnyObject;
};
export type DBSchema = {
    [tov_name: string]: DBTableSchema;
};
export type ColumnInfo = {
    name: string;
    label: string;
    comment: string;
    ordinal_position: number;
    is_nullable: boolean;
    data_type: string;
    udt_name: PG_COLUMN_UDT_DATA_TYPE;
    element_type: string;
    element_udt_name: string;
    is_pkey: boolean;
    references?: {
        ftable: string;
        fcols: string[];
        cols: string[];
    }[];
    has_default: boolean;
    column_default?: any;
    min?: string | number;
    max?: string | number;
    hint?: string;
    jsonbSchema?: JSONB.JSONBSchema;
    file?: FileColumnConfig;
};
export type ValidatedColumnInfo = ColumnInfo & {
    tsDataType: TS_COLUMN_DATA_TYPES;
    select: boolean;
    orderBy: boolean;
    filter: boolean;
    insert: boolean;
    update: boolean;
    delete: boolean;
};
export type DBSchemaTable = {
    name: string;
    info: TableInfo;
    columns: ValidatedColumnInfo[];
};
export type FieldFilter<T extends AnyObject = AnyObject> = SelectTyped<T>;
export type AscOrDesc = 1 | -1 | boolean;
export type _OrderBy<T = AnyObject> = {
    [K in keyof Partial<T>]: AscOrDesc;
} | {
    [K in keyof Partial<T>]: AscOrDesc;
}[] | {
    key: keyof T;
    asc?: AscOrDesc;
    nulls?: "last" | "first";
    nullEmpty?: boolean;
}[] | Array<keyof T> | keyof T;
export type OrderBy<T = AnyObject> = _OrderBy<T> | _OrderBy<AnyObject>;
type CommonSelect = "*" | "" | {
    "*": 1;
};
export type SelectTyped<T extends AnyObject> = {
    [K in keyof Partial<T>]: 1 | true;
} | {
    [K in keyof Partial<T>]: 0 | false;
} | (keyof T)[] | CommonSelect;
export declare const JOIN_KEYS: readonly ["$innerJoin", "$leftJoin"];
export declare const JOIN_PARAMS: readonly ["select", "filter", "$path", "$condition", "offset", "limit", "orderBy"];
export type JoinCondition = {
    column: string;
    rootColumn: string;
} | ComplexFilter;
export type DetailedJoinSelect = Record<typeof JOIN_KEYS[number], {
    select: Select;
    filter?: FullFilter;
    offset?: number;
    limit?: number;
    orderBy?: OrderBy;
} & ({
    $path?: string[];
    $condition?: undefined;
} | {
    $path?: undefined;
    $condition: JoinCondition[];
})>;
export type JoinSelect = "*" | Record<string, Record<string, any>> | DetailedJoinSelect;
type FunctionSelect = Record<string, Record<string, any[]>>;
type SelectFuncs<T extends AnyObject = any> = T extends AnyObject ? (({
    [K in keyof Partial<T>]: true | 1 | string;
} & FunctionSelect) | JoinSelect | FunctionSelect | {
    [K in keyof Partial<T>]: true | 1 | string;
} | {
    [K in keyof Partial<T>]: 0 | false;
} | CommonSelect) : ({
    [key: string]: true | 1 | string | Record<string, any[]>;
} | {
    [K in keyof Partial<T>]: 0 | false;
} | CommonSelect);
export type Select<T extends AnyObject = any> = T extends AnyObject ? (SelectFuncs<T & {
    $rowhash: string;
}>) : (AnyObject | CommonSelect | SelectFuncs);
export type SelectBasic = {
    [key: string]: any;
} | {} | undefined | "" | "*";
type CommonSelectParams = {
    limit?: number;
    offset?: number;
    groupBy?: boolean;
    returnType?: "row" | "value" | "values" | "statement";
};
export type SelectParams<T extends AnyObject = any> = CommonSelectParams & {
    select?: Select<T>;
    orderBy?: OrderBy<T>;
};
export type SubscribeParams<T extends AnyObject = any> = SelectParams<T> & {
    throttle?: number;
};
export type UpdateParams<T extends AnyObject = any> = {
    returning?: Select<T>;
    onConflictDoNothing?: boolean;
    fixIssues?: boolean;
    multi?: boolean;
};
export type InsertParams<T extends AnyObject = any> = {
    returning?: Select<T>;
    onConflictDoNothing?: boolean;
    fixIssues?: boolean;
};
export type DeleteParams<T extends AnyObject = any> = {
    returning?: Select<T>;
};
export type SubscribeParamsBasic = CommonSelectParams & {
    throttle?: number;
};
export type UpdateParamsBasic = {
    returning?: SelectBasic;
    onConflictDoNothing?: boolean;
    fixIssues?: boolean;
    multi?: boolean;
};
export type InsertParamsBasic = {
    returning?: SelectBasic;
    onConflictDoNothing?: boolean;
    fixIssues?: boolean;
};
export type DeleteParamsBasic = {
    returning?: SelectBasic;
};
export type PartialLax<T = AnyObject> = Partial<T> & AnyObject;
export type TableInfo = {
    oid: number;
    comment?: string;
    is_media?: boolean;
    is_view?: boolean;
    has_media?: "one" | "many";
    has_direct_media?: boolean;
    media_table_name?: string;
    dynamicRules?: {
        update?: boolean;
    };
    info?: {
        label?: string;
    };
};
export type OnError = (err: any) => void;
type JoinedSelect = Record<string, Select>;
type ParseSelect<Select extends SelectParams<TD>["select"], TD extends AnyObject> = (Select extends {
    "*": 1;
} ? Required<TD> : {}) & {
    [Key in keyof Omit<Select, "*">]: Select[Key] extends 1 ? Required<TD>[Key] : Select[Key] extends Record<string, any[]> ? any : Select[Key] extends JoinedSelect ? any[] : any;
};
type GetSelectDataType<O extends SelectParams<TD>, TD extends AnyObject> = O extends {
    returnType: "value";
} ? any : O extends {
    returnType: "values";
    select: Record<string, 1>;
} ? ValueOf<Pick<Required<TD>, keyof O["select"]>> : O extends {
    returnType: "values";
} ? any : O extends {
    select: "*";
} ? Required<TD> : O extends {
    select: "";
} ? Record<string, never> : O extends {
    select: Record<string, 0>;
} ? Omit<Required<TD>, keyof O["select"]> : O extends {
    select: Record<string, any>;
} ? ParseSelect<O["select"], Required<TD>> : Required<TD>;
type GetSelectReturnType<O extends SelectParams<TD>, TD extends AnyObject, isMulti extends boolean> = O extends {
    returnType: "statement";
} ? string : isMulti extends true ? GetSelectDataType<O, TD>[] : GetSelectDataType<O, TD>;
type GetUpdateReturnType<O extends UpdateParams, TD extends AnyObject> = O extends {
    returning: "*";
} ? Required<TD> : O extends {
    returning: "";
} ? Record<string, never> : O extends {
    returning: Record<string, 1>;
} ? Pick<Required<TD>, keyof O["returning"]> : O extends {
    returning: Record<string, 0>;
} ? Omit<Required<TD>, keyof O["returning"]> : void;
export type SubscriptionHandler<T extends AnyObject = AnyObject> = {
    unsubscribe: () => Promise<any>;
    update?: (newData: T, updateParams: UpdateParams<T>) => Promise<any>;
    delete?: (deleteParams: DeleteParams<T>) => Promise<any>;
    filter: FullFilter<T> | {};
};
type GetColumns = (lang?: string, params?: {
    rule: "update";
    data: AnyObject;
    filter: AnyObject;
}) => Promise<ValidatedColumnInfo[]>;
export type ViewHandler<TD extends AnyObject = AnyObject, S = void> = {
    getInfo?: (lang?: string) => Promise<TableInfo>;
    getColumns?: GetColumns;
    find: <P extends SelectParams<TD>>(filter?: FullFilter<TD, S>, selectParams?: P) => Promise<GetSelectReturnType<P, TD, true>>;
    findOne: <P extends SelectParams<TD>>(filter?: FullFilter<TD, S>, selectParams?: P) => Promise<undefined | GetSelectReturnType<P, TD, false>>;
    subscribe: <P extends SubscribeParams<TD>>(filter: FullFilter<TD, S>, params: P, onData: (items: GetSelectReturnType<P, TD, true>) => any, onError?: OnError) => Promise<SubscriptionHandler<TD>>;
    subscribeOne: <P extends SubscribeParams<TD>>(filter: FullFilter<TD, S>, params: P, onData: (item: GetSelectReturnType<P, TD, false> | undefined) => any, onError?: OnError) => Promise<SubscriptionHandler<TD>>;
    count: (filter?: FullFilter<TD, S>) => Promise<number>;
    size: (filter?: FullFilter<TD>, selectParams?: SelectParams<TD>) => Promise<string>;
};
export type UpsertDataToPGCast<TD extends AnyObject> = {
    [K in keyof TD]: CastFromTSToPG<TD[K]>;
};
type UpsertDataToPGCastLax<T extends AnyObject> = PartialLax<UpsertDataToPGCast<T>>;
export type TableHandler<TD extends AnyObject = AnyObject, S = void> = ViewHandler<TD, S> & {
    update: <P extends UpdateParams<TD>>(filter: FullFilter<TD, S>, newData: UpsertDataToPGCastLax<TD>, params?: P) => Promise<GetUpdateReturnType<P, TD> | undefined>;
    updateBatch: (data: [FullFilter<TD, S>, UpsertDataToPGCastLax<TD>][], params?: UpdateParams<TD>) => Promise<PartialLax<TD> | void>;
    upsert: <P extends UpdateParams<TD>>(filter: FullFilter<TD, S>, newData: UpsertDataToPGCastLax<TD>, params?: P) => Promise<GetUpdateReturnType<P, TD>>;
    insert: <P extends UpdateParams<TD>>(data: (TD | TD[]), params?: P) => Promise<GetUpdateReturnType<P, TD>>;
    delete: <P extends DeleteParams<TD>>(filter?: FullFilter<TD, S>, params?: P) => Promise<GetUpdateReturnType<P, TD> | undefined>;
};
export type ViewHandlerBasic = {
    getInfo?: (lang?: string) => Promise<TableInfo>;
    getColumns?: GetColumns;
    find: <TD = AnyObject>(filter?: FullFilterBasic, selectParams?: SelectParams) => Promise<PartialLax<TD>[]>;
    findOne: <TD = AnyObject>(filter?: FullFilterBasic, selectParams?: SelectParams) => Promise<PartialLax<TD>>;
    subscribe: <TD = AnyObject>(filter: FullFilterBasic, params: SubscribeParamsBasic, onData: (items: PartialLax<TD>[], onError?: OnError) => any) => Promise<{
        unsubscribe: () => any;
    }>;
    subscribeOne: <TD = AnyObject>(filter: FullFilterBasic, params: SubscribeParamsBasic, onData: (item: PartialLax<TD> | undefined, onError?: OnError) => any) => Promise<{
        unsubscribe: () => any;
    }>;
    count: (filter?: FullFilterBasic) => Promise<number>;
    size: (filter?: FullFilterBasic, selectParams?: SelectParams) => Promise<string>;
};
export type TableHandlerBasic = ViewHandlerBasic & {
    update: <TD = AnyObject>(filter: FullFilterBasic, newData: PartialLax<TD>, params?: UpdateParamsBasic) => Promise<PartialLax<TD> | void>;
    updateBatch: <TD = AnyObject>(data: [FullFilterBasic, PartialLax<TD>][], params?: UpdateParamsBasic) => Promise<PartialLax<TD> | void>;
    upsert: <TD = AnyObject>(filter: FullFilterBasic, newData: PartialLax<TD>, params?: UpdateParamsBasic) => Promise<PartialLax<TD> | void>;
    insert: <TD = AnyObject>(data: (PartialLax<TD> | PartialLax<TD>[]), params?: InsertParamsBasic) => Promise<PartialLax<TD> | void>;
    delete: <TD = AnyObject>(filter?: FullFilterBasic, params?: DeleteParamsBasic) => Promise<PartialLax<TD> | void>;
};
export type JoinMaker<TT extends AnyObject = AnyObject> = (filter?: FullFilter<TT>, select?: Select<TT>, options?: SelectParams<TT>) => any;
export type JoinMakerBasic = (filter?: FullFilterBasic, select?: SelectBasic, options?: SelectParams) => any;
export type TableJoin = {
    [key: string]: JoinMaker;
};
export type TableJoinBasic = {
    [key: string]: JoinMakerBasic;
};
export type DbJoinMaker = {
    innerJoin: TableJoin;
    leftJoin: TableJoin;
    innerJoinOne: TableJoin;
    leftJoinOne: TableJoin;
};
export type SQLResult<T extends SQLOptions["returnType"]> = {
    command: "SELECT" | "UPDATE" | "DELETE" | "CREATE" | "ALTER" | "LISTEN" | "UNLISTEN" | "INSERT" | string;
    rowCount: number;
    rows: (T extends "arrayMode" ? any : AnyObject)[];
    fields: {
        name: string;
        dataType: string;
        udt_name: PG_COLUMN_UDT_DATA_TYPE;
        tsDataType: TS_COLUMN_DATA_TYPES;
        tableID?: number;
        tableName?: string;
        tableSchema?: string;
        columnID?: number;
        columnName?: string;
    }[];
    duration: number;
};
export type DBEventHandles = {
    socketChannel: string;
    socketUnsubChannel: string;
    addListener: (listener: (event: any) => void) => {
        removeListener: () => void;
    };
};
export type CheckForListen<T, O extends SQLOptions> = O["allowListen"] extends true ? (DBEventHandles | T) : T;
export type GetSQLReturnType<O extends SQLOptions> = CheckForListen<(O["returnType"] extends "row" ? AnyObject | null : O["returnType"] extends "rows" ? AnyObject[] : O["returnType"] extends "value" ? any | null : O["returnType"] extends "values" ? any[] : O["returnType"] extends "statement" ? string : O["returnType"] extends "noticeSubscription" ? DBEventHandles : SQLResult<O["returnType"]>), O>;
export type SQLHandler = <Opts extends SQLOptions>(query: string, args?: AnyObject | any[], options?: Opts, serverSideOptions?: {
    socket: any;
}) => Promise<GetSQLReturnType<Opts>>;
type SelectMethods<T extends DBTableSchema> = T["select"] extends true ? keyof Pick<TableHandler, "count" | "find" | "findOne" | "getColumns" | "getInfo" | "size" | "subscribe" | "subscribeOne"> : never;
type UpdateMethods<T extends DBTableSchema> = T["update"] extends true ? keyof Pick<TableHandler, "update" | "updateBatch"> : never;
type InsertMethods<T extends DBTableSchema> = T["insert"] extends true ? keyof Pick<TableHandler, "insert"> : never;
type UpsertMethods<T extends DBTableSchema> = T["insert"] extends true ? T["update"] extends true ? keyof Pick<TableHandler, "upsert"> : never : never;
type DeleteMethods<T extends DBTableSchema> = T["delete"] extends true ? keyof Pick<TableHandler, "delete"> : never;
export type ValidatedMethods<T extends DBTableSchema> = SelectMethods<T> | UpdateMethods<T> | InsertMethods<T> | UpsertMethods<T> | DeleteMethods<T>;
export type DBHandler<S = void> = (S extends DBSchema ? {
    [k in keyof S]: S[k]["is_view"] extends true ? ViewHandler<S[k]["columns"], S> : Pick<TableHandler<S[k]["columns"], S>, ValidatedMethods<S[k]>>;
} : {
    [key: string]: Partial<TableHandler>;
}) & DbJoinMaker & {
    sql?: SQLHandler;
};
export type DBHandlerBasic = {
    [key: string]: Partial<TableHandlerBasic>;
} & {
    innerJoin: TableJoinBasic;
    leftJoin: TableJoinBasic;
    innerJoinOne: TableJoinBasic;
    leftJoinOne: TableJoinBasic;
} & {
    sql?: SQLHandler;
};
export type DBNoticeConfig = {
    socketChannel: string;
    socketUnsubChannel: string;
};
export type DBNotifConfig = DBNoticeConfig & {
    notifChannel: string;
};
export type SQLOptions = {
    returnType?: Required<SelectParams>["returnType"] | "statement" | "rows" | "noticeSubscription" | "arrayMode";
    allowListen?: boolean;
    hasParams?: boolean;
};
export type SQLRequest = {
    query: string;
    params?: any | any[];
    options?: SQLOptions;
};
export type NotifSubscription = {
    socketChannel: string;
    socketUnsubChannel: string;
    notifChannel: string;
};
export type NoticeSubscription = {
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
    AUTHGUARD: string;
    CONNECTION: string;
    _preffix: string;
};
export type AuthGuardLocation = {
    href: string;
    origin: string;
    protocol: string;
    host: string;
    hostname: string;
    port: string;
    pathname: string;
    search: string;
    hash: string;
};
export type AuthGuardLocationResponse = {
    shouldReload: boolean;
};
export declare const RULE_METHODS: {
    readonly getColumns: readonly ["getColumns"];
    readonly getInfo: readonly ["getInfo"];
    readonly insert: readonly ["insert", "upsert"];
    readonly update: readonly ["update", "upsert", "updateBatch"];
    readonly select: readonly ["findOne", "find", "count", "size"];
    readonly delete: readonly ["delete", "remove"];
    readonly sync: readonly ["sync", "unsync"];
    readonly subscribe: readonly ["unsubscribe", "subscribe", "subscribeOne"];
};
export type MethodKey = typeof RULE_METHODS[keyof typeof RULE_METHODS][number];
export type TableSchemaForClient = Record<string, Partial<Record<MethodKey, {} | {
    err: any;
}>>>;
export type TableSchema = {
    schema: string;
    name: string;
    oid: number;
    comment: string;
    columns: (ColumnInfo & {
        privileges: {
            privilege_type: "INSERT" | "REFERENCES" | "SELECT" | "UPDATE";
            is_grantable: "YES" | "NO";
        }[];
    })[];
    is_view: boolean;
    parent_tables: string[];
    privileges: {
        insert: boolean;
        select: boolean;
        update: boolean;
        delete: boolean;
    };
};
export type MethodFunction = (...args: any) => (any | Promise<any>);
export type MethodFullDef = {
    input: Record<string, JSONB.JSONBSchema>;
    run: MethodFunction;
    output?: Record<string, JSONB.JSONBSchema>;
} & ({
    output?: undefined;
    outputTable?: string;
} | {
    output?: Record<string, JSONB.JSONBSchema>;
    outputTable?: undefined;
});
export type Method = MethodFunction | MethodFullDef;
export type MethodHandler = {
    [method_name: string]: Method;
};
export type ClientSchema = {
    rawSQL: boolean;
    joinTables: string[][];
    auth: AnyObject;
    version: any;
    err?: string;
    tableSchema?: DBSchemaTable[];
    schema: TableSchemaForClient;
    methods: (string | {
        name: string;
        description?: string;
    } & Pick<MethodFullDef, "input" | "output">)[];
};
export type AuthSocketSchema = {
    user?: AnyObject;
    register?: boolean;
    login?: boolean;
    logout?: boolean;
    pathGuard?: boolean;
};
export type ProstglesError = {
    stack: string[];
    message: string;
    column?: string;
    code?: string;
    table?: string;
    constraint?: string;
    txt?: string;
    code_info?: string;
    columns?: string[];
};
export type { WALItem, BasicOrderBy, WALItemsObj, WALConfig, TextPatch, SyncTableInfo } from "./util";
export { asName, pickKeys, omitKeys, getTextPatch, isEmpty, stableStringify, unpatchText, WAL, get, isDefined, isObject, getKeys } from "./util";
export * from "./filters";
export type { ClientExpressData, ClientSyncHandles, ClientSyncInfo, SyncConfig, ClientSyncPullResponse, SyncBatchParams, onUpdatesParams } from "./replication";
export type { ALLOWED_CONTENT_TYPE, ALLOWED_EXTENSION, FileColumnConfig, FileType } from "./files";
export { CONTENT_TYPE_TO_EXT } from "./files";
export * from "./jsonb";
//# sourceMappingURL=index.d.ts.map