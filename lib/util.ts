import { AnyObject, JoinPath, TS_COLUMN_DATA_TYPES } from ".";
import { md5 } from "./md5";

export function asName(str: string) {
  if (str === null || str === undefined || !str.toString || !str.toString())
    throw "Expecting a non empty string";

  return `"${str.toString().replace(/"/g, `""`)}"`;
}

export const pickKeys = <T extends AnyObject, Include extends keyof T>(
  obj: T,
  keys: Include[] | readonly Include[] = [],
  onlyIfDefined = true,
): Pick<T, Include> => {
  if (!keys.length) {
    return {} as T;
  }
  if (obj && keys.length) {
    let res = {} as T;
    keys.forEach((k) => {
      if (onlyIfDefined && obj[k] === undefined) {
      } else {
        res[k] = obj[k];
      }
    });
    return res;
  }

  return obj;
};

export function omitKeys<T extends AnyObject, Exclude extends keyof T>(
  obj: T,
  exclude: Exclude[],
): Omit<T, Exclude> {
  //@ts-ignore
  return pickKeys(
    obj,
    //@ts-ignore
    getKeys(obj).filter((k) => !exclude.includes(k)),
  );
}

export function filter<T extends AnyObject, ArrFilter extends Partial<T>>(
  array: T[],
  arrFilter: ArrFilter,
): T[] {
  return array.filter((d) => Object.entries(arrFilter).every(([k, v]) => d[k] === v));
}
export function find<T extends AnyObject, ArrFilter extends Partial<T>>(
  array: T[],
  arrFilter: ArrFilter,
): T | undefined {
  return filter(array, arrFilter)[0];
}

export function stableStringify(
  data: AnyObject,
  opts: Function | { cmp?: Function; cycles?: boolean } = {},
): string {
  if (!opts) opts = {};
  if (typeof opts === "function") opts = { cmp: opts };
  var cycles = typeof opts.cycles === "boolean" ? opts.cycles : false;

  var cmp =
    opts.cmp &&
    (function (f) {
      return function (node: any) {
        return function (a: any, b: any) {
          var aobj = { key: a, value: node[a] };
          var bobj = { key: b, value: node[b] };
          return f(aobj, bobj);
        };
      };
    })(opts.cmp);

  var seen: any[] = [];
  return (function stringify(node) {
    if (node && node.toJSON && typeof node.toJSON === "function") {
      node = node.toJSON();
    }

    if (node === undefined) return;
    if (typeof node == "number") return isFinite(node) ? "" + node : "null";
    if (typeof node !== "object") return JSON.stringify(node);

    var i, out;
    if (Array.isArray(node)) {
      out = "[";
      for (i = 0; i < node.length; i++) {
        if (i) out += ",";
        out += stringify(node[i]) || "null";
      }
      return out + "]";
    }

    if (node === null) return "null";

    if (seen.indexOf(node) !== -1) {
      if (cycles) return JSON.stringify("__cycle__");
      throw new TypeError("Converting circular structure to JSON");
    }

    var seenIndex = seen.push(node) - 1;
    var keys = Object.keys(node).sort(cmp && cmp(node));
    out = "";
    for (i = 0; i < keys.length; i++) {
      var key = keys[i]!;
      var value = stringify(node[key]);

      if (!value) continue;
      if (out) out += ",";
      out += JSON.stringify(key) + ":" + value;
    }
    seen.splice(seenIndex, 1);
    return "{" + out + "}";
  })(data)!;
}

export type TextPatch = {
  from: number;
  to: number;
  text: string;
  md5: string;
};

export function getTextPatch(oldStr: string, newStr: string): TextPatch | string {
  /* Big change, no point getting diff */
  if (!oldStr || !newStr || !oldStr.trim().length || !newStr.trim().length) return newStr;

  /* Return no change if matching */
  if (oldStr === newStr)
    return {
      from: 0,
      to: 0,
      text: "",
      md5: md5(newStr),
    };

  function findLastIdx(direction = 1) {
    let idx = direction < 1 ? -1 : 0,
      found = false;
    while (!found && Math.abs(idx) <= newStr.length) {
      const args = direction < 1 ? [idx] : [0, idx];

      let os = oldStr.slice(...args),
        ns = newStr.slice(...args);

      if (os !== ns) found = true;
      else idx += Math.sign(direction) * 1;
    }

    return idx;
  }

  let from = findLastIdx() - 1,
    to = oldStr.length + findLastIdx(-1) + 1,
    toNew = newStr.length + findLastIdx(-1) + 1;
  return {
    from,
    to,
    text: newStr.slice(from, toNew),
    md5: md5(newStr),
  };
}

export function unpatchText(original: string | null, patch: TextPatch): string {
  if (!patch || typeof patch === "string") return patch as unknown as string;
  const { from, to, text, md5: md5Hash } = patch;
  if (text === null || original === null) return text;
  let res = original.slice(0, from) + text + original.slice(to);
  if (md5Hash && md5(res) !== md5Hash)
    throw (
      "Patch text error: Could not match md5 hash: (original/result) \n" + original + "\n" + res
    );
  return res;
}

export function isEmpty(obj?: any): boolean {
  for (var v in obj) return false;
  return true;
}

export const isNotEmpty = <T extends Record<string, unknown>>(
  obj?: T | null | undefined,
): obj is T => !isEmpty(obj);

/* Get nested property from an object */
export function get(obj: any, propertyPath: string | string[]): any {
  let p = propertyPath,
    o = obj;

  if (!obj) return obj;
  if (typeof p === "string") p = p.split(".");
  return p.reduce((xs, x) => {
    if (xs && xs[x]) {
      return xs[x];
    } else {
      return undefined;
    }
  }, o);
}

