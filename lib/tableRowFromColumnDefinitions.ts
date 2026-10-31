import type { JSONB } from "./JSONBSchemaValidation/JSONBSchema";

export type TableCheckValue = string | number | boolean | null;
export type TableCheckBranch = Record<
  string,
  | TableCheckValue
  | { enum: readonly TableCheckValue[] }
  | { $ne: null }
  | Record<string, never>
>;
export type TableCheck = { $or: readonly TableCheckBranch[] };

export type ManagedTableColumnDefinition =
  | string
  | { enum: readonly (string | number)[]; nullable?: boolean }
  | { jsonbSchema: JSONB.JSONBSchema; nullable?: boolean };

export type ManagedTableSchema = {
  columns: Record<string, ManagedTableColumnDefinition>;
  check?: TableCheck;
};

/** Row types for the column definitions used by managed tables. */
export type TableRowFromColumnDefinitions<
  T extends Record<string, ManagedTableColumnDefinition>,
  Binary = ArrayBuffer | Uint8Array,
> = InsertRow<
  {
    [K in keyof T]: T[K] extends string ? NormalizeSQL<Uppercase<T[K]>> : T[K];
  },
  Binary
>;

/** Selected managed rows, narrowed by the same CHECK branches as the generated schema. */
export type TableRowFromTableConfig<
  T extends ManagedTableSchema,
  ValueTypes extends Partial<Record<keyof T["columns"], unknown>> = {},
  Binary = ArrayBuffer | Uint8Array,
> = CheckedRow<
  {
    [K in keyof T["columns"]]: K extends keyof ValueTypes ? ValueTypes[K]
    : TableRowFromColumnDefinitions<T["columns"], Binary> extends infer Row ?
      K extends keyof Row ?
        Required<Row>[K]
      : never
    : never;
  },
  T extends (
    { check: { $or: readonly (infer Branch extends TableCheckBranch)[] } }
  ) ?
    Branch
  : undefined
>;

/** Insert rows may omit nullable columns and columns supplied by database defaults. */
export type TableInsertRowFromTableConfig<
  T extends ManagedTableSchema,
  ValueTypes extends Partial<Record<keyof T["columns"], unknown>> = {},
  Binary = ArrayBuffer | Uint8Array,
> = CheckedInsertRow<
  TableRowFromTableConfig<T, ValueTypes, Binary>,
  GeneratedColumnNames<{
    [K in keyof T["columns"]]: T["columns"][K] extends string ?
      NormalizeSQL<Uppercase<T["columns"][K]>>
    : T["columns"][K];
  }>
>;

type CheckedInsertRow<Row, Defaults> =
  Row extends unknown ?
    Omit<Row, OptionalInsertKeys<Row, Defaults>> &
      Partial<Pick<Row, OptionalInsertKeys<Row, Defaults>>>
  : never;

type OptionalInsertKeys<Row, Defaults> = {
  [K in keyof Row]: K extends Defaults ? K
  : null extends Row[K] ? K
  : never;
}[keyof Row];

type CheckedRow<Row, Branch> =
  Branch extends TableCheckBranch ?
    {
      [K in keyof Row]: K extends keyof Branch ?
        Branch[K] extends { $ne: null } ? NonNullable<Row[K]>
        : Branch[K] extends { enum: readonly (infer V)[] } ? V
        : Branch[K] extends Record<string, never> ? Row[K]
        : Branch[K]
      : null extends Row[K] ? null
      : Row[K];
    }
  : Row;

type InsertRow<
  T extends Record<string, ManagedTableColumnDefinition>,
  Binary,
> = Omit<TableRow<T, Binary>, GeneratedColumnNames<T>> &
  Partial<Pick<TableRow<T, Binary>, GeneratedColumnNames<T>>>;

type TableRow<
  T extends Record<string, ManagedTableColumnDefinition>,
  Binary,
> = {
  [K in keyof T]: T[K] extends (
    {
      jsonbSchema: infer S extends JSONB.JSONBSchema;
    }
  ) ?
    JSONB.GetType<S> | (T[K] extends { nullable: true } ? null : never)
  : T[K] extends { enum: readonly (infer V)[] } ?
    V | (T[K] extends { nullable: true } ? null : never)
  : | ColumnValue<T[K], Binary>
    | (T[K] extends string ?
        ColumnIsRequired<T[K]> extends true ?
          never
        : null
      : never);
};

