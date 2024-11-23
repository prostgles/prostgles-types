export type IdentityProvider = "google" | "microsoft" | "github" | "apple" | "facebook" | "twitter" | "linkedin";
export type UserLike = {
    id: string;
    type: string;
    [key: string]: any;
};
export type EmailAuthType = "withPassword" | "magicLink";
export type AuthSocketSchema = {
    user: UserLike | undefined;
    providers: Partial<Record<IdentityProvider, {
        url: string;
    }>>;
    login: EmailAuthType | undefined;
    register: EmailAuthType | undefined;
    pathGuard?: boolean;
};
//# sourceMappingURL=auth.d.ts.map