import { DBSchema, RawJoinPath, type AllowedTSType, type CastFromTSToPG } from ".";
import { ExactlyOne } from "./util";
export declare const CompareFilterKeys: readonly ["=", "<>", ">", "<", ">=", "<=", "$eq", "$ne", "$gt", "$gte", "$lt", "$lte", "$isDistinctFrom", "$isNotDistinctFrom"];
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
export declare const JsonbFilterKeys: ("@>" | "<@" | "?" | "?|" | "?&" | "||" | "-" | "#-" | "@?" | "@@")[];
export declare const TextFilterKeys: readonly ["$ilike", "$like", "$nilike", "$nlike"];
export declare const TextFilterFTSKeys: readonly ["@@", "@>", "<@", "$contains", "$containedBy"];
export declare const TextFilter_FullTextSearchFilterKeys: readonly ["to_tsquery", "plainto_tsquery", "phraseto_tsquery", "websearch_to_tsquery"];
export type FullTextSearchFilter = ExactlyOne<Record<(typeof TextFilter_FullTextSearchFilterKeys)[number], string[]>>;
export declare const ArrayFilterOperands: readonly ["@>", "<@", "=", "$eq", "$contains", "$containedBy", "&&", "$overlaps"];
export type AllowedTSTypes = AllowedTSType[];
export type ArrayFilter<T extends AllowedTSType[]> = Record<(typeof ArrayFilterOperands)[number], T> | ExactlyOne<Record<(typeof ArrayFilterOperands)[number], T>>;
/**
 * Makes bounding box from NW and SE points
 * float xmin, float ymin, float xmax, float ymax, integer srid=unknown
 * https://postgis.net/docs/ST_MakeEnvelope.html
 */
export type GeoBBox = {
    ST_MakeEnvelope: number[];
};
/**
 * Returns TRUE if A's 2D bounding box intersects B's 2D bounding box.
 * https://postgis.net/docs/reference.html#Operators
 */
export type GeomFilter = 
/**
 * A's 2D bounding box intersects B's 2D bounding box.
 */
{
    "&&": GeoBBox;
}
/**
 * A's bounding box is contained by B's
 */
 | {
    "@": GeoBBox;
};
/**
 * A's bounding box contains B's.
 */
export declare const GeomFilterKeys: readonly ["~", "~=", "@", "|&>", "|>>", ">>", "=", "<<|", "<<", "&>", "&<|", "&<", "&&&", "&&"];
export declare const GeomFilter_Funcs: readonly ["ST_MakeEnvelope", "st_makeenvelope", "ST_MakePolygon", "st_makepolygon"];
export type AnyObject = Record<string, any>;
export declare const EXISTS_KEYS: readonly ["$exists", "$notExists", "$existsJoined", "$notExistsJoined"];
export type EXISTS_KEY = (typeof EXISTS_KEYS)[number];
export declare const ComplexFilterComparisonKeys: readonly ["$ilike", "$like", "$nilike", "$nlike", ...("@>" | "<@" | "?" | "?|" | "?&" | "||" | "-" | "#-" | "@?" | "@@")[], "=", "<>", ">", "<", ">=", "<=", "$eq", "$ne", "$gt", "$gte", "$lt", "$lte", "$isDistinctFrom", "$isNotDistinctFrom", "$between", "$notBetween", "$in", "$nin"];
export declare const COMPLEX_FILTER_KEY: "$filter";
/**
 * Complex filter that allows applying functions to columns
 *  `{
 *    $filter: [
 *      { $funcName: [...args] },
 *      operand,
 *      value | funcFilter
 *    ]
 *  }`
 */
export type ComplexFilter = Record<typeof COMPLEX_FILTER_KEY, [
    {
        [funcName: string]: any[];
    },
    (typeof ComplexFilterComparisonKeys)[number]?,
    any?
]>;
export type KeyofString<T> = keyof T & string;
export type ValueOf<T> = T[keyof T];
/**
 * Filter used for data synchronization, where all specified columns must match the given values.
 *
 * Columns are combined using an AND condition.
 *
 * Example: `{ department: 'd1', name: 'abc' }` would match records where department is 'd1' AND name is 'abc'.
 */