type ColumnIsRequired<T extends string> =
  ReadType<T>[0] extends SerialType ? true
  : ` ${Unquoted<T>} ` extends (

      | `${string} NOT NULL ${string}`
      | `${string} PRIMARY KEY ${string}`
      | `${string} GENERATED ${string} AS IDENTITY ${string}`
  ) ?
    true
  : false;

type GeneratedColumnNames<
  T extends Record<string, ManagedTableColumnDefinition>,
> = {
  [K in keyof T]: T[K] extends string ?
    ReadType<T[K]>[0] extends SerialType ? K
    : ` ${Unquoted<T[K]>} ` extends (
      `${string} DEFAULT ${string}` | `${string} GENERATED ${string}`
    ) ?
      K
    : never
  : never;
}[keyof T];

type SerialType =
  "SMALLSERIAL" | "SERIAL2" | "SERIAL" | "SERIAL4" | "BIGSERIAL" | "SERIAL8";

type ColumnValue<T, Binary> =
  T extends string ?
    T extends `DOUBLE PRECISION${infer Rest}` ?
      ColumnValue<`FLOAT8${Rest}`, Binary>
    : ReadType<T> extends (
      [infer Name extends string, infer Rest extends string]
    ) ?
      ArrayValue<ScalarValue<Name, Binary>, Trim<Rest>>
    : never
  : never;

type ScalarValue<T, Binary> =
  T extends "BYTEA" ? Binary
  : T extends "JSON" | "JSONB" ? Record<string, unknown>
  : T extends "BOOL" | "BOOLEAN" ? boolean
  : T extends (

      | "SMALLINT"
      | "INT2"
      | "INT"
      | "INTEGER"
      | "INT4"
      | "SMALLSERIAL"
      | "SERIAL2"
      | "SERIAL"
      | "SERIAL4"
      | "REAL"
      | "FLOAT"
      | "FLOAT4"
      | "FLOAT8"
  ) ?
    number
  : T extends (
    "BIGINT" | "INT8" | "BIGSERIAL" | "SERIAL8" | "NUMERIC" | "DECIMAL" | "DEC"
  ) ?
    string | number
  : string;

/** Only consume modifiers/array dimensions immediately following the type. */
type ArrayValue<Value, Rest extends string> =
  Rest extends `(${string})${infer Tail}` ? ArrayValue<Value, Trim<Tail>>
  : Rest extends `[${string}]${infer Tail}` ?
    ArrayValue<(Value | null)[], Trim<Tail>>
  : Rest extends "ARRAY" | `ARRAY ${string}` | `ARRAY[${string}` ?
    Rest extends `ARRAY${infer Tail}` ?
      Trim<Tail> extends `[${string}` ?
        ArrayValue<Value, Trim<Tail>>
      : (Value | null)[]
    : never
  : Value;

type ReadType<T extends string, Name extends string = ""> =
  T extends `${" " | "(" | "["}${string}` ? [Name, T]
  : T extends `${infer Char}${infer Rest}` ? ReadType<Rest, `${Name}${Char}`>
  : [Name, ""];

type Trim<T extends string> =
  T extends ` ${infer Rest}` ? Trim<Rest>
  : T extends `${infer Rest} ` ? Trim<Rest>
  : T;

type NormalizeSQL<T extends string> =
  T extends `${infer Start}\n${infer End}` ? NormalizeSQL<`${Start} ${End}`>
  : T extends `${infer Start}\r${infer End}` ? NormalizeSQL<`${Start} ${End}`>
  : T extends `${infer Start}\t${infer End}` ? NormalizeSQL<`${Start} ${End}`>
  : T extends `${infer Start}  ${infer End}` ? NormalizeSQL<`${Start} ${End}`>
  : Trim<T>;

/** Quoted values and identifiers do not declare defaults or constraints. */
type Unquoted<T extends string> =
  T extends `${infer Start}'${string}'${infer End}` ? Unquoted<`${Start}${End}`>
  : T extends `${infer Start}"${string}"${infer End}` ?
    Unquoted<`${Start}${End}`>
  : T;
