import type { EqualityFilter, FilterItem, FullFilter } from "./filters";
import { strict as assert } from "assert";
import { describe, test } from "node:test";

describe("filters", async () => {
  test("type checks", () => {
    /** Type checks */
    type RR = {
      h?: string[];
      id?: number;
      name?: string | null;
      z: "a" | "b" | "c";
    };

    const _f: FilterItem<RR> = {
      "h.$eq": ["2"],
      z: "a",
    };
    const forcedFilter: FullFilter<RR, {}> = {
      // "h.$eq": ["2"]
      $and: [{ "h.$eq": [] }, { h: { $containedBy: [] } }],
    };
    const _f2: FilterItem<RR> = {
      $filter: [{ $funcName: ["colname", "opts"] }, ">", 2],
    };

    const _d: EqualityFilter<{ a: number; b: string }> = {
      a: 2,
    };

    const _ffailed: FilterItem<RR> = {
      // @ts-expect-error
      z: "bz",
    };

    const fok: FilterItem<RR> = {
      z: { $ilike: "bz" },
    };
  });
});
