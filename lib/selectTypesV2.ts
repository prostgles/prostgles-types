import type { AnyObject, CommonSelect, DBSchema, SelectFunction } from ".";

type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;
type TableCols<S extends DBSchema, K extends keyof S> = Required<S[K]["columns"]>;

type JoinSelectResult<S extends DBSchema, K extends keyof S, V> =
  V extends "*" ? TableCols<S, K>[]
  : V extends Record<string, any> ? ParseSelectObject<V, TableCols<S, K>, S>[]
  : never;

export type ParseSelectObject<Sel, TD extends AnyObject, S extends DBSchema> = Expand<
  (Sel extends { "*": 1 } ? Required<TD> : {}) & {
    [K in keyof Sel as K extends "*" ? never
    : K extends keyof TD ?
      Sel[K] extends 1 | SelectFunction ?
        K
      : never
    : K extends keyof S ? K
    : Sel[K] extends SelectFunction ?
      K // <-- computed alias like "bd"
    : never]: K extends keyof TD ?
      Sel[K] extends SelectFunction ?
        any
      : Required<TD>[K]
    : K extends keyof S ? JoinSelectResult<S, K, Sel[K]>
    : Sel[K] extends SelectFunction ?
      any // <-- type of computed field
    : never;
  }
>;

type JoinSelect<S extends DBSchema, ParentK extends keyof S> = Partial<{
  [K in keyof Omit<S, ParentK>]: SelectV2<Omit<S, ParentK>, K>;
}>;

const FUNCTIONS = {
  count: { run: (colName: string) => {} },
  max: { run: (colName: string) => 1 },
  countAll: { run: () => 1 },
} as const;
type OneOf<T> = {
  [K in keyof T]: Pick<T, K> & Partial<Record<Exclude<keyof T, K>, never>>;
}[keyof T];
type Functions = typeof FUNCTIONS;
type FunctionName = keyof typeof FUNCTIONS;
type FunctionAliasedSelect = {
  [alias: string]: OneOf<{ [F in FunctionName]: Parameters<Functions[F]["run"]> }>;
};

/**
 * Functions where the first argument is a column name
 */
type ShorthandFunction = keyof Functions;

export type SelectV2<S extends DBSchema, K extends keyof S, T = S[K]["columns"]> =
  | ({ [K in keyof Partial<T>]: true | 1 | ShorthandFunction } & Omit<JoinSelect<S, K>, keyof T> &
      Omit<FunctionAliasedSelect, keyof T>)
  | { [K in keyof Partial<T>]: true | 1 | string }
  | { [K in keyof Partial<T>]: 0 | false }
  | CommonSelect
  | (keyof Partial<T>)[];

export type SelectV2ReturnType<S extends DBSchema, K extends keyof S, Sel extends SelectV2<S, K>> =
  Sel extends (keyof S[K]["columns"])[] ? { [C in Sel[number]]: S[K]["columns"][C] }
  : Sel extends "*" ? S[K]["columns"]
  : Sel extends "" ? Record<string, never>
  : Sel extends { [key: string]: any } ?
    {
      [C in keyof Sel as Sel[C] extends true | 1 ? C : never]: C extends keyof S[K]["columns"] ?
        S[K]["columns"][C]
      : never;
    } & {
      [C in keyof Sel as Sel[C] extends ShorthandFunction ? C : never]: number;
    } & {
      [C in keyof Sel as Sel[C] extends [infer ColName] ?
        ColName extends keyof S[K]["columns"] ?
          C
        : never
      : never]: number;
    } & {
      [C in keyof Sel as C extends keyof S ? never
      : Sel[C] extends { [F in FunctionName]: any } ? C
      : never]: number;
    }
  : never;

/** Tests */
type S = {
  table1: {
    select: true;
    insert: true;
    update: false;
    columns: { c1: string; c2?: number };
  };
  view1: {
    is_view: true;
    columns: { v1: string; v2: number };
  };
  table2: {
    update: true;
    columns: { c1: string; c2?: number };
  };
};
const joinedResult = {
  c1: 1,
  // view1: {
  //   v1: 1,
  //   v2: 1,
  // },
  c22: {
    count: [""],
  },
} satisfies SelectV2<S, "table1">;

const result: ParseSelectObject<
  { "*": 1; hehe: { $func: [] }; table2: { c1: 1; c2: 1 } },
  S["table1"]["columns"],
  S
> = {
  c1: "string",
  c2: 1,
  hehe: 3,
  table2: [
    {
      c1: "string",
      c2: 1,
    },
  ],
};

const result2: ParseSelectObject<{ "*": 1; table2: { "*": 1 } }, S["table1"]["columns"], S> = {
  c1: "string",
  c2: 1,
  table2: [
    {
      c1: "string",
      c2: 1,
    },
  ],
};
