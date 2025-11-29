export type TryCatchResult<T> =
  | { data: T; hasError?: false; error?: undefined; duration: number }
  | { data?: undefined; hasError: true; error: unknown; duration: number };

export const tryCatchV2 = <T>(
  func: () => T
): T extends Promise<infer R> ? Promise<TryCatchResult<Awaited<Promise<R>>>>
: TryCatchResult<T> => {
  const startTime = Date.now();
  try {
    const dataOrResult = func();
    if (dataOrResult instanceof Promise) {
      return new Promise(async (resolve, reject) => {
        const result = await dataOrResult
          .then((data) => ({ data }))
          .catch((error) => {
            return {
              error,
              hasError: true,
            };
          });
        resolve({
          ...result,
          duration: Date.now() - startTime,
        });
      }) as any;
    }
    return {
      data: dataOrResult,
      duration: Date.now() - startTime,
    } as any;
  } catch (error) {
    return {
      error,
      hasError: true,
      duration: Date.now() - startTime,
    } as any;
  }
};
