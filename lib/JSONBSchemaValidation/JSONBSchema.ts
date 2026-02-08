import { AnyObject } from "../filters";
import { type PartialByKeys, type Simplify } from "../util";
export const PrimitiveTypes = [
  "boolean",
  "number",
  "integer",
  "string",
  "Date",
  "time",
  "timestamp",
  "Blob",
  "any",
  "unknown",
] as const;
export const PrimitiveArrayTypes = PrimitiveTypes.map((v) => `${v}[]` as `${typeof v}[]`);
export const DATA_TYPES = [...PrimitiveTypes, ...PrimitiveArrayTypes] as const;
type DataType = (typeof DATA_TYPES)[number];

export namespace JSONB {
  export type BaseOptions = {
    /**
     * If true then field is optional
     */
    optional?: boolean;
    /**
     * If true then value can be null
     */
    nullable?: boolean;
    description?: string;
    title?: string;
  };

  export type Lookup = BaseOptions & {
    type?: "Lookup" | "Lookup[]";
    lookup:
      | {
          type:
            | "data"
            /**
             * This is used as edit-mode (to generate lookup of type data)
             */
            | "data-def";
          table: string;
          column: string;
          filter?: AnyObject;
          isArray?: boolean;
          isFullRow?: {
            /**
             * Columns used to display the selected row in the dropdown
             */
            displayColumns?: string[];
          };
          /**
           * Columns used to search
           */
          searchColumns?: string[];
          /**
           * If true then a button will be shown
           *  in the row card footer to access this action
           */
          showInRowCard?: {
            /**
             * Action button text. Defaults to the method name
             */
            actionLabel?: string;
            actionColor?: "danger" | "warn" | "action";
            actionStyle?: AnyObject;
            actionClass?: string;
          };
        }
      | {
          type: "schema";
          isArray?: boolean;
          object: "column" | "table";
          filter?: { table?: string; tsDataType?: string; udt_name?: string };
        };
    allowedValues?: undefined;
    oneOf?: undefined;
    oneOfType?: undefined;
    arrayOf?: undefined;
    arrayOfType?: undefined;
    enum?: undefined;
    record?: undefined;
  };

  /**
   * Provide more info for allowed values
   */
  type AllowedValueInfo = {
    value: any;
    label: string;
    subLabel?: string;
    /**
     * URL of the icon
     */
    icon?: string;
  };

  export type BasicType = BaseOptions & {
    type: DataType;
    allowedValues?: readonly any[] | any[] | readonly AllowedValueInfo[] | AllowedValueInfo[];
    oneOf?: undefined;
    oneOfType?: undefined;
    arrayOf?: undefined;
    arrayOfType?: undefined;
    enum?: undefined;
    record?: undefined;
    lookup?: undefined;
  };

  export type ObjectType = BaseOptions & {
    type: ObjectSchema;
    allowedValues?: undefined;
    oneOf?: undefined;
    oneOfType?: undefined;
    arrayOf?: undefined;
    arrayOfType?: undefined;
    enum?: undefined;
    record?: undefined;
    lookup?: undefined;
  };

  export type EnumType = BaseOptions & {
    enum: readonly any[];
    type?: undefined;
    oneOf?: undefined;
    oneOfType?: undefined;
    arrayOf?: undefined;
    arrayOfType?: undefined;
    allowedValues?: undefined;
    record?: undefined;
    lookup?: undefined;
  };

  export type OneOf = BaseOptions & {
    type?: undefined;
    arrayOf?: undefined;
    arrayOfType?: undefined;
    allowedValues?: undefined;
    enum?: undefined;
    record?: undefined;
    lookup?: undefined;
  } & (
      | {
          oneOf?: undefined;
          oneOfType: readonly ObjectSchema[];
        }
      | {
          oneOf: readonly FieldType[];
          oneOfType?: undefined;
        }
    );
  export type ArrayOf = BaseOptions & {
    type?: undefined;
    allowedValues?: undefined;
    oneOf?: undefined;
    oneOfType?: undefined;
    enum?: undefined;
    record?: undefined;
    lookup?: undefined;
  } & (
      | {
          arrayOf?: undefined;
          arrayOfType: ObjectSchema;
        }
      | {
          arrayOf: FieldType;
          arrayOfType?: undefined;
        }
    );

  export type RecordType = BaseOptions & {
    type?: undefined;
    allowedValues?: undefined;
    oneOf?: undefined;
    oneOfType?: undefined;
    arrayOf?: undefined;
    arrayOfType?: undefined;
    enum?: undefined;
    lookup?: undefined;
    record: {
      keysEnum?: readonly string[];
      values?: FieldType;
      partial?: boolean;
    };
  };

  export type FieldTypeObj =
    | BasicType
    | ObjectType
    | EnumType
    | OneOf
    | ArrayOf
    | RecordType
    | Lookup;

