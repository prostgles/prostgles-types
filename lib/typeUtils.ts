export type AllKeys<U> = U extends unknown ? keyof U : never;
export type StrictUnion<U> =
  U extends unknown ? U & Partial<Record<Exclude<AllKeys<U>, keyof U>, never>> : never;
