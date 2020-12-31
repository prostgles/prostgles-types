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
export declare type WALConfig = SyncTableInfo & {
    onSendStart?: () => any;
    onSend: (items: any[]) => Promise<any>;
    onSendEnd?: (batch?: any[], error?: any) => any;
};
export declare class WAL {
    private changed;
    private sending;
    private options;
    constructor(args: WALConfig);
    isSending(): boolean;
    getIdStr(d: any): string;
    getIdObj(d: any): any;
    addData: (data: any[]) => void;
    isSendingTimeout?: any;
    private sendItems;
}
export declare function isEmpty(obj?: object): boolean;
//# sourceMappingURL=util.d.ts.map