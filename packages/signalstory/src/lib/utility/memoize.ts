/**
 * Memoizes a function by caching its result and returning the cached result on subsequent calls.
 * @param fn - The function to be memoized.
 * @returns A memoized version of the input function.
 */
export function memoize<T>(fn: () => T): () => T {
  let cachedResult: T | undefined;

  return () => {
    if (cachedResult === undefined) {
      cachedResult = fn();
    }
    return cachedResult;
  };
}
