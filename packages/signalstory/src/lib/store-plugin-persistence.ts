import { assertInInjectionContext, effect } from '@angular/core';
import { Store } from './store';
import { StorePlugin } from './store-plugin';

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
  persistenceStorage: StorePersistence,
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
 * @param {Store<TState>} store - The store instance.
 * @param {TState} value - The store value to store.
 */
export function saveToStorage<TState>(
  persistenceStorage: StorePersistence,
  persistenceKey: string,
  value: TState
): void {
  persistenceStorage.setItem(persistenceKey, JSON.stringify(value));
}

/**
 * Clears the value associated with the provided key from local storage.
 *
 * @template TState - The type of state to clear from local storage.
 * @param {Store<TState>} store - The store instance.
 */
export function clearStorage(
  persistenceStorage: StorePersistence,
  persistenceKey: string
): void {
  persistenceStorage.removeItem(persistenceKey);
}

type StorePersistencePlugin = StorePlugin & {
  getStorePersistenceKey: (store: Store<any>) => string;
  getStoreStorage: () => StorePersistence;
};

function isStorePersistencePlugin(obj: any): obj is StorePersistencePlugin {
  return (
    obj &&
    typeof obj === 'object' &&
    'getStorePersistenceKey' in obj &&
    typeof obj.getStorePersistenceKey === 'function' &&
    'getStoreStorage' in obj &&
    typeof obj.getStoreStorage === 'function'
  );
}

/**
 * Clears the value associated with the provided key from local storage.
 *
 * @template TState - The type of state to clear from local storage.
 * @param {Store<TState>} store - The store instance.
 */
export function clearStoreStorage(store: Store<any>): void {
  const plugin = store.config.plugins.find(isStorePersistencePlugin);
  if (plugin) {
    clearStorage(
      plugin.getStoreStorage(),
      plugin.getStorePersistenceKey(store)
    );
  }
}

export function useStorePersistence(
  options: {
    persistenceKey?: string;
    persistenceStorage?: StorePersistence;
  } = {}
): StorePersistencePlugin {
  const plugin = <StorePersistencePlugin>{
    getStorePersistenceKey(store: Store<any>) {
      return (
        options?.persistenceKey ?? `_persisted_state_of_${store.config.name}_`
      );
    },
    getStoreStorage() {
      return options?.persistenceStorage ?? localStorage;
    },
  };

  plugin.init = function (store) {
    const persistenceKey = plugin.getStorePersistenceKey(store);
    const persistenceStorage = plugin.getStoreStorage();

    const persistedState = loadFromStorage(persistenceStorage, persistenceKey);
    if (persistedState) {
      store.set(persistedState, 'Load state from storage');
    }

    if (!store.config.injector) {
      assertInInjectionContext(useStorePersistence);
    }

    effect(
      () => {
        saveToStorage(persistenceStorage, persistenceKey, store.state());
      },
      { injector: store.config.injector ?? undefined }
    );
  };

  return plugin;
}
