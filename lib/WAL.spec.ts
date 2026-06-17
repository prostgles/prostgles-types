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
  test("WAL merges multiple updates for same id before send", async () => {
    const sent: any[] = [];

    const w = new WAL({
      id_fields: ["id"],
      synced_field: "c",
      throttle: 50,
      batch_size: 50,
      onSend: async (batch, fullItems) => {
        sent.push({ batch, fullItems });
      },
    });

    await w.addData([
      {
        initial: { id: "r1", c: 1, n: 1, x: 10 },
        current: { id: "r1", c: 1, n: 1, x: 11 },
      },
      {
        current: { id: "r1", c: 2, n: 2, x: 11 },
      },
    ]);

    await sleep(20);

    assert.equal(sent.length, 1);
    assert.equal(sent[0].batch.length, 1);
    assert.deepEqual(sent[0].batch[0], { id: "r1", c: 2, n: 2, x: 11 });
    assert.deepEqual(sent[0].fullItems[0].current, { id: "r1", c: 2, n: 2, x: 11 });
  });

  test("WAL splits into batches and throttles follow-up sends", async () => {
    const calls: any[][] = [];
    let completed = 0;

    await new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(
        () => reject(new Error("Timed out waiting for batched sends")),
        2000,
      );

      const w = new WAL({
        id_fields: ["a", "b"],
        synced_field: "c",
        throttle: 40,
        batch_size: 2,
        onSend: async (batch) => {
          calls.push(batch);
          completed++;
          if (completed === 3) {
            clearTimeout(timeout);
            resolve();
          }
        },
      });

      w.addData([
        { current: { a: "z", b: "1", c: 2 } },
        { current: { a: "a", b: "2", c: 1 } },
        { current: { a: "a", b: "1", c: 1 } },
        { current: { a: "m", b: "1", c: 2 } },
        { current: { a: "b", b: "1", c: 1 } },
      ]);
    });

    assert.deepEqual(
      calls.map((c) => c.length),
      [2, 2, 1],
    );

    const flattened = calls.flat();
    assert.deepEqual(
      flattened.map((r) => `${r.c}.${r.a}.${r.b}`),
      ["1.a.1", "1.a.2", "1.b.1", "2.m.1", "2.z.1"],
    );
  });

  test("WAL isSending reflects in-flight and drained states", async () => {
    let release!: () => void;
    const gate = new Promise<void>((r) => {
      release = r;
    });

    const w = new WAL({
      id_fields: ["id"],
      synced_field: "c",
      throttle: 20,
      batch_size: 10,
      onSend: async () => {
        await gate;
      },
    });

    const sendPromise = w.addData([{ current: { id: "r1", c: 1 } }]);
    await sleep(10);

    assert.equal(w.isSending(), true);

    release();
    await sendPromise;
    await sleep(10);

    assert.equal(w.isSending(), false);
  });

  test("WAL history is set after send and expires", async () => {
    let ended = 0;

    await new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error("Timed out waiting for onSendEnd")), 1500);

      const w = new WAL({
        id_fields: ["id"],
        synced_field: "c",
        throttle: 20,
        batch_size: 10,
        historyAgeSeconds: 0.05,
        onSend: async () => {},
        onSendEnd: () => {
          ended++;
          if (ended === 1) {
            clearTimeout(timeout);
            resolve();
          }
        },
      });

      w.addData([{ current: { id: "r1", c: 101, v: "ok" } }]).then(async () => {
        assert.equal(w.isInHistory({ id: "r1", c: 101 }), true);
        assert.equal(w.isInHistory({ id: "r1", c: 102 }), false);

        await sleep(80);

        assert.equal(w.isInHistory({ id: "r1", c: 101 }), false);
      });
    });
  });

  test("WAL forwards onSend error to onSendEnd", async () => {
    const expectedError = new Error("send failed");
    let receivedError: unknown = undefined;

    await new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(
        () => reject(new Error("Timed out waiting for onSendEnd with error")),
        1500,
      );

      const w = new WAL({
        id_fields: ["id"],
        synced_field: "c",
        throttle: 20,
        batch_size: 10,
        onSend: async () => {
          throw expectedError;
        },
        onSendEnd: (_batch, _fullItems, error) => {
          receivedError = error;
          clearTimeout(timeout);
          resolve();
        },
      });

      w.addData([{ current: { id: "r1", c: 1 } }]);
    });

    assert.equal(receivedError, expectedError);
  });

  test("WAL throws if orderBy fields are missing from items", async () => {
    const w = new WAL({
      id_fields: ["id"],
      synced_field: "c",
      throttle: 20,
      batch_size: 10,
      orderBy: [
        { fieldName: "missingField", tsDataType: "string", asc: true },
        { fieldName: "id", tsDataType: "string", asc: true },
      ],
      onSend: async () => {},
    });

    await assert.rejects(async () => {
      await w.addData([{ current: { id: "a", c: 1 } }, { current: { id: "b", c: 1 } }]);
    });
  });
});

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