  export type FieldType = DataType | FieldTypeObj;

  export type GetType<T extends FieldType | Omit<FieldTypeObj, "optional">> = GetWNullType<
    T extends DataType ? { type: T } : T
  >;
  type GetWNullType<T extends FieldTypeObj | Omit<FieldTypeObj, "optional">> =
    T extends { nullable: true } ? null | _GetType<T> : _GetType<T>;
  type GetAllowedValues<T extends FieldTypeObj | Omit<FieldTypeObj, "optional">, TType> =
    T extends { allowedValues: readonly any[] } ? T["allowedValues"][number] : TType;

  type PrimitiveTypeMap = {
    number: number;
    integer: number;
    string: string;
    time: string;
    timestamp: string;
    Date: string;
    boolean: boolean;
    any: any;
    unknown: unknown;
    Blob: Blob;
  };
  /** New */
  // type GetPrimitiveType<
  //   T extends JSONB.FieldTypeObj | Omit<JSONB.FieldTypeObj, "optional">,
  //   U extends DataType,
  // > =
  //   U extends keyof PrimitiveTypeMap ? GetAllowedValues<T, PrimitiveTypeMap[U]>
  //   : U extends `${infer P}[]` ?
  //     P extends keyof PrimitiveTypeMap ?
  //       GetAllowedValues<T, PrimitiveTypeMap[P][]>
  //     : never
  //   : never;

  /* OLD */
  type GetPrimitiveType<
    T extends JSONB.FieldTypeObj | Omit<JSONB.FieldTypeObj, "optional">,
    U extends DataType,
  > =
    U extends "number" | "integer" ? GetAllowedValues<T, number>
    : U extends "string" | "time" | "timestamp" | "Date" ? GetAllowedValues<T, string>
    : U extends "boolean" ? GetAllowedValues<T, boolean>
    : U extends "any" ? GetAllowedValues<T, any>
    : U extends "unknown" ? GetAllowedValues<T, unknown>
    : U extends "Blob" ? GetAllowedValues<T, Blob>
    : U extends `${infer P}[]` ?
      P extends "number" | "integer" ? GetAllowedValues<T, number>[]
      : P extends "string" | "time" | "timestamp" | "Date" ? GetAllowedValues<T, string>[]
      : P extends "boolean" ? GetAllowedValues<T, boolean>[]
      : P extends "any" ? GetAllowedValues<T, any>[]
      : never
    : never;

  type _GetType<T extends FieldTypeObj | Omit<FieldTypeObj, "optional">> =
    // Handle objects first (most common case)
    T extends { type: infer U } ?
      U extends ObjectSchema ? GetObjectType<U>
      : U extends DataType ? GetPrimitiveType<T, U>
      : never
    : // Handle other patterns
    T extends { enum: readonly any[] } ? T["enum"][number]
    : T extends { arrayOfType: infer U } ?
      U extends ObjectSchema ?
        GetObjectType<U>[]
      : never
    : T extends { arrayOf: infer U } ?
      U extends FieldType ?
        GetType<U>[]
      : never
    : T extends { oneOf: readonly (infer U)[] } ?
      U extends FieldType ?
        GetType<U>
      : never
    : T extends { oneOfType: readonly (infer U)[] } ?
      U extends ObjectSchema ?
        GetObjectType<U>
      : never
    : T extends { record: infer R } ?
      R extends RecordType["record"] ?
        Record<
          R extends { keysEnum: readonly string[] } ? R["keysEnum"][number] : string,
          R extends { values: infer V } ?
            V extends FieldType ?
              GetType<V>
            : any
          : any
        >
      : never
    : any;

  type IsOptional<F extends FieldType> =
    F extends DataType ? false
    : F extends { optional: true } ? true
    : false;

  type ObjectSchema = Record<string, FieldType>;
  export type JSONBSchema = Omit<FieldTypeObj, "optional"> & {
    defaultValue?: unknown;
  };

  /** OLD */
  export type GetObjectType<S extends ObjectSchema> = {
    [K in keyof S as IsOptional<S[K]> extends true ? K : never]?: GetType<S[K]>;
  } & {
    [K in keyof S as IsOptional<S[K]> extends true ? never : K]: GetType<S[K]>;
  };

  /* NEW Single-pass object type construction */
  // type OptionalKeys<S extends ObjectSchema> = {
  //   [K in keyof S]: S[K] extends { optional: true } ? K : never;
  // }[keyof S];
  // export type GetObjectType<S extends ObjectSchema> = Simplify<
  //   PartialByKeys<{ [K in keyof S]: GetType<S[K]> }, OptionalKeys<S>>
  // >;

  export type GetSchemaType<S extends JSONBSchema> =
    S["nullable"] extends true ? null | GetType<S> : GetType<S>;

  export type GetTypeIfDefined<Schema extends FieldType | undefined> =
    Schema extends FieldType ? GetType<Schema> : never;
}
