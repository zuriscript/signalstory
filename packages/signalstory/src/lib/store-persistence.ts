/**
 * Constructs the identifier for a specific store name in local storage.
 * @param storeName The name of the store.
 * @returns The constructed identifier for the store.
 */
const localStorageIdentifier = (storeName: string) =>
  `_persisted_state_of_${storeName}_`;

/**
 * Tries to retrieve the local storage object, if available.
 * @returns The local storage object if available, otherwise undefined.
 */
export function tryGetLocalStorage(): Storage | undefined {
  try {
    return typeof localStorage !== 'undefined' ? localStorage : undefined;
  } catch {
    return undefined;
  }
}

/**
 * Loads a value from local storage.
 * @param storeName The name of the store to load the value from.
 * @returns The loaded value if available and successfully parsed, otherwise undefined.
 */
export function loadFromStorage<T>(storeName: string): T | undefined {
  const storage = tryGetLocalStorage();
  const value = storage?.getItem(localStorageIdentifier(storeName));

  try {
    return value ? (JSON.parse(value) as T) : undefined;
  } catch {
    return undefined;
  }
}

/**
 * Saves a value to local storage.
 * @param storeName The name of the store to save the value to.
 * @param value The value to be saved.
 */
export function saveToStorage<T>(storeName: string, value: T) {
  const storage = tryGetLocalStorage();
  if (storage) {
    storage.setItem(localStorageIdentifier(storeName), JSON.stringify(value));
  }
}

/**
 * Clears the value from local storage.
 * @param storeName The name of the store to clear the value from.
 */
export function clearLocalStorage(storeName: string) {
  const storage = tryGetLocalStorage();
  if (storage) {
    storage.removeItem(localStorageIdentifier(storeName));
  }
}
