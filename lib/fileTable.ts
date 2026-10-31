import type { TableRowFromColumnDefinitions } from "./tableRowFromColumnDefinitions";
import { omitKeys } from "./util";

export const FILE_TABLE_COLUMN_DEFINITIONS = {
  id: `UUID PRIMARY KEY DEFAULT gen_random_uuid()`,
  /* NULL for legacy objects stored under their file ID. */
  storage_key: `UUID UNIQUE`,
  extension: `TEXT NOT NULL DEFAULT ''`,
  content_type: `TEXT NOT NULL DEFAULT ''`,
  content_length: `BIGINT NOT NULL DEFAULT 0`,
  etag: `TEXT NOT NULL DEFAULT ''`,
  original_name: `TEXT NOT NULL`,
  original_last_modified: `TIMESTAMPTZ`,
  description: `TEXT`,
  url: `TEXT NOT NULL DEFAULT ''`,
  cloud_url: `TEXT`,
  local_file_path: `TEXT`,
  signed_url: `TEXT`,
  signed_url_expires: `BIGINT`,
  added: `TIMESTAMP NOT NULL DEFAULT NOW()`,
  updated: `TIMESTAMP NOT NULL DEFAULT NOW()`,
  deleted: `TIMESTAMPTZ`,
  deleted_from_storage: `TIMESTAMPTZ`,
  /* Actual bytes live in storage; this column only holds a placeholder. */
  data: `BYTEA NOT NULL CHECK (data = decode('01', 'hex'))`,
} as const;

export const FILE_TABLE_VERSION_COLUMN_DEFINITIONS = {
  version: `INTEGER NOT NULL DEFAULT 1`,
} as const;

export const FILE_VERSION_TABLE_COLUMN_DEFINITIONS = {
  ...omitKeys(FILE_TABLE_COLUMN_DEFINITIONS, ["data"]),
  storage_key: `UUID NOT NULL`,
  /* The server adds the foreign key constraint. */
  file_id: `UUID NOT NULL`,
  version: `INTEGER NOT NULL`,
  created: `TIMESTAMP NOT NULL DEFAULT NOW()`,
} as const;

export type FileTableInsertRow<Binary = ArrayBuffer | Uint8Array> =
  TableRowFromColumnDefinitions<typeof FILE_TABLE_COLUMN_DEFINITIONS, Binary> &
    Partial<
      TableRowFromColumnDefinitions<
        typeof FILE_TABLE_VERSION_COLUMN_DEFINITIONS
      >
    >;
export type FileTableRow<Binary = ArrayBuffer | Uint8Array> = Required<
  TableRowFromColumnDefinitions<typeof FILE_TABLE_COLUMN_DEFINITIONS, Binary>
> &
  Partial<
    Required<
      TableRowFromColumnDefinitions<
        typeof FILE_TABLE_VERSION_COLUMN_DEFINITIONS
      >
    >
  >;

export type FileVersionTableInsertRow = TableRowFromColumnDefinitions<
  typeof FILE_VERSION_TABLE_COLUMN_DEFINITIONS
>;
export type FileVersionTableRow = Required<FileVersionTableInsertRow>;
