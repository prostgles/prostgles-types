import type { JobRecord } from "./jobTable";

export type JobStatus = JobRecord["status"];

/** Start new work or retry failed/cancelled work; rerun succeeded work; cancel pending/running work. */
export const JOB_CONTROL_OPERATIONS = [
  "startOrRetry",
  "rerun",
  "cancel",
] as const;
export type JobControlOperation = (typeof JOB_CONTROL_OPERATIONS)[number];

type RowJobControl = { triggerRowArgName: "row"; manualJobIdArgName?: never };
type ManualJobControl = {
  manualJobIdArgName: "jobId";
  triggerRowArgName?: never;
};

export type JobControlFunctionMetadata = (RowJobControl | ManualJobControl) & {
  jobName: string;
  /** A string fixes the operation. An array requires the caller to select one. */
  operation: JobControlOperation | readonly JobControlOperation[];
};

/** Row controls follow a job ID column. Manual controls target a run directly. */
export type JobControlBinding = {
  jobName: string;
  jobsTableName: string;
  operations: Partial<Record<JobControlOperation, readonly JobStatus[]>>;
} & (
  | (RowJobControl & { rowJobIdColumn: string })
  | (ManualJobControl & { rowJobIdColumn?: never })
);
