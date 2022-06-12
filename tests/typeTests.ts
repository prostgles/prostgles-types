
import type { TableHandler, SQLHandler, FullFilter, DBHandler, Select, SelectTyped, AnyObject } from "../dist/index";

/**
 * Test select/return type inference
 */
 (async () => {

  type TableData = { h: number; b: number; c: number; }
  
  const tableHandler: TableHandler<TableData, { h: number; b?: number; c?: number; }> = undefined as any;
  
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
      columns: {
        c1: { type: string; is_nullable: true };
        c2: { type: number; is_nullable_or_has_default: true };
      } 
    };
    view1: { 
      is_view: true
      columns: {
        c1: { type: string; is_nullable: true };
        c2: { type: number; };
      } 
    } 
  }> = 1 as any;

  const s: SelectTyped<{ a: number; c: string }> = { a: 1 }
  db.view1.find({ "c1.$in": ["2", null] }, { select: { c1: 1, c2: 1 }  });
  db.table1.insert({ c1: "2" });

  // @ts-expect-error
  db.table1.update 

  db.table1.find

  const sel: Select = {
    dwa: 1
  }

  const r: { id: number; name: number; public: number; $rowhash: number; added_day: any } = 1 as any
  const sel1: Select = { id: 1, name: 1, public: 1, $rowhash: 1, added_day: { $day: []  } };
  const sel2: Select<{ id: number; name: number; public: number; }> = { id: 1, name: 1, public: 1, $rowhash: 1, dsds: { d: [] } };
});

export const typeTestsOK = () => {};