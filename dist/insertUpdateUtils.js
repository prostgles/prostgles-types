"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FUNC_ENDING_HINT = void 0;
exports.FUNC_ENDING_HINT = "$func";
const basic = {
    col1: 2,
    col2: "2",
};
const funcs = {
    col1: { $merge: [] },
    col2: { $merge: [] },
};
const mixed = {
    col1: 2,
    col2: { $merge: [] },
};
const badKey = {
    //@ts-expect-error
    badkey: { func: [] },
};
//@ts-expect-error
const wrong = {
    col2: { $merge: [] },
};
//# sourceMappingURL=insertUpdateUtils.js.map