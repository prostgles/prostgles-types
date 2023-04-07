
import { FullFilter, AnyObject, FullFilterBasic, ValueOf, ComplexFilter, CastFromTSToPG } from "./filters";
import { FileColumnConfig } from "./files";
import { JSONB } from "./jsonb";

export const _PG_strings = [
  'bpchar','char','varchar','text','citext','uuid','bytea', 'time','timetz','interval','name', 
  'cidr', 'inet', 'macaddr', 'macaddr8', "int4range", "int8range", "numrange",
  'tsvector'
] as const;
export const _PG_numbers = ['int2','int4','int8','float4','float8','numeric','money','oid'] as const;
export const _PG_json = ['json', 'jsonb'] as const;
export const _PG_bool = ['bool'] as const;
export const _PG_date = ['date', 'timestamp', 'timestamptz'] as const;
export const _PG_interval = ['interval'] as const;
export const _PG_postgis = ['geometry', 'geography'] as const;
export const _PG_geometric = [
  "point", 
  "line", 
  "lseg", 
  "box", 
  "path",  
  "polygon", 
  "circle",
] as const;

export type PG_COLUMN_UDT_DATA_TYPE = 
    | typeof _PG_strings[number] 
    | typeof _PG_numbers[number] 
    | typeof _PG_geometric[number] 
    | typeof _PG_json[number] 
    | typeof _PG_bool[number] 
    | typeof _PG_date[number] 
    | typeof _PG_interval[number]
    | typeof _PG_postgis[number];
    
const TS_PG_PRIMITIVES = {
  "string": [ ..._PG_strings, ..._PG_date, ..._PG_geometric, ..._PG_postgis, "lseg"],
  "number": _PG_numbers,
  "boolean": _PG_bool,
  "any": [..._PG_json, ..._PG_interval], // consider as any

  /** Timestamps are kept in original string format to avoid filters failing 
   * TODO: cast to dates if udt_name date/timestamp(0 - 3)
  */
  // "Date": _PG_date,
} as const;

export const TS_PG_Types = {
  ...TS_PG_PRIMITIVES,
  "number[]": TS_PG_PRIMITIVES.number.map(s => `_${s}` as const),
  "boolean[]": TS_PG_PRIMITIVES.boolean.map(s => `_${s}` as const),
  "string[]": TS_PG_PRIMITIVES.string.map(s => `_${s}` as const),
  "any[]": TS_PG_PRIMITIVES.any.map(s => `_${s}` as const),
  // "Date[]": _PG_date.map(s => `_${s}` as const),
    // "any": [],
} as const;
export type TS_COLUMN_DATA_TYPES = keyof typeof TS_PG_Types;


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
}
export type DBSchema = { 
  [tov_name: string]: DBTableSchema
}

export type ColumnInfo = {
  name: string;

  /**
   * Column display name. Will be first non empty value from i18n data, comment, name 
   */
  label: string;

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

  /**
   * Simplified data type
   */
  data_type: string;

  /**
   * Postgres raw data types. values starting with underscore means it's an array of that data type
   */
  udt_name: PG_COLUMN_UDT_DATA_TYPE;

  /**
   * Element data type
   */
  element_type: string;

  /**
   * Element raw data type
   */
  element_udt_name: string;

  /**
   * PRIMARY KEY constraint on column. A table can have more then one PK
   */
  is_pkey: boolean;

  /**
   * Foreign key constraint 
   * A column can reference multiple tables
   */
  references?: {
    ftable: string;
    fcols: string[];
    cols: string[];
  }[];

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
   * Extracted from tableConfig
   * Used in SmartForm
   */
  min?: string | number;
  max?: string | number;
  hint?: string;

  jsonbSchema?: JSONB.JSONBSchema;

  /**
   * If degined then this column is referencing the file table
   * Extracted from FileTable config
   * Used in SmartForm
   */
  file?: FileColumnConfig;

}


