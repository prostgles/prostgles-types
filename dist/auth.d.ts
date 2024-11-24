export type IdentityProvider = "google" | "microsoft" | "github" | "apple" | "facebook" | "twitter" | "linkedin";
export type UserLike = {
    id: string;
    type: string;
    [key: string]: any;
};
export type EmailAuthType = "withPassword" | "withMagicLink";
export type EmailSignupType = "withPassword" | "withMagicLink";
export type AuthSocketSchema = {
    user: UserLike | undefined;
    providers: Partial<Record<IdentityProvider, {
        url: string;
    }>> | undefined;
    login: {
        type: EmailAuthType;
        url: string;
    } | undefined;
    register: {
        type: EmailSignupType;
        url: string;
    } | undefined;
    pathGuard?: boolean;
};
//# sourceMappingURL=auth.d.ts.map