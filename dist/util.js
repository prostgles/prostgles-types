"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProperty = exports.getSerialisableError = exports.safeStringify = exports.extractTypeUtil = exports.reverseParsedPath = exports.reverseJoinOn = exports.tryCatch = exports.getObjectEntries = exports.isNotEmpty = exports.pickKeys = void 0;
exports.asName = asName;
exports.omitKeys = omitKeys;
exports.filter = filter;
exports.find = find;
exports.stableStringify = stableStringify;
exports.getTextPatch = getTextPatch;
exports.unpatchText = unpatchText;
exports.isEmpty = isEmpty;
exports.get = get;
exports.isObject = isObject;
exports.isDefined = isDefined;
exports.getKeys = getKeys;
const md5_1 = require("./md5");
function asName(str) {
    if (str === null || str === undefined || !str.toString || !str.toString())
        throw "Expecting a non empty string";
    return `"${str.toString().replace(/"/g, `""`)}"`;
}
const pickKeys = (obj, keys = [], onlyIfDefined = true) => {
    if (!keys.length) {
        return {};
    }
    if (obj && keys.length) {
        let res = {};
        keys.forEach((k) => {
            if (onlyIfDefined && obj[k] === undefined) {
            }
            else {
                res[k] = obj[k];
            }
        });
        return res;
    }
    return obj;
};
exports.pickKeys = pickKeys;
function omitKeys(obj, exclude) {
    //@ts-ignore
    return (0, exports.pickKeys)(obj, 
    //@ts-ignore
    getKeys(obj).filter((k) => !exclude.includes(k)));
}
function filter(array, arrFilter) {
    return array.filter((d) => Object.entries(arrFilter).every(([k, v]) => d[k] === v));
}
function find(array, arrFilter) {
    return filter(array, arrFilter)[0];
}
function stableStringify(data, opts = {}) {
    if (!opts)
        opts = {};
    if (typeof opts === "function")
        opts = { cmp: opts };
    var cycles = typeof opts.cycles === "boolean" ? opts.cycles : false;
    var cmp = opts.cmp &&
        (function (f) {
            return function (node) {
                return function (a, b) {
                    var aobj = { key: a, value: node[a] };
                    var bobj = { key: b, value: node[b] };
                    return f(aobj, bobj);
                };
            };
        })(opts.cmp);
    var seen = [];
    return (function stringify(node) {
        if (node && node.toJSON && typeof node.toJSON === "function") {
            node = node.toJSON();
        }
        if (node === undefined)
            return;
        if (typeof node == "number")
            return isFinite(node) ? "" + node : "null";
        if (typeof node !== "object")
            return JSON.stringify(node);
        var i, out;
        if (Array.isArray(node)) {
            out = "[";
            for (i = 0; i < node.length; i++) {
                if (i)
                    out += ",";
                out += stringify(node[i]) || "null";
            }
            return out + "]";
        }
        if (node === null)
            return "null";
        if (seen.indexOf(node) !== -1) {
            if (cycles)
                return JSON.stringify("__cycle__");
            throw new TypeError("Converting circular structure to JSON");
        }
        var seenIndex = seen.push(node) - 1;
        var keys = Object.keys(node).sort(cmp && cmp(node));
        out = "";
        for (i = 0; i < keys.length; i++) {
            var key = keys[i];
            var value = stringify(node[key]);
            if (!value)
                continue;
            if (out)
                out += ",";
            out += JSON.stringify(key) + ":" + value;
        }
        seen.splice(seenIndex, 1);
        return "{" + out + "}";
    })(data);
}
function getTextPatch(oldStr, newStr) {
    /* Big change, no point getting diff */
    if (!oldStr || !newStr || !oldStr.trim().length || !newStr.trim().length)
        return newStr;
    /* Return no change if matching */
    if (oldStr === newStr)
        return {
            from: 0,
            to: 0,
            text: "",
            md5: (0, md5_1.md5)(newStr),
        };
    function findLastIdx(direction = 1) {
        let idx = direction < 1 ? -1 : 0, found = false;
        while (!found && Math.abs(idx) <= newStr.length) {
            const args = direction < 1 ? [idx] : [0, idx];
            let os = oldStr.slice(...args), ns = newStr.slice(...args);
            if (os !== ns)
                found = true;
            else
                idx += Math.sign(direction) * 1;
        }
        return idx;
    }
    let from = findLastIdx() - 1, to = oldStr.length + findLastIdx(-1) + 1, toNew = newStr.length + findLastIdx(-1) + 1;
    return {
        from,
        to,
        text: newStr.slice(from, toNew),
        md5: (0, md5_1.md5)(newStr),
    };
}
function unpatchText(original, patch) {
    if (!patch || typeof patch === "string")
        return patch;
    const { from, to, text, md5: md5Hash } = patch;
    if (text === null || original === null)
        return text;
    let res = original.slice(0, from) + text + original.slice(to);
    if (md5Hash && (0, md5_1.md5)(res) !== md5Hash)
        throw ("Patch text error: Could not match md5 hash: (original/result) \n" + original + "\n" + res);
    return res;
}
function isEmpty(obj) {
    for (var v in obj)
        return false;
    return true;
}
const isNotEmpty = (obj) => !isEmpty(obj);
exports.isNotEmpty = isNotEmpty;
/* Get nested property from an object */
function get(obj, propertyPath) {
    let p = propertyPath, o = obj;
    if (!obj)
        return obj;
    if (typeof p === "string")
        p = p.split(".");
    return p.reduce((xs, x) => {
        if (xs && xs[x]) {
            return xs[x];
        }
        else {
            return undefined;
        }
    }, o);
}
const getObjectEntries = (obj) => {
    return Object.entries(obj);
};
exports.getObjectEntries = getObjectEntries;
function isObject(obj) {
    return Boolean(obj && typeof obj === "object" && !Array.isArray(obj));
}
function isDefined(v) {
    return v !== undefined && v !== null;
}
function getKeys(o) {
    return Object.keys(o);
}
/**
 * @deprecated
 * use tryCatchV2 instead
 */
