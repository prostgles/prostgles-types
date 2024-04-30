import { DBSchema, RawJoinPath } from ".";
import { ExactlyOne, getKeys } from "./util";

export type AllowedTSType = string | number | boolean | Date | any;
export type AllowedTSTypes = AllowedTSType[];

export const CompareFilterKeys = ["=", "$eq","<>",">","<",">=","<=","$eq","$ne","$gt","$gte","$lte"] as const;
export const CompareInFilterKeys = ["$in", "$nin"] as const;

export const JsonbOperands = {
  "@>": {
    "Operator": "@>",
    "Right Operand Type": "jsonb",
    "Description": "Does the left JSON value contain the right JSON path/value entries at the top level?",
    "Example": "'{\"a\":1, \"b\":2}'::jsonb @> '{\"b\":2}'::jsonb"
  },
  "<@": {
    "Operator": "<@",
    "Right Operand Type": "jsonb",
    "Description": "Are the left JSON path/value entries contained at the top level within the right JSON value?",
    "Example": "'{\"b\":2}'::jsonb <@ '{\"a\":1, \"b\":2}'::jsonb"
  },
  "?": {
    "Operator": "?",
    "Right Operand Type": "text",
    "Description": "Does the string exist as a top-level key within the JSON value?",
    "Example": "'{\"a\":1, \"b\":2}'::jsonb ? 'b'"
  },
  "?|": {
    "Operator": "?|",
    "Right Operand Type": "text[]",
    "Description": "Do any of these array strings exist as top-level keys?",
    "Example": "'{\"a\":1, \"b\":2, \"c\":3}'::jsonb ?| array['b', 'c']"
  },
  "?&": {
    "Operator": "?&",
    "Right Operand Type": "text[]",
    "Description": "Do all of these array strings exist as top-level keys?",
    "Example": "'[\"a\", \"b\"]'::jsonb ?& array['a', 'b']"
  },
  "||": {
    "Operator": "||",
    "Right Operand Type": "jsonb",
    "Description": "Concatenate two jsonb values into a new jsonb value",
    "Example": "'[\"a\", \"b\"]'::jsonb || '[\"c\", \"d\"]'::jsonb"
  },
  "-": {
    "Operator": "-",
    "Right Operand Type": "integer",
    "Description": "Delete the array element with specified index (Negative integers count from the end). Throws an error if top level container is not an array.",
    "Example": "'[\"a\", \"b\"]'::jsonb - 1"
  },
  "#-": {
    "Operator": "#-",
    "Right Operand Type": "text[]",
    "Description": "Delete the field or element with specified path (for JSON arrays, negative integers count from the end)",
    "Example": "'[\"a\", {\"b\":1}]'::jsonb #- '{1,b}'"
  },
  "@?": {
    "Operator": "@?",
    "Right Operand Type": "jsonpath",
    "Description": "Does JSON path return any item for the specified JSON value?",
    "Example": "'{\"a\":[1,2,3,4,5]}'::jsonb @? '$.a[*] ? (@ > 2)'"
  },
  "@@": {
    "Operator": "@@",
    "Right Operand Type": "jsonpath",
    "Description": "Returns the result of JSON path predicate check for the specified JSON value. Only the first item of the result is taken into account. If the result is not Boolean, then null is returned.",
    "Example": "'{\"a\":[1,2,3,4,5]}'::jsonb @@ '$.a[*] > 2'"
  }
} as const;

export const JsonbFilterKeys = getKeys(JsonbOperands);

/**
 * Example: col_name: { $gt: 2 }
 */
 export type CompareFilter<T extends AllowedTSType = string> =
 /**
  * column value equals provided value
  */
 | T 
 | ExactlyOne<Record<typeof CompareFilterKeys[number], T>>

 | ExactlyOne<Record<typeof CompareInFilterKeys[number], T[]>>
 | { "$between": [T, T] }
