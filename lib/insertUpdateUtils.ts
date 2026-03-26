import { AnyObject, CastFromTSToPG } from "./filters";
import { ExactlyOne } from "./util";

export type KeysOfType<T, U> = { [K in keyof T]: T[K] extends U ? K : never }[keyof T];
export type RequiredKeys<T> = Exclude<KeysOfType<T, Exclude<T[keyof T], undefined>>, undefined>;
export type OptionalKeys<T> = Exclude<keyof T, RequiredKeys<T>>;
export type PartialBy<T, K extends keyof T | string> = Omit<T, K> &
  Partial<Pick<T, Extract<K, keyof T>>>;

export const FUNC_ENDING_HINT = "$func" as const;

export type UpsertDataToPGCast<TD extends AnyObject> = {
  [K in keyof TD]: CastFromTSToPG<TD[K]> | Record<"$merge", unknown[]>;
};

type Schema = {
  col1: number;
  col2: string;
  col3?: string;
};

const basic: UpsertDataToPGCast<Schema> = {
  col1: 2,
  col2: "2",
};

const funcs: UpsertDataToPGCast<Schema> = {
  col1: { $merge: [] },
  col2: { $merge: [] },
};

const mixed: UpsertDataToPGCast<Schema> = {
  col1: 2,
  col2: { $merge: [] },
};

const badKey: UpsertDataToPGCast<Schema> = {
  //@ts-expect-error
  badkey: { func: [] },
};

//@ts-expect-error
const wrong: UpsertDataToPGCast<Schema> = {
  col2: { $merge: [] },
};
