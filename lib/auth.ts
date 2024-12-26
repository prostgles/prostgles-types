export type IdentityProvider =
  | "google"
  | "microsoft"
  | "github"
  | "apple"
  | "facebook"
  | "twitter"
  | "linkedin";

export type UserLike = {
  id: string;
  type: string;
  [key: string]: any;
};

/**
 * - withPassword: email and password required
 * - withMagicLink: email required
 */
export type AuthType = "withPassword" | "withMagicLink";

/**
 * Auth object sent from server to client
 */
export type AuthSocketSchema = {
  /**
   * User data as returned from server auth.getClientUser
   * if undefined, the client is not logged in
   */
  user: UserLike | undefined;

  /**
   * Identity providers enabled and configured on the server.
   */
  providers: Partial<Record<IdentityProvider, { url: string }>> | undefined;

  /**
   * Email login methods enabled on the server
   */
  loginType: AuthType | undefined;

  /**
   * Email registration methods enabled on the server
   */
  register: { type: AuthType; url: string } | undefined;

  /**
   * If server auth publicRoutes is set up and AuthGuard is not explicitly disabled ( disableSocketAuthGuard: true ):
   *  on each connect/reconnect the client pathname is checked and page reloaded if it's not a public page and the client is not logged in
   */
  pathGuard?: boolean;
};

type Failure<Code extends string> = { success: false; code: Code; message?: string };
type Success<Code extends string> = { success: true; code: Code; message?: string };

export declare namespace AuthRequest {
  export type LoginData = {
    /**
     * Email or username
     */
    username: string;
    /**
     * Undefined if loginType must be withMagicLink
     */
    password?: string;
    remember_me?: boolean;
    totp_token?: string;
    totp_recovery_code?: string;
  };

  export type RegisterData = Pick<LoginData, "username" | "password">;
}

export type CommonAuthFailure = Failure<
  "server-error" | "rate-limit-exceeded" | "something-went-wrong"
>;

export declare namespace AuthResponse {
  export type AuthSuccess = {
    success: true;
    code?: undefined;
    message?: string;
  };

  export type AuthFailure =
    | CommonAuthFailure
    | { success: false; code: "no-match"; message?: string }
    | { success: false; code: "inactive-account"; message?: string };

  export type MagicLinkAuthSuccess = AuthSuccess;
  export type MagicLinkAuthFailure =
    | AuthFailure
    | Failure<"expired-magic-link" | "invalid-magic-link" | "used-magic-link">;

  export type OAuthRegisterSuccess = AuthSuccess;
  export type OAuthRegisterFailure = CommonAuthFailure | Failure<"provider-issue">;

  export type PasswordLoginSuccess = AuthSuccess;
  export type PasswordLoginFailure =
    | AuthFailure
    | Failure<
        | "totp-token-missing"
        | "invalid-username"
        | "username-missing"
        | "password-missing"
        | "invalid-password"
        | "is-from-OAuth"
        | "is-from-magic-link"
        | "invalid-totp-recovery-code"
        | "invalid-totp-code"
        | "email-not-confirmed"
      >;

  export type PasswordRegisterSuccess = Success<
    "email-verification-code-sent" | "already-registered-but-did-not-confirm-email"
  >;
  export type PasswordRegisterFailure =
    | CommonAuthFailure
    | Failure<
        | "weak-password"
        | "user-already-registered"
        | "username-missing"
        | "password-missing"
        | "invalid-email-confirmation-code"
        | "expired-email-confirmation-code"
        | "inactive-account"
      >;
}
