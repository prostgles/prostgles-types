import { strict as assert } from "assert";
import { describe, test } from "node:test";
import { isEqual } from "./isEqual";

describe("isEqual tests", () => {
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

    assert.equal(isEqual(NaN, NaN), true);

    const obj1 = { a: 1 };
    const obj2 = { nested: obj1 };
    const obj3 = { nested: obj1 };
    assert.equal(isEqual(obj2, obj3), true);

    assert.equal(isEqual([1, 2], { 0: 1, 1: 2, length: 2 }), false);
  });

  test("isEqual special types", () => {
    assert.equal(isEqual(new Date("2024-01-01"), new Date("2024-01-01")), true);
    assert.equal(isEqual(new Date("2024-01-01"), new Date("2024-01-02")), false);

    assert.equal(isEqual(/abc/gi, /abc/gi), true);
    assert.equal(isEqual(/abc/g, /abc/i), false);

    const buffer1 = Buffer.from([1, 2, 3]);
    const buffer2 = Buffer.from([1, 2, 3]);
    const buffer3 = Buffer.from([1, 2, 4]);
    assert.equal(isEqual(buffer1, buffer2), true);
    assert.equal(isEqual(buffer1, buffer3), false);

    const arr1 = new Uint8Array([1, 2, 3]);
    const arr2 = new Uint8Array([1, 2, 3]);
    const arr3 = new Uint8Array([1, 2, 4]);
    assert.equal(isEqual(arr1, arr2), true);
    assert.equal(isEqual(arr1, arr3), false);

    const ab1 = new ArrayBuffer(4);
    const ab2 = new ArrayBuffer(4);
    const ab3 = new ArrayBuffer(8);
    const view1 = new Uint8Array(ab1);
    view1.set([1, 2, 3, 4]);
    const view2 = new Uint8Array(ab2);
    view2.set([1, 2, 3, 4]);
    const view3 = new Uint8Array(ab3);
    view3.set([1, 2, 3, 4, 5, 6, 7, 8]);
    assert.equal(isEqual(ab1, ab2), true);
    assert.equal(isEqual(ab1, ab3), false);
  });
});
