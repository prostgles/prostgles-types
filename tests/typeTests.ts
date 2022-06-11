
import type { TableHandler, SQLHandler, FullFilter } from "../dist/index";

/**
 * Test select/return type inference
 */
 (async () => {
  
  const tableHandler: TableHandler<{ h: number; b: number; c: number; }, { h: number; b?: number; c?: number; }> = undefined as any;
  
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

});

export const typeTestsOK = () => {};