
import { FullFilter, AnyObject } from "./filters";

export type ColumnInfo = {
  name: string;

  /* Simplified data type */
  data_type: string;

  /* values starting with underscore means it's an array of that data type */
  udt_name: string;

  /* Element data type */
  element_type: string;

  /* PRIMARY KEY constraint on column. A table can have more then one PK */
  is_pkey: boolean;
}

export type ValidatedColumnInfo = ColumnInfo & {

  /**
   * TypeScript data type
   */
  tsDataType: string;

  /**
   * Fields that can be viewed
   */
  select: boolean;

  /**
   * Fields that can be filtered by
   */
  filter: boolean;

  /**
   * Fields that can be inserted
   */
  insert: boolean;

  /**
   * Fields that can be updated
   */
  update: boolean;

  /**
   * Fields that can be used in the delete filter
   */
  delete: boolean;
}

export type AscOrDesc = 1 | -1 | boolean;

/**
 * @example
 * { product_name: -1 } -> SORT BY product_name DESC
 * [{ field_name: (1 | -1 | boolean) }]
 * true | 1 -> ascending
 * false | -1 -> descending
 * Array order is maintained
 */
export type _OrderBy<T = AnyObject> = 
| { [K in keyof Partial<T>]: AscOrDesc }
| { [K in keyof Partial<T>]: AscOrDesc }[]
| { key: keyof T, asc: AscOrDesc }[] 
| Array<keyof T>
| keyof T

export type OrderBy<T = AnyObject> = 
| _OrderBy<T>
| _OrderBy<AnyObject>
;

// export const AGGREGATION_FUNCTIONS = ["$max", "$min", "$count"];
// export type AggFunc = typeof AGGREGATION_FUNCTIONS[number] | { [key in typeof AGGREGATION_FUNCTIONS[number]]: FieldFilter  };
export type Select<T = AnyObject> = 
 | { [K in keyof Partial<T>]: any } 
 | {} 
 | undefined 
 | "" 
 | "*" 
 | AnyObject 
 | Array<keyof T>
;

export type SelectParams<T = AnyObject> = {
  select?: Select<T>;
  limit?: number;
  offset?: number;
  orderBy?: OrderBy<T>;
  expectOne?: boolean;
}
export type UpdateParams<T = AnyObject> = {
  returning?: Select<T>;
  onConflictDoNothing?: boolean;
  fixIssues?: boolean;

  /* true by default. If false the update will fail if affecting more than one row */
  multi?: boolean;
}
export type InsertParams<T = AnyObject> = {
  returning?: Select<T>;
  onConflictDoNothing?: boolean;
  fixIssues?: boolean;
}
export type DeleteParams<T = AnyObject> = {
  returning?: Select<T>;
}

/**
 * Adds unknown props to object
 * Used in represent data returned from a query that can have arbitrary computed fields
 */
export type DExtended<T = AnyObject> = Partial<T & { [x: string]: any }>;


export type ViewHandler<TT = AnyObject> = {
  getColumns: () => Promise<ValidatedColumnInfo[]>;
  find: <TD = TT>(filter?: FullFilter<TD>, selectParams?: SelectParams<TD>) => Promise<DExtended<TD>[]>;
  findOne: <TD = TT>(filter?: FullFilter<TD>, selectParams?: SelectParams<TD>) => Promise<DExtended<TD>>;
  subscribe: <TD = TT>(filter: FullFilter<TD>, params: SelectParams<TD>, onData: (items: DExtended<TD>[]) => any) => Promise<{ unsubscribe: () => any }>;
  subscribeOne: <TD = TT>(filter: FullFilter<TD>, params: SelectParams<TD>, onData: (item: DExtended<TD>) => any) => Promise<{ unsubscribe: () => any }>;
  count: <TD = TT>(filter?: FullFilter<TD>) => Promise<number>;
}

export type TableHandler<TT = AnyObject> = ViewHandler<TT> & {
  update: <TD = TT>(filter: FullFilter<TD>, newData: Partial<TD>, params?: UpdateParams<TD>) => Promise<DExtended<TD> | void>;
  updateBatch: <TD = TT>(data: [FullFilter<TD>, Partial<TD>][], params?: UpdateParams<TD>) => Promise<DExtended<TD> | void>;
  upsert: <TD = TT>(filter: FullFilter<TD>, newData: Partial<TD>, params?: UpdateParams<TD>) => Promise<DExtended<TD> | void>;
  insert: <TD = TT>(data: (Partial<TD> | Partial<TD>[]), params?: InsertParams<TD>) => Promise<DExtended<TD> | void>;
  delete: <TD = TT>(filter?: FullFilter<TD>, params?: DeleteParams<TD>) => Promise<DExtended<TD> | void>;
}

export type JoinMaker<TT = AnyObject> = (filter?: FullFilter<TT>, select?: Select<TT>, options?: SelectParams<TT>) => any;

export type TableJoin = {
  [key: string]: JoinMaker;
}
export type DbJoinMaker = {
  innerJoin: TableJoin;
  leftJoin: TableJoin;
  innerJoinOne: TableJoin;
  leftJoinOne: TableJoin;
}

export type DBHandler = {
  [key: string]: Partial<TableHandler>;
} & DbJoinMaker;


export type SQLOptions = {
  /**
   * Change the return type
   */
  returnType?: "rows" | "statement";
}


export type SQLRequest = {
  query: string;
  params?: any | any[];
  options?:  SQLOptions
}

const preffix = "_psqlWS_.";
export const CHANNELS = {
  SCHEMA_CHANGED: preffix + "schema-changed",
  SCHEMA: preffix + "schema",


  DEFAULT: preffix,
  SQL: `${preffix}sql`,
  METHOD: `${preffix}method`,

  /* Auth channels */
  REGISTER: `${preffix}register`,
  LOGIN: `${preffix}login`,
  LOGOUT: `${preffix}logout`,

  _preffix: preffix,
}

// import { md5 } from "./md5";
export { getTextPatch, unpatchText, isEmpty, WAL, WALConfig, asName } from "./util";
export { EXISTS_KEYS, FilterDataType, FullFilter, GeomFilterKeys, GeomFilter_Funcs, TextFilter_FullTextSearchFilterKeys } from "./filters";

// const util = { getTextPatch, unpatchText, md5 };
// export { util };
// export { getTextPatch, unpatchText, md5 };