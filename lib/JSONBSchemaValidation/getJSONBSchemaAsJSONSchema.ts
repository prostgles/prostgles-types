import type { JSONSchema7, JSONSchema7Definition, JSONSchema7TypeName } from "json-schema";
import type { JSONB, PrimitiveTypes } from "./JSONBSchema";
import { getObjectEntries, isObject } from "../util";
import { safeGetKeys } from "./utils";

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
      : type === "unknown" ? undefined
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
      required: safeGetKeys(type).filter((k) => {
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
