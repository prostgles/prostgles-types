import type { JSONB } from "./JSONBSchemaValidation/JSONBSchema";
import { omitKeys, type StrictUnion } from "./util";
import { isEqual } from "./utilFuncs/isEqual";

type InputFields = JSONB.ObjectType["type"];
type InputUnion = readonly [InputFields, ...InputFields[]];

export type FunctionInput = InputFields | InputUnion;

type InputValue<Fields> =
  Fields extends InputFields ?
    /* A dynamic field map has no concrete schema to resolve. */
    [InputFields, string] extends [Fields, keyof Fields] ?
      Record<string, unknown>
    : JSONB.GetObjectType<Fields>
  : never;

export type JSONBObjectTypeIfDefined<T extends FunctionInput | undefined> =
  T extends InputUnion ? StrictUnion<InputValue<T[number]>> : InputValue<T>;

export const isFunctionInputUnion = (
  input: FunctionInput,
): input is InputUnion => Array.isArray(input);

export const getFunctionInputSchema = (
  input: FunctionInput,
  hiddenFields?: string[],
) => {
  const visibleFields = (fields: InputFields): InputFields =>
    hiddenFields?.length ? omitKeys(fields, hiddenFields) : fields;
  return (
    isFunctionInputUnion(input) ?
      { oneOfType: input.map(visibleFields) }
    : { type: visibleFields(input) }) satisfies JSONB.OneOf | JSONB.ObjectType;
};

export const getFunctionInputVariants = (
  input: FunctionInput,
): readonly InputFields[] => (isFunctionInputUnion(input) ? input : [input]);

/* A row action can bind a lookup before the caller chooses a variant. */
export const getCommonFunctionInputFields = (
  input: FunctionInput,
): InputFields => {
  if (!isFunctionInputUnion(input)) return input;
  const [first, ...others] = input;
  return Object.fromEntries(
    Object.entries(first).filter(([key, field]) =>
      others.every((fields) => isEqual(field, fields[key])),
    ),
  );
};