;
export const TextFilterKeys = ["$ilike", "$like", "$nilike", "$nlike"] as const;

export const TextFilterFTSKeys = ["@@", "@>", "<@", "$contains", "$containedBy"] as const;

export const TextFilter_FullTextSearchFilterKeys = ["to_tsquery","plainto_tsquery","phraseto_tsquery","websearch_to_tsquery"] as const;
export type FullTextSearchFilter = 
 | ExactlyOne<Record<typeof TextFilter_FullTextSearchFilterKeys[number], string[]>>
;

export type TextFilter = 
 | CompareFilter<string>
 | ExactlyOne<Record<typeof TextFilterKeys[number], string>>

 | ExactlyOne<Record<typeof TextFilterFTSKeys[number], FullTextSearchFilter>>
;

export const ArrayFilterOperands = ["@>", "<@", "=", "$eq", "$contains", "$containedBy", "&&", "$overlaps"] as const;
export type ArrayFilter<T extends AllowedTSType[]> = 
 | Record<typeof ArrayFilterOperands[number], T>
 | ExactlyOne<Record<typeof ArrayFilterOperands[number], T>>
;

/* POSTGIS */

/**
* Makes bounding box from NW and SE points
* float xmin, float ymin, float xmax, float ymax, integer srid=unknown
* https://postgis.net/docs/ST_MakeEnvelope.html
*/
export type GeoBBox = { ST_MakeEnvelope: number[] }


/**
* Returns TRUE if A's 2D bounding box intersects B's 2D bounding box.
* https://postgis.net/docs/reference.html#Operators
*/
export type GeomFilter = 

 /**
  * A's 2D bounding box intersects B's 2D bounding box.
  */
 | { "&&": GeoBBox }
//  | { "&&&": GeoBBox }
//  | { "&<": GeoBBox }
//  | { "&<|": GeoBBox }
//  | { "&>": GeoBBox }
//  | { "<<": GeoBBox }
//  | { "<<|": GeoBBox }
//  | { ">>": GeoBBox }

//  | { "=": GeoBBox }

 /**
  * A's bounding box is contained by B's
  */
 | { "@": GeoBBox }
//  | { "|&>": GeoBBox }
//  | { "|>>": GeoBBox }

 /**
  * A's bounding box contains B's.
  */
//  | { "~": GeoBBox }
//  | { "~=": GeoBBox }
;
export const GeomFilterKeys = ["~","~=","@","|&>","|>>", ">>", "=", "<<|", "<<", "&>", "&<|", "&<", "&&&", "&&"] as const;
export const GeomFilter_Funcs =  [
  "ST_MakeEnvelope", 
  "st_makeenvelope", 
  "ST_MakePolygon",
  "st_makepolygon",
] as const;

// export type AnyObject = { [key: string]: AllowedTSTypes };
export type AnyObject = { [key: string]: any };

// PG will try to cast strings to appropriate type
export type CastFromTSToPG<T extends AllowedTSType> = 
  T extends number ? (T | string) 
: T extends string ? (T | number | Date) 
: T extends boolean ? (T | string)
: T extends Date ? (T | string)
: T

export type FilterDataType<T extends AllowedTSType> = 
  T extends string ? TextFilter
: T extends number ? CompareFilter<CastFromTSToPG<T>>
: T extends boolean ? CompareFilter<CastFromTSToPG<T>>
: T extends Date ? CompareFilter<CastFromTSToPG<T>>
: T extends any[] ? ArrayFilter<T>
: (CompareFilter<T> | TextFilter | GeomFilter)
;

export const EXISTS_KEYS = ["$exists", "$notExists", "$existsJoined", "$notExistsJoined"] as const;
export type EXISTS_KEY = typeof EXISTS_KEYS[number];

/**
 * { 
 *    $filter: [
 *      { $funcName: [...args] },
 *      operand,
 *      value | funcFilter
 *    ] 
 * }
 */
