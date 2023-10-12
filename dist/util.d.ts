/// <reference types="node" />
import { AnyObject, JoinMaker, JoinPath, TS_COLUMN_DATA_TYPES } from ".";
export declare function asName(str: string): string;
export declare function pickKeys<T extends AnyObject, Include extends keyof T>(obj: T, include?: Include[], onlyIfDefined?: boolean): Pick<T, Include>;
export declare function omitKeys<T extends AnyObject, Exclude extends keyof T>(obj: T, exclude: Exclude[]): Omit<T, Exclude>;
export declare function filter<T extends AnyObject, ArrFilter extends Partial<T>>(array: T[], arrFilter: ArrFilter): T[];
export declare function find<T extends AnyObject, ArrFilter extends Partial<T>>(array: T[], arrFilter: ArrFilter): T | undefined;
export declare function includes<Arr extends any[] | readonly any[], Elem extends Arr[number]>(array: Arr, elem: Elem): boolean;
export declare function stableStringify(data: AnyObject, opts: any): string | undefined;
export type TextPatch = {
    from: number;
    to: number;
    text: string;
    md5: string;
};
export declare function getTextPatch(oldStr: string, newStr: string): TextPatch | string;
export declare function unpatchText(original: string, patch: TextPatch): string;
export type SyncTableInfo = {
    id_fields: string[];
    synced_field: string;
    throttle: number;
    batch_size: number;
};
export type BasicOrderBy = {
    fieldName: string;
    tsDataType: TS_COLUMN_DATA_TYPES;
    asc: boolean;
}[];
export type WALConfig = SyncTableInfo & {
    onSendStart?: () => any;
    onSend: (items: any[], fullItems: WALItem[]) => Promise<any>;
    onSendEnd?: (batch: any[], fullItems: WALItem[], error?: any) => any;
    orderBy?: BasicOrderBy;
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
export declare class WAL {
    private changed;
    private sending;
    private sentHistory;
    private options;
    private callbacks;
    constructor(args: WALConfig);
    sort: (a?: AnyObject, b?: AnyObject) => number;
    isSending(): boolean;
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
export declare function get(obj: any, propertyPath: string | string[]): any;
export declare function isObject(obj: any | undefined): obj is Record<string, any>;
export declare function isDefined<T>(v: T | undefined | void): v is T;
export declare function getKeys<T extends AnyObject>(o: T): Array<keyof T>;
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
export declare const tryCatch: <T extends AnyObject>(func: () => T | Promise<T>) => Promise<(T & {
    error?: undefined;
    duration: number;
}) | (Partial<Record<keyof T, undefined>> & {
    error: unknown;
    duration: number;
})>;
export declare const getJoinHandlers: (tableName: string) => {
    innerJoin: JoinMaker<AnyObject, void>;
    leftJoin: JoinMaker<AnyObject, void>;
    innerJoinOne: JoinMaker<AnyObject, void>;
    leftJoinOne: JoinMaker<AnyObject, void>;
};
export type ParsedJoinPath = Required<JoinPath>;
export declare const reverseJoinOn: (on: ParsedJoinPath["on"]) => {
    [k: string]: string;
}[];
export declare const reverseParsedPath: (parsedPath: ParsedJoinPath[], table: string) => {
    table: string;
    on: {
        [k: string]: string;
    }[];
}[];
export {};
//# sourceMappingURL=util.d.ts.map