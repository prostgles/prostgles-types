import type { AuthInput } from "./authContract";
import type { authResponseSchemas } from "./authResponseSchemas";
import type { JSONB } from "./JSONBSchemaValidation/JSONBSchema";

export type IdentityProvider =
  | "google"
  | "microsoft"
  | "github"
  | "apple"
  | "facebook"
  | "twitter"
  | "linkedin"
  | "customOAuth";

export type UserLike = {
  id: string;
  type: string;
  [key: string]: any;
};

/**
 * Used to hint to the client which login mode is available
 */
export type LocalLoginMode = "email" | "email+password";

/**
 * Auth object sent from server to client
 */
export type AuthSocketSchema<U extends UserLike = UserLike> = {
  /**
   * User data as returned from server auth.getClientUser
   * if undefined, the client is not logged in
   */
  user: U | undefined;

  /**
   * Identity providers enabled and configured on the server.
   */
  providers:
    | Partial<
        Record<
          IdentityProvider,
          { url: string; displayName?: string; displayIconPath?: string }
        >
      >
    | undefined;

  /**
   * Email login methods enabled on the server
   */
  login:
    | { mode: LocalLoginMode; loginRoute: string; logoutRoute: string }
    | undefined;

  /**
   * Email registration methods enabled on the server
   */
  signupWithEmail:
    | {
        minPasswordLength: number;
        requirePassword: boolean;
        requireInvitation: boolean;
        url: string;
        emailConfirmationRoute: string;
      }
    | undefined;

  /** @deprecated Use signupWithEmail and its requireInvitation flag. */
  signupWithEmailAndPassword:
    | { minPasswordLength: number; url: string; emailConfirmationRoute: string }
    | undefined;

  /**
   * If server auth publicRoutes is set up and AuthGuard is not explicitly disabled ( disableSocketAuthGuard: true ):
   *  on each connect/reconnect the client pathname is checked and page reloaded if it's not a public page and the client is not logged in
   */
  pathGuard?: boolean;

  /**
   * Account signup method if the client sid points to a user account
   */
  preferredLogin: LocalLoginMode | IdentityProvider | undefined;
};

export declare namespace AuthRequest {
  export type LoginData = AuthInput<"login">;
  export type RegisterData = AuthInput<"register">;
  export type ConfirmEmailData = Pick<
    Extract<AuthInput<"magicLinkOrOTP">, { email: string }>,
    "email" | "code"
  >;
}

type ResponseSchemaType<Name extends keyof typeof authResponseSchemas> =
  JSONB.GetType<(typeof authResponseSchemas)[Name]>;

export type CommonAuthFailure = ResponseSchemaType<"commonFailure">;

export declare namespace AuthResponse {
  export type AuthSuccess = ResponseSchemaType<"authSuccess">;
  export type AuthFailure = ResponseSchemaType<"authFailure">;
  export type MagicLinkAuthSuccess = ResponseSchemaType<"magicLinkAuthSuccess">;
  export type MagicLinkAuthFailure = ResponseSchemaType<"magicLinkAuthFailure">;
  export type OAuthRegisterSuccess = AuthSuccess;
  export type OAuthRegisterFailure = ResponseSchemaType<"oauthRegisterFailure">;
  export type PasswordLoginSuccess = AuthSuccess;
  export type PasswordLoginFailure = ResponseSchemaType<"passwordLoginFailure">;
  export type PasswordRegisterFailure =
    ResponseSchemaType<"passwordRegisterFailure">;
  export type PasswordRegisterSuccess =
    ResponseSchemaType<"passwordRegisterSuccess">;
  export type CodeVerificationFailure =
    ResponseSchemaType<"codeVerificationFailure">;
  export type PasswordRegisterEmailConfirmationFailure =
    CodeVerificationFailure;
  export type PasswordRegisterEmailConfirmationSuccess =
    ResponseSchemaType<"emailConfirmationSuccess">;
}
