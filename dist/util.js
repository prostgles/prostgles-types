"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractTypeUtil = exports.isEqual = exports.reverseParsedPath = exports.reverseJoinOn = exports.getJoinHandlers = exports.tryCatchV2 = exports.tryCatch = exports.getKeys = exports.isDefined = exports.isObject = exports.getObjectEntries = exports.get = exports.isEmpty = exports.WAL = exports.unpatchText = exports.getTextPatch = exports.stableStringify = exports.includes = exports.find = exports.filter = exports.omitKeys = exports.pickKeys = exports.asName = void 0;
const md5_1 = require("./md5");
function asName(str) {
    if (str === null || str === undefined || !str.toString || !str.toString())
        throw "Expecting a non empty string";
    return `"${str.toString().replace(/"/g, `""`)}"`;
}
exports.asName = asName;
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
    return (0, exports.pickKeys)(obj, getKeys(obj).filter((k) => !exclude.includes(k)));
}
exports.omitKeys = omitKeys;
function filter(array, arrFilter) {
    return array.filter((d) => Object.entries(arrFilter).every(([k, v]) => d[k] === v));
}
exports.filter = filter;
function find(array, arrFilter) {
    return filter(array, arrFilter)[0];
}
exports.find = find;
function includes(array, elem) {
    return array.some((v) => v === elem);
}
exports.includes = includes;
function stableStringify(data, opts) {
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
exports.stableStringify = stableStringify;
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
exports.getTextPatch = getTextPatch;
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
exports.unpatchText = unpatchText;
/**
 * Used to throttle and combine updates sent to server
 * This allows a high rate of optimistic updates on the client
 */
class WAL {
    constructor(args) {
        /**
         * Instantly merged records for prepared for update
         */
        this.changed = {};
        /**
         * Batch of records (removed from this.changed) that are currently being sent
         */
        this.sending = {};
        /**
         * Historic data used to reduce data pushes from server to client
         */
        this.sentHistory = {};
        this.callbacks = [];
        this.sort = (a, b) => {
            const { orderBy } = this.options;
            if (!orderBy || !a || !b)
                return 0;
            return (orderBy
                .map((ob) => {
                /* TODO: add fullData to changed items + ensure orderBy is in select */
                if (!(ob.fieldName in a) || !(ob.fieldName in b)) {
                    throw `Replication error: \n   some orderBy fields missing from data`;
                }
                let v1 = ob.asc ? a[ob.fieldName] : b[ob.fieldName], v2 = ob.asc ? b[ob.fieldName] : a[ob.fieldName];
                let vNum = +v1 - +v2, vStr = v1 < v2 ? -1
                    : v1 == v2 ? 0
                        : 1;
                return ob.tsDataType === "number" && Number.isFinite(vNum) ? vNum : vStr;
            })
                .find((v) => v) || 0);
        };
        /**
         * Used by server to avoid unnecessary data push to client.
         * This can happen due to the same data item having been previously pushed by the client
         * @param item data item
         * @returns boolean
         */
        this.isInHistory = (item) => {
            if (!item)
                throw "Provide item";
            const itemSyncVal = item[this.options.synced_field];
            if (!Number.isFinite(+itemSyncVal))
                throw "Provided item Synced field value is missing/invalid ";
            const existing = this.sentHistory[this.getIdStr(item)];
            const existingSyncVal = existing?.[this.options.synced_field];
            if (existing) {
                if (!Number.isFinite(+existingSyncVal))
                    throw "Provided historic item Synced field value is missing/invalid";
                if (+existingSyncVal === +itemSyncVal) {
                    return true;
                }
            }
            return false;
        };
        this.addData = (data) => {
            if (isEmpty(this.changed) && this.options.onSendStart)
                this.options.onSendStart();
            data.map((d) => {
                var _a;
                const { initial, current, delta } = { ...d };
                if (!current)
                    throw "Expecting { current: object, initial?: object }";
                const idStr = this.getIdStr(current);
                this.changed ?? (this.changed = {});
                (_a = this.changed)[idStr] ?? (_a[idStr] = { initial, current, delta });
                this.changed[idStr].current = {
                    ...this.changed[idStr].current,
                    ...current,
                };
                this.changed[idStr].delta = {
                    ...this.changed[idStr].delta,
                    ...delta,
                };
            });
            this.sendItems();
        };
        this.isOnSending = false;
        this.isSendingTimeout = undefined;
        this.willDeleteHistory = undefined;
        this.sendItems = async () => {
            const { DEBUG_MODE, onSend, onSendEnd, batch_size, throttle, historyAgeSeconds = 2, } = this.options;
            // Sending data. stop here
            if (this.isSendingTimeout || (this.sending && !isEmpty(this.sending)))
                return;
            // Nothing to send. stop here
            if (!this.changed || isEmpty(this.changed))
                return;
            // Prepare batch to send
            let batchItems = [], walBatch = [], batchObj = {};
            /**
             * Prepare and remove a batch from this.changed
             */
            Object.keys(this.changed)
                .sort((a, b) => this.sort(this.changed[a].current, this.changed[b].current))
                .slice(0, batch_size)
                .map((key) => {
                let item = { ...this.changed[key] };
                this.sending[key] = { ...item };
                walBatch.push({ ...item });
                /* Used for history */
                batchObj[key] = { ...item.current };
                delete this.changed[key];
            });
            batchItems = walBatch.map((d) => {
                let result = {};
                Object.keys(d.current).map((k) => {
                    const oldVal = d.initial?.[k];
                    const newVal = d.current[k];
                    /** Send only id fields and delta */
                    if ([this.options.synced_field, ...this.options.id_fields].includes(k) ||
                        !areEqual(oldVal, newVal)) {
                        result[k] = newVal;
                    }
                });
                return result;
            });
            if (DEBUG_MODE) {
                console.log(this.options.id, " SENDING lr->", batchItems[batchItems.length - 1]);
            }
            // Throttle next data send
            if (!this.isSendingTimeout) {
                this.isSendingTimeout = setTimeout(() => {
                    this.isSendingTimeout = undefined;
                    if (!isEmpty(this.changed)) {
                        this.sendItems();
                    }
                }, throttle);
            }
            let error;
            this.isOnSending = true;
            try {
                /* Deleted data should be sent normally through await db.table.delete(...) */
                await onSend(batchItems, walBatch); //, deletedData);
                /**
                 * Keep history if required
                 */
                if (historyAgeSeconds) {
                    this.sentHistory = {
                        ...this.sentHistory,
                        ...batchObj,
                    };
                    /**
                     * Delete history after some time
                     */
                    if (!this.willDeleteHistory) {
                        this.willDeleteHistory = setTimeout(() => {
                            this.willDeleteHistory = undefined;
                            this.sentHistory = {};
                        }, historyAgeSeconds * 1000);
                    }
                }
            }
            catch (err) {
                error = err;
                console.error("WAL onSend failed:", err, batchItems, walBatch);
            }
            this.isOnSending = false;
            /* Fire any callbacks */
            if (this.callbacks.length) {
                const ids = Object.keys(this.sending);
                this.callbacks.forEach((c, i) => {
                    c.idStrs = c.idStrs.filter((id) => ids.includes(id));
                    if (!c.idStrs.length) {
                        c.cb(error);
                    }
                });
                this.callbacks = this.callbacks.filter((cb) => cb.idStrs.length);
            }
            this.sending = {};
            if (DEBUG_MODE) {
                console.log(this.options.id, " SENT lr->", batchItems[batchItems.length - 1]);
            }
            if (!isEmpty(this.changed)) {
                this.sendItems();
            }
            else {
                if (onSendEnd)
                    onSendEnd(batchItems, walBatch, error);
            }
        };
        this.options = { ...args };
        if (!this.options.orderBy) {
            const { synced_field, id_fields } = args;
            this.options.orderBy = [synced_field, ...id_fields.sort()].map((fieldName) => ({
                fieldName,
                tsDataType: fieldName === synced_field ? "number" : "string",
                asc: true,
            }));
        }
    }
    isSending() {
        const result = this.isOnSending || !(isEmpty(this.sending) && isEmpty(this.changed));
        if (this.options.DEBUG_MODE) {
            console.log(this.options.id, " CHECKING isSending ->", result);
        }
        return result;
    }
    getIdStr(d) {
        return this.options.id_fields
            .sort()
            .map((key) => `${d[key] || ""}`)
            .join(".");
    }
    getIdObj(d) {
        let res = {};
        this.options.id_fields.sort().map((key) => {
            res[key] = d[key];
        });
        return res;
    }
    getDeltaObj(d) {
        let res = {};
        Object.keys(d).map((key) => {
            if (!this.options.id_fields.includes(key)) {
                res[key] = d[key];
            }
        });
        return res;
    }
}
exports.WAL = WAL;
function isEmpty(obj) {
    for (var v in obj)
        return false;
    return true;
}
exports.isEmpty = isEmpty;
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
exports.get = get;
const getObjectEntries = (obj) => {
    return Object.entries(obj);
};
exports.getObjectEntries = getObjectEntries;
function areEqual(a, b) {
    if (a === b)
        return true;
    if (["number", "string", "boolean"].includes(typeof a)) {
        return a === b;
    }
    return JSON.stringify(a) === JSON.stringify(b);
}
function isObject(obj) {
    return Boolean(obj && typeof obj === "object" && !Array.isArray(obj));
}
exports.isObject = isObject;
function isDefined(v) {
    return v !== undefined && v !== null;
}
exports.isDefined = isDefined;
function getKeys(o) {
    return Object.keys(o);
}
exports.getKeys = getKeys;
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
const tryCatchV2 = (func) => {
    const startTime = Date.now();
    try {
        const dataOrResult = func();
        if (dataOrResult instanceof Promise) {
            return new Promise(async (resolve, reject) => {
                const result = await dataOrResult
                    .then((data) => ({ data }))
                    .catch((error) => {
                    return {
                        error,
                        hasError: true,
                    };
                });
                resolve({
                    ...result,
                    duration: Date.now() - startTime,
                });
            });
        }
        return {
            data: dataOrResult,
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
exports.tryCatchV2 = tryCatchV2;
const getJoinHandlers = (tableName) => {
    const getJoinFunc = (isLeft, expectsOne) => {
        return (filter, select, options = {}) => {
            // return makeJoin(isLeft, filter, select, expectsOne? { ...options, limit: 1 } : options);
            return {
                [isLeft ? "$leftJoin" : "$innerJoin"]: options.path ?? tableName,
                filter,
                ...omitKeys(options, ["path", "select"]),
                select,
            };
        };
    };
    return {
        innerJoin: getJoinFunc(false, false),
        leftJoin: getJoinFunc(true, false),
        innerJoinOne: getJoinFunc(false, true),
        leftJoinOne: getJoinFunc(true, true),
    };
};
exports.getJoinHandlers = getJoinHandlers;
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
const isEqual = function (x, y) {
    if (x === y) {
        return true;
    }
    else if (typeof x == "object" && x != null && typeof y == "object" && y != null) {
        if (Object.keys(x).length != Object.keys(y).length) {
            return false;
        }
        for (const prop in x) {
            if (y.hasOwnProperty(prop)) {
                if (!(0, exports.isEqual)(x[prop], y[prop])) {
                    return false;
                }
            }
            else
                return false;
        }
        return true;
    }
    else {
        return false;
    }
};
exports.isEqual = isEqual;
const extractTypeUtil = (obj, objSubType) => {
    if (Object.entries(objSubType).every(([k, v]) => obj[k] === v)) {
        return obj;
    }
    return undefined;
};
exports.extractTypeUtil = extractTypeUtil;
//# sourceMappingURL=util.js.map