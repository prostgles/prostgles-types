import type {
  AnyObject,
  DBSchema,
  DeleteParams,
  FullFilter,
  InsertData,
  Select,
  SelectParams,
  TableHandler,
  ViewHandler,
} from ".";
import type { UpsertDataToPGCast } from "./insertUpdateUtils";

/**
 * Type tests
 */
async () => {
  type Fields = { id: number; name: number; public: number; $rowhash: string; added_day: any };
  const r: Fields = 1 as any;
  const sel1: Select = { id: 1, name: 1, public: 1, $rowhash: 1, added_day: { $day: [] } };
  const sel2: Select<{ id: number; name: number; public: number }> = {
    id: 1,
    name: 1,
    public: 1,
    $rowhash: 1,
    dsds: { d: [] },
  };
  const sel3: Select<{ id: number; name: number; public: number }> = "";
  const sel4: Select<{ id: number; name: number; public: number }> = "*";
  const sel12: Select = { id: 1, name: 1, public: 1, $rowhash: 1, dsds: { d: [] } };
  const sel13: Select = "";
  const sel14: Select = "*";

  const fRow: FullFilter<Fields, {}> = {
    $rowhash: { $in: [""] },
  };
  const emptyFilter: FullFilter<Fields, {}> = {};

  const sel32: Select = {
    dwa: 1,
  };

  const sel = {
    a: 1,
    $rowhash: 1,
    dwadwA: { dwdwa: [5] },
  } as const;

  const sds: Select = sel;
  const sds01: Select = "";
  const sds02: Select = "*";
  const sds03: Select = {};
  const sds2: Select<{ a: number }> = sel;

  const s001: Select = {
    h: { $ts_headline_simple: ["name", { plainto_tsquery: "abc81" }] },
    hh: { $ts_headline: ["name", "abc81"] },
    added: "$date_trunc_2hour",
    addedY: { $date_trunc_5minute: ["added"] },
  };

  //@ts-expect-error
  const badSel: Select = {
    a: 1,
    b: 0,
  };

  //@ts-expect-error
  const badSel1: Select<{ a: number }, {}> = {
    b: 1,
    a: 1,
  };

  const sds3: Select<{ a: number }> = {
    // "*": 1,
    // a: "$funcName",
    a: { dwda: [] },
    $rowhashD: { dwda: [] },
    // dwadwa: 1, //{ dwa: []}
  };

  const sel1d: Select = {
    dwada: 1,
    $rowhash: 1,
    dwawd: { funcName: [12] },
  };

  const sel1d2: Select<AnyObject> = ["a"];

  const deletePar: DeleteParams = {
    returning: { id: 1, name: 1, public: 1, $rowhash: 1, added_day: { $day: ["added"] } },
  };
};

/** More Type tests */
async () => {
  type GSchema = {
    tbl1: {
      is_view: false;
      columns: {
        col1: string;
        col2: string;
      };
      delete: true;
      select: true;
      insert: true;
      update: true;
    };
  };

  type TableDef = { h: number; b?: number; c?: number };
  const tableHandler: TableHandler<TableDef> = undefined as any;
  tableHandler.insert({ h: 1, c: 2, "b.$func": { dwa: [] } });

  type DBOFullyTyped<Schema = void> =
    Schema extends DBSchema ?
      {
        [tov_name in keyof Schema]: Schema[tov_name]["is_view"] extends true ?
          ViewHandler<Schema[tov_name]["columns"], Schema>
        : TableHandler<Schema[tov_name]["columns"], Schema>;
      }
    : Record<string, ViewHandler | TableHandler>;

  type TypedFFilter = FullFilter<GSchema["tbl1"]["columns"], GSchema>;
  const schemaFFilter: TypedFFilter = { "col1.$eq": "dd" };
  const fullFilter: FullFilter<void, void> = schemaFFilter;

  const ffFunc = (f: FullFilter<void, void>) => {};
  ffFunc(schemaFFilter);

  const dbo: DBOFullyTyped<GSchema> = 1 as any;
  const funcData = { funcName: [] };
  const noRow = await dbo.tbl1.update({}, { col1: "" });
  //@ts-expect-error
  noRow.length;
  //@ts-expect-error
  noRow.col1;

  const someData = await dbo.tbl1.find({}, { select: { col1: 1 }, orderBy: { col1: -1 } });

  const noRowFunc = await dbo.tbl1.update({}, { col1: "" });

  const oneRow = await dbo.tbl1.update({}, { col1: "" }, { returning: "*", multi: false });
  //@ts-expect-error
  oneRow?.length;
  //@ts-expect-error
  oneRow.col1;
  oneRow?.col1;

  const manyRows = await dbo.tbl1.update({}, { col1: "" }, { returning: "*" });
  //@ts-expect-error
  manyRows?.col1;
  manyRows?.at(0)?.col1;

  const noIRow = await dbo.tbl1.insert({ col1: "", col2: { $func: [] } });
  //@ts-expect-error
  noIRow.length;
  //@ts-expect-error
  noIRow.col1;

  const irow = await dbo.tbl1.insert({ col1: "", col2: funcData }, { returning: "*" });
  //@ts-expect-error
  irow.length;
  irow.col1;

  const irowFunc = await dbo.tbl1.insert({ col1: funcData, col2: "" }, { returning: "*" });

  const irows = await dbo.tbl1.insert([{ col1: "", col2: "" }], { returning: "*" });
  //@ts-expect-error
  irows.col1;
  irows.length;

  const filter: FullFilter<GSchema["tbl1"]["columns"], GSchema> = {};

  const filterCheck = <F extends FullFilter<void, void> | undefined>(f: F) => {};
  filterCheck(filter);

  const t: UpsertDataToPGCast<GSchema["tbl1"]["columns"]> = {} as any;
  const d: UpsertDataToPGCast<AnyObject> = t;
  const fup = (a: UpsertDataToPGCast<AnyObject>) => {};
  fup(t);

  // const f = <A extends TableHandler["count"]>(a: A) => {};
  const f = (s: TableHandler) => {};
  const th: TableHandler<GSchema["tbl1"]["columns"], GSchema> = {} as any;
  // f(th)

  const sp: SelectParams<GSchema["tbl1"]["columns"]> = { select: {} };
  const sf = (sp: SelectParams) => {};
  sf(sp);
  // const sub: TableHandler["count"] = dbo.tbl1.count

  /**
   * Upsert data funcs
   */
  const gdw: InsertData<{ a: number; z: number }> = {
    a: { dwa: [] },
    z: { dwa: [] },
  };
  const gdwn: InsertData<{ a: number; z: number }> = {
    a: 2,
    z: { dwa: [] },
  };
  const gdw1: InsertData<{ a: number; z: number }> = { a: 1, z: 2 };
  const gdw1Opt: InsertData<{ a: number; z?: number }> = { a: {}, z: 2 };
  const gdw2: InsertData<{ a: number; z: number }> = { a: { dwa: [] }, z: { dwa: [] } };
  //@ts-expect-error
  const missingKey: InsertData<{ a: number; z: number }> = { z: 1, z: { dwa: [] } };
  //@ts-expect-error
  const missingKey2: InsertData<{ a: number; z: number }> = { z: 1 };
  // ra(schema);
};
