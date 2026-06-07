"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSyncChannelName = void 0;
const index_1 = require("./index");
const getSyncChannelName = ({ tableName, filter, select, }) => [index_1.CHANNEL_PREFIX, tableName, "sync", (0, index_1.stableStringify)(filter), (0, index_1.stableStringify)(select)].join(".");
exports.getSyncChannelName = getSyncChannelName;
//# sourceMappingURL=replication.js.map