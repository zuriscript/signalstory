import { Store } from './store';

/**
 * Represents the interface for store persistence methods.
 */
export interface StorePersistence {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

/**
 * Loads a value from local storage.
 *
 * @template TState - The type of state to load.
 * @param {Store<TState>} store - The store instance.
 * @returns {TState | undefined} The loaded value if available and successfully parsed, otherwise undefined.
 */
export function loadFromStorage<TState>(
  store: Store<TState>
): TState | undefined {
  const value = store.config.persistenceStorage.getItem(
    store.config.persistenceKey
  );

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
 * @param {Store<TState>} store - The store instance.
 * @param {TState} value - The store value to store.
 */
export function saveToStorage<TState>(
  store: Store<TState>,
  value: TState
): void {
  store.config.persistenceStorage.setItem(
    store.config.persistenceKey,
    JSON.stringify(value)
  );
}

/**
 * Clears the value associated with the provided key from local storage.
 *
 * @template TState - The type of state to clear from local storage.
 * @param {Store<TState>} store - The store instance.
 */
export function clearStorage<TState>(store: Store<TState>): void {
  store.config.persistenceStorage.removeItem(store.config.persistenceKey);
}
