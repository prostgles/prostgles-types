import { getObjectEntries, isObject, postgresToTsType, type JSONB, type TableSchema } from "..";
import { getFieldTypeObj } from "./JSONBSchemaValidation";

type ColOpts = { nullable?: boolean };

export function getJSONBSchemaTSTypes(
  schema: JSONB.JSONBSchema,
  colOpts: ColOpts,
  outerLeading = "",
  tables: TableSchema[],
): string {
  return getJSONBTSTypes(
    tables,
    { ...(schema as JSONB.FieldTypeObj), nullable: colOpts.nullable },
    undefined,
    outerLeading,
  );
}

const valueToString = (v: any): string => {
  if (v === null) return "null";
  if (v === undefined) return "undefined";
  if (typeof v === "string") return JSON.stringify(v);
  return String(v);
};

const getLookupTSType = (tables: TableSchema[], fieldType: JSONB.Lookup): string => {
  const nullType = fieldType.nullable ? "null | " : "";
  const arrayType = fieldType.type.endsWith("[]") ? "[]" : "";

  if (fieldType.type === "TableLookup" || fieldType.type === "TableLookup[]") {
    return `${nullType}string${arrayType}`;
  }

  if (fieldType.type === "ColumnLookup" || fieldType.type === "ColumnLookup[]") {
    return `${nullType}{ "table": string; "column": string; }${arrayType}`;
  }

  const dataLookup = fieldType as JSONB.RowLookup | JSONB.ValueLookup;
  const cols = tables.find((table) => table.name === dataLookup.table)?.columns;
  if (fieldType.type === "ValueLookup" || fieldType.type === "ValueLookup[]") {
    const valueLookup = fieldType as JSONB.ValueLookup;
    const udtName = cols?.find((column) => column.name === valueLookup.column)?.udt_name;
    return `${nullType}${postgresToTsType(udtName ?? "text")}${arrayType}`;
  }

  const rowType =
    !cols ? "any" : (
      `{ ${cols.map((column) => `${JSON.stringify(column.name)}: ${column.is_nullable ? "null | " : ""} ${postgresToTsType(column.udt_name)}; `).join(" ")} }`
    );
  return `${nullType}${rowType}${arrayType}`;
};

export const getJSONBTSTypes = (
  tables: TableSchema[],
  rawFieldType: JSONB.FieldType,
  isOneOf = false,
  innerLeading = "",
  depth = 0,
): string => {
  const fieldType = getFieldTypeObj(rawFieldType);
  const nullType = fieldType.nullable ? `null | ` : "";
  if (typeof fieldType.type === "string" && fieldType.type.includes("Lookup")) {
    return getLookupTSType(tables, fieldType as JSONB.Lookup);
  } else if (typeof fieldType.type === "string") {
    /** Primitives */
    const correctType = fieldType.type
      .replace("integer", "number")
      .replace("time", "string")
      .replace("timestamp", "string")
      .replace("FileLike", `{ name: string; type: string; data: Blob; }`)
      .replace("Date", "string");

    if (fieldType.allowedValues) {
      const arrayType = fieldType.type.endsWith("[]") ? "[]" : "";
      return (
        nullType +
        ` (${fieldType.allowedValues.map((v) => JSON.stringify(isObject(v) ? v.value : v)).join(" | ")})${arrayType}`
      );
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
  } else if (fieldType.tuple) {
    const tupleItems = fieldType.tuple
      .map((item) => getJSONBTSTypes(tables, item, true, undefined, depth + 1))
      .join(", ");

    return `${nullType}[${tupleItems}]`;
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
