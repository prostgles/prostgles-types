import { AnyObject } from "./filters";
export type IdentityProvider = "google" | "microsoft" | "github" | "apple" | "facebook" | "twitter" | "linkedin";
export type EmailAuthType = "withPassword" | "magicLink";
export type AuthSocketSchema = {
    user: AnyObject | undefined;
    providers: Partial<Record<IdentityProvider, true>>;
    login: EmailAuthType | undefined;
    register: EmailAuthType | undefined;
    pathGuard?: boolean;
};
//# sourceMappingURL=auth.d.ts.map