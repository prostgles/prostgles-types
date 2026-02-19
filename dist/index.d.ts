import * as AuthTypes from "./auth";
import { FileColumnConfig } from "./files";
import { AnyObject, ComplexFilter, FullFilter, ValueOf } from "./filters";
import type { UpsertDataToPGCast } from "./insertUpdateUtils";
import { JSONB } from "./JSONBSchemaValidation/JSONBSchema";
export declare const _PG_strings: readonly ["bpchar", "char", "varchar", "text", "citext", "uuid", "bytea", "time", "timetz", "interval", "name", "cidr", "inet", "macaddr", "macaddr8", "int4range", "int8range", "numrange", "tsvector"];
export declare const _PG_numbers_num: readonly ["int2", "int4", "float4", "float8", "oid"];
export declare const _PG_numbers_str: readonly ["int8", "numeric", "money"];
export declare const _PG_numbers: readonly ["int2", "int4", "float4", "float8", "oid", "int8", "numeric", "money"];
export declare const _PG_json: readonly ["json", "jsonb"];
export declare const _PG_bool: readonly ["bool"];
export declare const _PG_date: readonly ["date", "timestamp", "timestamptz"];
export declare const _PG_interval: readonly ["interval"];
export declare const _PG_postgis: readonly ["geometry", "geography"];
export declare const _PG_geometric: readonly ["point", "line", "lseg", "box", "path", "polygon", "circle"];
export type PG_COLUMN_UDT_DATA_TYPE = (typeof _PG_strings)[number] | (typeof _PG_numbers)[number] | (typeof _PG_geometric)[number] | (typeof _PG_json)[number] | (typeof _PG_bool)[number] | (typeof _PG_date)[number] | (typeof _PG_interval)[number] | (typeof _PG_postgis)[number];
export declare const TS_PG_Types: {
    readonly "number[]": ("_int2" | "_int4" | "_float4" | "_float8" | "_oid")[];
    readonly "boolean[]": "_bool"[];
    readonly "string[]": ("_text" | "_bpchar" | "_char" | "_varchar" | "_citext" | "_uuid" | "_bytea" | "_time" | "_timetz" | "_interval" | "_name" | "_cidr" | "_inet" | "_macaddr" | "_macaddr8" | "_int4range" | "_int8range" | "_numrange" | "_tsvector" | "_int8" | "_numeric" | "_money" | "_date" | "_timestamp" | "_timestamptz" | "_point" | "_line" | "_lseg" | "_box" | "_path" | "_polygon" | "_circle" | "_geometry" | "_geography")[];
    readonly "any[]": ("_interval" | "_json" | "_jsonb")[];
    readonly string: readonly ["bpchar", "char", "varchar", "text", "citext", "uuid", "bytea", "time", "timetz", "interval", "name", "cidr", "inet", "macaddr", "macaddr8", "int4range", "int8range", "numrange", "tsvector", "int8", "numeric", "money", "date", "timestamp", "timestamptz", "point", "line", "lseg", "box", "path", "polygon", "circle", "geometry", "geography", "lseg"];
    readonly number: readonly ["int2", "int4", "float4", "float8", "oid"];
    readonly boolean: readonly ["bool"];
    readonly any: readonly ["json", "jsonb", "interval"];
};
export type TS_COLUMN_DATA_TYPES = keyof typeof TS_PG_Types;
export declare const postgresToTsType: (udt_data_type: PG_COLUMN_UDT_DATA_TYPE) => keyof typeof TS_PG_Types;
/**
 * Generated Typescript schema for the tables and views in the database
 * Example:
 *
 *
 * type DBSchema = {
 *    ..view_name: {
 *      is_view: boolean;
 *      select: boolean;
 *      insert: boolean;
 *      update: boolean;
 *      delete: boolean;
 *      insertColumns: { col1?: number | null; col2: string; }
 *      columns: { col1: number | null; col2: string; }
 *    }
 * }
 */
