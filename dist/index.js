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
exports.CONTENT_TYPE_TO_EXT = exports.RULE_METHODS = exports.CHANNELS = exports.JOIN_PARAMS = exports.JOIN_KEYS = exports.TS_PG_Types = exports._PG_geometric = exports._PG_postgis = exports._PG_interval = exports._PG_date = exports._PG_bool = exports._PG_json = exports._PG_numbers = exports._PG_strings = void 0;
exports._PG_strings = [
    'bpchar', 'char', 'varchar', 'text', 'citext', 'uuid', 'bytea', 'time', 'timetz', 'interval', 'name',
    'cidr', 'inet', 'macaddr', 'macaddr8', "int4range", "int8range", "numrange",
    'tsvector'
];
exports._PG_numbers = ['int2', 'int4', 'int8', 'float4', 'float8', 'numeric', 'money', 'oid'];
exports._PG_json = ['json', 'jsonb'];
exports._PG_bool = ['bool'];
exports._PG_date = ['date', 'timestamp', 'timestamptz'];
exports._PG_interval = ['interval'];
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
    "string": [...exports._PG_strings, ...exports._PG_date, ...exports._PG_geometric, ...exports._PG_postgis, "lseg"],
    "number": exports._PG_numbers,
    "boolean": exports._PG_bool,
    "any": [...exports._PG_json, ...exports._PG_interval],
};
exports.TS_PG_Types = {
    ...TS_PG_PRIMITIVES,
    "number[]": TS_PG_PRIMITIVES.number.map(s => `_${s}`),
    "boolean[]": TS_PG_PRIMITIVES.boolean.map(s => `_${s}`),
    "string[]": TS_PG_PRIMITIVES.string.map(s => `_${s}`),
    "any[]": TS_PG_PRIMITIVES.any.map(s => `_${s}`),
};
exports.JOIN_KEYS = ["$innerJoin", "$leftJoin"];
exports.JOIN_PARAMS = ["select", "filter", "$path", "$condition", "offset", "limit", "orderBy"];
const preffix = "_psqlWS_.";
exports.CHANNELS = {
    SCHEMA_CHANGED: preffix + "schema-changed",
    SCHEMA: preffix + "schema",
    DEFAULT: preffix,
    SQL: `${preffix}sql`,
    SQL_STREAM: `${preffix}sql-stream`,
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
(() => {
    const r = 1;
    const sel1 = { id: 1, name: 1, public: 1, $rowhash: 1, added_day: { $day: [] } };
    const sel2 = { id: 1, name: 1, public: 1, $rowhash: 1, dsds: { d: [] } };
    const sel3 = "";
    const sel4 = "*";
    const sel12 = { id: 1, name: 1, public: 1, $rowhash: 1, dsds: { d: [] } };
    const sel13 = "";
    const sel14 = "*";
    const fRow = {
        $rowhash: { "$in": [""] }
    };
    const emptyFilter = {};
    const sel32 = {
        dwa: 1
    };
    const sel = {
        a: 1,
        $rowhash: 1,
        dwadwA: { dwdwa: [5] }
    };
    const sds = sel;
    const sds01 = "";
    const sds02 = "*";
    const sds03 = {};
    const sds2 = sel;
    const s001 = {
        h: { "$ts_headline_simple": ["name", { plainto_tsquery: "abc81" }] },
        hh: { "$ts_headline": ["name", "abc81"] },
        added: "$date_trunc_2hour",
        addedY: { "$date_trunc_5minute": ["added"] },
    };
    const badSel = {
        a: 1,
        b: 0
    };
    const badSel1 = {
        b: 1,
        a: 1
    };
    const sds3 = {
        a: { dwda: [] },
        $rowhashD: { dwda: [] },
    };
    const sel1d = {
        dwada: 1,
        $rowhash: 1,
        dwawd: { funcName: [12] }
    };
    const sel1d2 = ["a"];
    const deletePar = {
        returning: { id: 1, name: 1, public: 1, $rowhash: 1, added_day: { "$day": ["added"] } }
    };
});
(async () => {
    const tableHandler = undefined;
    tableHandler.insert({ h: 1, c: 2, "b.$func": { dwa: [] } });
    const schemaFFilter = { "col1.$eq": "dd" };
    const fullFilter = schemaFFilter;
    const ffFunc = (f) => { };
    ffFunc(schemaFFilter);
    const dbo = 1;
    const funcData = { funcName: [] };
    const noRow = await dbo.tbl1.update({}, { col1: "" });
    noRow.length;
    noRow.col1;
    const noRowFunc = await dbo.tbl1.update({}, { col1: "" });
    const oneRow = await dbo.tbl1.update({}, { col1: "" }, { returning: "*", multi: false });
    oneRow?.length;
    oneRow.col1;
    oneRow?.col1;
    const manyRows = await dbo.tbl1.update({}, { col1: "" }, { returning: "*" });
    manyRows?.col1;
    manyRows?.at(0)?.col1;
    const noIRow = await dbo.tbl1.insert({ col1: "", col2: { $func: [] } });
    noIRow.length;
    noIRow.col1;
    const irow = await dbo.tbl1.insert({ col1: "", col2: funcData }, { returning: "*" });
    irow.length;
    irow.col1;
    const irowFunc = await dbo.tbl1.insert({ col1: funcData, col2: "" }, { returning: "*" });
    const irows = await dbo.tbl1.insert([{ col1: "", col2: "" }], { returning: "*" });
    irows.col1;
    irows.length;
    const filter = {};
    const filterCheck = (f) => { };
    filterCheck(filter);
    const t = {};
    const d = t;
    const fup = (a) => { };
    fup(t);
    const f = (s) => { };
    const th = {};
    const sp = { select: {} };
    const sf = (sp) => {
    };
    sf(sp);
    const gdw = {
        a: { dwa: [] },
        z: { dwa: [] }
    };
    const gdwn = {
        a: 2,
        z: { dwa: [] }
    };
    const gdw1 = { a: 1, z: 2 };
    const gdw1Opt = { a: {}, z: 2 };
    const gdw2 = { a: { dwa: [] }, z: { dwa: [] } };
    const missingKey = { z: 1, z: { dwa: [] } };
    const missingKey2 = { z: 1 };
});
var files_1 = require("./files");
Object.defineProperty(exports, "CONTENT_TYPE_TO_EXT", { enumerable: true, get: function () { return files_1.CONTENT_TYPE_TO_EXT; } });
__exportStar(require("./filters"), exports);
__exportStar(require("./jsonb"), exports);
__exportStar(require("./util"), exports);
//# sourceMappingURL=index.js.map