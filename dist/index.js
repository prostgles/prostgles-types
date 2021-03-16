"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asName = exports.WAL = exports.isEmpty = exports.unpatchText = exports.getTextPatch = exports.CHANNELS = exports.AGGREGATION_FUNCTIONS = exports.FIELD_FILTER_TYPES = void 0;
exports.FIELD_FILTER_TYPES = ["$ilike", "$gte"];
exports.AGGREGATION_FUNCTIONS = ["$max", "$min", "$count"];
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
Object.defineProperty(exports, "getTextPatch", { enumerable: true, get: function () { return util_1.getTextPatch; } });
Object.defineProperty(exports, "unpatchText", { enumerable: true, get: function () { return util_1.unpatchText; } });
Object.defineProperty(exports, "isEmpty", { enumerable: true, get: function () { return util_1.isEmpty; } });
Object.defineProperty(exports, "WAL", { enumerable: true, get: function () { return util_1.WAL; } });
Object.defineProperty(exports, "asName", { enumerable: true, get: function () { return util_1.asName; } });
//# sourceMappingURL=index.js.map