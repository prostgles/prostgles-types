import type { DBHandler } from "lib";
import { getKeys, isDefined, isEmpty, isObject } from "../util";
import { includes } from "../utilFuncs/includes";
import type { JSONB, PrimitiveTypeMap } from "./JSONBSchema";
import { safeGetKeys, safeGetProperty, safeHasOwn } from "./utils";

type ValidationOptions = {
  allowExtraProperties?: boolean;
};

type PendingLookupValidation = {
  schema: JSONB.Lookup;
  value: unknown;
  path: string[];
};

export const getFieldTypeObj = (rawFieldType: JSONB.FieldType): JSONB.FieldTypeObj => {
  if (typeof rawFieldType === "string") return { type: rawFieldType };

  return rawFieldType;
};

const isUint8ArrayOrBuffer = (val: unknown): val is Uint8Array => {
  return (
    val instanceof Blob ||
    //@ts-ignore
    (typeof Buffer !== "undefined" && val instanceof Buffer) ||
    //@ts-ignore
    (typeof ArrayBuffer !== "undefined" && val instanceof ArrayBuffer)
  );
};

type DataType = JSONB.BasicType["type"];
type ElementType<T extends DataType> = T extends `${infer E}[]` ? E : never;
type ArrayTypes = Extract<DataType, `${string}[]`>;
type NonArrayTypes = Extract<Exclude<DataType, ArrayTypes>, string>;
const PRIMITIVE_VALIDATORS: {
  [K in NonArrayTypes]: (
    val: any,
    /**
     * TODO: tidy schema types
     */
    schema: JSONB.BasicType | JSONB.ObjectType | JSONB.Lookup,
  ) => boolean;
  // removed for performance
  // ) => val is K extends keyof PrimitiveTypeMap ? PrimitiveTypeMap[K] : unknown;
} = {
  string: (val) => typeof val === "string",
  number: (val): val is number => typeof val === "number" && Number.isFinite(val),
  integer: (val): val is number => typeof val === "number" && Number.isInteger(val),
  boolean: (val): val is boolean => typeof val === "boolean",
  time: (val) => typeof val === "string",
  timestamp: (val) => typeof val === "string",
  any: (val): val is any => typeof val !== "function" && typeof val !== "symbol",
  unknown: (val): val is unknown => typeof val !== "function" && typeof val !== "symbol",
  Date: (val) => typeof val === "string",
  Uint8Array: isUint8ArrayOrBuffer,
  Blob: isUint8ArrayOrBuffer,
  FileLike: (val, s): val is PrimitiveTypeMap["FileLike"] => {
    if (s.type !== "FileLike") {
      throw new Error("FileLike type must have type 'FileLike'");
    }
    const validStructure =
      isObject(val) &&
      typeof val.name === "string" &&
      typeof val.type === "string" &&
      isUint8ArrayOrBuffer(val.data);
    if (validStructure && s.mimeTypes) {
      const validMime = Object.keys(s.mimeTypes).some((mime) => val.type === mime);
      if (!validMime) {
        throw new Error(
          `Invalid FileLike type. Expected one of: ${Object.keys(s.mimeTypes).join(", ")}`,
        );
      }
    }

    return validStructure;
  },
};
const PRIMITIVE_VALIDATORS_KEYS = getKeys(PRIMITIVE_VALIDATORS);
const getElementType = <T extends DataType>(type: T): undefined | ElementType<T> => {
  if (typeof type === "string" && type.endsWith("[]")) {
    const elementType = type.slice(0, -2);
    if (!includes(PRIMITIVE_VALIDATORS_KEYS, elementType)) {
      throw new Error(`Invalid array field type ${type}`);
    }
    return elementType as ElementType<T>;
  }
};

