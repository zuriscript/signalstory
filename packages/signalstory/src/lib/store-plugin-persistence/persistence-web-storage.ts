/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Represents the interface for store persistence methods with synchronous operations.
 */
export interface WebStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

/**
 * Type guard to check if an object implements the `PersistenceStorageSynchronous` interface.
 * @param obj - The object to check.
 * @returns True if the object implements the `PersistenceStorageSynchronous` interface, false otherwise.
 */
export function isWebStorage(obj: any): obj is WebStorage {
  return (
    typeof obj === 'object' &&
    typeof obj.getItem === 'function' &&
    typeof obj.setItem === 'function' &&
    typeof obj.removeItem === 'function'
  );
}

/**
 * Loads a value from storage.
 *
 * @template TState - The type of state to load.
 * @param store - The store instance.
 * @returns The loaded value if available and successfully parsed, otherwise undefined.
 */
export function loadFromStorage<TState>(
  persistenceStorage: WebStorage,
  persistenceKey: string
): TState | undefined {
  const value = persistenceStorage.getItem(persistenceKey);

  try {
    return value ? (JSON.parse(value) as TState) : undefined;
  } catch {
    return undefined;
  }
}

/**
 * Saves a value to local storage.
 *
 * @template TState - The type of state to save.
 * @param store - The store instance.
 * @param value - The store value to store.
 */
export function saveToStorage<TState>(
  persistenceStorage: WebStorage,
  persistenceKey: string,
  value: TState
): void {
  persistenceStorage.setItem(persistenceKey, JSON.stringify(value));
}
