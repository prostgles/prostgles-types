import { describe, test } from "node:test";
import { defineJoin } from "./joinHelpers";
import type {
  AnyObject,
  DBHandler,
  DBSchema,
  ExistsFilter,
  FullFilter,
  InsertDataWithNested,
  Select,
  SelectParams,
  SelectTyped,
  SQLHandler,
  TableHandler,
} from "./index";

describe("type tests", () => {
  test("explicit joined select inference", () => {
    type Schema = {
      orders: { select: true; columns: { id: number } };
      customers: {
        select: true;
        columns: { id: number; name: string; phone?: string | null };
      };
    };
    const db = {} as DBHandler<Schema>;
    async () => {
      const customerJoinDef = defineJoin({
        $leftJoin: "customers",
        select: { name: 1, phone: 1 },
      });
      const rows = await db.orders.find(
        {},
        {
          select: {
            id: 1,
            customer: customerJoinDef,
            total: { $count: ["id"] },
          },
        },
      );
      rows[0]!.customer[0]!.name satisfies string;
      rows[0]!.customer[0]!.phone satisfies string | null;
      // @ts-expect-error selected fields must retain their types (and cannot be any)
      rows[0]!.customer[0]!.name satisfies number;
      // @ts-expect-error unselected fields must be absent
      rows[0]!.customer[0]!.id;
      // @ts-expect-error joins return arrays
      rows[0]!.customer.name;
      rows[0]!.total satisfies number; // Existing function behavior stays any.

      const row = await db.orders.findOne(
        {},
        {
          select: {
            customer: defineJoin({
              $innerJoin: ["orders", { table: "customers" }],
              select: { phone: 0 },
            }),
          },
        },
      );
      row?.customer[0]!.name satisfies string | undefined;
      // @ts-expect-error excluded fields must be absent
      row?.customer[0]!.phone;

      const nested = await db.orders.find(
        {},
        {
          select: {
            customer: defineJoin({
              $leftJoin: "customers",
              select: {
                name: 1,
                orders: defineJoin({ $innerJoin: "orders", select: "*" }),
              },
            }),
          },
        },
      );
      nested[0]!.customer[0]!.orders[0]!.id satisfies number;
      // @ts-expect-error nested column cannot become any
      nested[0]!.customer[0]!.orders[0]!.id satisfies string;
      const arrays = await db.orders.find(
        {},
        {
          select: {
            customer: defineJoin({ $leftJoin: "customers", select: ["name"] }),
          },
        },
      );
      arrays[0]!.customer[0]!.name satisfies string;
      // @ts-expect-error array selections exclude other columns
      arrays[0]!.customer[0]!.id;

      const booleans = await db.orders.find(
        {},
        {
          select: {
            customer: defineJoin({
              $leftJoin: "customers",
              select: { name: true },
            }),
            withoutPhone: defineJoin({
              $leftJoin: "customers",
              select: { phone: false },
            }),
          },
        },
      );
      booleans[0]!.customer[0]!.name satisfies string;
      // @ts-expect-error boolean selections retain column types
      booleans[0]!.customer[0]!.name satisfies number;
      // @ts-expect-error boolean exclusions remove columns
      booleans[0]!.withoutPhone[0]!.phone;

      const dynamicPath: string[] = ["customers"];
      const fallback = await db.orders.find(
        {},
        {
          select: {
            customer: defineJoin({ $leftJoin: dynamicPath, select: "*" }),
          },
        },
      );
      // Dynamic paths still return usable arrays, not never.
      fallback[0]!.customer.push({ name: "Customer" });
    };
  });

  test("forward nested inputs", () => {
    type Schema = {
      orders: { columns: { customer_id: number; unrelated_id: number } };
      customers: {
        columns: { name: string; phone?: string | null };
        referencedBy: { orders: ["customer_id"] };
      };
    };
    type Input = InsertDataWithNested<Schema["orders"]["columns"], Schema, "orders">;
    const customer = { name: "Customer", phone: null };
    const valid: Input = { customer_id: customer, unrelated_id: 1 };
    // @ts-expect-error unrelated columns do not allow nested objects
    const unrelated: Input = { customer_id: 1, unrelated_id: customer };
    // @ts-expect-error nested required fields remain required
    const missing: Input = { customer_id: { phone: null }, unrelated_id: 1 };
  });
  test("JSON merge input types", () => {
    type Input = InsertDataWithNested<
      {
        json: { name: string };
        nullable?: { name: string } | null;
        mixed: string | { name: string };
        numeric: number;
        text: string;
        boolean: boolean;
        date: Date;
        untyped: unknown;
      },
      void
    >;
    const merge = { $merge: [{ name: "Updated" }] };
    const input: Input = {
      json: merge,
      nullable: merge,
      mixed: merge,
      numeric: "1",
      text: 1,
      boolean: "true",
      date: "2026-01-01",
      untyped: merge,
    };
    input.json = { name: "Original" };
    input.nullable = null;
    input.nullable = undefined;
    input.mixed = "text";
    // @ts-expect-error numeric columns do not support JSON merge
    input.numeric = merge;
    // @ts-expect-error text columns do not support JSON merge
    input.text = merge;
    // @ts-expect-error boolean columns do not support JSON merge
    input.boolean = merge;
    // @ts-expect-error dates do not support JSON merge
    input.date = merge;
    // @ts-expect-error ordinary JSON values still require their declared fields
    input.json = { other: "value" };
  });
  test("TableHandler", () => {
    /**
     * Test select/return type inference
     */
    async () => {
      type DBOFullyTyped<Schema = void> =
        Schema extends DBSchema ?
          {
            [tov_name in keyof Schema]: TableHandler<Schema[tov_name]["columns"], Schema>;
          }
        : Record<string, TableHandler>;

      type GSchema = {
        tbl1: {
          is_view: false;
          columns: {
            h: number;
            b?: number;
            c?: string;
          };
          delete: true;
          select: true;
          insert: true;
          update: true;
        };
      };

      const tblTyped = {} as TableHandler<GSchema["tbl1"]["columns"], GSchema>;
      let tblGeneric = {} as TableHandler;
      tblGeneric = tblTyped;

      const dbTyped = {} as DBHandler<GSchema>;
      let dbGeneric = {} as DBHandler;
      dbGeneric = dbTyped;

      const dbo = {} as DBOFullyTyped<GSchema>;
      // type SchemaDef = { h: number; b?: number; c?: number; }
      const tableHandler = dbo.tbl1; //: TableHandler<TableDef> = undefined as any;
      const params: SelectParams<GSchema["tbl1"]["columns"]> = {
        select: {
          "*": 1,
          bd: { $max: ["b"] },
          joined_table: { ids: { $array_agg: ["joined_field"] } },
        },
      };

      const f: FullFilter<{ a: string | null; num: number }, {}> = {
        $and: [{ a: "d", num: { ">": 232 } }, { num: 2 }],
      };

      if (tableHandler) {
        const newRow = await tableHandler.insert?.({ h: 2, c: 1 }, { returning: { b: 1, c: 1 } });
        newRow.b;
        newRow.c;

        //@ts-expect-error
        newRow.h;

        // const f: FullFilter<Partial<{ a: number; s: string}>> = {  }
        const row = await tableHandler.findOne?.({ c: { $nin: [""] } }, { select: { b: 0 } });
        row?.c;
        row?.h;

        const query = await tableHandler.find?.({ h: 2 }, { returnType: "statement" });
        query.toUpperCase();

        // /** TODO: Sort by computed funnc */
        // tableHandler.find?.(
        //   { h: 2 },
        //   {
        //     select: { b: 1, computed: { $max: ["b"] } },
        //     orderBy: { key: "b", asc: false },
        //   }
        // );

        //@ts-expect-error
        row.b;

        const vals = await tableHandler.find?.({ c: { $nin: ["2"] } }, { returnType: "values" });
        const vals2 = await tableHandler.find?.(
          { c: { $nin: ["2"] } },
          { select: { h: 1 }, returnType: "values" },
        );
        vals2[0]?.toExponential();

        const valsOptional = await tableHandler.find?.(
          {},
          { select: { b: 1 }, returnType: "values" },
        );
        const starSelect = await tableHandler.find?.(
          {},
          {
            select: {
              "*": 1,
              bd: { $max: ["b"] },
              joined_table: { ids: { $array_agg: ["joined_field"] } },
            },
          },
        );

        starSelect[0]?.bd;
        starSelect[0]?.joined_table.at(0);

        //@ts-expect-error
        row.b;

        tableHandler.subscribe({ h: 2 }, { select: { b: 1 } }, async (rows) => {
          const row = rows[0];
          row?.b;

          //@ts-expect-error
          row.c;
        });

        tableHandler.subscribeOne({ h: 2 }, { select: { b: 0 } }, async (row) => {
          //@ts-expect-error
          row.b;

          //@ts-expect-error
          row.c;

          row?.c;
        });
      }
      const s1: Select<AnyObject> = {
        val: { $template_string: ["$template_string"] },
      };

      const sqlHandler = {} as SQLHandler;
      if (sqlHandler) {
        const full = await sqlHandler("SELECT 1", {});
        full.rows.flatMap;
        full.fields.find((f) => f.tsDataType === "string");

        const value = await sqlHandler("SELECT 1", {}, { returnType: "value" });
        value;

        const values = await sqlHandler("SELECT 1", {}, { returnType: "values" });
        values.flatMap;

        const row = await sqlHandler("SELECT 1", {}, { returnType: "row" });
        row?.dhawjpeojfgrdfhoeisj;

        /** TODO */
        // const typedRow = await sqlHandler<{ a: number }>("SELECT 1", {}, { returnType: "row" });
        // typedRow?.rows[0]?.split satisfies number | undefined;

        const rows = await sqlHandler("SELECT 1", {}, { returnType: "rows" });
        rows.flatMap;

        const handles = await sqlHandler("SELECT 1", {}, { returnType: "noticeSubscription" });
        <Function>handles.addListener;
        <string>handles.socketChannel;
        <string>handles.socketUnsubChannel;

        const listenHandlesOrData = await sqlHandler("SELECT 1", {}, { allowListen: true });

        if ("command" in listenHandlesOrData) {
          <string>listenHandlesOrData.command;
          <number>listenHandlesOrData.duration;
        } else {
          // @ts-expect-error
          <string>listenHandlesOrData.command;

          <Function>handles.addListener;
          <string>handles.socketChannel;
          <string>handles.socketUnsubChannel;
        }
      }

      const db = {} as DBHandler<{
        table1: {
          is_view: false;
          select: true;
          insert: true;
          update: false;
          columns: { c1: string; c2?: number };
        };
        view1: {
          select: true;
          columns: { c1: string; c2: number };
        };
        table2: {
          update: true;
          columns: { c1: string; c2?: number };
        };
      }>;
      // const v = await db.sql<{ c: string }>(``)
      const s: SelectTyped<{ a: number; c: string }> = { a: 1 };

      // @ts-expect-error
      const s2: Select<{ a: number; c: string }, {}> = { a: 1, zz: 1 };

      // Correct function
      const s22: Select<{ a: number; c: string }, {}> = { a: 1, zz: { $max: ["c"] } };

      // Quick string func notation can only be used against existing column names
      // @ts-expect-error
      const s3: Select<{ a: number; c: string }, {}> = { a: 1, cc: "2" };

      const s33: Select<{ a: number; c: string }, {}> = { a: 1, c: "$max" };

      db.view1.find({}, { select: { c1: 1, c2: 1, table1: "*" } }).then((data) => {
        data[0]?.c1 satisfies string | undefined;
        data[0]?.c2 satisfies number | undefined;
      });
      db.table1.insert({ c1: "2" }, { returning: { c1: 1, c2: "func", dwad: { dwada: [] } } });

      //@ts-expect-error
      db.table1.update;

      //@ts-expect-error
      db.table12.update;

      db.table1.find;

      const data = await db.view1.findOne({}, { select: { c1: 1, view1: { id: 1 } } });

      data?.c1 satisfies string | undefined;
      data?.view1 satisfies { c1: string; c2: number } | undefined;

      const result = await db.table2.update({}, { c1: "" }, { returning: "*" });
      result?.at(0)?.c2 ?? 0 + 2;

      type SampleSchema = {
        tbl1: {
          columns: {
            col1: number;
            col2: string | null;
          };
        };
        tbl11: {
          columns: {
            col11: number;
            col21: string | null;
          };
        };
      };

      // const ff: FullFilter<SampleSchema["tbl1"]["columns"], SampleSchema> = {
      //   AnyObject
      // }

      const ef: ExistsFilter<SampleSchema> = {
        $existsJoined: {
          // tbl1: {"col1.$eq": 1 }
          tbl11: {
            // "col11.$eq": 1,
            // col11: { "=": 1, $between: [1, 2] }
          },
        },
      };

      const emptyExists: ExistsFilter<SampleSchema> = {
        $existsJoined: {
          tbl1: {},
        },
      };

      /** Typed DBSchema works */
      const dTyped = {
        col1: 1,
        col2: 2,
        tbl11: [
          {
            col11: 1,
            col21: "2",
          },
        ],
      } satisfies InsertDataWithNested<SampleSchema["tbl1"]["columns"], SampleSchema>;

      /** Untyped DBSchema works */
      const dUntyped = { named: "John", email: "", dwada: [] } satisfies InsertDataWithNested<
        Record<string, any>,
        {
          [x: string]: {
            columns: Record<string, any>;
          };
        }
      >;
    };
  });
});