export const COMPLEX_FILTER_KEY = "$filter" as const;
export type ComplexFilter = Record<typeof COMPLEX_FILTER_KEY, [
  { [funcName: string]: any[] },
  typeof CompareFilterKeys[number]?,
  any?
]>; 

/**
 * Shortened filter operands
 */
 type BasicFilter<Field extends string, DataType extends any> = Partial<{
  [K in Extract<typeof CompareFilterKeys[number], string> as `${Field}.${K}`]: CastFromTSToPG<DataType>
}> | Partial<{
  [K in Extract<typeof CompareInFilterKeys[number], string> as `${Field}.${K}`]: CastFromTSToPG<DataType>[]
}>;
type StringFilter<Field extends string, DataType extends any> = BasicFilter<Field, DataType> & (Partial<{
  [K in Extract<typeof TextFilterKeys[number], string> as `${Field}.${K}`]: DataType
}> | Partial<{
  [K in Extract<typeof TextFilterFTSKeys[number], string> as `${Field}.${K}`]: any
}>);
export type ValueOf<T> = T[keyof T];

type ShorthandFilter<Obj extends Record<string, any>> = ValueOf<{
  [K in keyof Obj]: Obj[K] extends string? StringFilter<K, Required<Obj>[K]> : BasicFilter<K, Required<Obj>[K]>;
}>


export type EqualityFilter<T extends AnyObject> = {
  [K in keyof Partial<T>]: CastFromTSToPG<T[K]>;
};

/* Traverses object keys to make filter */
export type FilterForObject<T extends AnyObject = AnyObject> = 
  /* { col: { $func: ["value"] } } */
  | {
    [K in keyof Partial<T>]: FilterDataType<T[K]>
  } & Partial<ComplexFilter>
  /**
   * Filters with shorthand notation
   * @example: { "name.$ilike": 'abc' }
   */
  | ShorthandFilter<T>
;

export type ExistsFilter<S = void> = Partial<{ 
  [key in EXISTS_KEY]: S extends DBSchema? 
    ExactlyOne<{ 
      [tname in keyof S]: 
       | FullFilter<S[tname]["columns"], S> 
       | {
          path: RawJoinPath[];
          filter: FullFilter<S[tname]["columns"], S> 
        }
    }> : any
    /** ExactlyOne does not for any type. This produces error */
    // ExactlyOne<{ 
    //   [key: string]: FullFilter<AnyObject,S> 
    // }>
}>; 

 
/**
 * Filter that relates to a single column { col: 2 } or
 * an exists filter: { $exists: {  } }
 */
export type FilterItem<T extends AnyObject = AnyObject> = 
  | FilterForObject<T> 


export type AnyObjIfVoid<T extends AnyObject | void> = T extends AnyObject? T : AnyObject;
/**
 * Full filter
 * @example { $or: [ { id: 1 }, { status: 'live' } ] }
 */
export type FullFilter<T extends AnyObject | void, S extends DBSchema | void> = 
 | { $and: FullFilter<T, S>[] } 
 | { $or: FullFilter<T, S>[] } 
 | FilterItem<AnyObjIfVoid<T>> 
 | ExistsFilter<S>
 | ComplexFilter

 /** Not implemented yet */
//  | { $not: FilterItem<T>  }
;

/**
 * Simpler FullFilter to reduce load on compilation
 */
export type FullFilterBasic<T = { [key: string]: any }> = {
  [key in keyof Partial<T & { [key: string]: any }>]: any
}


/** Type checks */


type RR = {
  h?: string[];
  id?: number;
  name?: string | null;
}

const _f: FilterItem<RR> = {
   "h.$eq": ["2"] 
}
const forcedFilter: FullFilter<RR, {}> = {
// "h.$eq": ["2"]
  $and: [
    { "h.$eq": [] },
    { h: { "$containedBy": [] } }
  ]
}
const _f2: FilterItem<RR> = {
   $filter: [{ $funcName: ["colname", "opts"] }, ">", 2] 
}