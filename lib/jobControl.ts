export type JobStatus =
  "pending" | "running" | "succeeded" | "failed" | "cancelled";

/** Start new work or retry failed/cancelled work; rerun succeeded work; cancel pending/running work. */
export type JobControlOperation = "startOrRetry" | "rerun" | "cancel";

export type JobControlFunctionMetadata = {
  jobName: string;
  rowArg: "row";
  operation: JobControlOperation;
};

/** Server-resolved row-job binding used to render a published function's controls. */
export type JobControlBinding = JobControlFunctionMetadata & {
  tableName: string;
  columnName: string;
  allowedStatuses: readonly JobStatus[];
};
