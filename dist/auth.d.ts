export type IdentityProvider = "google" | "microsoft" | "github" | "apple" | "facebook" | "twitter" | "linkedin";
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
    providers: Partial<Record<IdentityProvider, {
        url: string;
    }>> | undefined;
    /**
     * Email login methods enabled on the server
     */
    loginType: AuthType | undefined;
    /**
     * Email registration methods enabled on the server
     */
    register: {
        type: AuthType;
        url: string;
    } | undefined;
    /**
     * If server auth publicRoutes is set up and AuthGuard is not explicitly disabled ( disableSocketAuthGuard: true ):
     *  on each connect/reconnect the client pathname is checked and page reloaded if it's not a public page and the client is not logged in
     */
    pathGuard?: boolean;
};
export declare namespace AuthRequest {
    type LoginData = {
        /**
         * Email or username
         */
        username: string;
        /**
         * Undefined if loginType is withMagicLink
         */
        password?: string;
        remember_me?: boolean;
        totp_token?: string;
        totp_recovery_code?: string;
    };
    type RegisterData = Pick<LoginData, "username" | "password">;
}
export type CommonAuthFailure = {
    success: false;
    code: "rate-limit-exceeded";
    message?: string;
} | {
    success: false;
    code: "something-went-wrong";
    message?: string;
};
export type AuthFailure = CommonAuthFailure | {
    success: false;
    code: "no-match";
    message?: string;
} | {
    success: false;
    code: "inactive-account";
    message?: string;
};
export type AuthSuccess = {
    success: true;
    code?: undefined;
    message?: string;
};
export type OAuthRegisterFailure = CommonAuthFailure | {
    success: false;
    code: "provider-issue";
    message?: string;
};
export declare namespace AuthResponse {
    type MagicLinkAuthSuccess = {
        success: true;
        code: "magic-link-sent";
        message?: string;
    };
    type MagicLinkAuthFailure = AuthFailure | {
        success: false;
        code: "expired-magic-link";
        message?: string;
    };
    type OAuthRegisterSuccess = AuthSuccess;
    type OAuthRegisterFailure = CommonAuthFailure | {
        success: false;
        code: "provider-issue";
        message?: string;
    };
    type PasswordLoginSuccess = AuthSuccess;
    type PasswordLoginFailure = AuthFailure | {
        success: false;
        code: "totp-token-missing";
        message?: string;
    } | {
        success: false;
        code: "username-missing";
        message?: string;
    } | {
        success: false;
        code: "password-missing";
        message?: string;
    } | {
        success: false;
        code: "invalid-totp-recovery-code";
        message?: string;
    } | {
        success: false;
        code: "invalid-totp-code";
        message?: string;
    } | {
        success: false;
        code: "email-not-confirmed";
        message?: string;
    };
    type PasswordRegisterSuccess = {
        success: true;
        code: "email-verification-code-sent";
        message?: string;
    } | {
        success: true;
        code: "already-registered-but-did-not-confirm-email";
        message?: string;
    };
    type PasswordRegisterFailure = CommonAuthFailure | {
        success: false;
        code: "weak-password";
        message?: string;
    } | {
        success: false;
        code: "username-missing";
        message?: string;
    } | {
        success: false;
        code: "password-missing";
        message?: string;
    } | {
        success: false;
        code: "inactive-account";
        message?: string;
    };
}
//# sourceMappingURL=auth.d.ts.map