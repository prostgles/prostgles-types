"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WAL = exports.isEmpty = exports.unpatchText = exports.getTextPatch = exports.AGGREGATION_FUNCTIONS = exports.FIELD_FILTER_TYPES = void 0;
exports.FIELD_FILTER_TYPES = ["$ilike", "$gte"];
exports.AGGREGATION_FUNCTIONS = ["$max", "$min", "$count"];
var util_1 = require("./util");
Object.defineProperty(exports, "getTextPatch", { enumerable: true, get: function () { return util_1.getTextPatch; } });
Object.defineProperty(exports, "unpatchText", { enumerable: true, get: function () { return util_1.unpatchText; } });
Object.defineProperty(exports, "isEmpty", { enumerable: true, get: function () { return util_1.isEmpty; } });
Object.defineProperty(exports, "WAL", { enumerable: true, get: function () { return util_1.WAL; } });
//# sourceMappingURL=index.js.map