/* eslint-disable @typescript-eslint/no-explicit-any */

export interface AsyncStorage<TValue = unknown> {
  initAsync(storeName: string, callback?: () => void): void;
  getItemAsync(key: string, callback: (value: TValue | null) => void): void;
  setItemAsync(key: string, value: TValue, callback?: () => void): void;
  removeItemAsync(key: string, callback?: () => void): void;
}

/**
 * Type guard to check if an object implements the `PersistenceStorageAsynchronous` interface.
 * @param obj - The object to check.
 * @returns True if the object implements the `PersistenceStorageAsynchronous` interface, false otherwise.
 */
export function isAsyncStorage(obj: any): obj is AsyncStorage {
  return (
    typeof obj === 'object' &&
    typeof obj.initAsync === 'function' &&
    typeof obj.getItemAsync === 'function' &&
    typeof obj.setItemAsync === 'function' &&
    typeof obj.removeItemAsync === 'function'
  );
}
