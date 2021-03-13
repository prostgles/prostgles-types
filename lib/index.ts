
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
export type OrderBy = { key: string, asc: AscOrDesc }[] | { [key: string]: AscOrDesc }[] | { [key: string]: AscOrDesc } | string | string[];


/**
 * @example
 * { field_name: (true | false) }
 * 
 * ["field_name1", "field_name2"]
 * 
 * field_name: false -> means all fields except this
 */
export type FieldFilter = object | string[] | "*" | "" | { [key: string]: (1 | 0 | boolean) };

export const FIELD_FILTER_TYPES = ["$ilike", "$gte"];

export const AGGREGATION_FUNCTIONS = ["$max", "$min", "$count"];
export type AggFunc = typeof AGGREGATION_FUNCTIONS[number] | { [key in typeof AGGREGATION_FUNCTIONS[number]]: FieldFilter  };
export type Select = FieldFilter | 
  { 
    [key: string]: FieldFilter | AggFunc;
  };

export type SelectParams = {
  select?: FieldFilter;
  limit?: number;
  offset?: number;
  orderBy?: OrderBy;
  expectOne?: boolean;
}
export type UpdateParams = {
  returning?: FieldFilter;
  onConflictDoNothing?: boolean;
  fixIssues?: boolean;

  /* true by default. If false the update will fail if affecting more than one row */
  multi?: boolean;
}
export type InsertParams = {
  returning?: FieldFilter;
  onConflictDoNothing?: boolean;
  fixIssues?: boolean;
}
export type DeleteParams = {
  returning?: FieldFilter;
}

export type Filter = any;// | object | undefined;

export type ViewHandler = {
  getColumns: () => Promise<ValidatedColumnInfo[]>;
  find: <T = any>(filter?: Filter, selectParams?: SelectParams) => Promise<T[]>;
  findOne: <T = any>(filter?: Filter, selectParams?: SelectParams) => Promise<T>;
  subscribe: <T = any>(filter: Filter, params: SelectParams, onData: (items: T[]) => any) => Promise<{ unsubscribe: () => any }>;
  subscribeOne: <T = any>(filter: Filter, params: SelectParams, onData: (item: T) => any) => Promise<{ unsubscribe: () => any }>;
  count: (filter?: Filter) => Promise<number>;
}

export type TableHandler = ViewHandler & {
  update: <T = any>(filter: Filter, newData: any, params?: UpdateParams) => Promise<T | void>;
  updateBatch: <T = any>(data: [Filter, object][], params?: UpdateParams) => Promise<T | void>;
  upsert: <T = any>(filter: Filter, newData: any, params?: UpdateParams) => Promise<T | void>;
  insert: <T = any>(data: (T | T[]), params?: InsertParams) => Promise<T | void>;
  delete: <T = any>(filter?: Filter, params?: DeleteParams) => Promise<T | void>;
}

export type JoinMaker = (filter?: Filter, select?: FieldFilter, options?: SelectParams) => any;

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


// import { md5 } from "./md5";
export { getTextPatch, unpatchText, isEmpty, WAL, WALConfig } from "./util";

// const util = { getTextPatch, unpatchText, md5 };
// export { util };
// export { getTextPatch, unpatchText, md5 };