const getValidator = (
  type: Extract<DataType, string>,
  fieldType: JSONB.BasicType | JSONB.ObjectType | JSONB.Lookup,
) => {
  const elem = getElementType(type);
  if (elem) {
    const validator = PRIMITIVE_VALIDATORS[elem];
    return {
      isArray: true,
      validator: (v: any) => Array.isArray(v) && v.every((v) => validator(v, fieldType)),
    };
  }
  const validator = PRIMITIVE_VALIDATORS[type as NonArrayTypes];
  if (!(validator as any)) {
    throw new Error(`Unknown field type ${type}`);
  }
  return { isArray: false, validator };
};

const getPropertyValidationError = (
  value: any,
  rawFieldType: JSONB.FieldType,
  path: string[] = [],
  opts: ValidationOptions | undefined,
  pendingLookupValidations?: PendingLookupValidation[],
): string | undefined => {
  const err = `${path.join(".")} is of invalid type. Expecting ${getTypeDescription(rawFieldType).replaceAll("\n", "")}`;
  const fieldDefinition = getFieldTypeObj(rawFieldType);

  const { type, allowedValues, nullable, optional } = fieldDefinition;
  if (nullable && value === null) return;
  if (optional && value === undefined) return;
  if (allowedValues) {
    if (typeof type !== "string") {
      throw new Error("allowedValues is only supported for primitive types");
    }

    const isArrayType = type.endsWith("[]");
    const valuesToTest = isArrayType && Array.isArray(value) ? value : [value];
    const normalisedAllowedValues = allowedValues.map((v) => (isObject(v) ? v.value : v));
    for (const [index, val] of valuesToTest.entries()) {
      if (!normalisedAllowedValues.includes(val)) {
        const pathInfo = isArrayType ? `${path.join(".")}[${index}]` : path.join(".");
        return `${pathInfo} is of invalid type. Expecting ${normalisedAllowedValues
          .map((v) => (typeof v === "string" ? JSON.stringify(v) : String(v)))
          .join(" | ")} But got ${JSON.stringify(val)}`;
      }
    }
  }
  if (type) {
    if (isObject(type)) {
      if (!isObject(value)) {
        return err;
      }
      for (const subKey of safeGetKeys(type)) {
        const subSchema = safeGetProperty(type, subKey);
        const propIsOptional = isObject(subSchema) && subSchema.optional;
        if (!propIsOptional && !safeHasOwn(value, subKey)) {
          return `${[...path, subKey].join(".")} is missing but required`;
        }
        const error = getPropertyValidationError(
          safeGetProperty(value, subKey),
          subSchema,
          [...path, subKey],
          opts,
          pendingLookupValidations,
        );
        if (error !== undefined) {
          return error;
        }
      }

      if (!opts?.allowExtraProperties) {
        /** Check for extra properties */
        const valueKeys = safeGetKeys(value);
        const schemaKeys = safeGetKeys(type);
        const extraKeys = valueKeys.filter((key) => !schemaKeys.includes(key));
        if (extraKeys.length) {
          return `${path.join(".")} has extra properties: ${extraKeys.join(", ")}`;
        }
      }

      return;
    }

    if (type.includes("Lookup")) {
      if (!pendingLookupValidations) {
        throw new Error("Lookup types are not supported for validation");
      }
      const isArray = type.endsWith("[]");
      if (isArray !== Array.isArray(value)) return err;

      const lookupType = type.replace("[]", "");
      const values = isArray ? value : [value];
      const isValid = values.every((item: unknown) => {
        if (lookupType === "RowLookup") return isObject(item);
        if (lookupType === "ValueLookup") {
          return typeof item !== "function" && typeof item !== "symbol";
        }
        if (lookupType === "TableLookup") return typeof item === "string";
        return (
          isObject(item) &&
          typeof safeGetProperty(item, "table") === "string" &&
          typeof safeGetProperty(item, "column") === "string" &&
          safeGetKeys(item).every((key) => key === "table" || key === "column")
        );
      });
      if (!isValid) return err;

      pendingLookupValidations.push({
        schema: fieldDefinition as JSONB.Lookup,
        value,
        path,
      });
      return;
    }
    const { validator } = getValidator(type as DataType, fieldDefinition);
    const isValid = validator(value, fieldDefinition);
    if (!isValid) {
      return err;
    }
    return;
  }

  if (fieldDefinition.tuple) {
    const tuple = fieldDefinition.tuple;

    if (!Array.isArray(value)) {
      return err + `[${tuple.map((item) => getTypeDescription(item)).join(", ")}]`;
    }

    if (value.length !== tuple.length) {
      const tuplePath = path.length ? path.join(".") : "value";
      return `${tuplePath} is of invalid tuple length. Expecting ${tuple.length} elements but got ${value.length}`;
    }

    for (let index = 0; index < tuple.length; index++) {
      const elementError = getPropertyValidationError(
        value[index],
        tuple[index]!,
        [...path, `${index}`],
        opts,
        pendingLookupValidations,
      );

      if (elementError !== undefined) {
        return elementError;
      }
    }

    return;
  }

  if (fieldDefinition.enum) {
    const otherOptions: any[] = [];
    if (fieldDefinition.nullable) otherOptions.push(null);
    if (fieldDefinition.optional) otherOptions.push(undefined);
    // err += `one of: ${JSON.stringify([...fieldType.enum, ...otherOptions]).slice(1, -1)}`;

    if (!fieldDefinition.enum.includes(value)) return err;
    return;
  }

  const arrayOf =
    fieldDefinition.arrayOf ??
    (fieldDefinition.arrayOfType ? { type: fieldDefinition.arrayOfType } : undefined);
  if (arrayOf) {
    if (!Array.isArray(value)) {
      return err + " an array";
    }
    const error = value
      .map((element, i) => {
        return getPropertyValidationError(
          element,
          arrayOf,
          [...path, `${i}`],
          opts,
          pendingLookupValidations,
        );
      })
      .filter(isDefined)[0];
    if (error !== undefined) {
      return `${err}. Error at index ${path.length > 0 ? path.join(".") + "." : ""}\n\n${error}`;
    }
    return;
  }

  const oneOf = fieldDefinition.oneOf ?? fieldDefinition.oneOfType?.map((type) => ({ type }));
  if (oneOf) {
    if (!oneOf.length) {
      return err + "to not be empty";
    }
    let firstError: string | undefined;
    const validMember = oneOf.find((member) => {
      const pendingLookupCount = pendingLookupValidations?.length;
      const error = getPropertyValidationError(value, member, path, opts, pendingLookupValidations);
      if (error !== undefined && pendingLookupCount !== undefined) {
        pendingLookupValidations!.length = pendingLookupCount;
      }
      firstError ??= error;
      return error === undefined;
    });
    if (validMember) {
      return;
    }
    return err;
  }
  if (fieldDefinition.record) {
    const { keysEnum, partial, values: valuesSchema } = fieldDefinition.record;
    if (!isObject(value)) {
      return err + "object";
    }
    if (partial && isEmpty(value)) {
      return;
    }
    const valueKeys = getKeys(value);
    const missingKey = partial ? undefined : keysEnum?.find((key) => !valueKeys.includes(key));
    if (missingKey !== undefined) {
      return `${err} to have key ${missingKey}`;
    }
    const extraKeys = keysEnum && valueKeys.filter((key) => !keysEnum.includes(key));
    if (extraKeys?.length) {
      return `${err} has extra keys: ${extraKeys}`;
    }
    if (valuesSchema) {
      for (const propKey of safeGetKeys(value)) {
        const propValue = safeGetProperty(value, propKey);
        const valError = getPropertyValidationError(
          propValue,
          valuesSchema,
          [...path, propKey],
          opts,
          pendingLookupValidations,
        );
        if (valError !== undefined) {
          return `${valError}`;
        }
      }
    }
    return;
  }
  return `Could not validate field type. Some logic might be missing: ${JSON.stringify(fieldDefinition)}`;
};