export type ValidatedColumnInfo = ColumnInfo & {

  /**
   * TypeScript data type
   */
  tsDataType: TS_COLUMN_DATA_TYPES;

  /**
   * Can be viewed/selected
   */
  select: boolean;

  /**
   * Can be ordered by
   */
  orderBy: boolean;

  /**
   * Can be filtered by
   */
  filter: boolean;

  /**
   * Can be inserted
   */
  insert: boolean;

  /**
   * Can be updated
   */
  update: boolean;

  /**
   * Can be used in the delete filter
   */
  delete: boolean;
}


export type DBSchemaTable = {
  name: string;
  info: TableInfo;
  columns: ValidatedColumnInfo[];
};

/**
 * List of fields to include or exclude
 */
export type FieldFilter<T extends AnyObject = AnyObject> = SelectTyped<T>

export type AscOrDesc = 1 | -1 | boolean;

/**
 * @example
 * { product_name: -1 } -> SORT BY product_name DESC
 * [{ field_name: (1 | -1 | boolean) }]
 * true | 1 -> ascending
 * false | -1 -> descending
 * Array order is maintained
 * if nullEmpty is true then empty text will be replaced to null (so nulls sorting takes effect on it)
 */
export type _OrderBy<T extends AnyObject> = 
  | { [K in keyof Partial<T>]: AscOrDesc }
  | { [K in keyof Partial<T>]: AscOrDesc }[]
  | { key: keyof T, asc?: AscOrDesc, nulls?: "last" | "first", nullEmpty?: boolean }[] 
  | Array<keyof T>
  | keyof T
  ;
  
export type OrderBy<T extends AnyObject | void = void> = T extends AnyObject? _OrderBy<T> :  _OrderBy<AnyObject>;

type CommonSelect =  
| "*"
| ""
| { "*" : 1 }

export type SelectTyped<T extends AnyObject> = 
  | { [K in keyof Partial<T>]: 1 | true } 
  | { [K in keyof Partial<T>]: 0 | false } 
  | (keyof T)[]
  | CommonSelect
;


export const JOIN_KEYS = ["$innerJoin", "$leftJoin"] as const; 
export const JOIN_PARAMS = ["select", "filter", "$path", "$condition", "offset", "limit", "orderBy"] as const;

export type JoinCondition = {
  column: string;
  rootColumn: string;
} | ComplexFilter;

export type DetailedJoinSelect = Record<typeof JOIN_KEYS[number], {
  select: Select;
  filter?: FullFilter<void, void>;
  offset?: number;
  limit?: number;
  orderBy?: OrderBy;

} & ({
  $path?: string[];
  $condition?: undefined;
} | {
  $path?: undefined;

  /**
   * If present then will overwrite $path and any inferred joins
   */
  $condition: JoinCondition[];

})>;

export type JoinSelect = 
| "*"
/** Shorthand join: table_name: { ...select } */
| Record<string, Record<string, any>> 
| DetailedJoinSelect;

type FunctionShorthand = string;
type FunctionFull = Record<string, any[] | readonly any[]>;
type FunctionSelect = FunctionShorthand | FunctionFull;
/**
 * { computed_field: { funcName: [args] } }
 */
type FunctionAliasedSelect = Record<string, FunctionFull>;

type InclusiveSelect = true | 1 | FunctionSelect

type SelectFuncs<T extends AnyObject = AnyObject, IsTyped = false> = (
  | ({ [K in keyof Partial<T>]: InclusiveSelect } & Record<string, IsTyped extends true? FunctionFull : InclusiveSelect>)
  | JoinSelect
  | FunctionAliasedSelect
  | { [K in keyof Partial<T>]: true | 1 | string }
  | { [K in keyof Partial<T>]: 0 | false }
  | CommonSelect
  | (keyof Partial<T>)[]
);

/** S param is needed to ensure the non typed select works fine */
export type Select<T extends AnyObject | void = void, S = void> = { t: T, s: S } extends { t: AnyObject, s: any } ? SelectFuncs<T & { $rowhash: string }, true> : SelectFuncs<AnyObject & { $rowhash: string }, false>;



