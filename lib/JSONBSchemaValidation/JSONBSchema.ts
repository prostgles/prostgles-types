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
  Uint8Array: Uint8Array;
  Blob: Blob;
  FileLike: {
    name: string;
    type: string;
    lastModified?: number;
    data: Uint8Array | Blob;
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
  Uint8Array: 1,
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

  type LookupBase = BaseOptions & {
    allowedValues?: undefined;
    oneOf?: undefined;
    oneOfType?: undefined;
    arrayOf?: undefined;
    arrayOfType?: undefined;
    enum?: undefined;
    tuple?: undefined;
    record?: undefined;
  };

  type ShowInRowCardOptions = {
    /**
     * Action button text. Defaults to the method name
     */
    actionLabel?: string;
    actionColor?: "danger" | "warn" | "action";
    actionStyle?: AnyObject;
    actionClass?: string;
  };

  type DataLookupOptions = {
    table: string;
    filter?: AnyObject;
    /**
     * Columns used to search
     */
    searchColumns?: string[];
    /**
     * If defined then a button will be shown
     * in the row card footer to access this action
     */
    showInRowCard?: ShowInRowCardOptions;
  };

  type RowLookupOptions = {
    type: "RowLookup" | "RowLookup[]";
    /**
     * Columns used to display the selected row in the dropdown
     */
    displayColumns?: string[];
  };

  type ValueLookupOptions = {
    type: "ValueLookup" | "ValueLookup[]";
    column: string;
  };

  type TableLookupOptions = {
    type: "TableLookup" | "TableLookup[]";
  };

  type ColumnLookupOptions = {
    type: "ColumnLookup" | "ColumnLookup[]";
    filter?: {
      table?: string;
      tsDataType?: string;
      udt_name?: string;
    };
  };

  export type RowLookup = LookupBase & DataLookupOptions & RowLookupOptions;
  export type ValueLookup = LookupBase & DataLookupOptions & ValueLookupOptions;
  export type TableLookup = LookupBase & TableLookupOptions;
  export type ColumnLookup = LookupBase & ColumnLookupOptions;
  export type Lookup = LookupBase &
    (
      | (DataLookupOptions & (RowLookupOptions | ValueLookupOptions))
      | TableLookupOptions
      | ColumnLookupOptions
    );

  export type BasicType = BaseOptions &
    PrimitiveOptions & {
      type: DataType;
      oneOf?: undefined;
      oneOfType?: undefined;
      arrayOf?: undefined;
      arrayOfType?: undefined;
      enum?: undefined;
      tuple?: undefined;
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
    tuple?: undefined;
    record?: undefined;
    lookup?: undefined;
  };

  export type EnumType = BaseOptions & {
    enum: readonly any[];
    tuple?: undefined;
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

  export type TupleType = BaseOptions & {
    tuple: readonly FieldType[];
    enum?: undefined;
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
    tuple?: undefined;
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
    tuple?: undefined;
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
    tuple?: undefined;
    lookup?: undefined;
    record: {
      keysEnum?: readonly string[];
      values?: FieldType;
      partial?: boolean;
    };
  };

  export type FieldTypeObj =
    BasicType | ObjectType | EnumType | TupleType | OneOf | ArrayOf | RecordType | Lookup;

  export type FieldType = DataType | FieldTypeObj;
  type ObjectSchema = Record<string, FieldType>;

  type AllowedValueFromItem<I> = I extends { value: infer V } ? V : I;

  type AllowedValuesUnion<A extends readonly any[]> = AllowedValueFromItem<A[number]>;

  type ApplyAllowedToType<Allowed, TType> = TType extends readonly any[] ? Allowed[] : Allowed;

  type GetAllowedValues<T, TType> =
    T extends { allowedValues: readonly any[] } ?
      ApplyAllowedToType<AllowedValuesUnion<T["allowedValues"]>, TType>
    : TType;

  type PrimitiveValue<U extends DataType> =
    U extends keyof PrimitiveTypeMap ? PrimitiveTypeMap[U]
    : U extends `${infer P}[]` ?
      P extends keyof PrimitiveTypeMap ?
        PrimitiveTypeMap[P][]
      : never
    : never;

  type GetPrimitiveType<T, U extends DataType> = GetAllowedValues<T, PrimitiveValue<U>>;

  type LookupType = Lookup["type"];
  type ColumnReference = { table: string; column: string };
  type LookupValue<U extends LookupType> =
    U extends "RowLookup" ? AnyObject
    : U extends "RowLookup[]" ? AnyObject[]
    : U extends "ValueLookup" ? any
    : U extends "ValueLookup[]" ? any[]
    : U extends "TableLookup" ? string
    : U extends "TableLookup[]" ? string[]
    : U extends "ColumnLookup" ? ColumnReference
    : U extends "ColumnLookup[]" ? ColumnReference[]
    : never;

  type ResolveRecord<R extends RecordType["record"]> = Record<
    R extends { keysEnum: readonly string[] } ? R["keysEnum"][number] : string,
    R extends { values: infer V } ?
      V extends FieldType ?
        GetType<V>
      : any
    : any
  >;
  type ResolveTuple<T extends readonly FieldType[]> = {
    -readonly [K in keyof T]: T[K] extends FieldType ? GetType<T[K]> : never;
  };
  type ResolveField<T> =
    T extends { type: infer U } ?
      U extends DataType ? GetPrimitiveType<T, U>
      : U extends LookupType ? LookupValue<U>
      : U extends ObjectSchema ? GetObjectType<U>
      : never
    : T extends { enum: readonly any[] } ? T["enum"][number]
    : T extends { tuple: infer U } ?
      U extends readonly FieldType[] ?
        ResolveTuple<U>
      : never
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

  type GetWNullType<T> = T extends { nullable: true } ? null | ResolveField<T> : ResolveField<T>;

  export type GetType<T extends FieldType | Omit<FieldTypeObj, "optional">> =
    T extends DataType ? PrimitiveValue<T> : GetWNullType<T>;

  type IsOptional<F extends FieldType> = F extends { optional: true } ? true : false;

  type OptionalKeys<S extends ObjectSchema> = {
    [K in keyof S]-?: IsOptional<S[K]> extends true ? K : never;
  }[keyof S];

  type RequiredKeys<S extends ObjectSchema> = Exclude<keyof S, OptionalKeys<S>>;

  export type GetObjectType<S extends ObjectSchema> = {
    [K in RequiredKeys<S>]: GetType<S[K]>;
  } & {
    [K in OptionalKeys<S>]?: GetType<S[K]>;
  };

  type RootLookupOptions = {
    table?: string;
    filter?: AnyObject;
    searchColumns?: string[];
    showInRowCard?: ShowInRowCardOptions;
    column?: string;
    displayColumns?: string[];
  };

  export type JSONBSchema = Omit<FieldTypeObj, "optional"> &
    RootLookupOptions & { defaultValue?: unknown };

  export type GetSchemaType<S extends JSONBSchema> = GetType<S>;

  export type GetTypeIfDefined<Schema extends FieldType | undefined> =
    Schema extends FieldType ? GetType<Schema> : never;
}