const getTypeDescription = (schema: JSONB.FieldType): string => {
  const schemaObj = getFieldTypeObj(schema);
  const { type, nullable, optional, record } = schemaObj;
  const oneOf = schemaObj.oneOf ?? schemaObj.oneOfType?.map((type) => ({ type }));
  const allowedTypes: any[] = [];
  if (nullable) allowedTypes.push("null");
  if (optional) allowedTypes.push("undefined");
  if (typeof type === "string") {
    allowedTypes.push(type);
  } else if (type) {
    if (isObject(type)) {
      const keyOpts: string[] = [];
      Object.entries(type).forEach(([key, value]) => {
        keyOpts.push(`${key}: ${getTypeDescription(value)}`);
      });
      allowedTypes.push(`{ ${keyOpts.join("; ")} }`);
    }
  }
  schemaObj.enum?.forEach((v) => {
    if (v === null) {
      allowedTypes.push("null");
    } else if (v === undefined) {
      allowedTypes.push("undefined");
    } else if (typeof v === "string") {
      allowedTypes.push(JSON.stringify(v));
    } else {
      allowedTypes.push(v);
    }
  });
  oneOf?.forEach((v) => {
    const type = getTypeDescription(v);
    allowedTypes.push(type);
  });
  if (record) {
    const { keysEnum, partial, values } = record;
    const optional = partial ? "?" : "";
    const valueType = !values ? "any" : getTypeDescription(values);
    if (keysEnum) {
      allowedTypes.push(`{ [${keysEnum.join(" | ")}]${optional}: ${valueType} }`);
    } else {
      allowedTypes.push(`{ [key: string]${optional}: ${valueType} }`);
    }
  }

  return allowedTypes.join(" | ");
};

