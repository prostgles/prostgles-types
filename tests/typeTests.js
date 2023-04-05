"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeTestsOK = void 0;
(async () => {
    const tableHandler = undefined;
    const params = {
        select: {
            "*": 1,
            bd: { $max: ["b"] },
            joined_table: { ids: { "$array_agg": ["joined_field"] } }
        }
    };
    const f = {
        $and: [
            { a: "d", num: { ">": 232 } },
            { "num.$eq": 2, }
        ]
    };
    if (tableHandler) {
        const newRow = await tableHandler.insert?.({ h: 2 }, { returning: { b: 1, c: 1 } });
        newRow.b;
        newRow.c;
        newRow.h;
        const row = await tableHandler.findOne?.({ "c.$nin": [2] }, { select: { b: 0 } });
        row.c;
        row.h;
        const query = await tableHandler.find?.({ h: 2 }, { returnType: "statement" });
        query.toUpperCase();
        row.b;
        const vals = await tableHandler.find?.({ "c.$nin": [2] }, { returnType: "values" });
        const vals2 = await tableHandler.find?.({ "c.$nin": [2] }, { select: { h: 1 }, returnType: "values" });
        vals2[0]?.toExponential();
        const valsOptional = await tableHandler.find?.({}, { select: { b: 1 }, returnType: "values" });
        const starSelect = await tableHandler.find?.({}, { select: { "*": 1, bd: { $max: ["b"] }, joined_table: { ids: { "$array_agg": ["joined_field"] } } } });
        starSelect[0].bd;
        starSelect[0].joined_table.at(0);
        row.b;
        tableHandler.subscribe({ h: 2 }, { select: { b: 1 } }, async (rows) => {
            const row = rows[0];
            row.b;
            row.c;
        });
        tableHandler.subscribeOne({ h: 2 }, { select: { b: 0 } }, async (row) => {
            row.b;
            row.c;
        });
    }
    const s1 = {
        val: { $template_string: ["$template_string"] }
    };
    const sqlHandler = undefined;
    if (sqlHandler) {
        const full = await sqlHandler("SELECT 1", {});
        full.rows.flatMap;
        full.fields.find(f => f.tsDataType === "string");
        const value = await sqlHandler("SELECT 1", {}, { returnType: "value" });
        value;
        const values = await sqlHandler("SELECT 1", {}, { returnType: "values" });
        values.flatMap;
        const row = await sqlHandler("SELECT 1", {}, { returnType: "row" });
        row.dhawjpeojfgrdfhoeisj;
        const rows = await sqlHandler("SELECT 1", {}, { returnType: "rows" });
        rows.flatMap;
        const handles = await sqlHandler("SELECT 1", {}, { returnType: "noticeSubscription" });
        handles.addListener;
        handles.socketChannel;
        handles.socketUnsubChannel;
        const listenHandlesOrData = await sqlHandler("SELECT 1", {}, { allowListen: true });
        if ("command" in listenHandlesOrData) {
            listenHandlesOrData.command;
            listenHandlesOrData.duration;
        }
        else {
            listenHandlesOrData.command;
            handles.addListener;
            handles.socketChannel;
            handles.socketUnsubChannel;
        }
    }
    const db = 1;
    const s = { a: 1 };
    const s2 = { a: 1, zz: 1 };
    const s22 = { a: 1, zz: { $max: ["c"] } };
    const s3 = { a: 1, cc: "2" };
    const s33 = { a: 1, c: "$max" };
    db.view1.find({ "c1.$in": ["2", null] }, { select: { c1: 1, c2: 1 } });
    db.table1.insert({ c1: "2" }, { returning: { c1: 1, c2: "func", dwad: { dwada: [] } } });
    db.table1.update;
    db.table12.update;
    db.table1.find;
    const result = await db.table2.update({}, { c1: "" }, { returning: "*" });
    result.c2 + 2;
    const sel = {
        dwa: 1
    };
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
    const ef = {
        $existsJoined: {
            tbl11: {}
        }
    };
    const emptyExists = {
        $existsJoined: {
            tbl1: {}
        }
    };
    const sel1d = {
        dwada: 1,
        $rowhash: 1,
        dwawd: { funcName: [12] }
    };
    const deletePar = {
        returning: { id: 1, name: 1, public: 1, $rowhash: 1, added_day: { "$day": ["added"] } }
    };
});
const typeTestsOK = () => { };
exports.typeTestsOK = typeTestsOK;
(() => {
    const schemaFFilter = { "col1.$eq": "dd" };
    const fullFilter = schemaFFilter;
    const ffFunc = (f) => { };
    ffFunc(schemaFFilter);
    const dbo = 1;
    const filter = {};
    const filterCheck = (f) => { };
    filterCheck(filter);
    const t = {};
    const d = t;
    const fup = (a) => { };
    fup(t);
    const f = (s) => { };
    const th = {};
    f(th);
    const ra = (a) => {
    };
    const eft = { tbl1: { "col1.$eq": '2' } };
    const fFilter = (a) => {
    };
    fFilter(eft);
    const ff2 = (a) => {
    };
    ff2({ $exists: eft });
    const sp = { select: {} };
    const sf = (sp) => {
    };
    sf(sp);
});
//# sourceMappingURL=typeTests.js.map