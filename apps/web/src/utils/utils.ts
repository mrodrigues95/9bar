// SAFETY: Object.keys returns the object's own string keys at runtime, which is exactly
// Array<keyof T>. The assertion only recovers the key type that the standard library erases.
export const objectKeys = <T extends object>(obj: T) => Object.keys(obj) as Array<keyof T>;
