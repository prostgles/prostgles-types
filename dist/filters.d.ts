import { DBSchema, RawJoinPath } from ".";
import { ExactlyOne } from "./util";
export type AllowedTSType = string | number | boolean | Date | any;
export type AllowedTSTypes = AllowedTSType[];
export declare const CompareFilterKeys: readonly ["=", "$eq", "<>", ">", "<", ">=", "<=", "$eq", "$ne", "$gt", "$gte", "$lt", "$lte", "$isDistinctFrom", "$isNotDistinctFrom"];
export declare const CompareInFilterKeys: readonly ["$in", "$nin"];
export declare const BetweenFilterKeys: readonly ["$between", "$notBetween"];
export declare const JsonbOperands: {
    readonly "@>": {
        readonly Operator: "@>";
        readonly "Right Operand Type": "jsonb";
        readonly Description: "Does the left JSON value contain the right JSON path/value entries at the top level?";
        readonly Example: "'{\"a\":1, \"b\":2}'::jsonb @> '{\"b\":2}'::jsonb";
    };
    readonly "<@": {
        readonly Operator: "<@";
        readonly "Right Operand Type": "jsonb";
        readonly Description: "Are the left JSON path/value entries contained at the top level within the right JSON value?";
        readonly Example: "'{\"b\":2}'::jsonb <@ '{\"a\":1, \"b\":2}'::jsonb";
    };
    readonly "?": {
        readonly Operator: "?";
        readonly "Right Operand Type": "text";
        readonly Description: "Does the string exist as a top-level key within the JSON value?";
        readonly Example: "'{\"a\":1, \"b\":2}'::jsonb ? 'b'";
    };
    readonly "?|": {
        readonly Operator: "?|";
        readonly "Right Operand Type": "text[]";
        readonly Description: "Do any of these array strings exist as top-level keys?";
        readonly Example: "'{\"a\":1, \"b\":2, \"c\":3}'::jsonb ?| array['b', 'c']";
    };
    readonly "?&": {
        readonly Operator: "?&";
        readonly "Right Operand Type": "text[]";
        readonly Description: "Do all of these array strings exist as top-level keys?";
        readonly Example: "'[\"a\", \"b\"]'::jsonb ?& array['a', 'b']";
    };
    readonly "||": {
        readonly Operator: "||";
        readonly "Right Operand Type": "jsonb";
        readonly Description: "Concatenate two jsonb values into a new jsonb value";
        readonly Example: "'[\"a\", \"b\"]'::jsonb || '[\"c\", \"d\"]'::jsonb";
    };
    readonly "-": {
        readonly Operator: "-";
        readonly "Right Operand Type": "integer";
        readonly Description: "Delete the array element with specified index (Negative integers count from the end). Throws an error if top level container is not an array.";
        readonly Example: "'[\"a\", \"b\"]'::jsonb - 1";
    };
    readonly "#-": {
        readonly Operator: "#-";
        readonly "Right Operand Type": "text[]";
        readonly Description: "Delete the field or element with specified path (for JSON arrays, negative integers count from the end)";
        readonly Example: "'[\"a\", {\"b\":1}]'::jsonb #- '{1,b}'";
    };
    readonly "@?": {
        readonly Operator: "@?";
        readonly "Right Operand Type": "jsonpath";
        readonly Description: "Does JSON path return any item for the specified JSON value?";
        readonly Example: "'{\"a\":[1,2,3,4,5]}'::jsonb @? '$.a[*] ? (@ > 2)'";
    };
    readonly "@@": {
        readonly Operator: "@@";
        readonly "Right Operand Type": "jsonpath";
        readonly Description: "Returns the result of JSON path predicate check for the specified JSON value. Only the first item of the result is taken into account. If the result is not Boolean, then null is returned.";
        readonly Example: "'{\"a\":[1,2,3,4,5]}'::jsonb @@ '$.a[*] > 2'";
    };
};
export declare const JsonbFilterKeys: ("@@" | "@>" | "<@" | "?" | "?|" | "?&" | "||" | "-" | "#-" | "@?")[];
export declare const TextFilterKeys: readonly ["$ilike", "$like", "$nilike", "$nlike"];
export declare const TextFilterFTSKeys: readonly ["@@", "@>", "<@", "$contains", "$containedBy"];
export declare const TextFilter_FullTextSearchFilterKeys: readonly ["to_tsquery", "plainto_tsquery", "phraseto_tsquery", "websearch_to_tsquery"];
export type FullTextSearchFilter = ExactlyOne<Record<typeof TextFilter_FullTextSearchFilterKeys[number], string[]>>;
export type CompareFilter<T extends AllowedTSType = string> = T | ExactlyOne<Record<typeof CompareFilterKeys[number], T>> | ExactlyOne<Record<typeof CompareInFilterKeys[number], T[]>> | ExactlyOne<Record<typeof BetweenFilterKeys[number], [T, T]>>;
export type TextFilter = CompareFilter<string> | ExactlyOne<Record<typeof TextFilterKeys[number], string>> | ExactlyOne<Record<typeof TextFilterFTSKeys[number], FullTextSearchFilter>>;
export declare const ArrayFilterOperands: readonly ["@>", "<@", "=", "$eq", "$contains", "$containedBy", "&&", "$overlaps"];
export type ArrayFilter<T extends AllowedTSType[]> = Record<typeof ArrayFilterOperands[number], T> | ExactlyOne<Record<typeof ArrayFilterOperands[number], T>>;
export type GeoBBox = {
    ST_MakeEnvelope: number[];
};
export type GeomFilter = {
    "&&": GeoBBox;
} | {
    "@": GeoBBox;
};
export declare const GeomFilterKeys: readonly ["~", "~=", "@", "|&>", "|>>", ">>", "=", "<<|", "<<", "&>", "&<|", "&<", "&&&", "&&"];
export declare const GeomFilter_Funcs: readonly ["ST_MakeEnvelope", "st_makeenvelope", "ST_MakePolygon", "st_makepolygon"];
export type AnyObject = Record<string, any>;
export type CastFromTSToPG<T extends AllowedTSType> = T extends number ? (T | string) : T extends string ? (T | number | Date) : T extends boolean ? (T | string) : T extends Date ? (T | string) : T;
export type FilterDataType<T extends AllowedTSType> = T extends string ? TextFilter : T extends number ? CompareFilter<CastFromTSToPG<T>> : T extends boolean ? CompareFilter<CastFromTSToPG<T>> : T extends Date ? CompareFilter<CastFromTSToPG<T>> : T extends any[] ? ArrayFilter<T> : (CompareFilter<T> | TextFilter | GeomFilter);
export declare const EXISTS_KEYS: readonly ["$exists", "$notExists", "$existsJoined", "$notExistsJoined"];
export type EXISTS_KEY = typeof EXISTS_KEYS[number];
export declare const ComplexFilterComparisonKeys: readonly ["$ilike", "$like", "$nilike", "$nlike", ...("@@" | "@>" | "<@" | "?" | "?|" | "?&" | "||" | "-" | "#-" | "@?")[], "=", "$eq", "<>", ">", "<", ">=", "<=", "$eq", "$ne", "$gt", "$gte", "$lt", "$lte", "$isDistinctFrom", "$isNotDistinctFrom", "$between", "$notBetween", "$in", "$nin"];
export declare const COMPLEX_FILTER_KEY: "$filter";
export type ComplexFilter = Record<typeof COMPLEX_FILTER_KEY, [
    {
        [funcName: string]: any[];
    },
    typeof ComplexFilterComparisonKeys[number]?,
    any?
]>;
export type KeyofString<T> = keyof T & string;
type BasicFilter<Field extends string, DataType extends any> = Partial<{
    [K in Extract<typeof CompareFilterKeys[number], string> as `${Field}.${K}`]: CastFromTSToPG<DataType>;
}> | Partial<{
    [K in Extract<typeof CompareInFilterKeys[number], string> as `${Field}.${K}`]: CastFromTSToPG<DataType>[];
}>;
type StringFilter<Field extends string, DataType extends any> = BasicFilter<Field, DataType> & (Partial<{
    [K in Extract<typeof TextFilterKeys[number], string> as `${Field}.${K}`]: DataType;
}> | Partial<{
    [K in Extract<typeof TextFilterFTSKeys[number], string> as `${Field}.${K}`]: any;
}>);
export type ValueOf<T> = T[keyof T];
type ShorthandFilter<Obj extends Record<string, any>> = ValueOf<{
    [K in KeyofString<Obj>]: Obj[K] extends string ? StringFilter<K, Required<Obj>[K]> : BasicFilter<K, Required<Obj>[K]>;
}>;
export type EqualityFilter<T extends AnyObject> = {
    [K in KeyofString<Partial<T>>]: CastFromTSToPG<T[K]>;
};
export type FilterForObject<T extends AnyObject = AnyObject> = {
    [K in keyof Partial<T>]: FilterDataType<T[K]>;
} & Partial<ComplexFilter> | ShorthandFilter<T>;
export type ExistsFilter<S = void> = Partial<{
    [key in EXISTS_KEY]: S extends DBSchema ? ExactlyOne<{
        [tname in KeyofString<S>]: FullFilter<S[tname]["columns"], S> | {
            path: RawJoinPath[];
            filter: FullFilter<S[tname]["columns"], S>;
        };
    }> : any;
}>;
export type FilterItem<T extends AnyObject = AnyObject> = FilterForObject<T>;
export type AnyObjIfVoid<T extends AnyObject | void> = T extends AnyObject ? T : AnyObject;
export type FullFilter<T extends AnyObject | void, S extends DBSchema | void> = {
    $and: FullFilter<T, S>[];
} | {
    $or: FullFilter<T, S>[];
} | FilterItem<AnyObjIfVoid<T>> | ExistsFilter<S> | ComplexFilter;
export type FullFilterBasic<T = {
    [key: string]: any;
}> = {
    [key in KeyofString<Partial<T>> & {
        [key: string]: any;
    }]: any;
};
export {};
//# sourceMappingURL=filters.d.ts.map