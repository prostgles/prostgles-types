"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getJSONBSchemaAsJSONSchema = exports.JSONB = exports.DATA_TYPES = exports.PrimitiveArrayTypes = exports.PrimitiveTypes = void 0;
const util_1 = require("./util");
exports.PrimitiveTypes = ["boolean", "number", "integer", "string", "any"];
exports.PrimitiveArrayTypes = exports.PrimitiveTypes.map(v => `${v}[]`);
exports.DATA_TYPES = [
    ...exports.PrimitiveTypes,
    ...exports.PrimitiveArrayTypes
];
var JSONB;
(function (JSONB) {
    const _r = {
        a: [2],
        b: [221]
    };
    const _dd = {
        enum: [1],
        type: "any"
    };
})(JSONB = exports.JSONB || (exports.JSONB = {}));
const s = {
    type: {
        a: { type: "boolean" },
        c: { type: { c1: { type: "string" } } },
        arr: { arrayOfType: { d: "string" } },
        o: {
            oneOfType: [
                { z: { type: "integer" } },
                { z1: { type: "integer" } }
            ]
        }
    }
};
const _ss = {
    a: true,
    arr: [{ d: "" }],
    c: {
        c1: ""
    },
    o: { z1: 23 }
};
const getJSONSchemaObject = (rawType, rootInfo) => {
    const { type, arrayOf, arrayOfType, description, nullable, oneOf, oneOfType, title, record, ...t } = typeof rawType === "string" ? { type: rawType } : rawType;
    let result = {};
    const partialProps = {
        ...((t.enum || t.allowedValues?.length) && { enum: t.allowedValues ?? t.enum.slice(0) }),
        ...(!!description && { description }),
        ...(!!title && { title }),
    };
    if (t.enum?.length) {
        partialProps.type = typeof t.enum[0];
    }
    if (typeof type === "string" || arrayOf || arrayOfType) {
        if (type && typeof type !== "string") {
            throw "Not expected";
        }
        if (arrayOf || arrayOfType || type?.endsWith("[]")) {
            const arrayItems = (arrayOf || arrayOfType) ? getJSONSchemaObject(arrayOf || { type: arrayOfType }) :
                type?.startsWith("any") ? { type: undefined } :
                    {
                        type: type?.slice(0, -2),
                        ...(t.allowedValues && { enum: t.allowedValues }),
                    };
            result = {
                type: "array",
                items: arrayItems,
            };
        }
        else {
            result = {
                type: type,
            };
        }
    }
    else if ((0, util_1.isObject)(type)) {
        result = {
            type: "object",
            required: (0, util_1.getKeys)(type).filter(k => {
                const t = type[k];
                return typeof t === "string" || !t.optional;
            }),
            properties: (0, util_1.getKeys)(type).reduce((a, k) => {
                return {
                    ...a,
                    [k]: getJSONSchemaObject(type[k])
                };
            }, {}),
        };
    }
    else if (oneOf || oneOfType) {
        const _oneOf = oneOf || oneOfType.map(type => ({ type }));
        result = {
            type: "object",
            oneOf: _oneOf.map(t => getJSONSchemaObject(t))
        };
    }
    else if (record) {
        result = {
            type: "object",
            ...(record.values && !record.keysEnum && { additionalProperties: getJSONSchemaObject(record.values) }),
            ...(record.keysEnum && { properties: record.keysEnum.reduce((a, v) => ({
                    ...a,
                    [v]: !record.values ? { type: {} } : getJSONSchemaObject(record.values)
                }), {}) })
        };
    }
    if (nullable) {
        const nullDef = { type: "null" };
        if (result.oneOf) {
            result.oneOf.push(nullDef);
        }
        else if (result.enum && !result.enum.includes(null)) {
            result.enum.push(null);
        }
        else
            result = {
                type: 'object',
                oneOf: [result, nullDef]
            };
    }
    const rootSchema = !rootInfo ? undefined : {
        "$id": rootInfo?.id,
        "$schema": "https://json-schema.org/draft/2020-12/schema",
    };
    return {
        ...rootSchema,
        ...partialProps,
        ...result,
    };
};
function getJSONBSchemaAsJSONSchema(tableName, colName, schema) {
    return getJSONSchemaObject(schema, { id: `${tableName}.${colName}` });
}
exports.getJSONBSchemaAsJSONSchema = getJSONBSchemaAsJSONSchema;
//# sourceMappingURL=jsonb.js.map