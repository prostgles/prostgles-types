"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isEmpty = exports.WAL = exports.unpatchText = exports.getTextPatch = exports.stableStringify = void 0;
const md5_1 = require("./md5");
function stableStringify(data, opts) {
    if (!opts)
        opts = {};
    if (typeof opts === 'function')
        opts = { cmp: opts };
    var cycles = (typeof opts.cycles === 'boolean') ? opts.cycles : false;
    var cmp = opts.cmp && (function (f) {
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
        if (node && node.toJSON && typeof node.toJSON === 'function') {
            node = node.toJSON();
        }
        if (node === undefined)
            return;
        if (typeof node == 'number')
            return isFinite(node) ? '' + node : 'null';
        if (typeof node !== 'object')
            return JSON.stringify(node);
        var i, out;
        if (Array.isArray(node)) {
            out = '[';
            for (i = 0; i < node.length; i++) {
                if (i)
                    out += ',';
                out += stringify(node[i]) || 'null';
            }
            return out + ']';
        }
        if (node === null)
            return 'null';
        if (seen.indexOf(node) !== -1) {
            if (cycles)
                return JSON.stringify('__cycle__');
            throw new TypeError('Converting circular structure to JSON');
        }
        var seenIndex = seen.push(node) - 1;
        var keys = Object.keys(node).sort(cmp && cmp(node));
        out = '';
        for (i = 0; i < keys.length; i++) {
            var key = keys[i];
            var value = stringify(node[key]);
            if (!value)
                continue;
            if (out)
                out += ',';
            out += JSON.stringify(key) + ':' + value;
        }
        seen.splice(seenIndex, 1);
        return '{' + out + '}';
    })(data);
}
exports.stableStringify = stableStringify;
;
function getTextPatch(oldStr, newStr) {
    if (!oldStr || !newStr || !oldStr.trim().length || !newStr.trim().length)
        return newStr;
    if (oldStr === newStr)
        return {
            from: 0,
            to: 0,
            text: "",
            md5: md5_1.md5(newStr)
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
        md5: md5_1.md5(newStr)
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
    if (md5Hash && md5_1.md5(res) !== md5Hash)
        throw "Patch text error: Could not match md5 hash: (original/result) \n" + original + "\n" + res;
    return res;
}
exports.unpatchText = unpatchText;
class WAL {
    constructor(args) {
        this.changed = {};
        this.sending = {};
        this.addData = (data) => {
            if (isEmpty(this.changed) && this.options.onSendStart)
                this.options.onSendStart();
            data.map(d => {
                const idStr = this.getIdStr(d);
                this.changed = this.changed || {};
                this.changed[idStr] = Object.assign(Object.assign({}, this.changed[idStr]), d);
            });
            this.sendItems();
        };
        this.isSendingTimeout = null;
        this.sendItems = () => __awaiter(this, void 0, void 0, function* () {
            const { synced_field, onSend, onSendEnd, batch_size, throttle } = this.options;
            if (this.isSendingTimeout || this.sending && !isEmpty(this.sending))
                return;
            if (!this.changed || isEmpty(this.changed))
                return;
            let batch = [];
            Object.keys(this.changed)
                .sort((a, b) => +this.changed[a][synced_field] - +this.changed[b][synced_field])
                .slice(0, batch_size)
                .map(key => {
                let item = Object.assign({}, this.changed[key]);
                this.sending[key] = item;
                batch.push(Object.assign({}, item));
                delete this.changed[key];
            });
            this.isSendingTimeout = setTimeout(() => {
                this.isSendingTimeout = undefined;
                if (!isEmpty(this.changed)) {
                    this.sendItems();
                }
            }, throttle);
            let error;
            try {
                yield onSend(batch);
            }
            catch (err) {
                error = err;
                console.error(err, batch);
            }
            this.sending = {};
            if (!isEmpty(this.changed)) {
                this.sendItems();
            }
            else {
                if (onSendEnd)
                    onSendEnd(batch, error);
            }
        });
        this.options = Object.assign({}, args);
    }
    isSending() {
        return !(isEmpty(this.sending) && isEmpty(this.changed));
    }
    getIdStr(d) {
        return this.options.id_fields.sort().map(key => `${d[key] || ""}`).join(".");
    }
    getIdObj(d) {
        let res = {};
        this.options.id_fields.sort().map(key => {
            res[key] = d[key];
        });
        return res;
    }
}
exports.WAL = WAL;
;
function isEmpty(obj) {
    for (var v in obj)
        return false;
    return true;
}
exports.isEmpty = isEmpty;
//# sourceMappingURL=util.js.map