export const getJSONBObjectSchemaValidationError = <S extends JSONB.ObjectType["type"]>(
  schema: S,
  obj: any,
  objName = "input",
  optional = false,
  opts?: ValidationOptions,
): { error: string; data?: undefined } | { error?: undefined; data: JSONB.GetObjectType<S> } => {
  if (obj === undefined && !optional) return { error: `Expecting ${objName} to be defined` };
  if (!isObject(obj)) {
    return { error: `Expecting ${objName} to be an object` };
  }
  const error = getPropertyValidationError(obj, { type: schema }, [], opts);
  if (error) {
    return { error };
  }
  return { data: obj as JSONB.GetObjectType<S> };
};

export const getJSONBSchemaValidationError = <S extends JSONB.FieldType>(
  schema: S,
  obj: any,
  opts?: ValidationOptions,
): { error: string; data?: undefined } | { error?: undefined; data: JSONB.GetType<S> } => {
  const error = getPropertyValidationError(obj, schema, undefined, opts);
  if (error) {
    return { error };
  }
  return { data: obj as JSONB.GetType<S> };
};

const getLookupValuePath = (path: string[], index?: number): string => {
  const result = [...path, ...(index === undefined ? [] : [String(index)])].join(".");
  return result || "value";
};

const getLookupTableHandler = (db: DBHandler, table: string): DBHandler[string] | undefined => {
  if (!safeHasOwn(db, table)) return;
  const handler = safeGetProperty(db, table);
  return isObject(handler) ? (handler as DBHandler[string]) : undefined;
};

