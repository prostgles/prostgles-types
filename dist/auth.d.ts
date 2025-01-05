export type IdentityProvider = "google" | "microsoft" | "github" | "apple" | "facebook" | "twitter" | "linkedin" | "customOAuth";
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
export type AuthSocketSchema = {
    /**
     * User data as returned from server auth.getClientUser
     * if undefined, the client is not logged in
     */
    user: UserLike | undefined;
    /**
     * Identity providers enabled and configured on the server.
     */
    providers: Partial<Record<IdentityProvider, {
        url: string;
        displayName?: string;
        displayIconPath?: string;
    }>> | undefined;
    /**
     * Email login methods enabled on the server
     */
    loginType: LocalLoginMode | undefined;
    /**
     * Email registration methods enabled on the server
     */
    signupWithEmailAndPassword: {
        minPasswordLength: number;
        url: string;
    } | undefined;
    /**
     * If server auth publicRoutes is set up and AuthGuard is not explicitly disabled ( disableSocketAuthGuard: true ):
     *  on each connect/reconnect the client pathname is checked and page reloaded if it's not a public page and the client is not logged in
     */
    pathGuard?: boolean;
    /**
     * Account signup method if the client sid points to a user account
     */
    preferredLogin: "email" | IdentityProvider | undefined;
};
type Failure<Code extends string> = {
    success: false;
    code: Code;
    message?: string;
};
type Success<Code extends string> = {
    success: true;
    code: Code;
    message?: string;
};
export declare namespace AuthRequest {
    type LoginData = {
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
    type RegisterData = Pick<LoginData, "username" | "password">;
}
export type CommonAuthFailure = Failure<"server-error" | "rate-limit-exceeded" | "something-went-wrong">;
export declare namespace AuthResponse {
    type AuthSuccess = {
        success: true;
        code?: undefined;
        message?: string;
    };
    type AuthFailure = CommonAuthFailure | {
        success: false;
        code: "no-match";
        message?: string;
    } | {
        success: false;
        code: "inactive-account";
        message?: string;
    };
    type MagicLinkAuthSuccess = {
        success: true;
        code: "email-verification-code-sent" | "magic-link-sent";
        message?: string;
    };
    type MagicLinkAuthFailure = AuthFailure | Failure<"expired-magic-link" | "invalid-magic-link" | "used-magic-link">;
    type OAuthRegisterSuccess = AuthSuccess;
    type OAuthRegisterFailure = CommonAuthFailure | Failure<"provider-issue">;
    type PasswordLoginSuccess = AuthSuccess;
    type PasswordLoginFailure = AuthFailure | Failure<"totp-token-missing" | "invalid-username" | "username-missing" | "invalid-email" | "password-missing" | "invalid-password" | "is-from-OAuth" | "is-from-magic-link" | "invalid-totp-recovery-code" | "invalid-totp-code" | "email-not-confirmed">;
    type PasswordRegisterFailure = CommonAuthFailure | Failure<"weak-password" | "user-already-registered" | "username-missing" | "password-missing" | "invalid-email-confirmation-code" | "expired-email-confirmation-code" | "inactive-account">;
    type PasswordRegisterSuccess = Success<"email-verification-code-sent" | "already-registered-but-did-not-confirm-email">;
    type CodeVerificationFailure = AuthFailure | Failure<"invalid-otp-code" | "expired-otp-code">;
    type PasswordRegisterEmailConfirmationFailure = CodeVerificationFailure;
    type PasswordRegisterEmailConfirmationSuccess = Success<"email-verified">;
}
export {};
//# sourceMappingURL=auth.d.ts.map