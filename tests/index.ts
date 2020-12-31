import { getTextPatch, TextPatch, unpatchText } from "../dist/util";

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
  const patch = getTextPatch(o, n) as TextPatch;
  // console.log(o, patch)
  const unpatched = unpatchText(o, patch);
  // console.log(o, unpatched, n)
  if(unpatched !== n){
    failed = i;
  }
});

if(failed > -1) {
  console.error("unpatchText failed for:", vals[failed])
  process.exit(1);
} else {
  console.log("test successful")
  process.exit(0);
}
