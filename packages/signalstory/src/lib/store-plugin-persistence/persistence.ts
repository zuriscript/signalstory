/**
 * Represents the interface for store persistence methods.
 */
export interface PersistenceStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

/**
 * Loads a value from storage.
 *
 * @template TState - The type of state to load.
 * @param store - The store instance.
 * @returns The loaded value if available and successfully parsed, otherwise undefined.
 */
export function loadFromStorage<TState>(
  persistenceStorage: PersistenceStorage,
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
  persistenceStorage: PersistenceStorage,
  persistenceKey: string,
  value: TState
): void {
  persistenceStorage.setItem(persistenceKey, JSON.stringify(value));
}

/**
 * Clears the value associated with the provided key from local storage.
 *
 * @template TState - The type of state to clear from local storage.
 * @param store - The store instance.
 */
export function clearStorage(
  persistenceStorage: PersistenceStorage,
  persistenceKey: string
): void {
  persistenceStorage.removeItem(persistenceKey);
}
