"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.COMPLEX_FILTER_KEY = exports.ComplexFilterComparisonKeys = exports.EXISTS_KEYS = exports.GeomFilter_Funcs = exports.GeomFilterKeys = exports.ArrayFilterOperands = exports.TextFilter_FullTextSearchFilterKeys = exports.TextFilterFTSKeys = exports.TextFilterKeys = exports.JsonbFilterKeys = exports.JsonbOperands = exports.BetweenFilterKeys = exports.CompareInFilterKeys = exports.CompareFilterKeys = void 0;
const util_1 = require("./util");
exports.CompareFilterKeys = [
    "=",
    "$eq",
    "<>",
    ">",
    "<",
    ">=",
    "<=",
    "$eq",
    "$ne",
    "$gt",
    "$gte",
    "$lt",
    "$lte",
    "$isDistinctFrom",
    "$isNotDistinctFrom",
];
exports.CompareInFilterKeys = ["$in", "$nin"];
exports.BetweenFilterKeys = ["$between", "$notBetween"];
exports.JsonbOperands = {
    "@>": {
        Operator: "@>",
        "Right Operand Type": "jsonb",
        Description: "Does the left JSON value contain the right JSON path/value entries at the top level?",
        Example: '\'{"a":1, "b":2}\'::jsonb @> \'{"b":2}\'::jsonb',
    },
    "<@": {
        Operator: "<@",
        "Right Operand Type": "jsonb",
        Description: "Are the left JSON path/value entries contained at the top level within the right JSON value?",
        Example: '\'{"b":2}\'::jsonb <@ \'{"a":1, "b":2}\'::jsonb',
    },
    "?": {
        Operator: "?",
        "Right Operand Type": "text",
        Description: "Does the string exist as a top-level key within the JSON value?",
        Example: "'{\"a\":1, \"b\":2}'::jsonb ? 'b'",
    },
    "?|": {
        Operator: "?|",
        "Right Operand Type": "text[]",
        Description: "Do any of these array strings exist as top-level keys?",
        Example: "'{\"a\":1, \"b\":2, \"c\":3}'::jsonb ?| array['b', 'c']",
    },
    "?&": {
        Operator: "?&",
        "Right Operand Type": "text[]",
        Description: "Do all of these array strings exist as top-level keys?",
        Example: "'[\"a\", \"b\"]'::jsonb ?& array['a', 'b']",
    },
    "||": {
        Operator: "||",
        "Right Operand Type": "jsonb",
        Description: "Concatenate two jsonb values into a new jsonb value",
        Example: '\'["a", "b"]\'::jsonb || \'["c", "d"]\'::jsonb',
    },
    "-": {
        Operator: "-",
        "Right Operand Type": "integer",
        Description: "Delete the array element with specified index (Negative integers count from the end). Throws an error if top level container is not an array.",
        Example: '\'["a", "b"]\'::jsonb - 1',
    },
    "#-": {
        Operator: "#-",
        "Right Operand Type": "text[]",
        Description: "Delete the field or element with specified path (for JSON arrays, negative integers count from the end)",
        Example: "'[\"a\", {\"b\":1}]'::jsonb #- '{1,b}'",
    },
    "@?": {
        Operator: "@?",
        "Right Operand Type": "jsonpath",
        Description: "Does JSON path return any item for the specified JSON value?",
        Example: "'{\"a\":[1,2,3,4,5]}'::jsonb @? '$.a[*] ? (@ > 2)'",
    },
    "@@": {
        Operator: "@@",
        "Right Operand Type": "jsonpath",
        Description: "Returns the result of JSON path predicate check for the specified JSON value. Only the first item of the result is taken into account. If the result is not Boolean, then null is returned.",
        Example: "'{\"a\":[1,2,3,4,5]}'::jsonb @@ '$.a[*] > 2'",
    },
};
exports.JsonbFilterKeys = (0, util_1.getKeys)(exports.JsonbOperands);
exports.TextFilterKeys = ["$ilike", "$like", "$nilike", "$nlike"];
exports.TextFilterFTSKeys = ["@@", "@>", "<@", "$contains", "$containedBy"];
exports.TextFilter_FullTextSearchFilterKeys = [
    "to_tsquery",
    "plainto_tsquery",
    "phraseto_tsquery",
    "websearch_to_tsquery",
];
exports.ArrayFilterOperands = [
    "@>",
    "<@",
    "=",
    "$eq",
    "$contains",
    "$containedBy",
    "&&",
    "$overlaps",
];
//  | { "|&>": GeoBBox }
//  | { "|>>": GeoBBox }
/**
 * A's bounding box contains B's.
 */
//  | { "~": GeoBBox }
//  | { "~=": GeoBBox }
exports.GeomFilterKeys = [
    "~",
    "~=",
    "@",
    "|&>",
    "|>>",
    ">>",
    "=",
    "<<|",
    "<<",
    "&>",
    "&<|",
    "&<",
    "&&&",
    "&&",
];
exports.GeomFilter_Funcs = [
    "ST_MakeEnvelope",
    "st_makeenvelope",
    "ST_MakePolygon",
    "st_makepolygon",
];
exports.EXISTS_KEYS = ["$exists", "$notExists", "$existsJoined", "$notExistsJoined"];
exports.ComplexFilterComparisonKeys = [
    ...exports.TextFilterKeys,
    ...exports.JsonbFilterKeys,
    ...exports.CompareFilterKeys,
    ...exports.BetweenFilterKeys,
    ...exports.CompareInFilterKeys,
];
exports.COMPLEX_FILTER_KEY = "$filter";
const _f = {
    "h.$eq": ["2"],
};
const forcedFilter = {
    // "h.$eq": ["2"]
    $and: [{ "h.$eq": [] }, { h: { $containedBy: [] } }],
};
const _f2 = {
    $filter: [{ $funcName: ["colname", "opts"] }, ">", 2],
};
const _d = {
    a: 2,
};
//# sourceMappingURL=filters.js.map