export type DBTableSchema = {
    is_view?: boolean;
    select?: boolean;
    insert?: boolean;
    update?: boolean;
    delete?: boolean;
    /**
     * Used in update, insertm select and filters
     * fields that are nullable or with a default value are be optional
     */
    columns: AnyObject;
};
export type DBSchema = {
    [tov_name: string]: DBTableSchema;
};
type ReferenceTable = {
    ftable: string;
    fcols: string[];
    cols: string[];
};
export type ColumnInfo = {
    name: string;
    /**
     * Column display name. Will be first non empty value from i18n data, comment, name
     */
    label: string;
    /**
     * Column description (if provided)
     */
    comment: string | undefined;
    /**
     * Ordinal position of the column within the table (count starts at 1)
     */
    ordinal_position: number;
    /**
     * True if column is nullable
     *
     */
    is_nullable: boolean;
    is_updatable: boolean;
    /**
     * If the column is a generated column (converted to boolean from ALWAYS and NEVER)
     */
    is_generated: boolean;
    /**
     * Simplified data type
     */
    data_type: string;
    /**
     * Postgres data type name.
     * Array types start with an underscore
     */
    udt_name: PG_COLUMN_UDT_DATA_TYPE;
    /**
     * Element data type
     */
    element_type: string | undefined;
    /**
     * Element data type name
     */
    element_udt_name: string | undefined;
    /**
     * PRIMARY KEY constraint on column.
     * A table can have a multi column primary key
     */
    is_pkey: boolean;
    /**
     * Foreign key constraint
     * A column can reference multiple tables
     */
    references?: ReferenceTable[];
    /**
     * true if column has a default value
     * Used for excluding pkey from insert
     */
    has_default: boolean;
    /**
     * Column default value
     */
    column_default?: any;
    /**
     * @example: "character varying(255)"
     */
    character_maximum_length?: number | null;
    /**
     * @example: "numeric(10,2)" precision,scale
     */
    numeric_precision?: number | null;
    numeric_scale?: number | null;
    /**
     * Extracted from tableConfig
     * Used in SmartForm
     */
    min?: string | number;
    max?: string | number;
    hint?: string;
    /**
     * JSONB schema (a simplified version of json schema) for the column (if defined in the tableConfig)
     * A check constraint will use this schema for runtime data validation and apropriate TS types will be generated
     */
    jsonbSchema?: JSONB.JSONBSchema;
    /**
     * If defined then this column is referencing the file table
     * Extracted from FileTable config
     * Used in SmartForm
     */
    file?: FileColumnConfig;
};
export type ValidatedColumnInfo = ColumnInfo & {
    /**
     * TypeScript data type
     */
    tsDataType: TS_COLUMN_DATA_TYPES;
    /**
     * Can be viewed/selected
     * Based on access rules and postgres policies
     */
    select: boolean;
    /**
     * Can be ordered by
     * Based on access rules
     */
    orderBy: boolean;
    /**
     * Can be filtered by
     * Based on access rules
     */
    filter: boolean;
    /**
     * Can be inserted
     * Based on access rules and postgres policies
     */
    insert: boolean;
    /**
     * Can be updated
     * Based on access rules and postgres policies
     */
    update: boolean;
    /**
     * Can be used in the delete filter
     * Based on access rules
     */
    delete: boolean;
};
export type DBSchemaTable = {
    name: string;
    info: TableInfo;
    columns: ValidatedColumnInfo[];
};
type FileTableConfig = {
    /**
     * Defined if direct inserts are disabled.
     * Only nested inserts through the specified tables/columns are allowed
     * */
    allowedNestedInserts?: {
        table: string;
        column: string;
    }[] | undefined;
};
export type TableInfo = {
    /**
     * OID from the postgres database
     * Useful in handling renamed tables
     */
    oid: number;
    /**
     * Comment from the postgres database
     */
    comment?: string;
    /**
     * Defined if this is the fileTable
     */
    isFileTable?: FileTableConfig;
    /**
     * True if fileTable is enabled and this table references the fileTable
     * Used in UI
     */
    hasFiles?: boolean;
    /**
     * True if this is a view.
     * Table methods (insert, update, delete) are undefined for views
     */
    isView?: boolean;
    /**
     * Name of the fileTable (if enabled)
     * Used in UI
     */
    fileTableName?: string;
    /**
     * Used for getColumns in cases where the columns are dynamic based on the request.
     * See dynamicFields from Update rules
     */
    dynamicRules?: {
        update?: boolean;
    };
    /**
     * Additional table info provided through TableConfig
     */
    info?: {
        label?: string;
    };
    /**
     * List of unique column indexes/constraints.
     * Column groups where at least a column is not allowed to be viewed (selected) are omitted.
     */
    uniqueColumnGroups?: string[][];
    /**
     * Controlled through the publish.table_name.insert config
     * If defined then any insert on this table must also contain nested inserts for the specified tables that reference this table
     */
    requiredNestedInserts?: RequiredNestedInsert[];
};
type RequiredNestedInsert = {
    ftable: string;
    minRows?: number;
    maxRows?: number;
};
/**
 * Dynamic/filter based rules (dynamicFields) allow specifying which columns can be updated based on the target record.
 * Useful when the same user can update different fields based on the record state.
 */
