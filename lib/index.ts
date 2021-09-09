
import { FullFilter, AnyObject, FullFilterBasic } from "./filters";

export type ColumnInfo = {
  name: string;

  /**
   * Column description (if provided)
   */
  comment: string;

  /**
   * Ordinal position of the column within the table (count starts at 1)
   */
  ordinal_position: number;

  /**
   * True if column is nullable. A not-null constraint is one way a column can be known not nullable, but there may be others.
   */
  is_nullable: boolean;

  /* Simplified data type */
  data_type: string;

  /* values starting with underscore means it's an array of that data type */
  udt_name: string;

  /* Element data type */
  element_type: string;

  /* PRIMARY KEY constraint on column. A table can have more then one PK */
  is_pkey: boolean;

  /* Foreign key constraint */
  references?: {
    ftable: string;
    fcols: string[];
    cols: string[];
  }
}

export type TS_DATA_TYPE = "string" | "number" | "boolean" | "Object" | "Date" | "Array<number>" | "Array<boolean>" | "Array<string>" | "Array<Object>" | "Array<Date>" | "any";

export type ValidatedColumnInfo = ColumnInfo & {

  /**
   * TypeScript data type
   */
  tsDataType: TS_DATA_TYPE;

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

/**
 * List of fields to include or exclude
 */
export declare type FieldFilter = {} | string[] | "*" | "" | {
  [key: string]: (1 | 0 | boolean);
};

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
| { key: keyof T, asc: AscOrDesc, nulls?: "last" | "first" }[] 
| Array<keyof T>
| keyof T
;

export type OrderBy<T = AnyObject> = 
| _OrderBy<T>
| _OrderBy<AnyObject>
;

export type Select<T = AnyObject> = 
 | { [K in keyof Partial<T>]: any } 
 | {} 
 | undefined 
 | "" 
 | "*" 
 | AnyObject 
 | Array<keyof T>
;
export type SelectBasic = 
 | { [key: string]: any } 
 | {} 
 | undefined 
 | "" 
 | "*" 
;

/* Simpler types */

 export type SelectParamsBasic = {
  select?: SelectBasic;
  limit?: number;
  offset?: number;
  orderBy?: OrderBy;
  /**
   * Will group by all non aggregated fields specified in select (or all fields by default)
   */
  groupBy?: boolean;

  return?: 

  /**
   * Will return the first row as an object. Will throw an error if more than a row is returned. Use limit: 1 to avoid error.
   */
  | "row"

  /**
    * Will return an array of values from the selected field. Similar to array_agg(field).
    */
  | "values"
 ;
}

export type SelectParams<T = AnyObject> = SelectParamsBasic & {
  select?: Select<T>;
  orderBy?: OrderBy<T>;
}
export type SubscribeParams<T = AnyObject> = SelectParams<T> & {
  throttle?: number;
};

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

export type SubscribeParamsBasic = SelectParamsBasic & {
  throttle?: number;
};

export type UpdateParamsBasic = {
  returning?: SelectBasic;
  onConflictDoNothing?: boolean;
  fixIssues?: boolean;

  /* true by default. If false the update will fail if affecting more than one row */
  multi?: boolean;
}
export type InsertParamsBasic = {
  returning?: SelectBasic;
  onConflictDoNothing?: boolean;
  fixIssues?: boolean;
}
export type DeleteParamsBasic = {
  returning?: SelectBasic;
}
/**
 * Adds unknown props to object
 * Used in represent data returned from a query that can have arbitrary computed fields
 */

export type PartialLax<T = AnyObject> = Partial<T>  & AnyObject;

export type TableInfo = {
  oid: number;
  comment: string;
}

export type OnError = (err: any) => void;

export type SubscriptionHandler<T = AnyObject> = Promise<{
    unsubscribe: () => Promise<any>;
    update?: (newData: T, updateParams: UpdateParams<T>) => Promise<any>;
    delete?: (deleteParams: DeleteParams<T>) => Promise<any>;
    filter: FullFilter<T> | {};
}>

export type ViewHandler<TT = AnyObject> = {
  getInfo?: () => Promise<TableInfo>;
  getColumns?: () => Promise<ValidatedColumnInfo[]>;
  find: <TD = TT>(filter?: FullFilter<TD>, selectParams?: SelectParams<TD>) => Promise<PartialLax<TD>[]>;
  findOne: <TD = TT>(filter?: FullFilter<TD>, selectParams?: SelectParams<TD>) => Promise<PartialLax<TD>>;
  subscribe: <TD = TT>(filter: FullFilter<TD>, params: SubscribeParams<TD>, onData: (items: PartialLax<TD>[], onError?: OnError) => any) => SubscriptionHandler;
  subscribeOne: <TD = TT>(filter: FullFilter<TD>, params: SubscribeParams<TD>, onData: (item: PartialLax<TD>) => any, onError?: OnError) => SubscriptionHandler;
  count: <TD = TT>(filter?: FullFilter<TD>) => Promise<number>;
}

export type TableHandler<TT = AnyObject> = ViewHandler<TT> & {
  update: <TD = TT>(filter: FullFilter<TD>, newData: PartialLax<TD>, params?: UpdateParams<TD>) => Promise<PartialLax<TD> | void>;
  updateBatch: <TD = TT>(data: [FullFilter<TD>, PartialLax<TD>][], params?: UpdateParams<TD>) => Promise<PartialLax<TD> | void>;
  upsert: <TD = TT>(filter: FullFilter<TD>, newData: PartialLax<TD>, params?: UpdateParams<TD>) => Promise<PartialLax<TD> | void>;
  insert: <TD = TT>(data: (PartialLax<TD> | PartialLax<TD>[]), params?: InsertParams<TD>) => Promise<PartialLax<TD> | void>;
  delete: <TD = TT>(filter?: FullFilter<TD>, params?: DeleteParams<TD>) => Promise<PartialLax<TD> | void>;
}

// const c: TableHandler<{ h: number }> = {} as any;
// c.findOne({ }, { select: { h: 2 }}).then(r => {
//   r.hd;
// });
// c.update({ da: 2 }, { zd: '2' });
// c.subscribe({ x: 10}, {}, d => {
//   d.filter(dd => dd.x === 20);
// })


export type ViewHandlerBasic = {
  getInfo?: () => Promise<TableInfo>;
  getColumns?: () => Promise<ValidatedColumnInfo[]>;
  find: <TD = AnyObject>(filter?: FullFilterBasic, selectParams?: SelectParamsBasic) => Promise<PartialLax<TD>[]>;
  findOne: <TD = AnyObject>(filter?: FullFilterBasic, selectParams?: SelectParamsBasic) => Promise<PartialLax<TD>>;
  subscribe: <TD = AnyObject>(filter: FullFilterBasic, params: SubscribeParamsBasic, onData: (items: PartialLax<TD>[], onError?: OnError) => any) => Promise<{ unsubscribe: () => any }>;
  subscribeOne: <TD = AnyObject>(filter: FullFilterBasic, params: SubscribeParamsBasic, onData: (item: PartialLax<TD>, onError?: OnError) => any) => Promise<{ unsubscribe: () => any }>;
  count: (filter?: FullFilterBasic) => Promise<number>;
}

export type TableHandlerBasic = ViewHandlerBasic & {
  update: <TD = AnyObject>(filter: FullFilterBasic, newData: PartialLax<TD>, params?: UpdateParamsBasic) => Promise<PartialLax<TD> | void>;
  updateBatch: <TD = AnyObject>(data: [FullFilterBasic, PartialLax<TD>][], params?: UpdateParamsBasic) => Promise<PartialLax<TD> | void>;
  upsert: <TD = AnyObject>(filter: FullFilterBasic, newData: PartialLax<TD>, params?: UpdateParamsBasic) => Promise<PartialLax<TD> | void>;
  insert: <TD = AnyObject>(data: (PartialLax<TD> | PartialLax<TD>[]), params?: InsertParamsBasic) => Promise<PartialLax<TD> | void>;
  delete: <TD = AnyObject>(filter?: FullFilterBasic, params?: DeleteParamsBasic) => Promise<PartialLax<TD> | void>;
}

export type JoinMaker<TT = AnyObject> = (filter?: FullFilter<TT>, select?: Select<TT>, options?: SelectParams<TT>) => any;
export type JoinMakerBasic = (filter?: FullFilterBasic, select?: SelectBasic, options?: SelectParamsBasic) => any;

export type TableJoin = {
  [key: string]: JoinMaker;
}
export type TableJoinBasic = {
  [key: string]: JoinMakerBasic;
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


/**
 * Simpler DBHandler types to reduce load on TS
 */
export type DBHandlerBasic = {
  [key: string]: Partial<TableHandlerBasic>;
} & {
  innerJoin: TableJoinBasic;
  leftJoin: TableJoinBasic;
  innerJoinOne: TableJoinBasic;
  leftJoinOne: TableJoinBasic;
}



/**
 * Other
 */

export type DBNoticeConfig = {
  socketChannel: string;
  socketUnsubChannel: string;
}

export type DBNotifConfig = DBNoticeConfig & {
  notifChannel: string;
}


export type SQLOptions = {
  /**
   * Return type
   */
  returnType: "statement" | "rows" | "noticeSubscription";
} ;

export type SQLRequest = {
  query: string;
  params?: any | any[];
  options?:  SQLOptions
}

export type NotifSubscription = {
  socketChannel: string;
  socketUnsubChannel: string;
  notifChannel: string;
}

export type NoticeSubscription = {
  socketChannel: string;
  socketUnsubChannel: string;
}

const preffix = "_psqlWS_.";
export const CHANNELS = {
  SCHEMA_CHANGED: preffix + "schema-changed",
  SCHEMA: preffix + "schema",


  DEFAULT: preffix,
  SQL: `${preffix}sql`,
  METHOD: `${preffix}method`,
  NOTICE_EV: `${preffix}notice`,
  LISTEN_EV: `${preffix}listen`,

  /* Auth channels */
  REGISTER: `${preffix}register`,
  LOGIN: `${preffix}login`,
  LOGOUT: `${preffix}logout`,

  _preffix: preffix,
}

// import { md5 } from "./md5";
// export { get, getTextPatch, unpatchText, isEmpty, WAL, WALConfig, asName } from "./util";
export * from "./util";
export * from "./filters";

// const util = { getTextPatch, unpatchText, md5 };
// export { util };
// export { getTextPatch, unpatchText, md5 };
