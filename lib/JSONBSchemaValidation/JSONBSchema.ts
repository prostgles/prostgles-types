import { AnyObject, type ValueOf } from "../filters";
import { getKeys } from "../util";

export type PrimitiveTypeMap = {
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
  FileLike: {
    name: string;
    type: string;
    data: Blob;
  };
};

/**
 * Provide more info for allowed values
 */
export type AllowedValueType = null | number | string | boolean;
type AllowedValueInfo = {
  value: AllowedValueType;
  label: string;
  subLabel?: string;
  /**
   * URL of the icon
   */
  icon?: string;
};

export type PrimitiveOptions = {
  allowedValues?:
    | readonly AllowedValueType[]
    | AllowedValueType[]
    | readonly AllowedValueInfo[]
    | AllowedValueInfo[];
  /**
   * Optional MIME types that can be used with Blob or FileLike types.
   * @example
   * { "image/png": 1, "image/jpeg": 1 }
   */
  mimeTypes?: Record<string, 1>;
};

export const PrimitiveTypesObj = {
  boolean: 1,
  number: 1,
  integer: 1,
  string: 1,
  Date: 1,
  time: 1,
  timestamp: 1,
  Blob: 1,
  FileLike: 1,
  any: 1,
  unknown: 1,
} as const satisfies Record<keyof PrimitiveTypeMap, 1>;

export const PrimitiveTypes = getKeys(PrimitiveTypesObj);

/**
 * Instantiations:  49914
 */

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

  export type BasicType = BaseOptions &
    PrimitiveOptions & {
      type: DataType;
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
    mimeTypes?: undefined;
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
    mimeTypes?: undefined;
    record?: undefined;
    lookup?: undefined;
  };

  export type OneOf = BaseOptions & {
    type?: undefined;
    arrayOf?: undefined;
    arrayOfType?: undefined;
    allowedValues?: undefined;
    mimeTypes?: undefined;
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
    mimeTypes?: undefined;
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
    mimeTypes?: undefined;
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
  type ObjectSchema = Record<string, FieldType>;

  type NormalizeField<T extends FieldType | Omit<FieldTypeObj, "optional">> =
    T extends DataType ? { type: T } : T;

  type GetAllowedValues<T extends FieldTypeObj | Omit<FieldTypeObj, "optional">, TType> =
    T extends { allowedValues: readonly any[] } ? T["allowedValues"][number] : TType;

  type PrimitiveValue<U extends DataType> =
    U extends `${infer P}[]` ?
      P extends keyof PrimitiveTypeMap ?
        PrimitiveTypeMap[P][]
      : never
    : U extends keyof PrimitiveTypeMap ? PrimitiveTypeMap[U]
    : never;

  type GetPrimitiveType<
    T extends FieldTypeObj | Omit<FieldTypeObj, "optional">,
    U extends DataType,
  > = GetAllowedValues<T, PrimitiveValue<U>>;

  type ResolveRecord<R extends RecordType["record"]> = Record<
    R extends { keysEnum: readonly string[] } ? R["keysEnum"][number] : string,
    R extends { values: infer V } ?
      V extends FieldType ?
        GetType<V>
      : any
    : any
  >;

  type ResolveField<T extends FieldTypeObj | Omit<FieldTypeObj, "optional">> =
    T extends { type: infer U } ?
      U extends DataType ? GetPrimitiveType<T, U>
      : U extends ObjectSchema ? GetObjectType<U>
      : never
    : T extends { enum: readonly any[] } ? T["enum"][number]
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
        ResolveRecord<R>
      : never
    : any;

  type GetWNullType<T extends FieldTypeObj | Omit<FieldTypeObj, "optional">> =
    T extends { nullable: true } ? null | ResolveField<T> : ResolveField<T>;

  export type GetType<T extends FieldType | Omit<FieldTypeObj, "optional">> = GetWNullType<
    NormalizeField<T>
  >;

  type IsOptional<F extends FieldType> =
    F extends DataType ? false
    : F extends { optional: true } ? true
    : false;

  type OptionalKeys<S extends ObjectSchema> = {
    [K in keyof S]-?: IsOptional<S[K]> extends true ? K : never;
  }[keyof S];

  type RequiredKeys<S extends ObjectSchema> = Exclude<keyof S, OptionalKeys<S>>;

  export type GetObjectType<S extends ObjectSchema> = {
    [K in RequiredKeys<S>]: GetType<S[K]>;
  } & {
    [K in OptionalKeys<S>]?: GetType<S[K]>;
  };

  export type JSONBSchema = Omit<FieldTypeObj, "optional"> & {
    defaultValue?: unknown;
  };

  export type GetSchemaType<S extends JSONBSchema> =
    S["nullable"] extends true ? null | GetType<S> : GetType<S>;

  export type GetTypeIfDefined<Schema extends FieldType | undefined> =
    Schema extends FieldType ? GetType<Schema> : never;
}
