import { AnyObject, CastFromTSToPG } from "./filters";
export type KeysOfType<T, U> = {
    [K in keyof T]: T[K] extends U ? K : never;
}[keyof T];
export type RequiredKeys<T> = Exclude<KeysOfType<T, Exclude<T[keyof T], undefined>>, undefined>;
export type OptionalKeys<T> = Exclude<keyof T, RequiredKeys<T>>;
export type PartialBy<T, K extends keyof T | string> = Omit<T, K> & Partial<Pick<T, Extract<K, keyof T>>>;
export declare const FUNC_ENDING_HINT: "$func";
export type UpsertDataToPGCast<TD extends AnyObject = AnyObject> = {
    [K in keyof TD]: CastFromTSToPG<TD[K]> | Record<string, any[]>;
};
//# sourceMappingURL=insertUpdateUtils.d.ts.map