const getLookupValidationError = async (
  lookup: PendingLookupValidation,
  db: DBHandler,
): Promise<string | undefined> => {
  const { schema, path } = lookup;
  const isArray = schema.type.endsWith("[]");
  const values = isArray ? (lookup.value as unknown[]) : [lookup.value];

  for (const [index, value] of values.entries()) {
    const valuePath = getLookupValuePath(path, isArray ? index : undefined);

    if (schema.type === "TableLookup" || schema.type === "TableLookup[]") {
      if (!getLookupTableHandler(db, value as string)) {
        return `${valuePath} references an unknown table ${JSON.stringify(value)}`;
      }
      continue;
    }

    if (schema.type === "ColumnLookup" || schema.type === "ColumnLookup[]") {
      const reference = value as { table: string; column: string };
      if (schema.filter?.table && reference.table !== schema.filter.table) {
        return `${valuePath} references a column that does not match the lookup filter`;
      }
      if (!db) continue;

      const tableHandler = getLookupTableHandler(db, reference.table);
      if (!tableHandler) {
        return `${valuePath} references an unknown table ${JSON.stringify(reference.table)}`;
      }
      if (typeof tableHandler.getColumns !== "function") {
        throw new Error(
          `Cannot validate ColumnLookup: table ${JSON.stringify(reference.table)} does not expose getColumns`,
        );
      }
      const columns = await tableHandler.getColumns();
      const column = columns.find(({ name }) => name === reference.column);
      if (
        !column ||
        (schema.filter?.tsDataType && column.tsDataType !== schema.filter.tsDataType) ||
        (schema.filter?.udt_name && column.udt_name !== schema.filter.udt_name)
      ) {
        return `${valuePath} references an unknown or disallowed column ${JSON.stringify(`${reference.table}.${reference.column}`)}`;
      }
      continue;
    }

    const dataLookup = schema as JSONB.RowLookup | JSONB.ValueLookup;
    const tableHandler = getLookupTableHandler(db, dataLookup.table);

    if (!tableHandler) {
      throw new Error(
        `Cannot validate ${dataLookup.type}: table ${JSON.stringify(dataLookup.table)} does not expose findOne`,
      );
    }

    const valueFilter =
      dataLookup.type === "RowLookup" || dataLookup.type === "RowLookup[]" ?
        (value as Record<string, unknown>)
      : { [(dataLookup as JSONB.ValueLookup).column]: value };
    const filter = dataLookup.filter ? { $and: [dataLookup.filter, valueFilter] } : valueFilter;
    const row = await tableHandler?.findOne?.(filter);
    if (row === undefined) {
      return `${valuePath} does not reference an existing row in ${JSON.stringify(dataLookup.table)}`;
    }
  }
};

/**
 * Validates lookup values as well as the synchronous JSONB schema rules.
 * A prostgles DB handler validates every lookup kind. A fetch-row callback
 * validates RowLookup and ValueLookup records, while table/column lookups are
 * structurally validated.
 */
export const getJSONBSchemaValidationErrorAsync = async <S extends JSONB.FieldType>(
  schema: S,
  obj: any,
  source: DBHandler,
  opts?: ValidationOptions,
): Promise<{ error: string; data?: undefined } | { error?: undefined; data: JSONB.GetType<S> }> => {
  const pendingLookupValidations: PendingLookupValidation[] = [];
  const error = getPropertyValidationError(obj, schema, undefined, opts, pendingLookupValidations);
  if (error) return { error };

  for (const lookup of pendingLookupValidations) {
    const lookupError = await getLookupValidationError(lookup, source);
    if (lookupError) return { error: lookupError };
  }
  return { data: obj as JSONB.GetType<S> };
};

export const validateJSONBObjectAgainstSchema = <S extends JSONB.ObjectType["type"]>(
  schema: S,
  obj: any,
  objName: string,
  optional = false,
): obj is JSONB.GetObjectType<S> => {
  const { error } = getJSONBObjectSchemaValidationError(schema, obj, objName, optional);
  return error === undefined;
};
export const assertJSONBObjectAgainstSchema = <S extends JSONB.ObjectType["type"]>(
  schema: S,
  obj: any,
  objName: string,
  optional = false,
): asserts obj is JSONB.GetObjectType<S> => {
  const { error } = getJSONBObjectSchemaValidationError(schema, obj, objName, optional);
  if (error) {
    throw new Error(error);
  }
};
