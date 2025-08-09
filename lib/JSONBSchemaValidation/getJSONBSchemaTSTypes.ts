import { getObjectEntries, isObject, postgresToTsType, type JSONB, type TableSchema } from "..";
import { getFieldTypeObj } from "./JSONBSchemaValidation";

type ColOpts = { nullable?: boolean };

export function getJSONBSchemaTSTypes(
  schema: JSONB.JSONBSchema,
  colOpts: ColOpts,
  outerLeading = "",
  tables: TableSchema[]
): string {
  return getJSONBTSTypes(
    tables,
    { ...(schema as JSONB.FieldTypeObj), nullable: colOpts.nullable },
    undefined,
    outerLeading
  );
}

const valueToString = (v: any): string => {
  if (v === null) return "null";
  if (v === undefined) return "undefined";
  if (typeof v === "string") return JSON.stringify(v);
  return String(v);
};

export const getJSONBTSTypes = (
  tables: TableSchema[],
  rawFieldType: JSONB.FieldType,
  isOneOf = false,
  innerLeading = "",
  depth = 0
): string => {
  const fieldType = getFieldTypeObj(rawFieldType);
  const nullType = fieldType.nullable ? `null | ` : "";
  if (fieldType.lookup) {
    const l = fieldType.lookup;
    if (l.type === "data-def") {
      return `${fieldType.nullable ? `null |` : ""} ${getJSONBTSTypes(tables, {
        type: {
          table: "string",
          column: "string",
          filter: { record: {}, optional: true },
          isArray: { type: "boolean", optional: true },
          searchColumns: { type: "string[]", optional: true },
          isFullRow: {
            optional: true,
            type: {
              displayColumns: { type: "string[]", optional: true },
            },
          },
          showInRowCard: { optional: true, record: {} },
        },
      })}`;
    }

    const isSChema = l.type === "schema";
    let type =
      isSChema ?
        l.object === "table" ?
          "string"
        : `{ "table": string; "column": string; }`
      : "";
    if (!isSChema) {
      const cols = tables.find((t) => t.name === l.table)?.columns;
      if (!l.isFullRow) {
        type = postgresToTsType(cols?.find((c) => c.name === l.column)?.udt_name ?? "text");
      } else {
        type =
          !cols ? "any" : (
            `{ ${cols.map((c) => `${JSON.stringify(c.name)}: ${c.is_nullable ? "null | " : ""} ${postgresToTsType(c.udt_name)}; `).join(" ")} }`
          );
      }
    }
    return `${fieldType.nullable ? `null | ` : ""}${type}${l.isArray ? "[]" : ""}`;
  } else if (typeof fieldType.type === "string") {
    if (fieldType.type.toLowerCase().includes("lookup")) {
      throw new Error(`getJSONBTSTypes: Lookup type not handled correctly`);
    }

    /** Primitives */
    const correctType = fieldType.type
      .replace("integer", "number")
      .replace("time", "string")
      .replace("timestamp", "string")
      .replace("Date", "string");

    if (fieldType.allowedValues && fieldType.type.endsWith("[]")) {
      return nullType + ` (${fieldType.allowedValues.map((v) => JSON.stringify(v)).join(" | ")})[]`;
    }
    return nullType + correctType;

    /** Object */
  } else if (isObject(fieldType.type)) {
    const addSemicolonIfMissing = (v: string) => (v.trim().endsWith(";") ? v : v.trim() + ";");
    const { type } = fieldType;
    const spacing = isOneOf ? " " : "  ";
    let objDef =
      ` {${spacing}` +
      getObjectEntries(type)
        .map(([key, value]) => {
          const fieldType = getFieldTypeObj(value);
          const escapedKey = isValidIdentifier(key) ? key : JSON.stringify(key);
          return (
            `${spacing}${escapedKey}${fieldType.optional ? "?" : ""}: ` +
            addSemicolonIfMissing(getJSONBTSTypes(tables, fieldType, true, undefined, depth + 1))
          );
        })
        .join(" ") +
      `${spacing}}`;
    if (!isOneOf) {
      objDef = addSemicolonIfMissing(objDef);
    }

    /** Keep single line */
    if (isOneOf) {
      objDef = objDef.split("\n").join("");
    }
    return nullType + objDef;
  } else if (fieldType.enum) {
    return nullType + fieldType.enum.map((v) => valueToString(v)).join(" | ");
  } else if (fieldType.oneOf || fieldType.oneOfType) {
    const oneOf = fieldType.oneOf || fieldType.oneOfType.map((type) => ({ type }));
    return (
      (fieldType.nullable ? `\n${innerLeading} | null` : "") +
      oneOf
        .map((v) => `\n${innerLeading} | ` + getJSONBTSTypes(tables, v, true, undefined, depth + 1))
        .join("")
    );
  } else if (fieldType.arrayOf || fieldType.arrayOfType) {
    const arrayOf = fieldType.arrayOf || { type: fieldType.arrayOfType };
    return `${fieldType.nullable ? `null | ` : ""} ( ${getJSONBTSTypes(tables, arrayOf, true, undefined, depth + 1)} )[]`;
  } else if (fieldType.record) {
    const { keysEnum, values, partial } = fieldType.record;
    // TODO: ensure props with undefined values are not allowed in the TS type (strict union)
    const getRecord = (v: string) => (partial ? `Partial<Record<${v}>>` : `Record<${v}>`);
    return `${fieldType.nullable ? `null |` : ""} ${getRecord(`${keysEnum?.map((v) => valueToString(v)).join(" | ") ?? "string"}, ${!values ? "any" : getJSONBTSTypes(tables, values, true, undefined, depth + 1)}`)}`;
  } else throw "Unexpected getSchemaTSTypes: " + JSON.stringify({ fieldType }, null, 2);
};

const isValidIdentifier = (str: string) => {
  const identifierRegex = /^[A-Za-z$_][A-Za-z0-9$_]*$/;
  return identifierRegex.test(str);
};