export type SelectBasic = 
  | { [key: string]: any } 
  | {} 
  | undefined 
  | "" 
  | "*" 
  ;

/* Simpler types */
type CommonSelectParams = {

  limit?: number;
  offset?: number;

  /**
   * Will group by all non aggregated fields specified in select (or all fields by default)
   */
  groupBy?: boolean;

  returnType?: 

  /**
   * Will return the first row as an object. Will throw an error if more than a row is returned. Use limit: 1 to avoid error.
   */
  | "row"

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

} 

export type SelectParams<T extends AnyObject | void = void, S = void> = CommonSelectParams & {
  select?: Select<T, S>;
  orderBy?: OrderBy<S extends DBSchema? T : void>;
}
export type SubscribeParams<T extends AnyObject | void = void, S = void> = SelectParams<T, S> & {
  throttle?: number;
  throttleOpts?: {
    /** 
     * False by default. 
     * If true then the first value will be emitted at the end of the interval. Instant otherwise 
     * */
    skipFirst?: boolean;
  };
};

export type UpdateParams<T extends AnyObject | void = void, S = void> = {
  returning?: Select<T, S>;
  onConflictDoNothing?: boolean;
  fixIssues?: boolean;

  /* true by default. If false the update will fail if affecting more than one row */
  multi?: boolean;
}
export type InsertParams<T extends AnyObject | void = void, S = void> = {
  returning?: Select<T, S>;
  onConflictDoNothing?: boolean;
  fixIssues?: boolean;
}
export type DeleteParams<T extends AnyObject | void = void, S = void> = {
  returning?: Select<T, S>;
} 

export type PartialLax<T = AnyObject> = Partial<T> & AnyObject;

export type TableInfo = {
  oid: number;
  comment?: string;
  /**
   * Created by prostgles for managing files
   */
  is_media?: boolean;

  is_view?: boolean;

  /**
   * How many files are expected at most for each row from this table
   */
  has_media?: "one" | "many";

  /**
   * True if the media relates to this table only (does not relate to some joined table)
   */
  has_direct_media?: boolean;

  /**
   * Name of the table that contains the files
   */
  media_table_name?: string;

  /**
   * Used for getColumns in cases where the columns are dynamic based on the request.
   * See dynamicFields from Update rules
   */
  dynamicRules?: {
    update?: boolean;
  }

  /**
   * Additional table info provided through TableConfig
   */
  info?: {
    label?: string;
  }
}

export type OnError = (err: any) => void;

type JoinedSelect = Record<string, Select>;

type ParseSelect<Select extends SelectParams<TD>["select"], TD extends AnyObject> = 
(Select extends { "*": 1 }? Required<TD> : {})
& {
  [Key in keyof Omit<Select, "*">]: Select[Key] extends 1? Required<TD>[Key] : 
    Select[Key] extends Record<string, any[]>? any : //Function select
    Select[Key] extends JoinedSelect? any[] : 
    any;
}

type GetSelectDataType<S, O extends SelectParams<TD, S>, TD extends AnyObject> = 
  O extends { returnType: "value" }? any : 
  O extends { returnType: "values"; select: Record<string, 1> }? ValueOf<Pick<Required<TD>, keyof O["select"]>> : 
  O extends { returnType: "values" }? any : 
  O extends { select: "*" }? Required<TD> : 
  O extends { select: "" }? Record<string, never> : 
  O extends { select: Record<string, 0> }? Omit<Required<TD>, keyof O["select"]> : 
  O extends { select: Record<string, any> }? ParseSelect<O["select"], Required<TD>> : 
  Required<TD>;

export type GetSelectReturnType<S, O extends SelectParams<TD, S>, TD extends AnyObject, isMulti extends boolean> = 
  O extends { returnType: "statement" }? string : 
  isMulti extends true? GetSelectDataType<S, O, TD>[] :
  GetSelectDataType<S, O, TD>;

