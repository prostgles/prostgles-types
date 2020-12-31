import { getTextPatch, TextPatch, unpatchText } from "../dist/util";

let failed = false;
[
  { o: "ab", n: "a12b" },
  { o: "ab", n: "12ab" },
  { o: "ab", n: "a12" },
  { o: "", n: "a12b" },
  { o: "ab", n: "" },
  { o: "ab", n: null },
  { o: null, n: "a12b" },
].map(({ o, n }, i) => {
  const patch = getTextPatch(o, n) as TextPatch;
  const unpatched = unpatchText(o, patch);
  console.log(i, patch, unpatched)
  if(unpatched !== n){
    failed = true;
    console.error("unpatchText failed for:", {o, n, patch, unpatched})
    process.exit(1);
  }
});

console.log("test successful", failed)
process.exit(0);