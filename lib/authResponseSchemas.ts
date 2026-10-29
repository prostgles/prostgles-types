import type { JSONB } from "./JSONBSchemaValidation/JSONBSchema";

const message = { type: "string", optional: true } as const;
const success = { success: { enum: [true] }, message } as const;
const failure = { success: { enum: [false] }, message } as const;
const commonFailureCodes = [
  "server-error",
  "rate-limit-exceeded",
  "something-went-wrong",
] as const;
const authFailureCodes = [
  ...commonFailureCodes,
  "no-match",
  "inactive-account",
] as const;

export const authResponseSchemas = {
  authSuccess: {
    type: {
      ...success,
      code: { enum: [undefined], optional: true },
      token: { type: "string", optional: true },
    },
  },
  commonFailure: { type: { ...failure, code: { enum: commonFailureCodes } } },
  authFailure: { type: { ...failure, code: { enum: authFailureCodes } } },
  magicLinkAuthSuccess: {
    type: {
      ...success,
      code: { enum: ["email-verification-code-sent", "magic-link-sent"] },
    },
  },
  magicLinkAuthFailure: {
    type: {
      ...failure,
      code: {
        enum: [
          ...authFailureCodes,
          "expired-magic-link",
          "invalid-magic-link",
          "used-magic-link",
        ],
      },
    },
  },
  oauthRegisterFailure: {
    type: {
      ...failure,
      code: { enum: [...commonFailureCodes, "provider-issue"] },
    },
  },
  passwordLoginFailure: {
    type: {
      ...failure,
      code: {
        enum: [
          ...authFailureCodes,
          "totp-token-missing",
          "invalid-username",
          "username-missing",
          "invalid-email",
          "password-missing",
          "invalid-password",
          "is-from-OAuth",
          "is-from-magic-link",
          "invalid-totp-recovery-code",
          "invalid-totp-code",
          "email-not-confirmed",
        ],
      },
    },
  },
  passwordRegisterFailure: {
    type: {
      ...failure,
      code: {
        enum: [
          ...commonFailureCodes,
          "weak-password",
          "user-already-registered",
          "username-missing",
          "password-missing",
          "invalid-email-confirmation-code",
          "expired-email-confirmation-code",
          "inactive-account",
        ],
      },
    },
  },
  passwordRegisterSuccess: {
    type: {
      ...success,
      code: {
        enum: [
          "email-verification-code-sent",
          "already-registered-but-did-not-confirm-email",
        ],
      },
    },
  },
  codeVerificationFailure: {
    type: {
      ...failure,
      code: {
        enum: [...authFailureCodes, "invalid-otp-code", "expired-otp-code"],
      },
    },
  },
  emailConfirmationSuccess: {
    type: { ...success, code: { enum: ["email-verified"] } },
  },
  invalidEmail: { type: { ...failure, code: { enum: ["invalid-email"] } } },
} as const satisfies Record<string, JSONB.FieldTypeObj>;
