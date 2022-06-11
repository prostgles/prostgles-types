export declare type CompareFilter<T = Date | number | string | boolean> = T | {
    "=": T;
} | {
    "$eq": T;
} | {
    "<>": T;
} | {
    "$ne": T;
} | {
    ">": T;
} | {
    "$gt": T;
} | {
    ">=": T;
} | {
    "$gte": T;
} | {
    "<=": T;
} | {
    "$lte": T;
} | {
    "$in": T[];
} | {
    "$nin": T[];
} | {
    "$between": [T, T];
};
export declare const CompareFilterKeys: readonly ["=", "$eq", "<>", ">", ">=", "<=", "$eq", "$ne", "$gt", "$gte", "$lte"];
export declare const CompareInFilterKeys: readonly ["$in", "$nin"];
export declare const TextFilterKeys: readonly ["$ilike", "$like"];
export declare type FullTextSearchFilter = {
    "to_tsquery": string[];
} | {
    "plainto_tsquery": string[];
} | {
    "phraseto_tsquery": string[];
} | {
    "websearch_to_tsquery": string[];
};
export declare const TextFilter_FullTextSearchFilterKeys: readonly ["to_tsquery", "plainto_tsquery", "phraseto_tsquery", "websearch_to_tsquery"];
export declare type TextFilter = CompareFilter<string> | {
    "$ilike": string;
} | {
    "$like": string;
} | {
    "@@": FullTextSearchFilter;
} | {
    "@>": FullTextSearchFilter;
} | {
    "$contains": FullTextSearchFilter;
} | {
    "<@": FullTextSearchFilter;
} | {
    "$containedBy": FullTextSearchFilter;
};
export declare const TextFilterFTSKeys: readonly ["@@", "@>", "<@", "$contains", "$containedBy"];
export declare type ArrayFilter<T = (number | boolean | string)[]> = CompareFilter<T> | {
    "@>": T;
} | {
    "$contains": T;
} | {
    "<@": T;
} | {
    "$containedBy": T;
} | {
    "&&": T;
} | {
    "$overlaps": T;
};
export declare type GeoBBox = {
    ST_MakeEnvelope: number[];
};
export declare type GeomFilter = {
    "&&": GeoBBox;
} | {
    "@": GeoBBox;
};
export declare const GeomFilterKeys: readonly ["~", "~=", "@", "|&>", "|>>", ">>", "=", "<<|", "<<", "&>", "&<|", "&<", "&&&", "&&"];
export declare const GeomFilter_Funcs: string[];
export declare type AllowedTSTypes = string | number | boolean | Date | any[];
export declare type AnyObject = {
    [key: string]: any;
};
export declare type FilterDataType<T = any> = T extends string ? TextFilter : T extends number ? CompareFilter<T> : T extends boolean ? CompareFilter<T> : T extends Date ? CompareFilter<T> : T extends any[] ? ArrayFilter<T> : (CompareFilter<T> | ArrayFilter<T> | TextFilter | GeomFilter);
export declare const EXISTS_KEYS: readonly ["$exists", "$notExists", "$existsJoined", "$notExistsJoined"];
export declare type EXISTS_KEY = typeof EXISTS_KEYS[number];
declare type BasicFilter<Field extends string, DataType extends any> = Partial<{
    [K in Extract<typeof CompareFilterKeys[number], string> as `${Field}.${K}`]: DataType;
}> | Partial<{
    [K in Extract<typeof CompareInFilterKeys[number], string> as `${Field}.${K}`]: DataType[];
}>;
declare type StringFilter<Field extends string, DataType extends any> = BasicFilter<Field, DataType> & (Partial<{
    [K in Extract<typeof TextFilterKeys[number], string> as `${Field}.${K}`]: DataType;
}> | Partial<{
    [K in Extract<typeof TextFilterFTSKeys[number], string> as `${Field}.${K}`]: any;
}>);
declare type ValueOf<T> = T[keyof T];
declare type ShorthandFilter<Obj extends Record<string, any>> = ValueOf<{
    [K in keyof Obj]: Obj[K] extends string ? StringFilter<K, Obj[K]> : BasicFilter<K, Obj[K]>;
}>;
export declare type FilterForObject<T = AnyObject> = {
    [K in keyof Partial<T>]: FilterDataType<T[K]>;
} | ShorthandFilter<T>;
export declare type FilterItem<T = AnyObject> = FilterForObject<T> | Partial<{
    [key in EXISTS_KEY]: {
        [key: string]: FilterForObject;
    };
}>;
export declare type FullFilter<T = AnyObject> = {
    $and: (FilterItem<T> | FullFilter<T>)[];
} | {
    $or: (FilterItem<T> | FullFilter<T>)[];
} | {
    $not: FilterItem<T>;
} | FilterItem<T>;
export declare type FullFilterBasic<T = {
    [key: string]: any;
}> = {
    [key in keyof Partial<T & {
        [key: string]: any;
    }>]: any;
};
export {};
//# sourceMappingURL=filters.d.ts.map