export type EqualityFilter<T extends AnyObject> = {
    [K in keyof Partial<T>]: CastFromTSToPG<T[K]>;
};
/**
 * Example: col_name: { $gt: 2 }
 */
export type CompareFilter<T extends AllowedTSType> = 
/**
 * column value equals provided value
 */
T | ExactlyOne<Record<(typeof CompareFilterKeys)[number], T>> | ExactlyOne<Record<(typeof CompareInFilterKeys)[number], T[]>> | ExactlyOne<Record<(typeof BetweenFilterKeys)[number], [T, T]>>;
export type TextFilter = ExactlyOne<Record<(typeof TextFilterKeys)[number], string>> | ExactlyOne<Record<(typeof TextFilterFTSKeys)[number], FullTextSearchFilter>>;
type Primitive = string | number | boolean | Date | null;
export type JSONBFilter<T extends Record<string, unknown> | readonly Record<string, unknown>[]> = {
    /**
     * Does the left JSON value contain the right JSON path/value entries at the top level?
     */
    "@>": T extends readonly (infer U)[] ? Partial<U>[] : Partial<T>;
} | {
    /**
     * Are the left JSON path/value entries contained at the top level within the right JSON value?
     */
    "<@": T extends readonly (infer U)[] ? Partial<U>[] : Partial<T>;
} | {
    /**
     * Does JSON path return any item for the specified JSON value
     */
    "@?": string;
};
/**
 * Filter operators for each PG data type
 */
export type FilterDataType<T extends AllowedTSType> = T extends string ? TextFilter : T extends number ? CompareFilter<CastFromTSToPG<T>> : T extends boolean ? CompareFilter<CastFromTSToPG<T>> : T extends Date ? CompareFilter<CastFromTSToPG<T>> : T extends Primitive[] ? ArrayFilter<T> : T extends Record<string, unknown> | Record<string, unknown>[] ? JSONBFilter<T> : CompareFilter<T> | TextFilter | GeomFilter;
/**
 * Column filter with operators
 * Multiple columns are combined with AND
 * @example: { colName: { $operator: ["value"] } }
 * */
export type NormalFilter<T> = {
    [K in keyof Partial<T>]: CompareFilter<T[K]> | FilterDataType<T[K]>;
} & Partial<ComplexFilter>;
export type FilterForObject<T extends AnyObject = AnyObject> = NormalFilter<T>;
export type ExistsFilter<S = void> = Partial<{
    [key in EXISTS_KEY]: S extends DBSchema ? ExactlyOne<{
        [tname in KeyofString<S>]: FullFilter<S[tname]["columns"], S> | {
            path: RawJoinPath[];
            filter: FullFilter<S[tname]["columns"], S>;
        };
    }> : any;
}>;
/**
 * Filter that relates to a single column
 */
export type FilterItem<T extends AnyObject = AnyObject> = FilterForObject<T>;
export type AnyObjIfVoid<T extends AnyObject | void> = T extends AnyObject ? T : AnyObject;
/**
 * Data filter
 * - `{ status: 'live' }`
 * - `{ $or: [{ id: 1 }, { status: 'live' }] }`
 * - `{ $existsJoined: { referencedTable: { id: 1 } } }`
 * - `{
 *      $filter: [
 *        { $age: ["created_at"] },
 *        "<",
 *        '1 year'
 *      ]
 *   }`
 */
export type FullFilter<T extends AnyObject | void, S extends DBSchema | void> = {
    $and: FullFilter<T, S>[];
} | {
    $or: FullFilter<T, S>[];
} | FilterItem<AnyObjIfVoid<T>> | ExistsFilter<S> | ComplexFilter;
/**
 * Simpler FullFilter to reduce load on compilation
 */
export type FullFilterBasic<T = {
    [key: string]: any;
}> = {
    [key in keyof Partial<T> & {
        [key: string]: any;
    }]: any;
};
export {};
//# sourceMappingURL=filters.d.ts.map