type GetColumnsParams = {
    /**
     * Only "update" is supported at the moment
     */
    rule: "update";
    /**
     * Filter specifying which records are to be updated
     */
    filter: FullFilter<void, void>;
};
type GetColumns = (
/**
 * Language code for i18n data. "en" by default
 */
lang?: string, params?: GetColumnsParams) => Promise<ValidatedColumnInfo[]>;
/**
 * Data fetching and manipulation methods for interacting with the database
 */
/**
 * List of fields to include or exclude
 */
export type FieldFilter<T extends AnyObject = AnyObject> = SelectTyped<T>;
export type AscOrDesc = 1 | -1 | boolean;
export type OrderByDetailed<T> = {
    key: keyof T;
    asc?: AscOrDesc | null;
    nulls?: "last" | "first" | null;
    nullEmpty?: boolean | null;
};
/**
 * `{ product_name: -1 }` -> SORT BY product_name DESC
 * [{ field_name: (1 | -1 | boolean) }]
 * true | 1 -> ascending
 * false | -1 -> descending
 * Array order is maintained
 * if nullEmpty is true then empty text will be replaced to null (so nulls sorting takes effect on it)
 */
export type OrderByTyped<T extends AnyObject> = {
    [K in keyof Partial<T>]: AscOrDesc;
} | {
    [K in keyof Partial<T>]: AscOrDesc;
}[] | OrderByDetailed<T> | OrderByDetailed<T>[] | Array<keyof T> | keyof T;
export type OrderBy<T extends AnyObject | void = void> = T extends AnyObject ? OrderByTyped<T> : OrderByTyped<AnyObject>;
export type CommonSelect = "*" | "" | {
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
export type JoinPath = {
    table: string;
    /**
     * {
     *    leftColumn: "rightColumn"
     * }
     */
    on?: Record<string, string>[];
};
/**
 * Can be either the target table name, or the sequence of tables to join through with the target table at the end.
 */
export type RawJoinPath = string | (JoinPath | string)[];
export type DetailedJoinSelect = Partial<Record<(typeof JOIN_KEYS)[number], RawJoinPath>> & {
    select: Select;
    filter?: FullFilter<void, void>;
    having?: FullFilter<void, void>;
    offset?: number;
    limit?: number;
    orderBy?: OrderBy;
} & ({
    $condition?: undefined;
} | {
    /**
     * If present then will overwrite $path and any inferred joins
     */
    $condition?: JoinCondition[];
});
export type SimpleJoinSelect = "*"
/** Aliased Shorthand join: table_name: { ...select } */
 | Record<string, 1 | "*" | true | FunctionSelect> | Record<string, 0 | false>;
export type JoinSelect = SimpleJoinSelect | DetailedJoinSelect;
/**
 * Functions that take one column argument can be applied to the selected field by specifying the function name.
 * Example: { field: { funcName: ["field"] } }
 * Can be written as { field: "funcName" } if the field is the same as the argument
 */
type FunctionShorthand = string;
/**
 * Common functions:
 *  - Aggregation functions: $count, $sum, $avg, $min, $max
 *  - String functions: $upper, $lower
 *  - Date functions: $age, $date_part
 *  - JSON functions: $merge
 */
type FunctionFull = Record<string, any[] | readonly any[] | FunctionShorthand>;
type FunctionSelect = FunctionShorthand | FunctionFull;
/**
 * { computed_field: { funcName: [args] } }
 */
type FunctionAliasedSelect = Record<string, FunctionFull>;
type InclusiveSelect = true | 1 | FunctionSelect | JoinSelect;
type SelectWithFunctions<T extends AnyObject = AnyObject, IsTyped = false> = ({
    [K in keyof Partial<T>]: InclusiveSelect;
} & Record<string, IsTyped extends true ? FunctionFull : InclusiveSelect>) | FunctionAliasedSelect | {
    [K in keyof Partial<T>]: true | 1 | string;
} | {
    [K in keyof Partial<T>]: 0 | false;
} | CommonSelect | (keyof Partial<T>)[];
/** S param is needed to ensure the non typed select works fine */
export type Select<T extends AnyObject | void = void, S extends DBSchema | void = void> = {
    t: T;
    s: S;
} extends {
    t: AnyObject;
    s: DBSchema;
} ? SelectWithFunctions<T & {
    $rowhash: string;
}, true> : SelectWithFunctions<AnyObject & {
    $rowhash: string;
}, false>;
export type SelectBasic = {
    [key: string]: any;
} | {} | undefined | "" | "*";
/**
 * Will return the first row as an object. Will throw an error if more than a row is returned. Use limit: 1 to avoid error.
 */
type ReturnTypeRow = "row";
type CommonSelectParams = {
    /**
     * Max number of rows to return. Defaults to 1000
     * - On client publish rules can affect this behaviour: cannot request more than the maxLimit (if present)
     */
    limit?: number | null;
    /**
     * Number of rows to skip
     */
    offset?: number;
    /**
     * Will group by all non aggregated fields specified in select (or all fields by default)
     */
    groupBy?: boolean;
    /**
     * Result data structure/type:
     * - **row**: the first row as an object
     * - **value**: the first value from of first field
     * - **values**: array of values from the selected field
     * - **statement**: sql statement
     * - **statement-no-rls**: sql statement without row level security
     * - **statement-where**: sql statement where condition
     */
    returnType?: ReturnTypeRow
    /**
     * Will return the first value from the selected field
     */
     | "value"
    /**
     * Will return an array of values from the selected field. Similar to array_agg(field).
     */
     | "values"
    /**
     * Will return the sql statement. Requires publishRawSQL privileges if called by client
     */
     | "statement"
    /**
     * Will return the sql statement excluding the user header. Requires publishRawSQL privileges if called by client
     */
     | "statement-no-rls"
    /**
     * Will return the sql statement where condition. Requires publishRawSQL privileges if called by client
     */
     | "statement-where";
};
export type SelectParams<T extends AnyObject | void = void, S extends DBSchema | void = void> = CommonSelectParams & {
    /**
     * Fields/expressions/linked data to select
     * - `"*"` or undefined will return all fields
     * - `{ field: 0 }` - all fields except the specified field will be selected. Cannot be combined with inclusive selects (1, true, function or join selects)
     * - `{ field: 1 }` - only the specified field will be selected
     * - `{ field: { $funcName: [...args] } }` - the field will be selected with the specified function applied
     * - `{ field: 1, referencedTable: "*" }` - field together with all fields from referencedTable will be returned (as an array). The referencedTable must have a reference to the current table through foreign keys for this to work
     * - `{ linkedData: { $leftJoin: ["lookupTable", "targetTable"], select: { field: 1 } } }` - linkedData will contain the linked/joined records from referencedTable as an array of objects.
     */
    select?: Select<T, S>;
    /**
     * Order by options
     * - Order is maintained in arrays
     * - `[{ key: "field", asc: true, nulls: "last" }]`
     */
    orderBy?: OrderBy<S extends DBSchema ? T : void>;
    /**
     * Filter applied after any aggregations (group by)
     */
    having?: FullFilter<T, S>;
};
type SubscribeActions = "insert" | "delete" | "update";
export type SubscribeOptions = {
    /**
     * If true then the first value will not be emitted
     * */
    skipFirst?: boolean;
    /**
     * Controls which actions will trigger the subscription.
     * If not provided then all actions will be triggered
     */
    actions?: Partial<Record<SubscribeActions, true> | Record<SubscribeActions, false>>;
    /**
     * If true then the subscription will be triggered without first checking if selected column values have changed
     * @default false
     */
    skipChangedColumnsCheck?: boolean;
    /**
     * If provided then the subscription will be throttled to the provided number of milliseconds
     */
    throttle?: number;
    throttleOpts?: {
        /**
         * False by default.
         * If true then the first value will be emitted at the end of the interval. Instant otherwise
         * */
        skipFirst?: boolean;
    };
};
export type SubscribeParams<T extends AnyObject | void = void, S extends DBSchema | void = void> = SelectParams<T, S> & SubscribeOptions;
export type InsertParams<T extends AnyObject | void = void, S extends DBSchema | void = void> = {
    /**
     * If defined will returns the specified fields of the updated record(s)
     */
    returning?: Select<T, S>;
    /**
     * By default the insert may fail due to a unique/exclusion constraint violation error. To control this:
     * - DoNothing: will ignore the error and do nothing
     * - DoUpdate: will update all non primary key columns of the conflicting row
     */
    onConflict?: "DoNothing" | "DoUpdate" | {
        action: "DoNothing" | "DoUpdate";
        conflictColumns: string[];
    };
    /**
     * Used for sync.
     * If true then only valid and allowed fields will be inserted
     */
    removeDisallowedFields?: boolean;
} & Pick<CommonSelectParams, "returnType">;
type JoinedSelect = Record<string, Select>;
export type SelectFunction = Record<string, any[]>;
type ParseSelect<Select extends SelectParams<TD>["select"], TD extends AnyObject> = (Select extends {
    "*": 1;
} ? Required<TD> : {}) & {
    [Key in keyof Omit<Select, "*"> & string]: Select[Key] extends 1 ? Required<TD>[Key] : Select[Key] extends SelectFunction ? any : Select[Key] extends JoinedSelect ? any[] : any;
};
type SelectDataType<S extends DBSchema | void, O extends SelectParams<TD, S>, TD extends AnyObject> = O extends {
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
export type SelectReturnType<S extends DBSchema | void, O extends SelectParams<TD, S>, TD extends AnyObject, isMulti extends boolean> = O extends {
    returnType: "statement";
} ? string : isMulti extends true ? SelectDataType<S, O, TD>[] : SelectDataType<S, O, TD>;
export type UpdateParams<T extends AnyObject | void = void, S extends DBSchema | void = void> = {
    /**
     * If defined will returns the specified fields of the updated record(s)
     */
    returning?: Select<T, S>;
    /**
     * Used for sync.
     * If true then only valid and allowed fields will be updated
     */
    removeDisallowedFields?: boolean;
    multi?: boolean;
} & Pick<CommonSelectParams, "returnType">;
type GetReturningReturnType<O extends UpdateParams<TD, S>, TD extends AnyObject, S extends DBSchema | void = void> = O extends {
    returning: "*";
} ? Required<TD> : O extends {
    returning: "";
} ? Record<string, never> : O extends {
    returning: Record<string, 1>;
} ? Pick<Required<TD>, keyof O["returning"]> : O extends {
    returning: Record<string, 0>;
} ? Omit<Required<TD>, keyof O["returning"]> : void;
/**
 *
 * Nothing is returned by default.
 * `returning` must be specified to return the updated records.
 */
export type UpdateReturnType<O extends UpdateParams<TD, S>, TD extends AnyObject, S extends DBSchema | void = void> = O extends {
    multi: false;
} ? GetReturningReturnType<O, TD, S> : GetReturningReturnType<O, TD, S>[];
/**
 * Nothing is returned by default.
 * `returning` must be specified to return the updated records.
 * If an array of records is inserted then an array of records will be returned
 * otherwise a single record will be returned.
 */
export type InsertReturnType<Data extends InsertData<AnyObject>, O extends UpdateParams<TD, S>, TD extends AnyObject, S extends DBSchema | void = void> = Data extends any[] | readonly any[] ? GetReturningReturnType<O, TD, S>[] : GetReturningReturnType<O, TD, S>;
export type SubscriptionHandler = {
    unsubscribe: () => Promise<void>;
    filter: FullFilter<void, void> | {};
};
/**
 * Callback fired once after subscribing and then every time the data matching the filter changes
 */
type SubscribeCallback<ItemsDataType> = (items: ItemsDataType, 
/**
 * Error due to schema changes or other post subscribe issues
 * Column or filter issues are thrown during the subscribe call
 */
error?: unknown) => void | Promise<void>;
/**
 * Callback fired once after subscribing and then every time the data matching the filter changes
 */
type SubscribeOneCallback<ItemDataType> = (item: ItemDataType) => void | Promise<void>;
/**
 * Methods for interacting with a view
 * - On client-side some methods are restricted (and undefined) based on publish rules on the server
 */
export type ViewHandler<TD extends AnyObject = AnyObject, S extends DBSchema | void = void> = {
    /**
     * Retrieves the table/view info
     */
    getInfo: (
    /**
     * Language code for i18n data. "en" by default
     */
    lang?: string) => Promise<TableInfo>;
    /**
     * Retrieves columns metadata of the table/view
     */
    getColumns: GetColumns;
    /**
     * Retrieves a list of matching records from the view/table
     */
    find: <P extends SelectParams<TD, S>>(
    /**
     * Filter to apply. Undefined will return all records
     * @example
     * - { "field": "value" }
     * - { "field": { $in: ["value", "value2"] } }
     * - { $or: [
     *      { "field1": "value" },
     *      { "field2": "value" }
     *     ]
     *   }
     * - { $existsJoined: { linkedTable: { "linkedTableField": "value" } } }
     */
    filter?: FullFilter<TD, S>, 
    /**
     * @example
     * {
     *    select: {
     *      field1: 1,
     *      field2: 1,
     *    },
     *    orderBy: { field1: -1 },
     *    limit: 10,
     * }
     */
    selectParams?: P) => Promise<SelectReturnType<S, P, TD, true>>;
    /**
     * Retrieves a record from the view/table
     */
    findOne: <P extends SelectParams<TD, S>>(filter?: FullFilter<TD, S>, selectParams?: P) => Promise<undefined | SelectReturnType<S, P, TD, false>>;
    /**
     * Retrieves a list of matching records from the view/table and subscribes to changes
     */
    subscribe: <P extends SubscribeParams<TD, S>>(filter: FullFilter<TD, S>, params: P, onData: SubscribeCallback<SelectReturnType<S, P, TD, true>>) => Promise<SubscriptionHandler>;
    /**
     * Retrieves first matching record from the view/table and subscribes to changes
     */
    subscribeOne: <P extends SubscribeParams<TD, S>>(filter: FullFilter<TD, S>, params: P, onData: SubscribeOneCallback<SelectReturnType<S, P, TD, false> | undefined>) => Promise<SubscriptionHandler>;
    /**
     * Returns the number of rows that match the filter
     */
    count: <P extends SelectParams<TD, S>>(filter?: FullFilter<TD, S>, selectParams?: P) => Promise<number>;
    /**
     * Returns result size in bits
     */
    size: <P extends SelectParams<TD, S>>(filter?: FullFilter<TD, S>, selectParams?: P) => Promise<string>;
};
export type PartialLax<T = AnyObject> = Partial<T>;
type UpsertDataToPGCastLax<T extends AnyObject> = PartialLax<UpsertDataToPGCast<T>>;
export type InsertData<T extends AnyObject> = UpsertDataToPGCast<T> | UpsertDataToPGCast<T>[];
export type DeleteParams<T extends AnyObject | void = void, S extends DBSchema | void = void> = {
    returning?: Select<T, S>;
} & Pick<CommonSelectParams, "returnType">;
/**
 * Methods for interacting with a table
 * - On client-side some methods are restricted (and undefined) based on publish rules on the server
 */
export type TableHandler<TD extends AnyObject = AnyObject, S extends DBSchema | void = void> = ViewHandler<TD, S> & {
    /**
     * Updates a record in the table based on the specified filter criteria
     * - Use { multi: false } to ensure no more than one row is updated
     */
    update: <P extends UpdateParams<TD, S>>(filter: FullFilter<TD, S>, newData: UpsertDataToPGCastLax<TD>, params?: P) => Promise<UpdateReturnType<P, TD, S> | undefined>;
    /**
     * Updates multiple records in the table in a batch operation.
     * - Each item in the `data` array contains a filter and the corresponding data to update.
     */
    updateBatch: <P extends UpdateParams<TD, S>>(data: [FullFilter<TD, S>, UpsertDataToPGCastLax<TD>][], params?: P) => Promise<UpdateReturnType<P, TD, S> | void>;
    /**
     * Inserts a new record into the table.
     */
    insert: <P extends InsertParams<TD, S>, D extends InsertData<TD>>(data: D, params?: P) => Promise<InsertReturnType<D, P, TD, S>>;
    /**
     * Inserts or updates a record in the table.
     * - If a record matching the `filter` exists, it updates the record.
     * - If no matching record exists, it inserts a new record.
     */
    upsert: <P extends UpdateParams<TD, S>>(filter: FullFilter<TD, S>, newData: UpsertDataToPGCastLax<TD>, params?: P) => Promise<UpdateReturnType<P, TD, S>>;
    /**
     * Deletes records from the table based on the specified filter criteria.
     * - If no filter is provided, all records may be deleted (use with caution).
     */
    delete: <P extends DeleteParams<TD, S>>(filter?: FullFilter<TD, S>, params?: P) => Promise<UpdateReturnType<P, TD, S> | undefined>;
};
export type JoinMakerOptions<TT extends AnyObject = AnyObject> = SelectParams<TT> & {
    path?: RawJoinPath;
};
export type JoinMaker<TT extends AnyObject = AnyObject, S extends DBSchema | void = void> = (tableName: string, filter?: FullFilter<TT, S>, select?: Select<TT>, options?: JoinMakerOptions<TT>) => any;
export type SQLResultInfo = {
    command: "SELECT" | "UPDATE" | "DELETE" | "CREATE" | "ALTER" | "LISTEN" | "UNLISTEN" | "INSERT" | undefined | string;
    rowCount: number;
    duration: number;
};
export type SQLResult<T extends SQLOptions["returnType"]> = SQLResultInfo & {
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
};
export type DBEventHandles = {
    socketChannel: string;
    socketUnsubChannel: string;
    addListener: (listener: (event: any) => void) => {
        removeListener: () => void;
    };
};
export type SocketSQLStreamPacket = {
    type: "data";
    fields?: any[];
    rows: any[];
    ended?: boolean;
    info?: SQLResultInfo;
    processId: number;
} | {
    type: "error";
    error: any;
};
export type SocketSQLStreamServer = {
    channel: string;
    unsubChannel: string;
};
export type SocketSQLStreamHandlers = {
    pid: number;
    run: (query: string, params?: any | any[]) => Promise<void>;
    stop: (terminate?: boolean) => Promise<void>;
};
export type SocketSQLStreamClient = SocketSQLStreamServer & {
    start: (listener: (packet: SocketSQLStreamPacket) => void) => Promise<SocketSQLStreamHandlers>;
};
export type CheckForListen<T, O extends SQLOptions> = O["allowListen"] extends true ? DBEventHandles | T : T;
export type GetSQLReturnType<O extends SQLOptions> = CheckForListen<O["returnType"] extends "row" ? AnyObject | null : O["returnType"] extends "rows" ? AnyObject[] : O["returnType"] extends "value" ? any | null : O["returnType"] extends "values" ? any[] : O["returnType"] extends "statement" ? string : O["returnType"] extends "noticeSubscription" ? DBEventHandles : O["returnType"] extends "stream" ? SocketSQLStreamClient : SQLResult<O["returnType"]>, O>;
export type SQLHandler<ServerSideOptions = void> = 
/**
 *
 * @param query <string> query. e.g.: SELECT * FROM users;
 * @param params <any[] | object> query arguments to be escaped. e.g.: { name: 'dwadaw' }
 * @param options <object> { returnType: "statement" | "rows" | "noticeSubscription" }
 */
<Opts extends SQLOptions>(query: string, args?: AnyObject | any[], options?: Opts, serverSideOptions?: ServerSideOptions) => Promise<GetSQLReturnType<Opts>>;
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
}) & {
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
    /**
     * Return type of the query
     */
    returnType?: Required<SelectParams>["returnType"] | "default-with-rollback" | "statement" | "rows" | "noticeSubscription" | "arrayMode" | "stream";
    /**
     * If allowListen not specified and a LISTEN query is issued then expect error
     */
    allowListen?: boolean;
    /**
     * Positive integer that works only with returnType="stream".
     * If provided then the query will be cancelled when the specified number of rows have been streamed
     */
    streamLimit?: number;
    /**
     * If true then the connection will be persisted and used for subsequent queries
     */
    persistStreamConnection?: boolean;
    /**
     * connectionId of the stream connection to use
     * Acquired from the first query with persistStreamConnection=true
     */
    streamConnectionId?: string;
    /**
     * If false then the query will not be checked for params. Used to ignore queries with param like text (e.g.:  ${someText} )
     * Defaults to true
     */
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
    SQL_STREAM: string;
    METHOD: string;
    NOTICE_EV: string;
    LISTEN_EV: string;
    REGISTER: string;
    LOGIN: string;
    LOGOUT: string;
    AUTHGUARD: string;
    /**
     * Used for sending any connection errors from onSocketConnect
     */
    CONNECTION: string;
    _preffix: string;
};
export type SubscriptionChannels = {
    /** Used by server to emit data to client */
    channelName: string;
    /** Used by client to confirm when ready */
    channelNameReady: string;
    /** Used by client to stop subscription */
    channelNameUnsubscribe: string;
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
export type MethodKey = (typeof RULE_METHODS)[keyof typeof RULE_METHODS][number];
export type TableSchemaForClient = Record<string, Partial<Record<MethodKey, MethodKey extends "insert" ? {
    allowedNestedInserts?: string[];
} : AnyObject>>>;
export type TableSchema = {
    schema: string;
    name: string;
    oid: number;
    comment: string;
    columns: (ColumnInfo & {
        privileges: Partial<Record<"INSERT" | "REFERENCES" | "SELECT" | "UPDATE", true>>;
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
export type MaybePromise<T> = T | Promise<T>;
export type JSONBObjectTypeIfDefined<T extends Record<string, JSONB.FieldType> | undefined> = T extends Record<string, JSONB.FieldType> ? JSONB.GetObjectType<T> : never;
export type ClientServerFunction = {
    input?: Record<string, JSONB.FieldType>;
    output?: JSONB.FieldType;
    description?: string;
    run: (args?: Record<string, unknown>) => Promise<unknown>;
};
export type ServerFunctionHandler = {
    [name: string]: ClientServerFunction;
};
export type SocketFunctionCall = {
    name: string;
    input: unknown;
};
export type TableSchemaErrors = {
    [tableName: string]: {
        [method: string]: {
            error: any;
        };
    };
};
export type ClientSchema = {
    rawSQL: boolean;
    joinTables: string[][];
    auth: AuthTypes.AuthSocketSchema | undefined;
    version: any;
    err?: string;
    tableSchemaErrors: TableSchemaErrors;
    tableSchema: DBSchemaTable[];
    schema: TableSchemaForClient;
    methods: {
        name: string;
        description?: string;
        input?: Record<string, JSONB.FieldType> | undefined;
        output?: JSONB.FieldType | undefined;
    }[];
};
export type ProstglesError = {
    message: string;
    column?: string;
    code?: string;
    table?: string;
    constraint?: string;
    txt?: string;
    code_info?: string;
    detail?: string;
    columns?: string[];
};
type ColumnInfoForNestedInsert = Pick<ColumnInfo, "name" | "references" | "is_pkey">;
export declare const getPossibleNestedInsert: (column: ColumnInfoForNestedInsert, schema: {
    name: string;
    columns: ColumnInfoForNestedInsert[];
}[], silent?: boolean) => ReferenceTable | undefined;
export * from "./auth";
export { CONTENT_TYPE_TO_EXT } from "./files";
export type { ALLOWED_CONTENT_TYPE, ALLOWED_EXTENSION, FileColumnConfig, FileType } from "./files";
export * from "./filters";
export * from "./joinHelpers";
export * from "./JSONBSchemaValidation/getJSONBSchemaAsJSONSchema";
export * from "./JSONBSchemaValidation/getJSONBSchemaTSTypes";
export * from "./JSONBSchemaValidation/JSONBSchema";
export * from "./JSONBSchemaValidation/JSONBSchemaValidation";
export type { ClientExpressData, ClientSyncHandles, ClientSyncInfo, ClientSyncPullResponse, onUpdatesParams, SyncBatchParams, SyncConfig, } from "./replication";
export * from "./util";
export * from "./utilFuncs/index";
//# sourceMappingURL=index.d.ts.map