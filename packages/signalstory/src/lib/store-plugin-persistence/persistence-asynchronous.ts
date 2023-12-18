/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Represents the interface for store persistence methods with asynchronous operations.
 */
export interface PersistenceStorageAsynchronous<
  TKey = string,
  TValue = unknown,
> {
  /**
   * Retrieves the value associated with the specified key and processes it asynchronously.
   * @param key - The key to retrieve the value for.
   * @param callback - A callback function to handle the retrieved value asynchronously.
   */
  init(key: TKey, onSuccess: () => void): void;
  getAndProcessValue(key: TKey, callback: (value: TValue | null) => void): void;
  setItem(key: TKey, value: TValue): void;
  removeItem(key: TKey): void;
}

/**
 * Type guard to check if an object implements the `PersistenceStorageAsynchronous` interface.
 * @param obj - The object to check.
 * @returns True if the object implements the `PersistenceStorageAsynchronous` interface, false otherwise.
 */
export function isPersistenceStorageAsynchronous(
  obj: any
): obj is PersistenceStorageAsynchronous {
  return (
    typeof obj === 'object' &&
    typeof obj.getAndProcessValue === 'function' &&
    typeof obj.setItem === 'function' &&
    typeof obj.removeItem === 'function'
  );
}
