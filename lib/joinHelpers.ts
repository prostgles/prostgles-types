import type { AnyObject, DetailedJoinSelect, JoinMaker, JSONB } from "./index";
import { omitKeys } from "./util";

/** Preserve literal table names and selections for joined return type inference. */
export const defineJoin = <const J extends DetailedJoinSelect>(join: J): J =>
  join;

/** Schema for an explicit, persisted join path step. */
export const parsedJoinPathSchema = {
  type: {
    table: "string",
    on: {
      oneOf: [
        { type: "string" },
        { arrayOf: { record: { values: "string" } } },
      ],
    },
    params: { record: { values: "unknown" }, optional: true },
    reversed: { type: "boolean", optional: true },
  },
} as const satisfies JSONB.JSONBSchema;

const getJoinFunc = (joinType: "$leftJoin" | "$innerJoin" = "$leftJoin") => {
  const joinMaker: JoinMaker = (
    tableName: Parameters<JoinMaker<AnyObject>>[0],
    filter: Parameters<JoinMaker<AnyObject>>[1],
    select: Parameters<JoinMaker<AnyObject>>[2],
    options: Parameters<JoinMaker<AnyObject>>[3] = {},
  ) => {
    return {
      [joinType]: options.path ?? tableName,
      filter,
      ...omitKeys(options, ["path", "select"]),
      select,
    };
  };
  return joinMaker;
};

export const innerJoin = getJoinFunc("$innerJoin");
export const leftJoin = getJoinFunc("$leftJoin");
