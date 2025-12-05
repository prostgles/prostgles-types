const DANGEROUS_PROTO_PROPS = ["__proto__", "constructor", "prototype"];

/**
 * Safely check if an object has a property (works with __proto__ and constructor)
 */
export const safeHasOwn = (obj: object, key: string): boolean => {
  return Object.prototype.hasOwnProperty.call(obj, key);
};

/**
 * Safely get a property value without triggering prototype chain issues
 */
export const safeGetProperty = (obj: object, key: string): any => {
  if (DANGEROUS_PROTO_PROPS.includes(key)) {
    // Use Object.getOwnPropertyDescriptor to safely access these properties
    const descriptor = Object.getOwnPropertyDescriptor(obj, key);
    return descriptor?.value;
  }
  return (obj as Record<string, any>)[key];
};

export const safeGetKeys = (obj: object): string[] => {
  const keys = Object.keys(obj);

  // Object.keys already returns own enumerable properties
  // But we need to also check for dangerous props that might be own properties
  for (const prop of DANGEROUS_PROTO_PROPS) {
    if (safeHasOwn(obj, prop) && !keys.includes(prop)) {
      keys.push(prop);
    }
  }

  return keys;
};