type GetUpdateReturnType<O extends UpdateParams<TD, S>, TD extends AnyObject, S = void> = 
  O extends { returning: "*" }? Required<TD> : 
  O extends { returning: "" }? Record<string, never> : 
  O extends { returning: Record<string, 1> }? Pick<Required<TD>, keyof O["returning"]> : 
  O extends { returning: Record<string, 0> }? Omit<Required<TD>, keyof O["returning"]> : 
  void;

export type SubscriptionHandler = {
  unsubscribe: () => Promise<any>;
  filter: FullFilter<void, void> | {};
}

type GetColumns = (lang?: string, params?: { rule: "update", data: AnyObject, filter: AnyObject }) => Promise<ValidatedColumnInfo[]>;

export type ViewHandler<TD extends AnyObject = AnyObject, S extends DBSchema | void = void> = {
  getInfo?: (lang?: string) => Promise<TableInfo>;
  getColumns?: GetColumns
  find: <P extends SelectParams<TD, S>>(filter?: FullFilter<TD, S>, selectParams?: P) => Promise<GetSelectReturnType<S, P, TD, true>>;
  findOne: <P extends SelectParams<TD, S>>(filter?: FullFilter<TD, S>, selectParams?: P) => Promise<undefined | GetSelectReturnType<S, P, TD, false>>;
  subscribe: <P extends SubscribeParams<TD, S>>(
    filter: FullFilter<TD, S>, 
    params: P, 
    onData: (items: GetSelectReturnType<S, P, TD, true>) => any,
    onError?: OnError
  ) => Promise<SubscriptionHandler>;
  subscribeOne: <P extends SubscribeParams<TD, S>>(
    filter: FullFilter<TD, S>, 
    params: P, 
    onData: (item: GetSelectReturnType<S, P, TD, false> | undefined) => any, 
    onError?: OnError
  ) => Promise<SubscriptionHandler>;
  count: (filter?: FullFilter<TD, S>) => Promise<number>;
  /**
   * Returns result size in bits
   */
  size: <P extends SelectParams<TD, S>>(filter?: FullFilter<TD, S>, selectParams?: P) => Promise<string>;
}

export type UpsertDataToPGCast<TD extends AnyObject = AnyObject> = {
  [K in keyof TD]: CastFromTSToPG<TD[K]>
};

type UpsertDataToPGCastLax<T extends AnyObject> = PartialLax<UpsertDataToPGCast<T>>;
type InsertData<T extends AnyObject> = UpsertDataToPGCast<T> | UpsertDataToPGCast<T>[]

export type TableHandler<TD extends AnyObject = AnyObject, S extends DBSchema | void = void> = ViewHandler<TD, S> & {
  update: <P extends UpdateParams<TD, S>>(filter: FullFilter<TD, S>, newData: UpsertDataToPGCastLax<TD>, params?: P) => Promise<GetUpdateReturnType<P ,TD, S> | undefined>;
  updateBatch: (data: [FullFilter<TD, S>, UpsertDataToPGCastLax<TD>][], params?: UpdateParams<TD>) => Promise<PartialLax<TD> | void>;
  upsert: <P extends UpdateParams<TD, S>>(filter: FullFilter<TD, S>, newData: UpsertDataToPGCastLax<TD>, params?: P) => Promise<GetUpdateReturnType<P ,TD, S>>; 
  insert: <P extends UpdateParams<TD, S>, Data extends InsertData<TD>>(data: Data, params?: P ) => Promise<GetUpdateReturnType<P ,TD, S>>;
  delete: <P extends DeleteParams<TD, S>>(filter?: FullFilter<TD, S>, params?: P) => Promise<GetUpdateReturnType<P ,TD, S> | undefined>;
} 

export type JoinMaker<TT extends AnyObject = AnyObject, S extends DBSchema | void = void> = (filter?: FullFilter<TT, S>, select?: Select<TT>, options?: SelectParams<TT>) => any;
export type JoinMakerBasic = (filter?: FullFilterBasic, select?: SelectBasic, options?: SelectParams) => any;

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

