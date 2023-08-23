/**
 * Deeply freezes an object and its properties, making it immutable at runtime.
 * @template T - The type of the object.
 * @param {T} obj - The object to be deeply frozen.
 * @returns {T} The deeply frozen object.
 */
export function deepFreeze<T>(obj: T): T {
  if (obj) {
    Object.freeze(obj);

    const oIsFunction = typeof obj === 'function';
    const hasOwnProp = Object.prototype.hasOwnProperty;

    Object.getOwnPropertyNames(obj).forEach(function (prop: string) {
      if (
        hasOwnProp.call(obj, prop) &&
        (oIsFunction
          ? prop !== 'caller' && prop !== 'callee' && prop !== 'arguments'
          : true)
      ) {
        const propValue = obj[prop as keyof T];
        if (
          propValue !== null &&
          (typeof propValue === 'object' || typeof propValue === 'function') &&
          !Object.isFrozen(propValue)
        ) {
          deepFreeze(propValue);
        }
      }
    });
  }

  return obj;
}
