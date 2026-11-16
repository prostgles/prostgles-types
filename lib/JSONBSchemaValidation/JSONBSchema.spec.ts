import { strict as assert } from "assert";
import { describe, test } from "node:test";
import { type JSONB } from "./JSONBSchema";
import { getJSONBSchemaAsJSONSchema, getJSONSchemaObject } from "./getJSONBSchemaAsJSONSchema";
import { getJSONBTSTypes } from "./getJSONBSchemaTSTypes";
import type { TableSchema } from "..";

describe("jsonb to json schema conversion", async () => {
  test("array allowedValues", () => {
    const res = getJSONSchemaObject({
      type: {
        scope: {
          type: "string[]",
          allowedValues: ["a", "b"],
        },
      },
    });
    assert.deepStrictEqual(res, {
      type: "object",
      required: ["scope"],
      properties: {
        scope: {
          type: "array",
          items: {
            type: "string",
            enum: ["a", "b"],
          },
        },
      },
    });
  });

  test("types", () => {
    const createContainerSchema = {
      type: {
        files: {
          arrayOfType: {
            name: { type: "string" },
            content: {
              type: "string",
            },
          },
        },
      },
    } as const satisfies JSONB.JSONBSchema;

    type CreateContainerParams = JSONB.GetSchemaType<typeof createContainerSchema>;
    // Type instantiation is excessively deep and possibly infinite.ts(2589)
    const dockerFile = ({ files: [] } as unknown as CreateContainerParams).files.find(
      ({ name }) => name === "Dockerfile",
    );
    dockerFile?.content.charAt(0); // should not error
  });

  test("complex", () => {
    const jsonSSchema = {
      type: {
        a: { type: "boolean" },
        arr: { enum: ["1", "2", "3"] },
        arr1: { enum: [1, 2, 3] },
        arr2: { type: "integer[]" },
        arrStr: { type: "string[]", optional: true, nullable: true },
        o: { optional: true, nullable: true, oneOfType: [{ o1: "integer" }, { o2: "boolean" }] },
        customTables: {
          optional: true,
          arrayOfType: {
            tableName: "string",
            select: {
              optional: true,
              oneOf: ["boolean", { type: { fields: "string[]" } }],
            },
          },
        },
      },
    } as const satisfies JSONB.JSONBSchema;
    const jsonS = getJSONBSchemaAsJSONSchema("tjson", "json", jsonSSchema);

    const jsonSSchemaArrAllowedValues = {
      type: {
        arrStr: { type: "string[]", optional: true, nullable: true, allowedValues: ["a", "b"] },
      },
    } as const satisfies JSONB.JSONBSchema;
    const d: JSONB.GetSchemaType<typeof jsonSSchemaArrAllowedValues> = {
      arrStr: ["a"],
    };

    assert.deepEqual(jsonS, {
      $id: "tjson.json",
      $schema: "https://json-schema.org/draft/2020-12/schema",
      // title: 'json',
      type: "object",
      required: ["a", "arr", "arr1", "arr2"],
      properties: {
        a: { type: "boolean" },
        arr: {
          type: "string",
          enum: ["1", "2", "3"],
        },
        arr1: {
          type: "number",
          enum: [1, 2, 3],
        },
        arr2: { type: "array", items: { type: "integer" } },
        arrStr: {
          oneOf: [{ type: "array", items: { type: "string" } }, { type: "null" }],
        },
        o: {
          oneOf: [
            { type: "object", required: ["o1"], properties: { o1: { type: "integer" } } },
            { type: "object", required: ["o2"], properties: { o2: { type: "boolean" } } },
            { type: "null" },
          ],
        },
        customTables: {
          type: "array",
          items: {
            type: "object",
            required: ["tableName"],
            properties: {
              tableName: { type: "string" },
              select: {
                oneOf: [
                  { type: "boolean" },
                  {
                    type: "object",
                    required: ["fields"],
                    properties: {
                      fields: { type: "array", items: { type: "string" } },
                    },
                  },
                ],
              },
            },
          },
        },
      },
    });

    assert.deepEqual(
      getJSONBSchemaAsJSONSchema("tjson", "status", {
        nullable: true,
        oneOfType: [
          { ok: { type: "string" } },
          { err: { type: "string" } },
          {
            loading: {
              type: {
                loaded: { type: "number" },
                total: { type: "number" },
              },
            },
          },
        ],
      }),
      {
        $id: "tjson.status",
        $schema: "https://json-schema.org/draft/2020-12/schema",
        oneOf: [
          { type: "object", required: ["ok"], properties: { ok: { type: "string" } } },
          { type: "object", required: ["err"], properties: { err: { type: "string" } } },
          {
            type: "object",
            required: ["loading"],
            properties: {
              loading: {
                required: ["loaded", "total"],
                properties: {
                  loaded: { type: "number" },
                  total: { type: "number" },
                },
                type: "object",
              },
            },
          },
          { type: "null" },
        ],
        // title: 'status'
      },
    );
  });

  test("type checks", () => {
    /** tests */
    const t: JSONB.GetType<{ arrayOfType: { a: "number" } }> = [{ a: 2 }];

    /** StrictUnion was removed because it doesn't work with object | string */
    const _oneOf: JSONB.GetType<{
      nullable: true;
      oneOf: [
        { enum: ["n"] },
        { type: { a: "number" } },
        { type: { a: { type: "string"; allowedValues: ["a"] } } },
      ];
    }> = {
      a: "a",
    };

    //@ts-expect-error
    if (_oneOf.a !== "n") {
    }

    const _a: JSONB.GetType<{ type: { a: "number" } }> = {
      a: 2,
    };

    const _r: JSONB.GetType<{ record: { keysEnum: ["a", "b"]; values: "integer[]" } }> = {
      a: [2],
      b: [221],
    };

    const _dd: JSONB.JSONBSchema = {
      enum: [1],
      type: "any",
    };

    const s = {
      type: {
        a: { type: "boolean" },
        c: { type: { c1: { type: "string" } } },
        arr: { arrayOfType: { d: "string" } },
        o: {
          oneOfType: [{ z: { type: "integer" } }, { z1: { type: "integer" } }],
        },
        blbArr: "Blob[]",
        f: "FileLike",
      },
    } as const; // satisfies JSONB.JSONBSchema;

    const _ss: JSONB.GetType<typeof s> = {
      a: true,
      arr: [{ d: "" }],
      c: {
        c1: "",
      },
      o: { z1: 23 },
      blbArr: [
        new Blob(),
        new Blob(),
        //@ts-expect-error
        1,
      ],
      f: {
        name: "file",
        type: "text/plain",
        lastModified: 1234567890,
        data: new Blob(),
      },
    };

    const lookupSchema = {
      type: {
        rows: { type: "RowLookup[]", table: "users" },
        values: {
          type: "ValueLookup[]",
          table: "users",
          column: "id",
        },
        tables: { type: "TableLookup[]" },
        columns: { type: "ColumnLookup[]", filter: { udt_name: "int4" } },
      },
    } as const satisfies JSONB.FieldType;
    const _lookups: JSONB.GetType<typeof lookupSchema> = {
      rows: [{ id: 1 }],
      values: [1],
      tables: ["users"],
      columns: [{ table: "users", column: "id" }],
    };

    const rootLookupSchema = {
      type: "ValueLookup",
      table: "users",
      column: "id",
    } as const satisfies JSONB.JSONBSchema;
    const _rootLookupValue: JSONB.GetSchemaType<typeof rootLookupSchema> = 1;
  });

  await test("DBSchema lookup inference preserves nested types and legacy defaults", () => {
    type Schema = {
      users: { columns: { id: number; name: string | null } };
      teams: { columns: { slug: string } };
    };
    const valueLookup = {
      type: "ValueLookup",
      table: "users",
      column: "id",
    } as const;
    const rowLookup = { type: "RowLookup", table: "users" } as const;
    const _lookupSchema = {
      type: {
        row: rowLookup,
        rows: { ...rowLookup, type: "RowLookup[]" },
        value: valueLookup,
        values: { ...valueLookup, type: "ValueLookup[]", nullable: true },
        optional: { ...rowLookup, optional: true },
        nullableColumn: { ...valueLookup, column: "name" },
        table: { type: "TableLookup" },
        tables: { type: "TableLookup[]" },
        column: { type: "ColumnLookup" },
        columns: { type: "ColumnLookup[]", filter: { table: "users" } },
        unfilteredColumn: {
          type: "ColumnLookup",
          filter: { table: undefined },
        },
        nested: { type: { id: valueLookup } },
        array: { arrayOf: valueLookup },
        objects: { arrayOfType: { id: valueLookup } },
        tuple: { tuple: [valueLookup, rowLookup] },
        union: { oneOf: [valueLookup, { enum: ["none"] }] },
        objectUnion: { oneOfType: [{ id: valueLookup }, { name: "string" }] },
        record: { record: { keysEnum: ["selected"], values: rowLookup } },
      },
    } as const satisfies JSONB.JSONBSchema;
    type Lookups = JSONB.GetSchemaTypeWithDBSchema<
      typeof _lookupSchema,
      Schema
    >;
    const value: Lookups = {
      row: { id: 1 },
      rows: [{ name: null }],
      value: 1,
      values: [1, 2],
      nullableColumn: null,
      table: "users",
      tables: ["users", "teams"],
      column: { table: "teams", column: "slug" },
      columns: [{ table: "users", column: "id" }],
      unfilteredColumn: { table: "teams", column: "slug" },
      nested: { id: 1 },
      array: [1],
      objects: [{ id: 1 }],
      tuple: [1, { id: 1 }],
      union: "none",
      objectUnion: { id: 1 },
      record: { selected: { id: 1 } },
    };
    void (null satisfies Lookups["values"]);
    void (undefined satisfies Lookups["optional"]);
    void (1 satisfies Lookups["union"]);
    void (1 satisfies JSONB.GetSchemaTypeWithDBSchema<
      typeof valueLookup,
      Schema
    >);
    void (value satisfies JSONB.GetTypeIfDefinedWithDBSchema<
      typeof _lookupSchema | undefined,
      Schema
    >);
    void (1 satisfies JSONB.GetTypeIfDefinedWithDBSchema<
      "integer" | undefined,
      Schema
    >);

    const widenedValueLookup = {
      type: "ValueLookup",
      table: "users",
      column: "id",
    } satisfies JSONB.ValueLookup;
    const widenedRowLookup = {
      type: "RowLookup",
      table: "users",
    } satisfies JSONB.RowLookup;
    const widenedColumnLookup = {
      ...valueLookup,
      column: "id",
    } satisfies JSONB.ValueLookup;
    void (1 satisfies JSONB.GetSchemaTypeWithDBSchema<
      typeof widenedValueLookup,
      Schema
    >);
    void ({ id: 1 } satisfies JSONB.GetSchemaTypeWithDBSchema<
      typeof widenedRowLookup,
      Schema
    >);
    void (1 satisfies JSONB.GetTypeIfDefinedWithDBSchema<
      typeof widenedColumnLookup,
      Schema
    >);

    /* @ts-expect-error Row lookups retain column types. */
    void ({ id: "invalid" } satisfies Lookups["row"]);
    /* @ts-expect-error Row lookups reject unknown columns. */
    void ({ missing: 1 } satisfies Lookups["row"]);
    /* @ts-expect-error Row lookup arrays retain column types. */
    void ([{ name: 1 }] satisfies Lookups["rows"]);
    /* @ts-expect-error Value lookups retain the column type. */
    void ("invalid" satisfies Lookups["value"]);
    /* @ts-expect-error A nullable array does not make its elements nullable. */
    void ([null] satisfies Lookups["values"]);
    /* @ts-expect-error Nullable database columns retain their non-null type. */
    void (1 satisfies Lookups["nullableColumn"]);
    /* @ts-expect-error Table lookups only accept schema tables. */
    void ("missing" satisfies Lookups["table"]);
    /* @ts-expect-error Table lookup arrays only accept schema tables. */
    void (["missing"] satisfies Lookups["tables"]);
    const mismatchedColumnReference = { table: "teams", column: "id" } as const;
    /* @ts-expect-error Column references must match their table. */
    void (mismatchedColumnReference satisfies Lookups["column"]);
    /* @ts-expect-error Column lookups respect the table filter. */
    void ([{ table: "teams", column: "slug" }] satisfies Lookups["columns"]);
    /* @ts-expect-error An undefined filter still checks table-column pairs. */
    void (mismatchedColumnReference satisfies Lookups["unfilteredColumn"]);
    /* @ts-expect-error Unknown literal tables do not use the widened fallback. */
    void (1 satisfies JSONB.GetSchemaTypeWithDBSchema<
      { type: "ValueLookup"; table: "missing"; column: "id" },
      Schema
    >);
    /* @ts-expect-error Unknown literal columns do not use the widened fallback. */
    void (1 satisfies JSONB.GetSchemaTypeWithDBSchema<
      { type: "ValueLookup"; table: "users"; column: "missing" },
      Schema
    >);
    /* @ts-expect-error Nested objects retain lookup types. */
    void ({ id: "invalid" } satisfies Lookups["nested"]);
    /* @ts-expect-error arrayOf retains lookup types. */
    void (["invalid"] satisfies Lookups["array"]);
    /* @ts-expect-error arrayOfType retains lookup types. */
    void ([{ id: "invalid" }] satisfies Lookups["objects"]);
    /* @ts-expect-error Tuples retain lookup types. */
    void (["invalid", {}] satisfies Lookups["tuple"]);
    /* @ts-expect-error oneOf retains lookup and enum types. */
    void ("invalid" satisfies Lookups["union"]);
    /* @ts-expect-error oneOfType retains lookup types. */
    void ({ id: "invalid" } satisfies Lookups["objectUnion"]);
    /* @ts-expect-error Records retain lookup types. */
    void ({ selected: { id: "invalid" } } satisfies Lookups["record"]);
    /* @ts-expect-error An undefined schema resolves to never. */
    void (undefined satisfies JSONB.GetTypeIfDefinedWithDBSchema<
      undefined,
      Schema
    >);

    const legacyValue: JSONB.GetSchemaType<typeof _lookupSchema> = {
      ...value,
      row: { unknownColumn: true },
      value: "any value",
      table: "unknownTable",
      column: { table: "unknownTable", column: "unknownColumn" },
    };
    void (legacyValue satisfies JSONB.GetSchemaTypeWithDBSchema<
      typeof _lookupSchema,
      void
    >);
    void ("any value" satisfies JSONB.GetTypeIfDefined<typeof valueLookup>);
  });

  test("lookup generated types", () => {
    const tables = [
      {
        name: "users",
        columns: [
          { name: "id", udt_name: "int4", is_nullable: false },
          { name: "name", udt_name: "text", is_nullable: true },
        ],
      },
    ] as unknown as TableSchema[];

    assert.equal(
      getJSONBTSTypes(tables, {
        type: "RowLookup",
        table: "users",
      }),
      '{ "id"?:  number;  "name"?: null |  string;  }',
    );
    assert.equal(
      getJSONBTSTypes(tables, {
        type: "ValueLookup[]",
        table: "users",
        column: "id",
      }),
      "number[]",
    );
    assert.equal(getJSONBTSTypes(tables, { type: "TableLookup[]" }), "string[]");
    assert.equal(
      getJSONBTSTypes(tables, { type: "ColumnLookup", nullable: true }),
      'null | { "table": string; "column": string; }',
    );
  });

  test("instantiation limits", () => {
    const deeplyNestedSchema = {
      type: {
        level2: {
          type: {
            level3: {
              type: {
                level4: {
                  type: {
                    level5: {
                      type: {
                        level6: {
                          type: {
                            level7: {
                              type: {
                                level8: {
                                  type: {
                                    value: "string" as const,
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    } as const satisfies JSONB.FieldType;
    type DeeplyNestedType = JSONB.GetType<typeof deeplyNestedSchema>;

    const wideSchema = {
      type: {
        field001: "string",
        field002: "number",
        field003: "boolean",
        field004: { type: "string", optional: true },
        field005: { type: "number", nullable: true },
        field006: { type: "integer" },
        field007: "Date",
        field008: "time",
        field009: "timestamp",
        field010: "string[]",
        field011: "number[]",
        field012: "boolean[]",
        field013: { type: "string", allowedValues: ["a", "b", "c"] as const },
        field014: { type: "number", allowedValues: [1, 2, 3] as const },
        field015: { enum: ["x", "y", "z"] as const },
        field016: { type: { nested1: "string", nested2: "number" } },
        field017: { arrayOf: "string" },
        field018: { arrayOfType: { inner: "string" } },
        field019: { record: { values: { type: "string" } } },
        field020: { record: { keysEnum: ["a", "b", "c"] as const, values: { type: "number" } } },
        field021: "string",
        field022: "number",
        field023: "boolean",
        field024: { type: "string", optional: true },
        field025: { type: "number", nullable: true },
        field026: { type: "integer" },
        field027: "Date",
        field028: "time",
        field029: "timestamp",
        field030: "string[]",
        field031: "number[]",
        field032: "boolean[]",
        field033: { type: "string", allowedValues: ["a", "b", "c"] as const },
        field034: { type: "number", allowedValues: [1, 2, 3] as const },
        field035: { enum: ["x", "y", "z"] as const },
        field036: { type: { nested1: "string", nested2: "number" } },
        field037: { arrayOf: "string" },
        field038: { arrayOfType: { inner: "string" } },
        field039: { record: { values: { type: "string" } } },
        field040: { record: { keysEnum: ["a", "b", "c"] as const, values: { type: "number" } } },
        // Continue to 100+ fields...
        field041: "string",
        field042: "number",
        field043: "boolean",
        field044: { type: "string", optional: true },
        field045: { type: "number", nullable: true },
        field046: { type: "integer" },
        field047: "Date",
        field048: "time",
        field049: "timestamp",
        field050: "string[]",
      },
    } as const satisfies JSONB.FieldType;

    type WideSchemaTest = JSONB.GetType<typeof wideSchema>;

    const complexOneOfSchema = {
      oneOf: [
        deeplyNestedSchema,
        { type: "string" },
        { type: "number" },
        { type: "boolean" },
        { type: { variant1: "string", meta1: "number" } },
        { type: { variant2: "boolean", meta2: "string" } },
        { type: { variant3: "number", meta3: "boolean" } },
        { enum: ["a", "b", "c"] as const },
        { arrayOf: "string" },
        { arrayOf: { type: "number" } },
        {
          type: {
            nested: {
              oneOf: [wideSchema, { type: "string" }, { type: { deepNested: "number" } }],
            },
          },
        },
      ],
    } as const satisfies JSONB.FieldType;

    type ComplexOneOfTest = JSONB.GetType<typeof complexOneOfSchema>;
    const d: ComplexOneOfTest = {
      nested: {
        deepNested: 42,
      },
    };

    const oneOfTypeSchema = {
      oneOfType: [
        { type: { enum: ["database"] }, host: "string", port: "number", database: "string" },
        { type: { enum: ["file"] }, path: "string", encoding: "string" },
        { type: { enum: ["memory"] }, maxSize: "number", ttl: "number" },
        { type: { enum: ["redis"] }, url: "string", password: { type: "string", optional: true } },
        { type: { enum: ["s3"] }, bucket: "string", region: "string", accessKey: "string" },
        {
          type: { enum: ["composite"] },
          primary: { type: { host: "string", port: "number" } },
          fallback: { type: { host: "string", port: "number" } },
        },
      ] as const,
    } as const satisfies JSONB.FieldType;

    type OneOfTypeTest = JSONB.GetType<typeof oneOfTypeSchema>;
  });
});
