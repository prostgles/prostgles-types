
import type { TableHandler, SQLHandler, FullFilter, DBHandler, Select, SelectTyped, ExistsFilter, DeleteParams, AnyObject, SelectParams, ViewHandler, DBSchema, UpsertDataToPGCast } from "../dist/index";
import { ExactlyOne } from "../dist/util";

/**
 * Test select/return type inference
 */
 (async () => {
  
  type TableDef = { h: number; b?: number; c?: number; }
  const tableHandler: TableHandler<TableDef> = undefined as any; 
  const params: SelectParams<TableDef> = {
    select: {
      "*": 1, 
      bd: { $max: ["b"] },
      joined_table: { ids: { "$array_agg": ["joined_field"] } }
    }
  }
  
  const f: FullFilter<{ a: string | null; num: number }> = {
    $and: [
      { a: "d", num: { ">": 232 } }, 
      { "num.$eq": 2,  }
    ]
  };

  if(tableHandler){
    const newRow = await tableHandler.insert?.({ h: 2 }, { returning: {b: 1, c: 1} });
    newRow.b;
    newRow.c;
  
    //@ts-expect-error
    newRow.h;
  
    // const f: FullFilter<Partial<{ a: number; s: string}>> = {  }
    const row = await tableHandler.findOne?.({ "c.$nin": [2] }, { select: {b: 0} });
    row.c;
    row.h;


    const query = await tableHandler.find?.({ h: 2 }, { returnType: "statement" });
    query.toUpperCase();

    //@ts-expect-error
    row.b;

    const vals = await tableHandler.find?.({ "c.$nin": [2] }, { returnType: "values" });
    const vals2 = await tableHandler.find?.({ "c.$nin": [2] }, { select: { h: 1 }, returnType: "values" });
    vals2[0]?.toExponential();
  
    const valsOptional = await tableHandler.find?.({ }, { select: { b: 1 }, returnType: "values" });
    const starSelect = await tableHandler.find?.({ }, { select: { "*": 1, bd: { $max: ["b"] }, joined_table: { ids: { "$array_agg": ["joined_field"] } } } });
    
    starSelect[0].bd
    starSelect[0].joined_table.at(0)

    //@ts-expect-error
    row.b;
  
    tableHandler.subscribe({ h: 2 }, { select: { b: 1 }}, async rows => {
      const row = rows[0];
      row.b;
  
      //@ts-expect-error
      row.c;
    });
  
    tableHandler.subscribeOne({ h: 2 }, { select: { b: 0 }}, async row => {
      
      //@ts-expect-error
      row.b;
  
      row.c;
    });
  }
  const s1: Select<AnyObject> = {
    val: { $template_string: ["$template_string"] } 
  }


  const sqlHandler: SQLHandler = undefined as any;
  if(sqlHandler){

    const full = await sqlHandler("SELECT 1", {});
    full.rows.flatMap;
    full.fields.find(f => f.tsDataType === "string");

    const value = await sqlHandler("SELECT 1", {}, { returnType: "value" });
    value;

    const values = await sqlHandler("SELECT 1", {}, { returnType: "values" });
    values.flatMap

    const row = await sqlHandler("SELECT 1", {}, { returnType: "row" });
    row.dhawjpeojfgrdfhoeisj;

    const rows = await sqlHandler("SELECT 1", {}, { returnType: "rows" });
    rows.flatMap


    const handles = await sqlHandler("SELECT 1", {}, { returnType: "noticeSubscription" });
    <Function>handles.addListener;
    <string>handles.socketChannel;
    <string>handles.socketUnsubChannel;

    const listenHandlesOrData = await sqlHandler("SELECT 1", {}, { allowListen: true });
    
    if("command" in listenHandlesOrData){
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

  const db: DBHandler<{ 
    table1: { 
      select: true;
      insert: true;
      update: false;
      columns: {  c1: string; c2?: number }
    };
    view1: { 
      is_view: true
      columns: {  c1: string; c2: number }
    };
    table2: {
      update: true;
      columns: {  c1: string; c2?: number }
    };
  }> = 1 as any;
// const v = await db.sql<{ c: string }>(``)
  const s: SelectTyped<{ a: number; c: string }> = { a: 1 }

  // @ts-expect-error
  const s2: Select<{ a: number; c: string }> = { a: 1 , zz: 1 }

  // Correct function
  const s22: Select<{ a: number; c: string }> = { a: 1 , zz: { $max: ["c"] } }

  // Quick string func notation can only be used against existing column names
  // @ts-expect-error
  const s3: Select<{ a: number; c: string }> = { a: 1 , cc: "2" }

  const s33: Select<{ a: number; c: string }> = { a: 1 , c: "$max" }

  db.view1.find({ "c1.$in": ["2", null] }, { select: { c1: 1, c2: 1 }  });
  db.table1.insert({ c1: "2" }, { returning: { c1: 1, c2: "func", dwad: { dwada: [] } } });

  //@ts-expect-error
  db.table1.update 

  //@ts-expect-error
  db.table12.update 

  db.table1.find;

  const result = await db.table2.update({}, { c1: "" }, { returning: "*" });
  result.c2 + 2;

  const sel: Select = {
    dwa: 1
  }

  type Fields =  { id: number; name: number; public: number; $rowhash: string; added_day: any }
  const r:Fields = 1 as any
  const sel1: Select = { id: 1, name: 1, public: 1, $rowhash: 1, added_day: { $day: []  } };
  const sel2: Select<{ id: number; name: number; public: number; }> = { id: 1, name: 1, public: 1, $rowhash: 1, dsds: { d: [] } };
  const sel3: Select<{ id: number; name: number; public: number; }> = ""
  const sel4: Select<{ id: number; name: number; public: number; }> = "*"
  const sel12: Select = { id: 1, name: 1, public: 1, $rowhash: 1, dsds: { d: [] } };
  const sel13: Select = ""
  const sel14: Select = "*";

  const fRow: FullFilter<Fields> = {
    $rowhash: { "$in": [""] }
  };
  const emptyFilter: FullFilter<Fields> = {
  };

  type SampleSchema = {
    tbl1: {
      columns: {
        col1: number;
        col2: string | null
      }
    }
    tbl11: {
      columns: {
        col11: number;
        col21: string | null
      }
    }
  }

  // const ff: FullFilter<SampleSchema["tbl1"]["columns"], SampleSchema> = {
  //   AnyObject
  // }


  
  const ef: ExistsFilter<SampleSchema> = {
    $existsJoined: {
      // tbl1: {"col1.$eq": 1 }
      tbl11: {
        // "col11.$eq": 1,
        // col11: { "=": 1, $between: [1, 2] }
      }
    }
  }

  const emptyExists: ExistsFilter<SampleSchema> = {
    $existsJoined: {
      tbl1: { }
    }
  }

  const sel1d: Select = {
    dwada: 1,
    $rowhash: 1,
    dwawd: { funcName: [12] }
  }

  const sel1d2: Select<AnyObject> = ["a"]

  const deletePar: DeleteParams = {
    returning: { id: 1, name: 1, public: 1 , $rowhash: 1, added_day: { "$day": ["added"] } }
  }
});

export const typeTestsOK = () => {};




/** Type tests */
(() => {

  type GSchema = {
    tbl1: {
      is_view: false,
      columns: {
        col1: string,
      },
      delete: true,
      select: true,
      insert: true,
      update: true,
    }
  };

    
  type DBOFullyTyped<Schema = void> = Schema extends DBSchema ? {
    [tov_name in keyof Schema]: Schema[tov_name]["is_view"] extends true ?
    ViewHandler<Schema[tov_name]["columns"], Schema> :
    TableHandler<Schema[tov_name]["columns"], Schema>
  } : Record<string, ViewHandler | TableHandler>;
  

  type TypedFFilter = FullFilter<GSchema["tbl1"]["columns"], GSchema>
  const schemaFFilter: TypedFFilter = { "col1.$eq": "dd" };
  const fullFilter: FullFilter = schemaFFilter;
  
  const ffFunc = (f: FullFilter) => {};
  ffFunc(schemaFFilter);
  // const thandler: TableHandler = 
  
  const dbo: DBOFullyTyped<GSchema> = 1 as any;
  
  const filter: FullFilter<GSchema["tbl1"]["columns"], GSchema> = {  };
  
  const filterCheck = <F extends FullFilter | undefined>(f: F) => {};
  filterCheck(filter);
  
  const t: UpsertDataToPGCast<GSchema["tbl1"]["columns"]> = {} as any;
  const d: UpsertDataToPGCast<AnyObject> = t;
  const fup = (a: UpsertDataToPGCast) => {}
  fup(t);

  // const f = <A extends TableHandler["count"]>(a: A) => {};
  const f = (s: TableHandler) => {};
  const th: TableHandler<GSchema["tbl1"]["columns"], GSchema> = {  } as any;
  f(th)
  // f(dbo.tbl1.find)
  const ra = <A extends AnyObject>(a: A) => {
  
  };
  const eft: ExactlyOne<{ tbl1: FullFilter<{ col1: string; }, GSchema>; }> = { tbl1: { "col1.$eq": '2' } }

  // Type 'ExactlyOne<{ [key: string]: FullFilter<AnyObject, void>; }>' is not assignable to type 'ExactlyOne<{ tbl1: FullFilter<{ col1: string; }, GSchema>; }>'.
  const fFilter = (a: ExactlyOne<{ [key: string]: FullFilter<AnyObject, void>; }>) => {

  };
  fFilter(eft);

  const ff2 = <F extends ExistsFilter>(a: F) => {

  }
  ff2({ $exists: eft });


  const sp: SelectParams<GSchema["tbl1"]["columns"]> = { select: {} };
  const sf = (sp: SelectParams) => {

  }
  sf(sp);
  // const sub: TableHandler["count"] = dbo.tbl1.count
  
  
  // ra(schema);
})
