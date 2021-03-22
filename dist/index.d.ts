import { FullFilter, AnyObject } from "./filters";
export declare type ColumnInfo = {
    name: string;
    data_type: string;
    udt_name: string;
    element_type: string;
    is_pkey: boolean;
};
export declare type ValidatedColumnInfo = ColumnInfo & {
    tsDataType: string;
    select: boolean;
    filter: boolean;
    insert: boolean;
    update: boolean;
    delete: boolean;
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
export declare type SelectParams<T = AnyObject> = {
    select?: Select<T>;
    limit?: number;
    offset?: number;
    orderBy?: OrderBy<T>;
    expectOne?: boolean;
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
export declare type DExtended<T = AnyObject> = Partial<T & {
    [x: string]: any;
}>;
export declare type ViewHandler<TT = AnyObject> = {
    getColumns: () => Promise<ValidatedColumnInfo[]>;
    find: <TD = TT>(filter?: FullFilter<TD>, selectParams?: SelectParams<TD>) => Promise<DExtended<TD>[]>;
    findOne: <TD = TT>(filter?: FullFilter<TD>, selectParams?: SelectParams<TD>) => Promise<DExtended<TD>>;
    subscribe: <TD = TT>(filter: FullFilter<TD>, params: SelectParams<TD>, onData: (items: DExtended<TD>[]) => any) => Promise<{
        unsubscribe: () => any;
    }>;
    subscribeOne: <TD = TT>(filter: FullFilter<TD>, params: SelectParams<TD>, onData: (item: DExtended<TD>) => any) => Promise<{
        unsubscribe: () => any;
    }>;
    count: <TD = TT>(filter?: FullFilter<TD>) => Promise<number>;
};
export declare type TableHandler<TT = AnyObject> = ViewHandler<TT> & {
    update: <TD = TT>(filter: FullFilter<TD>, newData: Partial<TD>, params?: UpdateParams<TD>) => Promise<DExtended<TD> | void>;
    updateBatch: <TD = TT>(data: [FullFilter<TD>, Partial<TD>][], params?: UpdateParams<TD>) => Promise<DExtended<TD> | void>;
    upsert: <TD = TT>(filter: FullFilter<TD>, newData: Partial<TD>, params?: UpdateParams<TD>) => Promise<DExtended<TD> | void>;
    insert: <TD = TT>(data: (Partial<TD> | Partial<TD>[]), params?: InsertParams<TD>) => Promise<DExtended<TD> | void>;
    delete: <TD = TT>(filter?: FullFilter<TD>, params?: DeleteParams<TD>) => Promise<DExtended<TD> | void>;
};
export declare type JoinMaker<TT = AnyObject> = (filter?: FullFilter<TT>, select?: Select<TT>, options?: SelectParams<TT>) => any;
export declare type TableJoin = {
    [key: string]: JoinMaker;
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
export declare type SQLOptions = {
    returnType?: "rows" | "statement";
};
export declare type SQLRequest = {
    query: string;
    params?: any | any[];
    options?: SQLOptions;
};
export declare const CHANNELS: {
    SCHEMA_CHANGED: string;
    SCHEMA: string;
    DEFAULT: string;
    SQL: string;
    METHOD: string;
    REGISTER: string;
    LOGIN: string;
    LOGOUT: string;
    _preffix: string;
};
export { getTextPatch, unpatchText, isEmpty, WAL, WALConfig, asName } from "./util";
export { EXISTS_KEYS, FilterDataType, FullFilter, GeomFilterKeys, GeomFilter_Funcs, TextFilter_FullTextSearchFilterKeys } from "./filters";
//# sourceMappingURL=index.d.ts.map