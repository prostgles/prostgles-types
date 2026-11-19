import type { JobRecord } from "./jobTable";

export type JobStatus = JobRecord["status"];

/** Start new work or retry failed/cancelled work; rerun succeeded work; cancel pending/running work. */
export const JOB_CONTROL_OPERATIONS = [
  "startOrRetry",
  "rerun",
  "cancel",
] as const;
export type JobControlOperation = (typeof JOB_CONTROL_OPERATIONS)[number];

export type JobControlFunctionMetadata = {
  jobName: string;
  rowArg: "row";
} & (
  | { operation: JobControlOperation; operations?: never }
  | { operations: readonly JobControlOperation[]; operation?: never }
);

/** Server-resolved row-job binding used to render a published function's controls. */
export type JobControlBinding = Pick<
  JobControlFunctionMetadata,
  "jobName" | "rowArg"
> & {
  tableName: string;
  columnName: string;
} & (
    | {
        operation: JobControlOperation;
        allowedStatuses: readonly JobStatus[];
        operations?: never;
      }
    | {
        operations: Partial<Record<JobControlOperation, readonly JobStatus[]>>;
        operation?: never;
        allowedStatuses?: never;
      }
  );
