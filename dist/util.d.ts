export declare function stableStringify(data: any, opts: any): string;
export declare type TextPatch = {
    from: number;
    to: number;
    text: string;
    md5: string;
};
export declare function getTextPatch(oldStr: string, newStr: string): TextPatch | string;
export declare function unpatchText(original: string, patch: TextPatch): string;
export declare type SyncTableInfo = {
    id_fields: string[];
    synced_field: string;
    throttle: number;
    batch_size: number;
};
export declare type BasicOrderBy = {
    fieldName: string;
    asc: boolean;
}[];
export declare type WALConfig = SyncTableInfo & {
    onSendStart?: () => any;
    onSend: (items: any[]) => Promise<any>;
    onSendEnd?: (batch?: any[], error?: any) => any;
    orderBy?: BasicOrderBy;
};
export declare class WAL {
    private changed;
    private sending;
    private options;
    private callbacks;
    constructor(args: WALConfig);
    sort: (a: any, b: any) => number;
    isSending(): boolean;
    getIdStr(d: any): string;
    getIdObj(d: any): any;
    addData: (data: any[], cb?: (err: any) => any) => void;
    isSendingTimeout?: any;
    private sendItems;
}
export declare function isEmpty(obj?: any): boolean;
//# sourceMappingURL=util.d.ts.map