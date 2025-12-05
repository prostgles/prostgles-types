import { strict as assert } from "assert";
import { describe, test } from "node:test";
import type { JSONB } from "./JSONBSchema";
import { getJSONBObjectSchemaValidationError } from "./JSONBSchemaValidation";

void describe("JSONBValidation", async () => {
  await test("getJSONBObjectSchemaValidationError", () => {
    const schema: JSONB.ObjectType = {
      type: {
        name: "string",
        age: { type: "integer", nullable: true },
        address: {
          type: {
            street: "string",
            city: "string",
            street_number: { type: "integer", optional: true },
            t: { enum: ["a", "b", "c"], optional: true },
          },
        },
      },
    };
    const obj = {
      name: "John Doe",
      age: 30,
      address: {
        street: "123 Main St",
        city: "New York",
      },
    };
    assert.deepStrictEqual(getJSONBObjectSchemaValidationError(schema.type, null, "test"), {
      error: "Expecting test to be an object",
    });
    assert.deepStrictEqual(getJSONBObjectSchemaValidationError(schema.type, {}, "test"), {
      error: "name is missing but required",
    });
    assert.deepStrictEqual(getJSONBObjectSchemaValidationError(schema.type, obj, "test"), {
      data: obj,
    });
    assert.deepStrictEqual(
      getJSONBObjectSchemaValidationError(schema.type, { ...obj, age: null }, "test"),
      {
        data: { ...obj, age: null },
      }
    );
    assert.deepStrictEqual(
      getJSONBObjectSchemaValidationError(schema.type, { ...obj, age: 22.2 }, "test"),
      {
        error: "age is of invalid type. Expecting null | integer",
      }
    );
    assert.deepStrictEqual(
      getJSONBObjectSchemaValidationError(
        schema.type,
        { ...obj, address: { ...obj.address, city: 22 } },
        "test"
      ),
      {
        error: "address.city is of invalid type. Expecting string",
      }
    );
    assert.deepStrictEqual(
      getJSONBObjectSchemaValidationError(
        schema.type,
        { ...obj, address: { ...obj.address, street_number: 22.22 } },
        "test"
      ),
      { error: "address.street_number is of invalid type. Expecting undefined | integer" }
    );
    assert.deepStrictEqual(
      getJSONBObjectSchemaValidationError(
        schema.type,
        { ...obj, address: { ...obj.address, street_number: undefined } },
        "test"
      ),
      { data: { ...obj, address: { ...obj.address, street_number: undefined } } }
    );
    assert.deepStrictEqual(
      getJSONBObjectSchemaValidationError(
        schema.type,
        { ...obj, address: { ...obj.address, t: "c" } },
        "test"
      ),
      { data: { ...obj, address: { ...obj.address, t: "c" } } }
    );
    assert.deepStrictEqual(
      getJSONBObjectSchemaValidationError(
        schema.type,
        { ...obj, address: { ...obj.address, t: 2 } },
        "test"
      ),
      { error: 'address.t is of invalid type. Expecting undefined | "a" | "b" | "c"' }
    );
  });
  await test("getJSONBObjectSchemaValidationError oneOf record", () => {
    assert.deepStrictEqual(
      getJSONBObjectSchemaValidationError(
        {
          d: { record: { keysEnum: ["a", "b"], values: "boolean" } },
          o: { optional: true, oneOf: ["number", "string[]"] },
        },
        { d: { a: true, b: 1 } },
        "test"
      ),
      { error: "d.b is of invalid type. Expecting boolean" }
    );
    assert.deepStrictEqual(
      getJSONBObjectSchemaValidationError(
        {
          d: { record: { keysEnum: ["a", "b"], values: "boolean" } },
          o: { optional: true, oneOf: ["number", "string[]"] },
        },
        { d: { a: true, b: true }, o: false },
        "test"
      ),
      { error: "o is of invalid type. Expecting undefined | number | string[]" }
    );
    assert.deepStrictEqual(
      getJSONBObjectSchemaValidationError(
        {
          d: { record: { keysEnum: ["a", "b"], values: "boolean" } },
          o: { optional: true, oneOf: ["number", "string[]"] },
        },
        { d: { a: true, b: true }, o: ["str"] },
        "test"
      ),
      { data: { d: { a: true, b: true }, o: ["str"] } }
    );
  });

  await test("security", () => {
    const maliciousInput = JSON.parse(`{ "__proto__": { "isAdmin": true } }`);
    const schema = { name: { type: "string" } } as const;

    const validation = getJSONBObjectSchemaValidationError(schema, maliciousInput);
    const validationEmpty = getJSONBObjectSchemaValidationError(schema, {});

    assert.deepStrictEqual(({} as any).isAdmin, undefined);
    assert.deepStrictEqual(validation, validationEmpty);
    assert.deepStrictEqual(validation, { error: "name is missing but required" });

    const validation2 = getJSONBObjectSchemaValidationError(schema, {
      ...maliciousInput,
      name: "test",
    });
    assert.deepStrictEqual(validation2, { error: " has extra properties: __proto__" });
  });

  await test("Extra properties", () => {
    const schema = { name: { type: "string" } } as const;
    const input = {
      name: "john",
      isAdmin: true,
    };

    const result = getJSONBObjectSchemaValidationError(schema, input);
    assert.deepStrictEqual(result, { error: " has extra properties: isAdmin" });
  });

  await test("Extra properties - nested", () => {
    const schema = {
      user: {
        type: {
          name: { type: "string" },
        },
      },
    } as const;
    const input = {
      user: {
        name: "john",
        role: "admin",
        permissions: ["delete_all"],
      },
    };

    const result = getJSONBObjectSchemaValidationError(schema, input);
    assert.deepStrictEqual(result, { error: "user has extra properties: role, permissions" });
  });

  await test("Constructor and prototype properties", () => {
    const schema = { name: { type: "string" } } as const;

    const withConstructor = { name: "test", constructor: { malicious: true } };
    const withPrototype = { name: "test", prototype: { malicious: true } };

    const result1 = getJSONBObjectSchemaValidationError(schema, withConstructor);
    const result2 = getJSONBObjectSchemaValidationError(schema, withPrototype);

    assert.deepStrictEqual(result1, { error: " has extra properties: constructor" });
    assert.deepStrictEqual(result2, { error: " has extra properties: prototype" });

    assert.deepStrictEqual(({} as any).malicious, undefined);
  });

  await test("JSON.parse __proto__ handling", () => {
    const schema = { name: { type: "string" } } as const;

    // JSON.parse creates __proto__ as a regular property
    const parsed = JSON.parse('{"name": "test", "__proto__": {"isAdmin": true}}');

    const result = getJSONBObjectSchemaValidationError(schema, parsed, "test");

    assert.deepStrictEqual(result, { error: " has extra properties: __proto__" });
    // Verify no global pollution
    assert.deepStrictEqual(({} as any).isAdmin, undefined);

    // __proto__ from JSON.parse is a regular property - should be caught as extra property
    assert.ok(Object.hasOwn(parsed, "__proto__"));
  });

  await test("Array validation - large arrays", () => {
    const schema = { items: { type: "string[]" } } as const;

    // Reasonable size should work
    const normalArray = { items: new Array(1000).fill("a") };
    const result = getJSONBObjectSchemaValidationError(schema, normalArray, "test");
    assert.deepStrictEqual(result, { data: normalArray });
  });

  await test("Number edge cases", () => {
    const schema = {
      num: { type: "number" },
      int: { type: "integer" },
    } as const;

    // NaN and Infinity should fail for 'number' type
    assert.deepStrictEqual(
      getJSONBObjectSchemaValidationError(schema, { num: NaN, int: 1 }, "test"),
      { error: "num is of invalid type. Expecting number" }
    );

    assert.deepStrictEqual(
      getJSONBObjectSchemaValidationError(schema, { num: Infinity, int: 1 }, "test"),
      { error: "num is of invalid type. Expecting number" }
    );

    assert.deepStrictEqual(
      getJSONBObjectSchemaValidationError(schema, { num: -Infinity, int: 1 }, "test"),
      { error: "num is of invalid type. Expecting number" }
    );

    // Valid numbers should pass
    assert.deepStrictEqual(
      getJSONBObjectSchemaValidationError(schema, { num: 0, int: 0 }, "test"),
      { data: { num: 0, int: 0 } }
    );
  });

  await test("Record with extra keys", () => {
    const schema = {
      settings: { record: { keysEnum: ["theme", "language"], values: "string" } },
    } as const;

    const withExtra = {
      settings: { theme: "dark", language: "en", malicious: "payload" },
    };

    const result = getJSONBObjectSchemaValidationError(schema, withExtra, "test");
    assert.ok(result.error?.includes("extra keys"));
  });

  await test("Record missing required keys", () => {
    const schema = {
      settings: { record: { keysEnum: ["theme", "language"], values: "string" } },
    } as const;

    const missing = {
      settings: { theme: "dark" },
    };

    const result = getJSONBObjectSchemaValidationError(schema, missing, "test");
    assert.ok(result.error?.includes("language"));
  });

  await test("__proto__ as schema key not supported. TODO add alert", () => {
    const schema = {
      __proto__: { type: "string" },
      name: { type: "string" },
    } as const;

    const input = JSON.parse('{"__proto__": "value", "name": "test"}');

    const result = getJSONBObjectSchemaValidationError(schema, input, "test");
    assert.deepStrictEqual(result, { error: " has extra properties: __proto__" });
  });

  await test("__proto__ in input via JSON.parse", () => {
    const schema = { name: { type: "string" } } as const;

    // JSON.parse creates __proto__ as an own property (not prototype assignment)
    const parsed = JSON.parse('{"name": "test", "__proto__": {"isAdmin": true}}');

    // Verify it's an own property
    assert.ok(Object.hasOwn(parsed, "__proto__"));
    assert.deepStrictEqual(parsed.__proto__, { isAdmin: true });

    // No global pollution
    assert.deepStrictEqual(({} as any).isAdmin, undefined);

    const result = getJSONBObjectSchemaValidationError(schema, parsed, "test");

    assert.deepStrictEqual(result, { error: " has extra properties: __proto__" });
  });

  await test("Recursion depth limit", () => {
    const createNested = (depth: number): any =>
      depth === 0 ? "x" : { a: createNested(depth - 1) };

    const createSchema = (depth: number): any =>
      depth === 0 ? { type: "string" } : { type: { a: createSchema(depth - 1) } };

    const depth = 200;
    const deepObj = createNested(depth);
    const deepSchema = createSchema(depth).type;

    // Should not throw stack overflow - either validate or reject with error
    assert.doesNotThrow(() => {
      const validation = getJSONBObjectSchemaValidationError(deepSchema, deepObj, "test");
      assert.deepStrictEqual(validation, { data: deepObj });
    });
  });

  await test("constructor in input", () => {
    const schema = { name: { type: "string" } } as const;

    const input = {
      name: "test",
      constructor: { prototype: { isAdmin: true } },
    };

    const result = getJSONBObjectSchemaValidationError(schema, input, "test");

    assert.deepStrictEqual(result, { error: " has extra properties: constructor" });

    // Verify no pollution
    assert.deepStrictEqual(({} as any).isAdmin, undefined);
  });

  await test("constructor as schema key", () => {
    const schema = JSON.parse(`{
      "constructor":  "string" ,
      "name": "string"
    }`);

    assert.equal(typeof schema.constructor, "string");

    const input = JSON.parse(`{ "constructor": "test", "name": "john" }`);

    const result = getJSONBObjectSchemaValidationError(schema, input, "test");
    assert.deepStrictEqual(result, { data: input });

    const result2 = getJSONBObjectSchemaValidationError(schema, { name: "john" }, "test");
    assert.deepStrictEqual(result2, { error: "constructor is missing but required" });

    const result3 = getJSONBObjectSchemaValidationError({ name: "string" }, input, "test");
    assert.deepStrictEqual(result3, { error: " has extra properties: constructor" });

    const result4 = getJSONBObjectSchemaValidationError(
      schema,
      { name: "john", constructor: 123, __proto__: "malicious" },
      "test"
    );
    assert.deepStrictEqual(result4, { error: "constructor is of invalid type. Expecting string" });
  });
  await test("__proto__ as schema key", () => {
    const schema = JSON.parse(`{
      "constructor":  "string" ,
      "name": "string",
       "__proto__": "number"
    }`);
    const result = getJSONBObjectSchemaValidationError(
      schema,
      JSON.parse(`{ 
          "constructor": "test", 
          "name": "john" 
        }`)
    );
    assert.deepStrictEqual(result, { error: "__proto__ is missing but required" });

    const result5 = getJSONBObjectSchemaValidationError(
      schema,
      JSON.parse(`{ 
          "constructor": "test", 
          "name": "john",
          "__proto__": "123"
        }`)
    );
    assert.deepStrictEqual(result5, { error: "__proto__ is of invalid type. Expecting number" });

    const validData = JSON.parse(`{ 
          "constructor": "test", 
          "name": "john",
          "__proto__": 123
        }`);
    const result1 = getJSONBObjectSchemaValidationError(schema, validData);
    assert.ok(result1.data?.__proto__ === 123);
    assert.deepStrictEqual(result1, { data: validData });
  });

  await test("Record partial with extra keys", () => {
    const schema = {
      settings: { record: { keysEnum: ["theme", "language"], partial: true, values: "string" } },
    } as const;

    const withExtra = {
      settings: { theme: "dark", malicious: "payload" },
    };

    const result = getJSONBObjectSchemaValidationError(schema, withExtra, "test");
    assert.ok(result.error?.includes("extra keys")); // Should catch this
  });

  await test("arrayOf with extra properties in objects", () => {
    const schema = {
      users: {
        arrayOf: {
          type: {
            name: "string",
            age: "integer",
          },
        },
      },
    } as const;

    const input = {
      users: [
        { name: "john", age: 30, isAdmin: true }, // extra property
      ],
    };

    const result = getJSONBObjectSchemaValidationError(schema, input, "test");
    assert.ok(result.error?.includes("extra properties"));
  });
});
