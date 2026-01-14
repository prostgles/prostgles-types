import { AnyObject, JoinMaker, JoinPath, TS_COLUMN_DATA_TYPES } from ".";
export declare function asName(str: string): string;
export declare const pickKeys: <T extends AnyObject, Include extends keyof T>(obj: T, keys?: Include[] | readonly Include[], onlyIfDefined?: boolean) => Pick<T, Include>;
export declare function omitKeys<T extends AnyObject, Exclude extends keyof T>(obj: T, exclude: Exclude[]): Omit<T, Exclude>;
export declare function filter<T extends AnyObject, ArrFilter extends Partial<T>>(array: T[], arrFilter: ArrFilter): T[];
export declare function find<T extends AnyObject, ArrFilter extends Partial<T>>(array: T[], arrFilter: ArrFilter): T | undefined;
export declare function stableStringify(data: AnyObject, opts: any): string | undefined;
export type TextPatch = {
    from: number;
    to: number;
    text: string;
    md5: string;
};
export declare function getTextPatch(oldStr: string, newStr: string): TextPatch | string;
export declare function unpatchText(original: string | null, patch: TextPatch): string;
export type SyncTableInfo = {
    id_fields: string[];
    synced_field: string;
    throttle: number;
    batch_size: number;
};
export type BasicOrderBy = {
    fieldName: string;
    /**
     * Used to ensure numbers are not left as strings in some cases
     */
    tsDataType: TS_COLUMN_DATA_TYPES;
    asc: boolean;
}[];
export type WALConfig = SyncTableInfo & {
    /**
     * Fired when new data is added and there is no sending in progress
     */
    onSendStart?: () => any;
    /**
     * Fired on each data send batch
     */
    onSend: (items: any[], fullItems: WALItem[]) => Promise<any>;
    /**
     * Fired after all data was sent or when a batch error is thrown
     */
    onSendEnd?: (batch: any[], fullItems: WALItem[], error?: any) => any;
    /**
     * Order by which the items will be synced. Defaults to [synced_field, ...id_fields.sort()]
     */
    orderBy?: BasicOrderBy;
    /**
     * Defaults to 2 seconds
     */
    historyAgeSeconds?: number;
    DEBUG_MODE?: boolean;
    id?: string;
};
export type WALItem = {
    initial?: AnyObject;
    delta?: AnyObject;
    current: AnyObject;
};
export type WALItemsObj = Record<string, WALItem>;
/**
 * Used to throttle and combine updates sent to server
 * This allows a high rate of optimistic updates on the client
 */
export declare class WAL {
    /**
     * Instantly merged records for prepared for update
     */
    private changed;
    /**
     * Batch of records (removed from this.changed) that are currently being sent
     */
    private sending;
    /**
     * Historic data used to reduce data pushes from server to client
     */
    private sentHistory;
    private options;
    private callbacks;
    constructor(args: WALConfig);
    sort: (a?: AnyObject, b?: AnyObject) => number;
    isSending(): boolean;
    /**
     * Used by server to avoid unnecessary data push to client.
     * This can happen due to the same data item having been previously pushed by the client
     * @param item data item
     * @returns boolean
     */
    isInHistory: (item: AnyObject) => boolean;
    getIdStr(d: AnyObject): string;
    getIdObj(d: AnyObject): AnyObject;
    getDeltaObj(d: AnyObject): AnyObject;
    addData: (data: WALItem[]) => void;
    isOnSending: boolean;
    isSendingTimeout?: ReturnType<typeof setTimeout>;
    willDeleteHistory?: ReturnType<typeof setTimeout>;
    private sendItems;
}
export declare function isEmpty(obj?: any): boolean;
export declare const isNotEmpty: <T extends Record<string, unknown>>(obj?: T | null | undefined) => obj is T;
export declare function get(obj: any, propertyPath: string | string[]): any;
export declare const getObjectEntries: <T extends Record<string, any>>(obj: T) => [keyof T, T[keyof T]][];
export declare function isObject(obj: any | undefined): obj is Record<string, any>;
export declare function isDefined<T>(v: T | undefined | void | null): v is NonNullable<T>;
export declare function getKeys<T extends Record<string, any>>(o: T): (keyof T & string)[];
export type Explode<T> = keyof T extends infer K ? K extends unknown ? {
    [I in keyof T]: I extends K ? T[I] : never;
} : never : never;
export type AtMostOne<T> = Explode<Partial<T>>;
export type AtLeastOne<T, U = {
    [K in keyof T]: Pick<T, K>;
}> = Partial<T> & U[keyof U];
export type ExactlyOne<T> = AtMostOne<T> & AtLeastOne<T>;
type UnionKeys<T> = T extends T ? keyof T : never;
type StrictUnionHelper<T, TAll> = T extends any ? T & Partial<Record<Exclude<UnionKeys<TAll>, keyof T>, never>> : never;
export type StrictUnion<T> = StrictUnionHelper<T, T>;
export type PartialByKeys<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type Simplify<T> = {
    [K in keyof T]: T[K];
} & {};
/**
 * @deprecated
 * use tryCatchV2 instead
 */
export declare const tryCatch: <T extends AnyObject>(func: () => T | Promise<T>) => Promise<(T & {
    hasError?: false;
    error?: undefined;
    duration: number;
}) | (Partial<Record<keyof T, undefined>> & {
    hasError: true;
    error: unknown;
    duration: number;
})>;
export declare const getJoinHandlers: (tableName: string) => {
    innerJoin: JoinMaker;
    leftJoin: JoinMaker;
    innerJoinOne: JoinMaker;
    leftJoinOne: JoinMaker;
};
export type ParsedJoinPath = Required<JoinPath>;
export declare const reverseJoinOn: (on: ParsedJoinPath["on"]) => {
    [k: string]: string;
}[];
/**
 * result = [
 *  { table, on: parsedPath[0] }
 *  ...parsedPath.map(p => ({ table: p.table, on: reversedOn(parsedPath[i+1].on) }))
 * ]
 */
export declare const reverseParsedPath: (parsedPath: ParsedJoinPath[], table: string) => {
    table: string;
    on: {
        [k: string]: string;
    }[];
}[];
type FilterMatch<T, U> = T extends U ? T : undefined;
export declare const extractTypeUtil: <T extends AnyObject, U extends Partial<T>>(obj: T, objSubType: U) => FilterMatch<T, U>;
export declare const safeStringify: (obj: AnyObject) => string;
export declare const getSerialisableError: (rawError: any, includeStack?: boolean) => AnyObject | any[] | string | undefined | null;
export declare const getProperty: <T extends object, K extends string>(obj: T, key: K | string) => K extends keyof T ? T[K] : K extends string ? T[keyof T] | undefined : undefined;
export {};
//# sourceMappingURL=util.d.ts.map