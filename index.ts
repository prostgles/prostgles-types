

export type ColumnInfo = {
  name: string;

  /* Simplified data type */
  data_type: string;

  /* values starting with underscore means it's an array of that data type */
  udt_name: string;

  element_type: string;

  /* PRIMARY KEY constraint on column. A table can have more then one PK */
  is_pkey: boolean;
}

export type ValidatedColumnInfo = ColumnInfo & {
  select: boolean;  
  insert: boolean;  
  update: boolean;
  delete: boolean;
}

export type AscOrDesc = 1 | -1 | boolean;

export type OrderBy = { key: string, asc: AscOrDesc }[] | { [key: string]: AscOrDesc }[] | { [key: string]: AscOrDesc } | string | string[];

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

export type Filter = {

} | object | undefined;

export type ViewHandler = {
  getColumns: () => Promise<any[]>;
  find: (filter?: Filter, selectParams?: SelectParams) => Promise<any[] | any[]>;
  findOne: (filter?: Filter, selectParams?: SelectParams) => Promise<any | any>;
  subscribe: (filter: Filter, params: SelectParams, onData: (items: any[]) => any) => Promise<{ unsubscribe: () => any }>;
  subscribeOne: (filter: Filter, params: SelectParams, onData: (item: any) => any) => Promise<{ unsubscribe: () => any }>;
  count: (filter?: Filter) => Promise<number>;
}

export type TableHandler = ViewHandler & {
  update: (filter: Filter, newData: any, params?: UpdateParams) => Promise<void | any>;
  upsert: (filter: Filter, newData: any, params?: UpdateParams) => Promise<void | any>;
  insert: (data: (any | any[]), params?: InsertParams) => Promise<void | any>;
  delete: (filter: Filter, params?: DeleteParams) => Promise<void | any>;
}

export type DBHandler = {
  [key: string]: Partial<TableHandler>;
}