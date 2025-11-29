export function includes<T>(array: T[] | readonly T[], elem: any): elem is T {
  return array.some((v) => v === elem);
}
