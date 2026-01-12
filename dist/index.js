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
exports.CONTENT_TYPE_TO_EXT = exports.getPossibleNestedInsert = exports.defineServerFunction = exports.RULE_METHODS = exports.CHANNELS = exports.JOIN_PARAMS = exports.JOIN_KEYS = exports.postgresToTsType = exports.TS_PG_Types = exports._PG_geometric = exports._PG_postgis = exports._PG_interval = exports._PG_date = exports._PG_bool = exports._PG_json = exports._PG_numbers = exports._PG_numbers_str = exports._PG_numbers_num = exports._PG_strings = void 0;
const util_1 = require("./util");
const includes_1 = require("./utilFuncs/includes");
exports._PG_strings = [
    "bpchar",
    "char",
    "varchar",
    "text",
    "citext",
    "uuid",
    "bytea",
    "time",
    "timetz",
    "interval",
    "name",
    "cidr",
    "inet",
    "macaddr",
    "macaddr8",
    "int4range",
    "int8range",
    "numrange",
    "tsvector",
];
exports._PG_numbers_num = ["int2", "int4", "float4", "float8", "oid"];
exports._PG_numbers_str = ["int8", "numeric", "money"];
exports._PG_numbers = [...exports._PG_numbers_num, ...exports._PG_numbers_str];
exports._PG_json = ["json", "jsonb"];
exports._PG_bool = ["bool"];
exports._PG_date = ["date", "timestamp", "timestamptz"];
exports._PG_interval = ["interval"];
exports._PG_postgis = ["geometry", "geography"];
exports._PG_geometric = ["point", "line", "lseg", "box", "path", "polygon", "circle"];
const TS_PG_PRIMITIVES = {
    string: [
        ...exports._PG_strings,
        ...exports._PG_numbers_str,
        ...exports._PG_date,
        ...exports._PG_geometric,
        ...exports._PG_postgis,
        "lseg",
    ],
    number: exports._PG_numbers_num,
    boolean: exports._PG_bool,
    any: [...exports._PG_json, ...exports._PG_interval], // consider as any
    /** Timestamps are kept in original string format to avoid filters failing
     * TODO: cast to dates if udt_name date/timestamp(0 - 3)
     */
    // "Date": _PG_date,
};
exports.TS_PG_Types = {
    ...TS_PG_PRIMITIVES,
    "number[]": TS_PG_PRIMITIVES.number.map((s) => `_${s}`),
    "boolean[]": TS_PG_PRIMITIVES.boolean.map((s) => `_${s}`),
    "string[]": TS_PG_PRIMITIVES.string.map((s) => `_${s}`),
    "any[]": TS_PG_PRIMITIVES.any.map((s) => `_${s}`),
    // "Date[]": _PG_date.map(s => `_${s}` as const),
    // "any": [],
};
const postgresToTsType = (udt_data_type) => {
    return ((0, util_1.getKeys)(exports.TS_PG_Types).find((k) => {
        return (0, includes_1.includes)(exports.TS_PG_Types[k], udt_data_type);
    }) ?? "any");
};
exports.postgresToTsType = postgresToTsType;
exports.JOIN_KEYS = ["$innerJoin", "$leftJoin"];
exports.JOIN_PARAMS = [
    "select",
    "filter",
    "$path",
    "$condition",
    "offset",
    "limit",
    "orderBy",
];
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
    /* Auth channels */
    REGISTER: `${preffix}register`,
    LOGIN: `${preffix}login`,
    LOGOUT: `${preffix}logout`,
    AUTHGUARD: `${preffix}authguard`,
    /**
     * Used for sending any connection errors from onSocketConnect
     */
    CONNECTION: `${preffix}connection`,
    _preffix: preffix,
};
exports.RULE_METHODS = {
    getColumns: ["getColumns"],
    getInfo: ["getInfo"],
    insert: ["insert", "upsert"],
    update: ["update", "upsert", "updateBatch"],
    select: ["findOne", "find", "count", "size"],
    delete: ["delete", "remove"],
    sync: ["sync", "unsync"],
    subscribe: ["unsubscribe", "subscribe", "subscribeOne"],
};
const defineServerFunction = (args) => args;
exports.defineServerFunction = defineServerFunction;
const getPossibleNestedInsert = (column, schema, silent = true) => {
    const refs = column.references ?? [];
    const colRefs = refs
        .map((ref) => {
        const { ftable, fcols } = ref;
        const ftableInfo = schema.find((s) => s.name === ftable);
        if (!ftableInfo)
            return;
        const fcolsInfo = ftableInfo.columns.filter((c) => fcols.includes(c.name));
        if (!fcolsInfo.length)
            return;
        return {
            ref,
            fcolsInfo,
        };
    })
        .filter(util_1.isDefined);
    const [firstColRef, ...otherSingleColRefs] = colRefs ?? [];
    if (!otherSingleColRefs.length) {
        return firstColRef?.ref;
    }
    const [pkeyRef, ...otherPkeyRefs] = colRefs.filter((r) => r.fcolsInfo.some((fcolInfo) => fcolInfo.is_pkey));
    if (!otherPkeyRefs.length)
        return pkeyRef?.ref;
    if (silent)
        return;
    throw [
        "Cannot do a nested insert on column that references multiple tables.",
        "Expecting only one reference to a single primary key fcol",
    ].join("\n");
};
exports.getPossibleNestedInsert = getPossibleNestedInsert;
/**
 * Type tests
 */
