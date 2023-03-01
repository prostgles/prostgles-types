"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = require("assert");
const util_1 = require("../dist/util");
const jsonb_1 = require("../dist/jsonb");
const typeTests_1 = require("./typeTests");
(0, typeTests_1.typeTestsOK)();
let error;
let failed = -1;
const vals = [
    { o: "ad awd awd awb", n: "a12b" },
    { o: "ab", n: "zzzzzzzzdqw q32e3qz" },
    { o: "ab", n: "12ab" },
    { o: "ab", n: "a12" },
    { o: "", n: "a12b" },
    { o: "ab", n: "" },
    { o: "ab", n: null },
    { o: null, n: "a12b" },
    { o: "ab123", n: "ab123" },
];
vals.map(({ o, n }, i) => {
    const patch = (0, util_1.getTextPatch)(o, n);
    const unpatched = (0, util_1.unpatchText)(o, patch);
    if (unpatched !== n) {
        failed = i;
    }
});
if (failed > -1) {
    error = { msg: "unpatchText failed for:", data: vals[failed] };
}
const jsonS = (0, jsonb_1.getJSONBSchemaAsJSONSchema)("tjson", "json", { type: {
        a: { type: "boolean" },
        arr: { enum: ["1", "2", "3"] },
        arr1: { enum: [1, 2, 3] },
        arr2: { type: "integer[]" },
        arrStr: { type: "string[]", optional: true, nullable: true },
        o: { optional: true, nullable: true, oneOfType: [
                { o1: "integer" },
                { o2: "boolean" }
            ] },
        customTables: { optional: true, arrayOfType: {
                tableName: "string",
                select: {
                    "optional": true,
                    "oneOf": [
                        "boolean",
                        { "type": { fields: "string[]" } }
                    ]
                }
            }
        }
    } });
assert_1.strict.deepEqual(jsonS, {
    $id: 'tjson.json',
    $schema: 'https://json-schema.org/draft/2020-12/schema',
    type: 'object',
    required: ['a', 'arr', 'arr1', 'arr2'],
    properties: {
        a: { type: 'boolean' },
        arr: {
            type: 'string', enum: ['1', '2', '3']
        },
        arr1: {
            type: 'number', enum: [1, 2, 3]
        },
        arr2: { type: 'array', items: { type: 'integer' } },
        arrStr: {
            oneOf: [
                { type: 'array', items: { type: 'string' } },
                { type: 'null' }
            ]
        },
        o: {
            oneOf: [
                { type: "object", required: ["o1"], properties: { o1: { type: 'integer' } } },
                { type: "object", required: ["o2"], properties: { o2: { type: 'boolean' } } },
                { type: 'null' }
            ]
        },
        customTables: {
            type: "array",
            items: {
                type: "object",
                required: ["tableName"],
                properties: {
                    tableName: { type: "string" },
                    select: {
                        oneOf: [
                            { type: "boolean" },
                            {
                                type: "object",
                                required: ["fields"],
                                properties: {
                                    fields: { type: "array", items: { type: "string" } }
                                }
                            }
                        ]
                    }
                }
            }
        }
    }
});
assert_1.strict.deepEqual((0, jsonb_1.getJSONBSchemaAsJSONSchema)("tjson", "status", {
    nullable: true,
    oneOfType: [
        { ok: { type: "string" } },
        { err: { type: "string" } },
        {
            loading: { type: {
                    loaded: { type: "number" },
                    total: { type: "number" }
                }
            }
        }
    ]
}), {
    $id: 'tjson.status',
    $schema: 'https://json-schema.org/draft/2020-12/schema',
    oneOf: [
        { type: "object", required: ["ok"], properties: { ok: { type: 'string' } } },
        { type: "object", required: ["err"], properties: { err: { type: 'string' } } },
        {
            type: "object",
            required: ["loading"],
            properties: {
                loading: {
                    required: ["loaded", "total"],
                    properties: {
                        loaded: { type: 'number' },
                        total: { type: 'number' }
                    },
                    type: 'object'
                }
            }
        },
        { type: "null" }
    ],
});
const w = new util_1.WAL({
    id_fields: ["a", "b"],
    synced_field: "c",
    onSend: async (d) => {
        if (d[0].a !== "a" || d[3].a !== "z" || d[2].b !== "zbb") {
            error = error || { msg: "WAL sorting failed", data: d };
        }
        if (error) {
            console.error(error);
            process.exit(1);
        }
        else {
            console.log("Testing successful");
            process.exit(0);
        }
    },
    throttle: 100,
    batch_size: 50
});
w.addData([
    { current: { a: "a", b: "bbb", c: "1" } },
    { current: { a: "e", b: "zbb", c: "1" } },
    { current: { a: "e", b: "ebb", c: "1" } },
    { current: { a: "z", b: "bbb", c: "1" } }
]);
//# sourceMappingURL=index.js.map