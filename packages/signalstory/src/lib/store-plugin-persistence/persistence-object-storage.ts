/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Represents the interface for store persistence methods with asynchronous operations.
 */
export interface ObjectStorage<TValue = unknown> {
  /**
   * Retrieves the value associated with the specified key and processes it asynchronously.
   * @param key - The key to retrieve the value for.
   * @param callback - A callback function to handle the retrieved value asynchronously.
   */
  init(storeName: string, callback?: () => void): void;
  getAndProcessState(callback: (value: TValue | null) => void): void;
  setState(value: TValue): void;
  clearState(): void;
}

/**
 * Type guard to check if an object implements the `PersistenceStorageAsynchronous` interface.
 * @param obj - The object to check.
 * @returns True if the object implements the `PersistenceStorageAsynchronous` interface, false otherwise.
 */
export function isObjectStorage(obj: any): obj is ObjectStorage {
  return (
    typeof obj === 'object' &&
    typeof obj.getAndProcessState === 'function' &&
    typeof obj.setState === 'function' &&
    typeof obj.clearState === 'function'
  );
}
