import { strict as assert } from "assert";
import { describe, test } from "node:test";
import { getTextPatch, TextPatch, unpatchText, WAL } from "./util";

describe("util func tests", () => {
  test("getTextPatch", () => {
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
      const patch = getTextPatch(o as any, n as any) as TextPatch;
      // console.log(o, patch)
      const unpatched = unpatchText(o, patch);
      // console.log(o, unpatched, n)
      if (unpatched !== n) {
        failed = i;
      }
    });

    let error: any;
    if (failed > -1) {
      error = { msg: "unpatchText failed for:", data: vals[failed] };
    }
    assert.equal(error, undefined);
  });

  test("WAL", async () => {
    let error: any;
    let runs = 0;

    await new Promise<boolean>((resolve) => {
      /** TEST THIS AT END - will exit process */
      const w = new WAL({
        id_fields: ["a", "b"],
        synced_field: "c",
        onSend: async (d) => {
          runs++;

          if (d[0].a !== "a" || d[3].a !== "z" || d[2].b !== "zbb") {
            error = error || { msg: "WAL sorting failed", data: d };
          }

          assert.equal(error, undefined);
          if (runs === 1) {
            resolve(true);
          }
        },
        throttle: 100,
        batch_size: 50,
      });

      w.addData([
        { current: { a: "a", b: "bbb", c: "1" } },
        { current: { a: "e", b: "zbb", c: "1" } },
        { current: { a: "e", b: "ebb", c: "1" } },
        { current: { a: "z", b: "bbb", c: "1" } },
      ]);
    });
  });
});
