import { strict as assert } from "assert";
import { describe, test } from "node:test";
import { WAL } from "./WAL";

describe("util func tests", () => {
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

          if (d[0]?.a !== "a" || d[3]?.a !== "z" || d[2]?.b !== "zbb") {
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
