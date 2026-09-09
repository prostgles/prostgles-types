import type { AnyObject, DBSchema, InsertDataWithNested, UpsertDataToPGCast } from "./index";

export type InsertColumnsWithReferences<
  TD extends AnyObject,
  S extends DBSchema | void,
  TName extends PropertyKey,
> =
  [TName] extends [never] ? UpsertDataToPGCast<TD>
  : ColumnReferences<S, TName> extends infer Refs ?
    [Refs] extends [never] ?
      UpsertDataToPGCast<TD>
    : {
        [K in keyof TD]:
          | UpsertDataToPGCast<TD>[K]
          | (Refs extends { columns: readonly string[]; data: infer Data } ?
              K extends Refs["columns"][number] ?
                Data
              : never
            : never);
      }
  : never;

type ColumnReferences<S extends DBSchema | void, TName extends PropertyKey> = {
  [F in keyof S]: S[F] extends (
    {
      columns: infer Data extends AnyObject;
      referencedBy: Record<TName, infer Columns>;
    }
  ) ?
    { columns: Columns; data: InsertDataWithNested<Data, S, F> }
  : never;
}[keyof S];