() => {
    const r = 1;
    const sel1 = { id: 1, name: 1, public: 1, $rowhash: 1, added_day: { $day: [] } };
    const sel2 = {
        id: 1,
        name: 1,
        public: 1,
        $rowhash: 1,
        dsds: { d: [] },
    };
    const sel3 = "";
    const sel4 = "*";
    const sel12 = { id: 1, name: 1, public: 1, $rowhash: 1, dsds: { d: [] } };
    const sel13 = "";
    const sel14 = "*";
    const fRow = {
        $rowhash: { $in: [""] },
    };
    const emptyFilter = {};
    const sel32 = {
        dwa: 1,
    };
    const sel = {
        a: 1,
        $rowhash: 1,
        dwadwA: { dwdwa: [5] },
    };
    const sds = sel;
    const sds01 = "";
    const sds02 = "*";
    const sds03 = {};
    const sds2 = sel;
    const s001 = {
        h: { $ts_headline_simple: ["name", { plainto_tsquery: "abc81" }] },
        hh: { $ts_headline: ["name", "abc81"] },
        added: "$date_trunc_2hour",
        addedY: { $date_trunc_5minute: ["added"] },
    };
    //@ts-expect-error
    const badSel = {
        a: 1,
        b: 0,
    };
    //@ts-expect-error
    const badSel1 = {
        b: 1,
        a: 1,
    };
    const sds3 = {
        // "*": 1,
        // a: "$funcName",
        a: { dwda: [] },
        $rowhashD: { dwda: [] },
        // dwadwa: 1, //{ dwa: []}
    };
    const sel1d = {
        dwada: 1,
        $rowhash: 1,
        dwawd: { funcName: [12] },
    };
    const sel1d2 = ["a"];
    const deletePar = {
        returning: { id: 1, name: 1, public: 1, $rowhash: 1, added_day: { $day: ["added"] } },
    };
};
/** More Type tests */
async () => {
    const tableHandler = undefined;
    tableHandler.insert({ h: 1, c: 2, "b.$func": { dwa: [] } });
    const schemaFFilter = { "col1.$eq": "dd" };
    const fullFilter = schemaFFilter;
    const ffFunc = (f) => { };
    ffFunc(schemaFFilter);
    const dbo = 1;
    const funcData = { funcName: [] };
    const noRow = await dbo.tbl1.update({}, { col1: "" });
    //@ts-expect-error
    noRow.length;
    //@ts-expect-error
    noRow.col1;
    const someData = await dbo.tbl1.find({}, { select: { col1: 1 }, orderBy: { col1: -1 } });
    const noRowFunc = await dbo.tbl1.update({}, { col1: "" });
    const oneRow = await dbo.tbl1.update({}, { col1: "" }, { returning: "*", multi: false });
    //@ts-expect-error
    oneRow?.length;
    //@ts-expect-error
    oneRow.col1;
    oneRow?.col1;
    const manyRows = await dbo.tbl1.update({}, { col1: "" }, { returning: "*" });
    //@ts-expect-error
    manyRows?.col1;
    manyRows?.at(0)?.col1;
    const noIRow = await dbo.tbl1.insert({ col1: "", col2: { $func: [] } });
    //@ts-expect-error
    noIRow.length;
    //@ts-expect-error
    noIRow.col1;
    const irow = await dbo.tbl1.insert({ col1: "", col2: funcData }, { returning: "*" });
    //@ts-expect-error
    irow.length;
    irow.col1;
    const irowFunc = await dbo.tbl1.insert({ col1: funcData, col2: "" }, { returning: "*" });
    const irows = await dbo.tbl1.insert([{ col1: "", col2: "" }], { returning: "*" });
    //@ts-expect-error
    irows.col1;
    irows.length;
    const filter = {};
    const filterCheck = (f) => { };
    filterCheck(filter);
    const t = {};
    const d = t;
    const fup = (a) => { };
    fup(t);
    // const f = <A extends TableHandler["count"]>(a: A) => {};
    const f = (s) => { };
    const th = {};
    // f(th)
    const sp = { select: {} };
    const sf = (sp) => { };
    sf(sp);
    // const sub: TableHandler["count"] = dbo.tbl1.count
    /**
     * Upsert data funcs
     */
    const gdw = {
        a: { dwa: [] },
        z: { dwa: [] },
    };
    const gdwn = {
        a: 2,
        z: { dwa: [] },
    };
    const gdw1 = { a: 1, z: 2 };
    const gdw1Opt = { a: {}, z: 2 };
    const gdw2 = { a: { dwa: [] }, z: { dwa: [] } };
    //@ts-expect-error
    const missingKey = { z: 1, z: { dwa: [] } };
    //@ts-expect-error
    const missingKey2 = { z: 1 };
    // ra(schema);
};
// import { md5 } from "./md5";
// export { get, getTextPatch, unpatchText, isEmpty, WAL, WALConfig, asName } from "./util";
// export type { WALItem, BasicOrderBy, WALItemsObj, WALConfig, TextPatch, SyncTableInfo } from "./util";
__exportStar(require("./auth"), exports);
var files_1 = require("./files");
Object.defineProperty(exports, "CONTENT_TYPE_TO_EXT", { enumerable: true, get: function () { return files_1.CONTENT_TYPE_TO_EXT; } });
__exportStar(require("./filters"), exports);
__exportStar(require("./JSONBSchemaValidation/getJSONBSchemaTSTypes"), exports);
__exportStar(require("./JSONBSchemaValidation/JSONBSchema"), exports);
__exportStar(require("./JSONBSchemaValidation/JSONBSchemaValidation"), exports);
__exportStar(require("./util"), exports);
__exportStar(require("./utilFuncs/index"), exports);
//# sourceMappingURL=index.js.map