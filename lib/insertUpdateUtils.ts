import { AnyObject, CastFromTSToPG } from "./filters";
import { ExactlyOne } from "./util";

export type KeysOfType<T, U> = { [K in keyof T]: T[K] extends U ? K : never }[keyof T];
export type RequiredKeys<T> = Exclude<KeysOfType<T, Exclude<T[keyof T], undefined>>, undefined>;
export type OptionalKeys<T> = Exclude<keyof T, RequiredKeys<T>>;
export type PartialBy<T, K extends keyof T | string> = Omit<T, K> &
  Partial<Pick<T, Extract<K, keyof T>>>;

export const FUNC_ENDING_HINT = "$func" as const;
type DataOrFuncValuesObject<ObjectType> = {
  [Key in keyof ObjectType & string]:
    | { [K in Key]: ObjectType[Key] }
    | { [K in `${Key}.${typeof FUNC_ENDING_HINT}`]: Record<string, any[]> };
};

type PropertyValueIntersection<O> =
  {
    [K in keyof O]: (x: O[K]) => void;
  }[keyof O] extends (x: infer I) => void ?
    I
  : never;

// export type UpsertDataToPGCast<TD> = PropertyValueIntersection<DataOrFuncValuesObject<Required<TD>>>;
export type UpsertDataToPGCast<TD extends AnyObject = AnyObject> = {
  [K in keyof TD]: CastFromTSToPG<TD[K]> | Record<string, any[]>;
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
  col1: { func: [] },
  col2: { func: [] },
};

const mixed: UpsertDataToPGCast<Schema> = {
  col1: 2,
  col2: { func: [] },
};

const badKey: UpsertDataToPGCast<Schema> = {
  //@ts-expect-error
  badkey: { func: [] },
};

//@ts-expect-error
const wrong: UpsertDataToPGCast<Schema> = {
  col2: { func: [] },
};
