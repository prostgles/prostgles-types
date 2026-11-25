import type { TableRowFromColumnDefinitions } from "./tableRowFromColumnDefinitions";
import { JOB_CONTROL_OPERATIONS } from "./jobControl";

export const AUDIT_TABLE_COLUMN_DEFINITIONS = {
  id: "BIGSERIAL PRIMARY KEY",
  created_at: "TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp()",
  schema_name: "TEXT NOT NULL",
  table_name: "TEXT NOT NULL",
  operation: { enum: ["INSERT", "UPDATE", "DELETE"] },
  old_id: "JSONB",
  new_id: "JSONB",
  old_row: "JSONB",
  new_row: "JSONB",
  actor: "JSONB",
  execution_context: {
    nullable: true,
    jsonbSchema: {
      type: {
        runId: "string",
        job: { type: { id: "string", name: "string" }, optional: true },
        invocations: {
          arrayOf: {
            oneOfType: [
              {
                type: { enum: ["function"] },
                id: "string",
                functionName: "string",
              },
              {
                type: { enum: ["trigger"] },
                id: "string",
                tableName: "string",
              },
              {
                type: { enum: ["jobControl"] },
                id: "string",
                jobName: "string",
                operation: { enum: JOB_CONTROL_OPERATIONS },
                tableName: "string",
              },
            ],
          },
        },
      },
    },
  },
  db_context: {
    jsonbSchema: {
      type: {
        transaction_id: "string",
        transaction_started_at: "string",
        statement_started_at: "string",
        current_role: "string",
        session_user: "string",
        application_name: "string",
      },
    },
  },
} as const;

export type AuditTableInsertRow = TableRowFromColumnDefinitions<
  typeof AUDIT_TABLE_COLUMN_DEFINITIONS
>;
export type AuditTableRow = Required<AuditTableInsertRow>;
export const AUDIT_TABLE_COLUMN_NAMES = Object.fromEntries(
  Object.keys(AUDIT_TABLE_COLUMN_DEFINITIONS).map((columnName) => [
    columnName,
    columnName,
  ]),
) as { [K in keyof AuditTableRow]: K };
export const AUDIT_TABLE_COLUMNS = Object.values(AUDIT_TABLE_COLUMN_NAMES);
