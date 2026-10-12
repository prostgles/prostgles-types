import type { ClientServerFunction, ValidatedColumnInfo } from "./index";
import type { JSONB } from "./JSONBSchemaValidation/JSONBSchema";

/** Finds single-row lookups that can be used as actions for this table. */
export const getActionFunctions = (
  methods: Record<string, Pick<ClientServerFunction, "input">>,
  table: {
    name: string;
    columns: readonly Pick<ValidatedColumnInfo, "name" | "select">[];
  },
): ActionFunction[] =>
  Object.entries(methods).flatMap(([methodName, method]) =>
    Object.entries(method.input ?? {}).flatMap(([argName, lookup]) => {
      if (
        typeof lookup === "string" ||
        (lookup.type !== "RowLookup" && lookup.type !== "ValueLookup") ||
        lookup.table !== table.name ||
        (lookup.type === "ValueLookup" &&
          !table.columns.some(
            (column) => column.name === lookup.column && column.select,
          ))
      ) {
        return [];
      }
      return [{ methodName, argName, lookup }];
    }),
  );

export type ActionFunction = {
  methodName: string;
  argName: string;
  lookup: JSONB.RowLookup | JSONB.ValueLookup;
};
