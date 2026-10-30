import { authResponseSchemas } from "./authResponseSchemas";
import type { JSONB } from "./JSONBSchemaValidation/JSONBSchema";
import type {
  RequestResponseCall,
  RequestResponseHandler,
  RequestResponseSchema,
} from "./requestResponse";

const credentials = {
  username: "string",
  password: { type: "string", optional: true },
} as const;

export const authContract = {
  login: {
    request: {
      type: {
        ...credentials,
        remember_me: { type: "boolean", optional: true },
        totp_token: { type: "string", optional: true },
        totp_recovery_code: { type: "string", optional: true },
      },
    },
    response: {
      oneOf: [
        authResponseSchemas.authSuccess,
        authResponseSchemas.passwordLoginFailure,
        authResponseSchemas.magicLinkAuthSuccess,
        authResponseSchemas.magicLinkAuthFailure,
        authResponseSchemas.oauthRegisterFailure,
        authResponseSchemas.codeVerificationFailure,
      ],
    },
  },
  register: {
    request: {
      type: {
        ...credentials,
        invitationToken: { type: "string", optional: true },
        totpTokenConfirmation: { type: "string", optional: true },
      },
    },
    response: {
      oneOf: [
        authResponseSchemas.passwordRegisterSuccess,
        authResponseSchemas.passwordRegisterFailure,
      ],
    },
  },
  magicLinkOrOTP: {
    request: {
      oneOfType: [
        { id: "string", returnToken: { type: "boolean", optional: true } },
        {
          email: "string",
          code: "string",
          returnToken: { type: "boolean", optional: true },
        },
      ],
    },
    response: {
      oneOf: [
        authResponseSchemas.authSuccess,
        authResponseSchemas.emailConfirmationSuccess,
        authResponseSchemas.magicLinkAuthFailure,
        authResponseSchemas.codeVerificationFailure,
        authResponseSchemas.invalidEmail,
      ],
    },
  },
  logout: {
    request: { type: {} },
    response: {
      oneOf: [
        authResponseSchemas.authSuccess,
        authResponseSchemas.commonFailure,
      ],
    },
  },
} as const satisfies Record<string, RequestResponseSchema>;

export type AuthOperation = keyof typeof authContract;
export type AuthInput<Operation extends AuthOperation> = JSONB.GetType<
  (typeof authContract)[Operation]["request"]
>;
export type AuthOutput<Operation extends AuthOperation> = JSONB.GetType<
  (typeof authContract)[Operation]["response"]
>;
export type AuthCalls = {
  [Operation in AuthOperation]: RequestResponseCall<
    (typeof authContract)[Operation]
  >;
};
export type AuthHandlers = {
  [Operation in AuthOperation]: RequestResponseHandler<
    (typeof authContract)[Operation]
  >;
};
