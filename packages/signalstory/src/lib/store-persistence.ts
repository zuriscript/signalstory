/**
 * Tries to retrieve the local storage object, if available.
 * @returns The local storage object if available, otherwise undefined.
 */
function tryGetLocalStorage(): Storage | undefined {
  try {
    return typeof localStorage !== 'undefined' ? localStorage : undefined;
  } catch {
    return undefined;
  }
}

/**
 * Loads a value from local storage.
 *
 * @param {string} localStorageKey - The key associated with the value to load from local storage.
 * @returns {T | undefined} - The loaded value if available and successfully parsed, otherwise undefined.
 */
export function loadFromStorage<T>(localStorageKey: string): T | undefined {
  const storage = tryGetLocalStorage();
  const value = storage?.getItem(localStorageKey);

  try {
    return value ? (JSON.parse(value) as T) : undefined;
  } catch {
    return undefined;
  }
}

/**
 * Saves a value to local storage.
 *
 * @param {string} localStorageKey - The key under which to save the value in local storage.
 * @param {T} value - The value to be saved.
 */
export function saveToStorage<T>(localStorageKey: string, value: T): void {
  const storage = tryGetLocalStorage();
  if (storage) {
    storage.setItem(localStorageKey, JSON.stringify(value));
  }
}

/**
 * Clears the value associated with the provided key from local storage.
 * @param {string} localStorageKey - The key associated with the value to clear from local storage.
 */
export function clearLocalStorage(localStorageKey: string): void {
  const storage = tryGetLocalStorage();
  if (storage) {
    storage.removeItem(localStorageKey);
  }
}
