"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../dist/util");
let failed = -1;
const vals = [
    { o: "ad awd awd awb", n: "a12b" },
    { o: "ab", n: "zzzzzzzzdqw q32e3qz" },
    { o: "ab", n: "12ab" },
    { o: "ab", n: "a12" },
    { o: "", n: "a12b" },
    { o: "ab", n: "" },
    { o: "ab", n: null },
    { o: null, n: "a12b" },
    { o: "ab123", n: "ab123" },
];
vals.map(({ o, n }, i) => {
    const patch = util_1.getTextPatch(o, n);
    console.log(o, patch);
    const unpatched = util_1.unpatchText(o, patch);
    console.log(o, unpatched, n);
    if (unpatched !== n) {
        failed = i;
    }
});
if (failed > -1) {
    console.error("unpatchText failed for:", vals[failed]);
    process.exit(1);
}
else {
    console.log("test successful");
    process.exit(0);
}
//# sourceMappingURL=index.js.map