const tryCatch = async (func) => {
    const startTime = Date.now();
    try {
        const res = await func();
        return {
            ...res,
            duration: Date.now() - startTime,
        };
    }
    catch (error) {
        return {
            error,
            hasError: true,
            duration: Date.now() - startTime,
        };
    }
};
exports.tryCatch = tryCatch;
const reverseJoinOn = (on) => {
    return on.map((constraint) => Object.fromEntries(Object.entries(constraint).map(([left, right]) => [right, left])));
};
exports.reverseJoinOn = reverseJoinOn;
/**
 * result = [
 *  { table, on: parsedPath[0] }
 *  ...parsedPath.map(p => ({ table: p.table, on: reversedOn(parsedPath[i+1].on) }))
 * ]
 */
const reverseParsedPath = (parsedPath, table) => {
    const newPPath = [{ table, on: [{}] }, ...(parsedPath ?? [])];
    return newPPath
        .map((pp, i) => {
        const nextPath = newPPath[i + 1];
        if (!nextPath)
            return undefined;
        return {
            table: pp.table,
            on: (0, exports.reverseJoinOn)(nextPath.on),
        };
    })
        .filter(isDefined)
        .reverse();
};
exports.reverseParsedPath = reverseParsedPath;
const extractTypeUtil = (obj, objSubType) => {
    if (Object.entries(objSubType).every(([k, v]) => obj[k] === v)) {
        return obj;
    }
    return undefined;
};
exports.extractTypeUtil = extractTypeUtil;
const safeStringify = (obj) => {
    const seen = new WeakSet();
    return JSON.stringify(obj, (key, value) => {
        if (typeof value === "object" && value !== null) {
            if (seen.has(value)) {
                return "[Circular]";
            }
            seen.add(value);
        }
        return value;
    });
};
exports.safeStringify = safeStringify;
const getSerialisableError = (rawError, includeStack = false) => {
    if (rawError === null || rawError === undefined) {
        return rawError;
    }
    if (typeof rawError === "string" ||
        typeof rawError === "boolean" ||
        typeof rawError === "bigint" ||
        typeof rawError === "undefined" ||
        typeof rawError === "number") {
        return rawError?.toString();
    }
    if (rawError instanceof DOMException) {
        return {
            name: rawError.name,
            message: rawError.message,
            code: rawError.code,
            ...(includeStack ? { stack: rawError.stack } : {}),
        };
    }
    if (rawError instanceof Error) {
        const errorObj = Object.getOwnPropertyNames(rawError).reduce((acc, key) => ({
            ...acc,
            [key]: rawError[key],
        }), {});
        const result = JSON.parse((0, exports.safeStringify)(errorObj));
        if (!includeStack) {
            return omitKeys(result, ["stack"]);
        }
        return result;
    }
    if (Array.isArray(rawError)) {
        return rawError.map((item) => (0, exports.getSerialisableError)(item, includeStack));
    }
    return rawError;
};
exports.getSerialisableError = getSerialisableError;
const getProperty = (obj, key) => {
    if (!Object.keys(obj).includes(key))
        return undefined;
    return obj[key];
};
exports.getProperty = getProperty;
//# sourceMappingURL=util.js.map