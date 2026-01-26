import type { AnyObject, JoinMaker } from "./index";
import { omitKeys } from "./util";

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
