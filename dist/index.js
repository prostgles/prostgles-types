"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CONTENT_TYPE_TO_EXT = exports.getKeys = exports.isObject = exports.isDefined = exports.get = exports.WAL = exports.unpatchText = exports.stableStringify = exports.isEmpty = exports.getTextPatch = exports.omitKeys = exports.pickKeys = exports.asName = exports.RULE_METHODS = exports.CHANNELS = exports.JOIN_PARAMS = exports.JOIN_KEYS = exports.TS_PG_Types = exports._PG_geometric = exports._PG_postgis = exports._PG_date = exports._PG_bool = exports._PG_json = exports._PG_numbers = exports._PG_strings = void 0;
exports._PG_strings = [
    'bpchar', 'char', 'varchar', 'text', 'citext', 'uuid', 'bytea', 'time', 'timetz', 'interval', 'name',
    'cidr', 'inet', 'macaddr', 'macaddr8', "int4range", "int8range", "numrange",
    'tsvector'
];
exports._PG_numbers = ['int2', 'int4', 'int8', 'float4', 'float8', 'numeric', 'money', 'oid'];
exports._PG_json = ['json', 'jsonb'];
exports._PG_bool = ['bool'];
exports._PG_date = ['date', 'timestamp', 'timestamptz'];
exports._PG_postgis = ['geometry', 'geography'];
exports._PG_geometric = [
    "point",
    "line",
    "lseg",
    "box",
    "path",
    "polygon",
    "circle",
];
const TS_PG_PRIMITIVES = {
    "string": [...exports._PG_strings, ...exports._PG_date, "lseg"],
    "number": exports._PG_numbers,
    "boolean": exports._PG_bool,
};
exports.TS_PG_Types = {
    ...TS_PG_PRIMITIVES,
    "number[]": TS_PG_PRIMITIVES.number.map(s => `_${s}`),
    "boolean[]": TS_PG_PRIMITIVES.boolean.map(s => `_${s}`),
    "string[]": TS_PG_PRIMITIVES.string.map(s => `_${s}`),
    "any[]": exports._PG_json.map(s => `_${s}`),
};
exports.JOIN_KEYS = ["$innerJoin", "$leftJoin"];
exports.JOIN_PARAMS = ["select", "filter", "$path", "$condition", "offset", "limit", "orderBy"];
const preffix = "_psqlWS_.";
exports.CHANNELS = {
    SCHEMA_CHANGED: preffix + "schema-changed",
    SCHEMA: preffix + "schema",
    DEFAULT: preffix,
    SQL: `${preffix}sql`,
    METHOD: `${preffix}method`,
    NOTICE_EV: `${preffix}notice`,
    LISTEN_EV: `${preffix}listen`,
    REGISTER: `${preffix}register`,
    LOGIN: `${preffix}login`,
    LOGOUT: `${preffix}logout`,
    AUTHGUARD: `${preffix}authguard`,
    CONNECTION: `${preffix}connection`,
    _preffix: preffix,
};
exports.RULE_METHODS = {
    "getColumns": ["getColumns"],
    "getInfo": ["getInfo"],
    "insert": ["insert", "upsert"],
    "update": ["update", "upsert", "updateBatch"],
    "select": ["findOne", "find", "count", "size"],
    "delete": ["delete", "remove"],
    "sync": ["sync", "unsync"],
    "subscribe": ["unsubscribe", "subscribe", "subscribeOne"],
};
var util_1 = require("./util");
Object.defineProperty(exports, "asName", { enumerable: true, get: function () { return util_1.asName; } });
Object.defineProperty(exports, "pickKeys", { enumerable: true, get: function () { return util_1.pickKeys; } });
Object.defineProperty(exports, "omitKeys", { enumerable: true, get: function () { return util_1.omitKeys; } });
Object.defineProperty(exports, "getTextPatch", { enumerable: true, get: function () { return util_1.getTextPatch; } });
Object.defineProperty(exports, "isEmpty", { enumerable: true, get: function () { return util_1.isEmpty; } });
Object.defineProperty(exports, "stableStringify", { enumerable: true, get: function () { return util_1.stableStringify; } });
Object.defineProperty(exports, "unpatchText", { enumerable: true, get: function () { return util_1.unpatchText; } });
Object.defineProperty(exports, "WAL", { enumerable: true, get: function () { return util_1.WAL; } });
Object.defineProperty(exports, "get", { enumerable: true, get: function () { return util_1.get; } });
Object.defineProperty(exports, "isDefined", { enumerable: true, get: function () { return util_1.isDefined; } });
Object.defineProperty(exports, "isObject", { enumerable: true, get: function () { return util_1.isObject; } });
Object.defineProperty(exports, "getKeys", { enumerable: true, get: function () { return util_1.getKeys; } });
__exportStar(require("./filters"), exports);
var files_1 = require("./files");
Object.defineProperty(exports, "CONTENT_TYPE_TO_EXT", { enumerable: true, get: function () { return files_1.CONTENT_TYPE_TO_EXT; } });
__exportStar(require("./jsonb"), exports);
//# sourceMappingURL=index.js.map