export const getObjectEntries = <T extends Record<string, any>>(
  obj: T,
): [keyof T, T[keyof T]][] => {
  return Object.entries(obj) as [keyof T, T[keyof T]][];
};

export function isObject(obj: any | undefined): obj is Record<string, any> {
  return Boolean(obj && typeof obj === "object" && !Array.isArray(obj));
}
export function isDefined<T>(v: T | undefined | void | null): v is NonNullable<T> {
  return v !== undefined && v !== null;
}

export function getKeys<T extends Record<string, any>>(o: T): (keyof T & string)[] {
  return Object.keys(o) as unknown as (keyof T & string)[];
}

export type Explode<T> =
  keyof T extends infer K ?
    K extends unknown ?
      { [I in keyof T]: I extends K ? T[I] : never }
    : never
  : never;
export type AtMostOne<T> = Explode<Partial<T>>;
export type AtLeastOne<T, U = { [K in keyof T]: Pick<T, K> }> = Partial<T> & U[keyof U];
export type ExactlyOne<T> = AtMostOne<T> & AtLeastOne<T>;

type UnionKeys<T> = T extends T ? keyof T : never;
type StrictUnionHelper<T, TAll> =
  T extends any ? T & Partial<Record<Exclude<UnionKeys<TAll>, keyof T>, never>> : never;
export type StrictUnion<T> = StrictUnionHelper<T, T>;

export type PartialByKeys<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type Simplify<T> = { [K in keyof T]: T[K] } & {};

/**
 * @deprecated
 * use tryCatchV2 instead
 */
export const tryCatch = async <T extends AnyObject>(
  func: () => T | Promise<T>,
): Promise<
  | (T & { hasError?: false; error?: undefined; duration: number })
  | (Partial<Record<keyof T, undefined>> & { hasError: true; error: unknown; duration: number })
> => {
  const startTime = Date.now();
  try {
    const res = await func();
    return {
      ...res,
      duration: Date.now() - startTime,
    };
  } catch (error) {
    return {
      error,
      hasError: true,
      duration: Date.now() - startTime,
    } as any;
  }
};

export type ParsedJoinPath = Required<JoinPath>;
export const reverseJoinOn = (on: ParsedJoinPath["on"]) => {
  return on.map((constraint) =>
    Object.fromEntries(Object.entries(constraint).map(([left, right]) => [right, left])),
  );
};

/**
 * result = [
 *  { table, on: parsedPath[0] }
 *  ...parsedPath.map(p => ({ table: p.table, on: reversedOn(parsedPath[i+1].on) }))
 * ]
 */
export const reverseParsedPath = (parsedPath: ParsedJoinPath[], table: string) => {
  const newPPath: ParsedJoinPath[] = [{ table, on: [{}] }, ...(parsedPath ?? [])];
  return newPPath
    .map((pp, i) => {
      const nextPath = newPPath[i + 1];
      if (!nextPath) return undefined;
      return {
        table: pp.table,
        on: reverseJoinOn(nextPath.on),
      };
    })
    .filter(isDefined)
    .reverse();
};

type FilterMatch<T, U> = T extends U ? T : undefined;

export const extractTypeUtil = <T extends AnyObject, U extends Partial<T>>(
  obj: T,
  objSubType: U,
): FilterMatch<T, U> => {
  if (Object.entries(objSubType).every(([k, v]) => obj[k] === v)) {
    return obj as FilterMatch<T, U>;
  }
  return undefined as FilterMatch<T, U>;
};

export const safeStringify = (obj: AnyObject) => {
  const seen = new WeakSet();
  return JSON.stringify(obj, (key, value: any) => {
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) {
        return "[Circular]";
      }
      seen.add(value);
    }
    return value;
  });
};
export const getSerialisableError = (
  rawError: any,
  includeStack = false,
): AnyObject | any[] | string | undefined | null => {
  if (rawError === null || rawError === undefined) {
    return rawError;
  }
  if (
    typeof rawError === "string" ||
    typeof rawError === "boolean" ||
    typeof rawError === "bigint" ||
    typeof rawError === "undefined" ||
    typeof rawError === "number"
  ) {
    return rawError?.toString();
  }

  if (rawError instanceof DOMException) {
    return {
      name: rawError.name,
      message: rawError.message,
      code: rawError.code,
      ...(includeStack ? { stack: rawError.stack } : {}),
    };
  }
  if (rawError instanceof Error) {
    const errorObj = Object.getOwnPropertyNames(rawError).reduce(
      (acc, key) => ({
        ...acc,
        [key]: (rawError as AnyObject)[key],
      }),
      {} as AnyObject,
    );
    const result = JSON.parse(safeStringify(errorObj));
    if (!includeStack) {
      return omitKeys(result, ["stack"]);
    }
    return result;
  }

  if (Array.isArray(rawError)) {
    return rawError.map((item) => getSerialisableError(item, includeStack));
  }

  return rawError;
};

export const getProperty = <T extends object, K extends string>(
  obj: T,
  key: K | string,
): K extends keyof T ? T[K]
: K extends string ? T[keyof T] | undefined
: undefined => {
  if (!Object.keys(obj).includes(key)) return undefined as K extends keyof T ? T[K] : undefined;
  return obj[key as keyof T] as K extends keyof T ? T[K] : undefined;
};

export const withTimeout = <T>(promise: Promise<T>, ms: number): Promise<T> => {
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error(`Timed out after ${ms}ms`)), ms),
  );
  return Promise.race([promise, timeout]);
};

export const getEntries = <T extends AnyObject>(obj: T) =>
  Object.entries(obj) as [keyof T, T[keyof T]][];

export const fromEntries = <K extends string | number | symbol, V>(
  entries: readonly (readonly [K, V])[],
): Record<K, V> => {
  return Object.fromEntries(entries) as Record<K, V>;
};