export type SQLResult<T extends SQLOptions["returnType"]> = {
  command: "SELECT" | "UPDATE" | "DELETE" | "CREATE" | "ALTER" | "LISTEN" | "UNLISTEN" | "INSERT" | string;
  rowCount: number;
  rows: (T extends "arrayMode"? any : AnyObject)[];
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
}
export type DBEventHandles = {
  socketChannel: string;
  socketUnsubChannel: string;
  addListener: (listener: (event: any) => void) => { removeListener: () => void; } 
};

export type CheckForListen<T, O extends SQLOptions> = O["allowListen"] extends true? (DBEventHandles | T) : T;

export type GetSQLReturnType<O extends SQLOptions> = CheckForListen<
  (
    O["returnType"] extends "row"? AnyObject | null :
    O["returnType"] extends "rows"? AnyObject[] :
    O["returnType"] extends "value"? any | null :
    O["returnType"] extends "values"? any[] :
    O["returnType"] extends "statement"? string :
    O["returnType"] extends "noticeSubscription"? DBEventHandles :
    SQLResult<O["returnType"]>
  )
, O>;

export type SQLHandler = 
/**
 * 
 * @param query <string> query. e.g.: SELECT * FROM users;
 * @param params <any[] | object> query arguments to be escaped. e.g.: { name: 'dwadaw' }
 * @param options <object> { returnType: "statement" | "rows" | "noticeSubscription" }
 */
<Opts extends SQLOptions>(
  query: string, 
  args?: AnyObject | any[], 
  options?: Opts,
  serverSideOptions?: {
    socket: any
  }
) => Promise<GetSQLReturnType<Opts>>

type SelectMethods<T extends DBTableSchema> = T["select"] extends true? keyof Pick<TableHandler, "count" | "find" | "findOne" | "getColumns" | "getInfo" | "size" | "subscribe" | "subscribeOne"> : never;
type UpdateMethods<T extends DBTableSchema> = T["update"] extends true? keyof Pick<TableHandler, "update" | "updateBatch"> : never;
type InsertMethods<T extends DBTableSchema> = T["insert"] extends true? keyof Pick<TableHandler, "insert"> : never;
type UpsertMethods<T extends DBTableSchema> = T["insert"] extends true? T["update"] extends true? keyof Pick<TableHandler, "upsert"> : never : never;
type DeleteMethods<T extends DBTableSchema> = T["delete"] extends true? keyof Pick<TableHandler, "delete"> : never;
// type SyncMethods<T extends DBTableSchema> = T["select"] extends true? T["is_view"] extends true?  keyof Pick<TableHandler, "sync"> : never : never;
export type ValidatedMethods<T extends DBTableSchema> = 
| SelectMethods<T> 
| UpdateMethods<T>
| InsertMethods<T>
| UpsertMethods<T>
| DeleteMethods<T>
// | SyncMethods<T>

export type DBHandler<S = void> = (S extends DBSchema? {
  [k in keyof S]: S[k]["is_view"] extends true ? 
    ViewHandler<S[k]["columns"], S> : 
    Pick<TableHandler<S[k]["columns"], S>, ValidatedMethods<S[k]>>
} : {
  [key: string]: Partial<TableHandler>;
}) & DbJoinMaker & {
  sql?: SQLHandler
}


/**
 * Simpler DBHandler types to reduce load on TS
 */
// export type DBHandlerBasic = {
//   [key: string]: Partial<TableHandlerBasic>;
// } & {
//   innerJoin: TableJoinBasic;
//   leftJoin: TableJoinBasic;
//   innerJoinOne: TableJoinBasic;
//   leftJoinOne: TableJoinBasic;
// } & {
//   sql?: SQLHandler
// }



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
   * if allowListen not specified and a LISTEN query is issued then expect error
   */
  returnType?: Required<SelectParams>["returnType"] | "statement" | "rows" | "noticeSubscription" | "arrayMode";
  allowListen?: boolean;

  /**
   * If false then the query will not be checked for params. Used to ignore queries with param like text (e.g.:  ${someText} )
   * Defaults to true
   */
  hasParams?: boolean;
};

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
  AUTHGUARD: `${preffix}authguard`,

  /**
   * Used for sending any connection errors from onSocketConnect
   */
  CONNECTION: `${preffix}connection`,

  _preffix: preffix,
}

