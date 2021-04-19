"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextFilter_FullTextSearchFilterKeys = exports.GeomFilter_Funcs = exports.GeomFilterKeys = exports.EXISTS_KEYS = exports.asName = exports.WAL = exports.isEmpty = exports.unpatchText = exports.getTextPatch = exports.get = exports.CHANNELS = void 0;
const preffix = "_psqlWS_.";
exports.CHANNELS = {
    SCHEMA_CHANGED: preffix + "schema-changed",
    SCHEMA: preffix + "schema",
    DEFAULT: preffix,
    SQL: `${preffix}sql`,
    METHOD: `${preffix}method`,
    REGISTER: `${preffix}register`,
    LOGIN: `${preffix}login`,
    LOGOUT: `${preffix}logout`,
    _preffix: preffix,
};
var util_1 = require("./util");
Object.defineProperty(exports, "get", { enumerable: true, get: function () { return util_1.get; } });
Object.defineProperty(exports, "getTextPatch", { enumerable: true, get: function () { return util_1.getTextPatch; } });
Object.defineProperty(exports, "unpatchText", { enumerable: true, get: function () { return util_1.unpatchText; } });
Object.defineProperty(exports, "isEmpty", { enumerable: true, get: function () { return util_1.isEmpty; } });
Object.defineProperty(exports, "WAL", { enumerable: true, get: function () { return util_1.WAL; } });
Object.defineProperty(exports, "asName", { enumerable: true, get: function () { return util_1.asName; } });
var filters_1 = require("./filters");
Object.defineProperty(exports, "EXISTS_KEYS", { enumerable: true, get: function () { return filters_1.EXISTS_KEYS; } });
Object.defineProperty(exports, "GeomFilterKeys", { enumerable: true, get: function () { return filters_1.GeomFilterKeys; } });
Object.defineProperty(exports, "GeomFilter_Funcs", { enumerable: true, get: function () { return filters_1.GeomFilter_Funcs; } });
Object.defineProperty(exports, "TextFilter_FullTextSearchFilterKeys", { enumerable: true, get: function () { return filters_1.TextFilter_FullTextSearchFilterKeys; } });
//# sourceMappingURL=index.js.map