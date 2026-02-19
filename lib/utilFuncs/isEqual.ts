/**
 * Compare two objects for equality
 * Returns false if any circular references are detected
 */
export const isEqual = (x: any, y: any, circularMode: CircularMode = "trace"): boolean => {
  return isEqualWithSeen(x, y, undefined, circularMode);
};

type CircularMode = "quiet" | "trace" | "error" | "return-true";

const isEqualWithSeen = (
  x: any,
  y: any,
  seen = new WeakMap<object, WeakSet<object>>(),
  circularMode: CircularMode,
): boolean => {
  if (x === y) return true;
  if (typeof x !== typeof y) return false;
  if (x === null || y === null) return false;

  if (typeof x !== "object" || typeof y !== "object") {
    return x !== x && y !== y;
  }

  let ySet = seen.get(x);
  if (ySet?.has(y)) {
    if (circularMode !== "quiet") {
      console.trace("Circular reference detected in isEqual", x, y);
    }
    if (circularMode === "error") {
      throw new Error("Circular reference detected in isEqual");
    }
    if (circularMode === "return-true") {
      return true;
    }
    return false;
  }
  if (!ySet) {
    ySet = new WeakSet<object>();
    seen.set(x, ySet);
  }
  ySet.add(y);

  if (x instanceof Date && y instanceof Date) {
    return x.getTime() === y.getTime();
  }

  if (x instanceof RegExp && y instanceof RegExp) {
    return x.source === y.source && x.flags === y.flags;
  }

  const xIsArray = Array.isArray(x);
  const yIsArray = Array.isArray(y);
  if (xIsArray && yIsArray) {
    if (x.length !== y.length) return false;
    for (let i = 0; i < x.length; i++) {
      if (!isEqualWithSeen(x[i], y[i], seen, circularMode)) return false;
    }
    return true;
  }

  if (xIsArray !== yIsArray) {
    return false;
  }

  if (ArrayBuffer.isView(x) && ArrayBuffer.isView(y)) {
    if (x.byteLength !== y.byteLength) return false;
    const xView = new Uint8Array(x.buffer, x.byteOffset, x.byteLength);
    const yView = new Uint8Array(y.buffer, y.byteOffset, y.byteLength);
    for (let i = 0; i < xView.length; i++) {
      if (xView[i] !== yView[i]) return false;
    }
    return true;
  }

  if (x instanceof ArrayBuffer && y instanceof ArrayBuffer) {
    if (x.byteLength !== y.byteLength) return false;
    const xView = new Uint8Array(x);
    const yView = new Uint8Array(y);
    for (let i = 0; i < xView.length; i++) {
      if (xView[i] !== yView[i]) return false;
    }
    return true;
  }

  const xKeys = Object.keys(x);
  if (xKeys.length !== Object.keys(y).length) {
    return false;
  }

  for (const key of xKeys) {
    if (key in y) {
      const xProp = x[key];
      const yProp = y[key];
      if (!isEqualWithSeen(xProp, yProp, seen, circularMode)) {
        return false;
      }
    } else {
      return false;
    }
  }

  return true;
};
