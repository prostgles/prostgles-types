"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getJSONSchemaObject = exports.DATA_TYPES = exports.PrimitiveArrayTypes = exports.PrimitiveTypes = void 0;
exports.getJSONBSchemaAsJSONSchema = getJSONBSchemaAsJSONSchema;
const util_1 = require("./util");
exports.PrimitiveTypes = [
    "boolean",
    "number",
    "integer",
    "string",
    "Date",
    "time",
    "timestamp",
    "any",
];
exports.PrimitiveArrayTypes = exports.PrimitiveTypes.map((v) => `${v}[]`);
exports.DATA_TYPES = [...exports.PrimitiveTypes, ...exports.PrimitiveArrayTypes];
/** tests */
const t = [{ a: 2 }];
/** StrictUnion was removed because it doesn't work with object | string */
const _oneOf = {
    a: "a",
};
const _a = {
    a: 2,
};
const _r = {
    a: [2],
    b: [221],
};
const _dd = {
    enum: [1],
    type: "any",
};
const s = {
    type: {
        a: { type: "boolean" },
        c: { type: { c1: { type: "string" } } },
        arr: { arrayOfType: { d: "string" } },
        o: {
            oneOfType: [{ z: { type: "integer" } }, { z1: { type: "integer" } }],
        },
    },
}; // satisfies JSONB.JSONBSchema;
const _ss = {
    a: true,
    arr: [{ d: "" }],
    c: {
        c1: "",
    },
    o: { z1: 23 },
};
const getJSONSchemaType = (rawType) => {
    if (!rawType)
        return;
    const type = rawType.endsWith("[]") ? rawType.slice(0, -2) : rawType;
    return {
        type: type === "integer" ? "integer"
            : type === "boolean" ? "boolean"
                : type === "number" ? "number"
                    : type === "any" ? undefined
                        : type === "Lookup" ? undefined
                            : "string",
        isArray: rawType.endsWith("[]"),
    };
};
const getJSONSchemaObject = (rawType, rootInfo) => {
    const { type, arrayOf, arrayOfType, description, nullable, oneOf, oneOfType, title, record, ...t } = typeof rawType === "string" ? { type: rawType } : rawType;
    let result = {};
    const partialProps = {
        ...((t.enum ||
            (t.allowedValues?.length && (typeof type !== "string" || !type.endsWith("[]")))) && {
            enum: t.allowedValues?.slice(0) ?? t.enum.slice(0),
        }),
        ...(!!description && { description }),
        ...(!!title && { title }),
    };
    if (t.enum?.length) {
        const firstElemType = typeof t.enum[0];
        partialProps.type =
            firstElemType === "number" ? "number"
                : firstElemType === "boolean" ? "boolean"
                    : "string";
    }
    if (typeof type === "string" || arrayOf || arrayOfType) {
        /** ARRAY */
        if (type && typeof type !== "string") {
            throw "Not expected";
        }
        if (arrayOf || arrayOfType || type?.endsWith("[]")) {
            const arrayItems = arrayOf || arrayOfType ? (0, exports.getJSONSchemaObject)(arrayOf || { type: arrayOfType })
                : type?.startsWith("any") ? { type: undefined }
                    : {
                        type: getJSONSchemaType(type)?.type,
                        ...(t.allowedValues && { enum: t.allowedValues.slice(0) }),
                    };
            result = {
                type: "array",
                items: arrayItems,
            };
            /** PRIMITIVES */
        }
        else {
            result = {
                type: getJSONSchemaType(type)?.type,
            };
        }
        /** OBJECT */
    }
    else if ((0, util_1.isObject)(type)) {
        result = {
            type: "object",
            required: (0, util_1.getKeys)(type).filter((k) => {
                const t = type[k];
                return typeof t === "string" || !t.optional;
            }),
            properties: (0, util_1.getObjectEntries)(type).reduce((a, [k, v]) => {
                return {
                    ...a,
                    [k]: (0, exports.getJSONSchemaObject)(v),
                };
            }, {}),
        };
    }
    else if (oneOf || oneOfType) {
        const _oneOf = oneOf || oneOfType.map((type) => ({ type }));
        result = {
            oneOf: _oneOf.map((t) => (0, exports.getJSONSchemaObject)(t)),
        };
    }
    else if (record) {
        result = {
            type: "object",
            ...(record.values &&
                !record.keysEnum && { additionalProperties: (0, exports.getJSONSchemaObject)(record.values) }),
            ...(record.keysEnum && {
                properties: record.keysEnum.reduce((a, v) => ({
                    ...a,
                    [v]: !record.values ? { type: {} } : (0, exports.getJSONSchemaObject)(record.values),
                }), {}),
            }),
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
                oneOf: [result, nullDef],
            };
    }
    const rootSchema = !rootInfo ? undefined : ({
        $id: rootInfo?.id,
        $schema: "https://json-schema.org/draft/2020-12/schema",
    });
    return {
        ...rootSchema,
        ...partialProps,
        ...result,
    };
};
exports.getJSONSchemaObject = getJSONSchemaObject;
function getJSONBSchemaAsJSONSchema(tableName, colName, schema) {
    return (0, exports.getJSONSchemaObject)(schema, { id: `${tableName}.${colName}` });
}
//# sourceMappingURL=jsonb.js.map