export type SubscriptionChannels = {
  /** Used by server to emit data to client */
  channelName: string;

  /** Used by client to confirm when ready */
  channelNameReady: string;

  /** Used by client to stop subscription */
  channelNameUnsubscribe: string;
}

export type AuthGuardLocation = {
  href:     string;
  origin:   string;
  protocol: string;
  host:     string;
  hostname: string;
  port:     string;
  pathname: string;
  search:   string;
  hash:     string;
}
export type AuthGuardLocationResponse = {
  shouldReload: boolean;
}

export const RULE_METHODS = {
  "getColumns": ["getColumns"], 
  "getInfo": ["getInfo"], 
  "insert": ["insert", "upsert"], 
  "update": ["update", "upsert", "updateBatch"], 
  "select": ["findOne", "find", "count", "size"], 
  "delete": ["delete", "remove"],
  "sync": ["sync", "unsync"], 
  "subscribe": ["unsubscribe", "subscribe", "subscribeOne"],  
} as const

export type MethodKey = typeof RULE_METHODS[keyof typeof RULE_METHODS][number]
export type TableSchemaForClient = Record<string, Partial<Record<MethodKey, {} | { err: any }>>>;

/* Schema */
export type TableSchema = {
  schema: string;
  name: string;
  oid: number;
  comment: string;
  columns: (ColumnInfo & {
    privileges: {
      privilege_type: "INSERT" | "REFERENCES" | "SELECT" | "UPDATE";// | "DELETE";
      is_grantable: "YES" | "NO"
    }[];
  })[];
  is_view: boolean;
  parent_tables: string[];
  privileges: {
    insert: boolean;
    select: boolean;
    update: boolean;
    delete: boolean;
  }
}

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
}

export type ClientSchema = { 
  rawSQL: boolean;
  joinTables: string[][];
  auth: AnyObject;
  version: any;
  err?: string;
  tableSchema?: DBSchemaTable[];
  schema: TableSchemaForClient;
  methods: (string | { name: string; description?: string; } & Pick<MethodFullDef, "input" | "output">)[];
}

/**
 * Auth object sent from server to client
 */
export type AuthSocketSchema = {
  /**
   * User data as returned from server auth.getClientUser
   */
  user?: AnyObject;

  register?: boolean;
  login?: boolean;
  logout?: boolean;

  /**
   * If server auth publicRoutes is set up and AuthGuard is not explicitly disabled ( disableSocketAuthGuard: true ):
   *  on each connect/reconnect the client pathname is checked and page reloaded if it's not a public page and the client is not logged in
   */
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
}


/**
 * Type tests
 */
 (( ) => {

  type Fields =  { id: number; name: number; public: number; $rowhash: string; added_day: any }
  const r:Fields = 1 as any
  const sel1: Select = { id: 1, name: 1, public: 1, $rowhash: 1, added_day: { $day: []  } };
  const sel2: Select<{ id: number; name: number; public: number; }> = { id: 1, name: 1, public: 1, $rowhash: 1, dsds: { d: [] } };
  const sel3: Select<{ id: number; name: number; public: number; }> = ""
  const sel4: Select<{ id: number; name: number; public: number; }> = "*"
  const sel12: Select = { id: 1, name: 1, public: 1, $rowhash: 1, dsds: { d: [] } };
  const sel13: Select = ""
  const sel14: Select = "*";

  const fRow: FullFilter<Fields, {}> = {
    $rowhash: { "$in": [""] }
  };
  const emptyFilter: FullFilter<Fields, {}> = {
  };

  const sel32: Select = {
    dwa: 1
  }
  
  const sel = {
    a: 1,
    $rowhash: 1,
    dwadwA: { dwdwa: [5] }
  } as const; 
  
  const sds: Select = sel;
  const sds01: Select = "";
  const sds02: Select = "*";
  const sds03: Select = {};
  const sds2: Select<{a: number}> = sel;
  
  const s001: Select = { 
    h: { "$ts_headline_simple": ["name", { plainto_tsquery: "abc81" }] },
    hh: { "$ts_headline": ["name", "abc81"] } ,
    added: "$date_trunc_2hour",
    addedY: { "$date_trunc_5minute": ["added"] },
  }
  
  //@ts-expect-error
  const badSel: Select = {
    a: 1,
    b: 0
  };
  
  //@ts-expect-error
  const badSel1: Select<{a: number}> = {
    b: 1,
    a: 1
  };
  
  const sds3: Select<{a: number}> = {
    // "*": 1,
    // a: "$funcName",
    a: { dwda: [] },
    $rowhashD: { dwda: [] },
    // dwadwa: 1, //{ dwa: []}
  }


  const sel1d: Select = {
    dwada: 1,
    $rowhash: 1,
    dwawd: { funcName: [12] }
  }

  const sel1d2: Select<AnyObject> = ["a"]

  const deletePar: DeleteParams = {
    returning: { id: 1, name: 1, public: 1 , $rowhash: 1, added_day: { "$day": ["added"] } }
  }
});

