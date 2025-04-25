import { tryCatchV2, isEqual, includes } from "./util";
import { describe, test } from "node:test";
import { strict as assert } from "assert";

describe("Utils tests", () => {
  test("tryCatchV2", () => {
    const d = tryCatchV2(async () => {
      return 2;
    });
    d.then((v) => {
      if (!v.hasError) {
        v.data.toExponential();
      } else {
        //@ts-expect-error
        v.data?.toExponential();
      }
    });

    const d2 = tryCatchV2(() => {
      return 2;
    });
    //@ts-expect-error
    d2.then;

    //@ts-expect-error
    d2.data.toExponential();

    if (!d2.hasError) {
      d2.data.toExponential();
    }
  });
  test("isEqual cirular object", () => {
    const a = { a: 1, b: 2 };
    const d = { a: 1, b: 2 };
    //@ts-expect-error
    a.b = { a };
    //@ts-expect-error
    d.b = { a: d };
    assert.equal(isEqual([a], [d]), false);
    assert.equal(isEqual(a, d), false);
  });
  test("isEqual", () => {
    const a = { a: 1, b: 2 };
    const b = { a: 1, b: 2 };
    const c = { a: 1, b: 3 };
    const d = { a: 1, b: 2, c: 3 };
    const e = { a: 1, b: 2, c: undefined };

    assert.equal(isEqual(a, b), true);
    assert.equal(isEqual(a, a), true);
    assert.equal(isEqual(a, c), false);
    assert.equal(isEqual(a, d), false);
    assert.equal(isEqual(a, e), false);

    const aa = [1, 2, 3];
    const bb = [1, 2, 3];
    const cc = [a, b, c];
    const dd = [a, b, c];
    const ee = [a, b, c, e];
    assert.equal(isEqual(a, aa), false);
    assert.equal(isEqual(aa, aa), true);
    assert.equal(isEqual(aa, bb), true);
    assert.equal(isEqual(cc, dd), true);
    assert.equal(isEqual(dd, ee), false);
    assert.equal(isEqual([{ a: { b: { c: 1 } } }], [{ a: { b: { c: 2 } } }]), false);
    assert.equal(isEqual([{ a: { b: { c: 1 } } }], [{ a: { b: { c: 1 } } }]), true);
  });
  test("includes types", () => {
    const arr = ["1", "2", "3", null, undefined] as const;

    const d: "0" | "1" = "1";
    if (includes(arr, d)) {
      d satisfies "1";
    }
    const d2: number | string = 1;
    if (includes(arr, d2)) {
      d2 satisfies 1;
    }
    const d23: any = 1;
    if (includes(arr, d23)) {
      d23 satisfies (typeof arr)[number];
    }
  });
});
