"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jsonbTest = void 0;
const jsonb_1 = require("../dist/jsonb");
const assert_1 = require("assert");
const jsonbTest = () => {
    const res = (0, jsonb_1.getJSONSchemaObject)({
        type: {
            scope: {
                type: "string[]",
                allowedValues: ["a", "b"]
            }
        }
    });
    assert_1.strict.deepStrictEqual(res, {
        type: "object",
        required: ["scope"],
        properties: {
            scope: {
                type: "array",
                items: {
                    type: "string",
                    enum: ["a", "b"]
                }
            }
        }
    });
};
exports.jsonbTest = jsonbTest;
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
//# sourceMappingURL=jsonbTest.js.map