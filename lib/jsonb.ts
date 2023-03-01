import { getKeys, isObject, StrictUnion } from "./util";
import type { JSONSchema7, JSONSchema7TypeName } from "json-schema";

export const PrimitiveTypes = ["boolean" , "number", "integer", "string", "any"] as const;
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

  export type BasicType = BaseOptions & {
    type: DataType;
    allowedValues?: any[];
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
  >;

  export type FieldType = 
  | DataType 
  | FieldTypeObj;


  export type GetType<T extends FieldType | Omit<FieldTypeObj, "optional">> =
  | T extends { type: ObjectSchema } ? GetObjectType<T["type"]> :
  | T extends "number" | { type: "number" } ? number :
  | T extends "boolean" | { type: "boolean" } ? boolean :
  | T extends "integer" | { type: "integer" } ? number :
  | T extends "string" | { type: "string" } ? string :
  | T extends "any" | { type: "any" } ? any :
  | T extends "number[]" | { type: "number[]" } ? number[] :
  | T extends "boolean[]" | { type: "boolean[]" } ? boolean[] :
  | T extends "integer[]" | { type: "integer[]" } ? number[] :
  | T extends "string[]" | { type: "string[]" } ? string[] :
  | T extends "any[]" | { type: "any[]" } ? any[] :
  | T extends { "enum": readonly any[] } ? T["enum"][number] :
  | T extends { "record": RecordType["record"] } ? Record<
    T["record"] extends { keysEnum: readonly string[] }? T["record"]["keysEnum"][number] : string, 
    T["record"] extends { values: FieldType }? GetType<T["record"]["values"]> : any
  > :

  | T extends { oneOf: FieldType[] } ? StrictUnion<GetType<T["oneOf"][number]>> :
  | T extends { oneOf: readonly ObjectSchema[] } ? StrictUnion<GetType<T["oneOf"][number]>> :

  | T extends { arrayOf: ObjectSchema } ? GetType<T["arrayOf"]>[] :
  | T extends { arrayOfType: ObjectSchema } ? GetType<T["arrayOfType"]>[] :
  any;

  type IsOptional<F extends FieldType> = F extends DataType? false : F extends { optional: true }? true : false; 

  const _r: GetType<{ record: { keysEnum: ["a", "b"], values: "integer[]" } }> = {
    a: [2],
    b: [221]
  }

  export type ObjectSchema = Record<string, FieldType>;
  export type JSONBSchema = Omit<FieldTypeObj, "optional">;

  const _dd: JSONBSchema = {
    enum: [1],
    type: "any"
  }

  export type GetObjectType<S extends ObjectSchema> = (
    {
      [K in keyof S as IsOptional<S[K]> extends true ? K : never]?: GetType<S[K]>
    } & {
      [K in keyof S as IsOptional<S[K]> extends true ? never : K]: GetType<S[K]>
    }
  );
  export type SchemaObject<S extends JSONBSchema> = S["nullable"] extends true? (null | GetType<S>) : GetType<S>;
}


/** tests */
const s: JSONB.JSONBSchema = {
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
};

const _ss: JSONB.SchemaObject<typeof s> = {
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
    ...((t.enum || t.allowedValues?.length) && { enum: t.allowedValues ?? t.enum!.slice(0) }),
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
          ...(t.allowedValues && { enum: t.allowedValues }), 
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
      type: "object",
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
      type: 'object',
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

