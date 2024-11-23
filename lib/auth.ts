import { AnyObject } from "./filters";

export type IdentityProvider = 
| "google" 
| "microsoft" 
| "github" 
| "apple"
| "facebook" 
| "twitter" 
| "linkedin" 
;

export type UserLike = {
  id: string;
  type: string;
  [key: string]: any;
};

export type EmailAuthType = "withPassword" | "magicLink";

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
   * Identity providers enabled on the server
   * if undefined, the server does not support social login
   */
  providers: Partial<Record<IdentityProvider, { url: string; }>>;

  /**
   * Email login methods enabled on the server
   */
  login: EmailAuthType | undefined;

  /**
   * Email registration methods enabled on the server
   */
  register: EmailAuthType | undefined;

  /**
   * If server auth publicRoutes is set up and AuthGuard is not explicitly disabled ( disableSocketAuthGuard: true ):
   *  on each connect/reconnect the client pathname is checked and page reloaded if it's not a public page and the client is not logged in
   */
  pathGuard?: boolean;
};