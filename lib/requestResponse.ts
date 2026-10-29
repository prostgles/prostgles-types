import type { JSONB } from "./JSONBSchemaValidation/JSONBSchema";
import type { MaybePromise } from "./index";

export type RequestResponseSchema = {
  request: Omit<JSONB.FieldTypeObj, "optional">;
  response: Omit<JSONB.FieldTypeObj, "optional">;
};

export type RequestResponseHandler<Schema extends RequestResponseSchema> = (
  data: JSONB.GetType<Schema["request"]>,
) => MaybePromise<JSONB.GetType<Schema["response"]>>;

export type RequestResponseCall<Schema extends RequestResponseSchema> = (
  data: JSONB.GetType<Schema["request"]>,
) => Promise<JSONB.GetType<Schema["response"]>>;
