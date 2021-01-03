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
export declare type OrderBy = {
    key: string;
    asc: AscOrDesc;
}[] | {
    [key: string]: AscOrDesc;
}[] | {
    [key: string]: AscOrDesc;
} | string | string[];
export declare type FieldFilter = object | string[] | "*" | "" | {
    [key: string]: (1 | 0 | boolean);
};
export declare const FIELD_FILTER_TYPES: string[];
export declare const AGGREGATION_FUNCTIONS: string[];
export declare type AggFunc = typeof AGGREGATION_FUNCTIONS[number] | {
    [key in typeof AGGREGATION_FUNCTIONS[number]]: FieldFilter;
};
export declare type Select = FieldFilter | {
    [key: string]: FieldFilter | AggFunc;
};
export declare type SelectParams = {
    select?: FieldFilter;
    limit?: number;
    offset?: number;
    orderBy?: OrderBy;
    expectOne?: boolean;
};
export declare type UpdateParams = {
    returning?: FieldFilter;
    onConflictDoNothing?: boolean;
    fixIssues?: boolean;
    multi?: boolean;
};
export declare type InsertParams = {
    returning?: FieldFilter;
    onConflictDoNothing?: boolean;
    fixIssues?: boolean;
};
export declare type DeleteParams = {
    returning?: FieldFilter;
};
export declare type Filter = any;
export declare type ViewHandler = {
    getColumns: () => Promise<ValidatedColumnInfo[]>;
    find: <T = any>(filter?: Filter, selectParams?: SelectParams) => Promise<T[]>;
    findOne: <T = any>(filter?: Filter, selectParams?: SelectParams) => Promise<T>;
    subscribe: <T = any>(filter: Filter, params: SelectParams, onData: (items: T[]) => any) => Promise<{
        unsubscribe: () => any;
    }>;
    subscribeOne: <T = any>(filter: Filter, params: SelectParams, onData: (item: T) => any) => Promise<{
        unsubscribe: () => any;
    }>;
    count: (filter?: Filter) => Promise<number>;
};
export declare type TableHandler = ViewHandler & {
    update: <T = any>(filter: Filter, newData: any, params?: UpdateParams) => Promise<T | void>;
    upsert: <T = any>(filter: Filter, newData: any, params?: UpdateParams) => Promise<T | void>;
    insert: <T = any>(data: (T | T[]), params?: InsertParams) => Promise<T | void>;
    delete: <T = any>(filter?: Filter, params?: DeleteParams) => Promise<T | void>;
};
export declare type JoinMaker = (filter?: Filter, select?: FieldFilter, options?: SelectParams) => any;
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
export { getTextPatch, unpatchText, isEmpty, WAL, WALConfig } from "./util";
//# sourceMappingURL=index.d.ts.map