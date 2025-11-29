import { describe, test } from "node:test";
import { includes } from "./includes";

describe("includes", () => {
  test("type guard works", () => {
    const d = {} as unknown;
    if (includes([1, 2, 3], d)) {
      d.toFixed();
    }

    const s = {} as unknown;
    if (includes([""], s)) {
      // @ts-expect-error
      s.toFixed();
    }
  });

  test("more type checks", () => {
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