/** More Type tests */
(() => {

  type GSchema = {
    tbl1: {
      is_view: false,
      columns: {
        col1: string,
      },
      delete: true,
      select: true,
      insert: true,
      update: true,
    }
  };

    
  type DBOFullyTyped<Schema = void> = Schema extends DBSchema ? {
    [tov_name in keyof Schema]: Schema[tov_name]["is_view"] extends true ?
    ViewHandler<Schema[tov_name]["columns"], Schema> :
    TableHandler<Schema[tov_name]["columns"], Schema>
  } : Record<string, ViewHandler | TableHandler>;
  

  type TypedFFilter = FullFilter<GSchema["tbl1"]["columns"], GSchema>
  const schemaFFilter: TypedFFilter = { "col1.$eq": "dd" };
  const fullFilter: FullFilter<void, void> = schemaFFilter;
  
  const ffFunc = (f: FullFilter<void, void>) => {};
  ffFunc(schemaFFilter); 
  
  const dbo: DBOFullyTyped<GSchema> = 1 as any;
  
  const filter: FullFilter<GSchema["tbl1"]["columns"], GSchema> = {  };
  
  const filterCheck = <F extends FullFilter<void, void> | undefined>(f: F) => {};
  filterCheck(filter);
  
  const t: UpsertDataToPGCast<GSchema["tbl1"]["columns"]> = {} as any;
  const d: UpsertDataToPGCast<AnyObject> = t;
  const fup = (a: UpsertDataToPGCast) => {}
  fup(t);

  // const f = <A extends TableHandler["count"]>(a: A) => {};
  const f = (s: TableHandler) => {};
  const th: TableHandler<GSchema["tbl1"]["columns"], GSchema> = {  } as any;
  // f(th) 

  const sp: SelectParams<GSchema["tbl1"]["columns"]> = { select: {} };
  const sf = (sp: SelectParams) => {

  }
  sf(sp);
  // const sub: TableHandler["count"] = dbo.tbl1.count
  
  
  // ra(schema);
})


// import { md5 } from "./md5";
// export { get, getTextPatch, unpatchText, isEmpty, WAL, WALConfig, asName } from "./util";
export type { WALItem, BasicOrderBy, WALItemsObj, WALConfig, TextPatch, SyncTableInfo } from "./util";
export { asName, pickKeys, omitKeys, getTextPatch, isEmpty, stableStringify, unpatchText, WAL, get, isDefined, isObject, getKeys } from "./util";
export * from "./filters";
export type { ClientExpressData, ClientSyncHandles, ClientSyncInfo, SyncConfig, ClientSyncPullResponse, SyncBatchParams, onUpdatesParams } from "./replication";
export type { ALLOWED_CONTENT_TYPE, ALLOWED_EXTENSION, FileColumnConfig, FileType } from "./files";
export { CONTENT_TYPE_TO_EXT } from "./files";
export * from "./jsonb";