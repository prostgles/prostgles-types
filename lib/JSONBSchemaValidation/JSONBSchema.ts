import type { JSONSchema7, JSONSchema7Definition, JSONSchema7TypeName } from "json-schema";
import { AnyObject } from "../filters";
import { getKeys, getObjectEntries, isObject, StrictUnion } from "../util";
export const PrimitiveTypes = [
  "boolean",
  "number",
  "integer",
  "string",
  "Date",
  "time",
  "timestamp",
  "any",
] as const;
export const PrimitiveArrayTypes = PrimitiveTypes.map((v) => `${v}[]` as `${typeof v}[]`);
export const DATA_TYPES = [...PrimitiveTypes, ...PrimitiveArrayTypes] as const;
type DataType = (typeof DATA_TYPES)[number];

export namespace JSONB {
  export type BaseOptions = {
    /**
     * False by default
     */
    optional?: boolean;
    /**
     * False by default
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
          oneOf: FieldType[];
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

  type GetPrimitiveType<
    T extends JSONB.FieldTypeObj | Omit<JSONB.FieldTypeObj, "optional">,
    U extends DataType,
  > =
    U extends "number" | "integer" ? GetAllowedValues<T, number>
    : U extends "string" | "time" | "timestamp" | "Date" ? GetAllowedValues<T, string>
    : U extends "boolean" ? GetAllowedValues<T, boolean>
    : U extends "any" ? GetAllowedValues<T, any>
    : U extends `${infer P}[]` ?
      P extends "number" | "integer" ? GetAllowedValues<T, number>[]
      : P extends "string" | "time" | "timestamp" | "Date" ? GetAllowedValues<T, string>[]
      : P extends "boolean" ? GetAllowedValues<T, boolean>[]
      : P extends "any" ? GetAllowedValues<T, any>[]
      : never
    : never;

  type IsOptional<F extends FieldType> =
    F extends DataType ? false
    : F extends { optional: true } ? true
    : false;

  type ObjectSchema = Record<string, FieldType>;
  export type JSONBSchema = Omit<FieldTypeObj, "optional"> & {
    defaultValue?: any;
  };

  export type GetObjectType<S extends ObjectSchema> = {
    [K in keyof S as IsOptional<S[K]> extends true ? K : never]?: GetType<S[K]>;
  } & {
    [K in keyof S as IsOptional<S[K]> extends true ? never : K]: GetType<S[K]>;
  };
  // export type GetObjectType<S extends ObjectSchema> = {
  //   [K in keyof S]: S[K] extends { optional: true } ? GetType<S[K]> | undefined : GetType<S[K]>;
  // };
  export type GetSchemaType<S extends JSONBSchema> =
    S["nullable"] extends true ? null | GetType<S> : GetType<S>;

  export type GetTypeIfDefined<Schema extends FieldType | undefined> =
    Schema extends FieldType ? GetType<Schema> : never;
}

const getJSONSchemaType = (
  rawType: JSONB.BasicType["type"] | JSONB.Lookup["type"] | undefined
): { type: JSONSchema7TypeName | undefined; isArray: boolean } | undefined => {
  if (!rawType) return;
  const type: (typeof PrimitiveTypes)[number] | "Lookup" =
    rawType.endsWith("[]") ? (rawType.slice(0, -2) as any) : rawType;

  return {
    type:
      type === "integer" ? "integer"
      : type === "boolean" ? "boolean"
      : type === "number" ? "number"
      : type === "any" ? undefined
      : type === "Lookup" ? undefined
      : "string",
    isArray: rawType.endsWith("[]"),
  };
};

export const getJSONSchemaObject = (
  rawType: JSONB.FieldType | JSONB.JSONBSchema,
  rootInfo?: { id: string }
): JSONSchema7 => {
  const {
    type,
    arrayOf,
    arrayOfType,
    description,
    nullable,
    oneOf,
    oneOfType,
    title,
    record,
    ...t
  } = typeof rawType === "string" ? ({ type: rawType } as JSONB.FieldTypeObj) : rawType;

  let result: JSONSchema7 = {};
  const partialProps: Partial<JSONSchema7> = {
    ...((t.enum ||
      (t.allowedValues?.length && (typeof type !== "string" || !type.endsWith("[]")))) && {
      enum: t.allowedValues?.slice(0) ?? t.enum!.slice(0),
    }),
    ...(!!description && { description }),
    ...(!!title && { title }),
  };

  if (t.enum?.length) {
    const firstElemType = typeof t.enum[0];
    partialProps.type =
      firstElemType === "number" ? "number"
      : firstElemType === "boolean" ? "boolean"
      : "string";
  }

  if (typeof type === "string" || arrayOf || arrayOfType) {
    /** ARRAY */
    if (type && typeof type !== "string") {
      throw "Not expected";
    }
    if (arrayOf || arrayOfType || type?.endsWith("[]")) {
      const arrayItems =
        arrayOf || arrayOfType ? getJSONSchemaObject(arrayOf || { type: arrayOfType })
        : type?.startsWith("any") ? { type: undefined }
        : ({
            type: getJSONSchemaType(type)?.type,
            ...(t.allowedValues && { enum: t.allowedValues.slice(0) }),
          } satisfies JSONSchema7Definition);
      result = {
        type: "array",
        items: arrayItems,
      };

      /** PRIMITIVES */
    } else {
      result = {
        type: getJSONSchemaType(type)?.type,
      };
    }

    /** OBJECT */
  } else if (isObject(type)) {
    result = {
      type: "object",
      required: getKeys(type).filter((k) => {
        const t = type[k]!;
        return typeof t === "string" || !t.optional;
      }),
      properties: getObjectEntries(type).reduce((a, [k, v]) => {
        return {
          ...a,
          [k]: getJSONSchemaObject(v),
        };
      }, {}),
    };
  } else if (oneOf || oneOfType) {
    const _oneOf = oneOf || oneOfType!.map((type) => ({ type }));
    result = {
      oneOf: _oneOf.map((t) => getJSONSchemaObject(t)),
    };
  } else if (record) {
    result = {
      type: "object",
      ...(record.values &&
        !record.keysEnum && { additionalProperties: getJSONSchemaObject(record.values) }),
      ...(record.keysEnum && {
        properties: record.keysEnum.reduce(
          (a, v) => ({
            ...a,
            [v]: !record.values ? { type: {} } : getJSONSchemaObject(record.values),
          }),
          {}
        ),
      }),
    };
  }

  if (nullable) {
    const nullDef = { type: "null" } as const;
    if (result.oneOf) {
      result.oneOf.push(nullDef);
    } else if (result.enum && !result.enum.includes(null)) {
      result.enum.push(null);
    } else
      result = {
        oneOf: [result, nullDef],
      };
  }

  const rootSchema: JSONSchema7 | undefined =
    !rootInfo ? undefined : (
      {
        $id: rootInfo?.id,
        $schema: "https://json-schema.org/draft/2020-12/schema",
      }
    );

  return {
    ...rootSchema,
    ...partialProps,
    ...result,
  };
};

export function getJSONBSchemaAsJSONSchema(
  tableName: string,
  colName: string,
  schema: JSONB.JSONBSchema
): JSONSchema7 {
  return getJSONSchemaObject(schema, { id: `${tableName}.${colName}` });
}
