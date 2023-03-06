import { getKeys, isObject, StrictUnion } from "./util";
import type { JSONSchema7, JSONSchema7TypeName } from "json-schema";
import { AnyObject } from "./filters";

export const PrimitiveTypes = ["boolean" , "number", "integer", "string", "Date", "time", "timestamp", "any"] as const;
export const PrimitiveArrayTypes = PrimitiveTypes.map(v => `${v}[]` as `${typeof v}[]`);
export const DATA_TYPES = [
  ...PrimitiveTypes,
  ...PrimitiveArrayTypes
] as const;
type DataType = typeof DATA_TYPES[number];


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
    lookup: ({
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

        /**
         * Columns used to search
         */
        searchColumns?: string[];

      };
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
      }
    } | {
      type: "schema";
      isArray?: boolean;
      object: "column" | "table";
      filter?: { table?: string; tsDataType?: string; udt_name?: string; };
    });
    allowedValues?: undefined;
    oneOf?: undefined;
    oneOfType?: undefined;
    arrayOf?: undefined;
    arrayOfType?: undefined;
    enum?: undefined;
  };

  export type BasicType = BaseOptions & {
    type: DataType;
    allowedValues?: readonly any[] | any[];
    oneOf?: undefined;
    oneOfType?: undefined;
    arrayOf?: undefined;
    arrayOfType?: undefined;
    enum?: undefined;
  };
  
  export type ObjectType = BaseOptions & {
    type: ObjectSchema;
    allowedValues?: undefined;
    oneOf?: undefined;
    oneOfType?: undefined;
    arrayOf?: undefined;
    arrayOfType?: undefined;
    enum?: undefined;
  } 
  
  export type EnumType = BaseOptions & {
    type?: undefined;
    enum: readonly any[];
    oneOf?: undefined;
    oneOfType?: undefined;
    arrayOf?: undefined;
    arrayOfType?: undefined;
    allowedValues?: undefined;
  };
  
  export type OneOf = BaseOptions & {
    type?: undefined;
    arrayOf?: undefined;
    arrayOfType?: undefined;
    allowedValues?: undefined;
    enum?: undefined;
  } & ({
    oneOf?: undefined;
    oneOfType: readonly ObjectSchema[];
  } | {
    oneOf: FieldType[];
    oneOfType?: undefined;
  })
  export type ArrayOf = BaseOptions & {
    type?: undefined;
    allowedValues?: undefined;
    oneOf?: undefined;
    oneOfType?: undefined;
    enum?: undefined;
  } & ({
    arrayOf?: undefined;
    arrayOfType: ObjectSchema;
  } | {
    arrayOf: FieldType;
    arrayOfType?: undefined;
  });
   
  export type RecordType = BaseOptions & {
    type?: undefined;
    allowedValues?: undefined;
    oneOf?: undefined;
    oneOfType?: undefined;
    arrayOf?: undefined;
    arrayOfType?: undefined;
    enum?: undefined;
    record: {
      keysEnum?: readonly string[];
      values?: FieldType;
    }
  }

  export type FieldTypeObj = StrictUnion<
    | BasicType
    | ObjectType
    | EnumType
    | OneOf
    | ArrayOf
    | RecordType
    | Lookup
  >;

  export type FieldType = 
  | DataType 
  | FieldTypeObj;


  export type GetType<T extends FieldType | Omit<FieldTypeObj, "optional">> = GetWNullType<T extends DataType? { type: T } : T>;
  type GetWNullType<T extends FieldTypeObj | Omit<FieldTypeObj, "optional">> = T extends { nullable: true }? (null | _GetType<T>) : _GetType<T>;
  type GetAllowedValues<T extends FieldTypeObj | Omit<FieldTypeObj, "optional">, TType> = T extends { allowedValues: readonly any[] }? T["allowedValues"][number] : TType;

  type _GetType<T extends FieldTypeObj | Omit<FieldTypeObj, "optional">> =
  | T extends { type: ObjectSchema } ? GetObjectType<T["type"]> :
  | T extends { type: "number" } ?    GetAllowedValues<T, number> :
  | T extends { type: "boolean" } ?   GetAllowedValues<T, boolean> :
  | T extends { type: "integer" } ?   GetAllowedValues<T, number> :
  | T extends { type: "string" } ?    GetAllowedValues<T, string> :
  | T extends { type: "time" } ?    GetAllowedValues<T, string> :
  | T extends { type: "timestamp" } ?    GetAllowedValues<T, string> :
  | T extends { type: "Date" } ?    GetAllowedValues<T, string> :
  | T extends { type: "any" } ?       GetAllowedValues<T, any> :
  | T extends { type: "number[]" } ?  GetAllowedValues<T, number>[] :
  | T extends { type: "boolean[]" } ? GetAllowedValues<T, boolean>[] :
  | T extends { type: "integer[]" } ? GetAllowedValues<T, number>[] :
  | T extends { type: "time[]" } ?    GetAllowedValues<T, string>[] :
  | T extends { type: "timestamp[]" } ?    GetAllowedValues<T, string>[] :
  | T extends { type: "Date[]" } ?    GetAllowedValues<T, string>[] :
  | T extends { type: "string[]" } ?  GetAllowedValues<T, string>[] :
  | T extends { type: "any[]" } ?     GetAllowedValues<T, any>[] :
  | T extends { "enum": readonly any[] | any[] } ? T["enum"][number] :
  | T extends { "record": RecordType["record"] } ? Record<
    T["record"] extends { keysEnum: readonly string[] }? T["record"]["keysEnum"][number] : string, 
    T["record"] extends { values: FieldType }? GetType<T["record"]["values"]> : any
  > :
  | T extends { oneOf: readonly FieldType[] | FieldType[] } ? GetType<T["oneOf"][number]> :
  | T extends { oneOfType: readonly ObjectSchema[] | ObjectSchema[] } ? GetObjectType<T["oneOfType"][number]> :
  | T extends { arrayOf: FieldType } ? GetType<T["arrayOf"]>[] :
  | T extends { arrayOfType: ObjectSchema } ? GetObjectType<T["arrayOfType"]>[] :
  any;

  type IsOptional<F extends FieldType> = F extends DataType? false : F extends { optional: true }? true : false; 


  type ObjectSchema = Record<string, FieldType>;
  export type JSONBSchema<T extends FieldTypeObj = FieldTypeObj> = Omit<T, "optional"> & { defaultValue?: any };

  export type GetObjectType<S extends ObjectSchema> = (
    {
      [K in keyof S as IsOptional<S[K]> extends true ? K : never]?: GetType<S[K]>
    } & {
      [K in keyof S as IsOptional<S[K]> extends true ? never : K]: GetType<S[K]>
    }
  );
  export type GetSchemaType<S extends JSONBSchema> = S["nullable"] extends true? (null | GetType<S>) : GetType<S>;

}


