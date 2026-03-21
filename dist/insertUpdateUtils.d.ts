import { AnyObject, CastFromTSToPG } from "./filters";
export type KeysOfType<T, U> = {
    [K in keyof T]: T[K] extends U ? K : never;
}[keyof T];
export type RequiredKeys<T> = Exclude<KeysOfType<T, Exclude<T[keyof T], undefined>>, undefined>;
export type OptionalKeys<T> = Exclude<keyof T, RequiredKeys<T>>;
export type PartialBy<T, K extends keyof T | string> = Omit<T, K> & Partial<Pick<T, Extract<K, keyof T>>>;
export declare const FUNC_ENDING_HINT: "$func";
type IsAny<T> = 0 extends 1 & T ? true : false;
type RejectAny<T> = IsAny<T> extends true ? never : T;
export type UpsertDataToPGCast<TD extends AnyObject = AnyObject> = RejectAny<{
    [K in keyof TD]: CastFromTSToPG<TD[K]> | Record<string, any[]>;
}>;
export {};
//# sourceMappingURL=insertUpdateUtils.d.ts.map