/** tests */
const t: JSONB.GetType<{ arrayOfType: { a: "number" } }> = [
  { a: 2 }
]

/** StrictUnion was removed because it doesn't work with object | string */
const _oneOf: JSONB.GetType<{ nullable: true, oneOf: [ 
  { enum: ["n"] },
  { type: { a: "number" } },
  { type: { a: { type: "string", allowedValues: ["a"] }} },
] }> = {
  a: "a"
}

const _a: JSONB.GetType<{ type: { a: "number" } }> = {
  a: 2
}

const _r: JSONB.GetType<{ record: { keysEnum: ["a", "b"], values: "integer[]" } }> = {
  a: [2],
  b: [221]
}

const _dd: JSONB.JSONBSchema = {
  enum: [1],
  type: "any"
}

const s = {
  type: {
    a: { type: "boolean" },
    c: { type: { c1: { type: "string" } } },
    arr: { arrayOfType: { d: "string" } },
    o: {
      oneOfType: [
        { z: { type: "integer" } },
        { z1: { type: "integer" } }
      ]
    }
  }
} as const;// satisfies JSONB.JSONBSchema;

const _ss: JSONB.GetType<typeof s> = {
  a: true,
  arr: [{ d: "" }],
  c: {
    c1: ""
  },
  o: { z1: 23 }
}

const getJSONSchemaObject = (rawType: JSONB.FieldType | JSONB.JSONBSchema, rootInfo?: { id: string }): JSONSchema7 => {
  const {  type, arrayOf, arrayOfType, description, nullable, oneOf, oneOfType, title, record, ...t } = typeof rawType === "string"? ({ type: rawType } as JSONB.FieldTypeObj) : rawType; 

  let result: JSONSchema7 = {};
  const partialProps: Partial<JSONSchema7> = {
    ...((t.enum || t.allowedValues?.length) && { enum: t.allowedValues?.slice(0) ?? t.enum!.slice(0) }),
    ...(!!description && { description }),
    ...(!!title && { title }),
  };

  if(t.enum?.length){
    partialProps.type = typeof t.enum[0]! as any;
  }

  if(typeof type === "string" || arrayOf || arrayOfType){

    /** ARRAY */
    if(type && typeof type !== "string") {
      throw "Not expected";
    }
    if(arrayOf || arrayOfType || type?.endsWith("[]")){
      const arrayItems = 
        (arrayOf || arrayOfType)? getJSONSchemaObject(arrayOf || { type: arrayOfType }) : 
        type?.startsWith("any")? { type: undefined } :
        {  
          type: type?.slice(0, -2) as JSONSchema7TypeName,
          ...(t.allowedValues && { enum: t.allowedValues.slice(0) }), 
        };
      result = {
        type: "array",
        items: arrayItems,
      }

    /** PRIMITIVES */
    } else {
      result = {
        type: type as JSONSchema7TypeName,
      }
    }

  /** OBJECT */
  } else if(isObject(type)){
    result = {
      type: "object",
      required: getKeys(type).filter(k => {
        const t = type[k]!;
        return typeof t === "string" || !t.optional;
      }),
      properties: getKeys(type).reduce((a, k) => { 
        return {
          ...a,
          [k]: getJSONSchemaObject(type[k]!)
        }
      }, {}),
    }
  } else if(oneOf || oneOfType){
    const _oneOf = oneOf || oneOfType!.map(type => ({ type }))
    result = {
      oneOf: _oneOf.map(t => getJSONSchemaObject(t))
    }
  } else if(record){
    result = {
      type: "object",
      ...(record.values && !record.keysEnum && { additionalProperties: getJSONSchemaObject(record.values) }),
      ...(record.keysEnum && { properties: record.keysEnum.reduce((a, v) => ({ 
        ...a,
        [v]: !record.values? { type: {} } : getJSONSchemaObject(record.values)
       }), {}) })
    }
  }

  if (nullable) {
    const nullDef = { type: "null" } as const;
    if (result.oneOf) {
      result.oneOf.push(nullDef)
    } else if (result.enum && !result.enum.includes(null)) {
      result.enum.push(null)

    } else result = {
      oneOf: [result, nullDef]
    }
  }

  const rootSchema: JSONSchema7 | undefined = !rootInfo? undefined : {
    "$id": rootInfo?.id,
    "$schema": "https://json-schema.org/draft/2020-12/schema",
  };

  return {
    ...rootSchema,
    ...partialProps,
    ...result,
  }
}

export function getJSONBSchemaAsJSONSchema(tableName: string, colName: string, schema: JSONB.JSONBSchema): JSONSchema7 { 
  return getJSONSchemaObject(schema, { id: `${tableName}.${colName}` })
}

