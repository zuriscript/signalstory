/* eslint-disable @typescript-eslint/no-explicit-any */
import { Store } from '../store';
import { StorePlugin, StoreState } from '../store-plugin';
import {
  PersistenceStorageAsynchronous,
  isPersistenceStorageAsynchronous,
} from './persistence-asynchronous';
import {
  PersistenceStorageSynchronous,
  clearStorage,
  isPersistenceStorageSynchronous,
  loadFromStorage,
  saveToStorage,
} from './persistence-synchronous';

/**
 * Options for configuring the Store Persistence Plugin.
 */
export interface StorePersistencePluginOptions {
  /**
   * The key to use for the local storage entry. (optional, default: _persisted_state_of_storeName_).
   */
  persistenceKey?: string;
  /**
   * The storage mechanism for persistence.  (optional, default: localStorage).
   */
  persistenceStorage?:
    | PersistenceStorageSynchronous
    | PersistenceStorageAsynchronous;
}

/**
 * Represents the Store Persistence Plugin, enhancing a store with state persistence functionality.
 */
type StorePersistencePlugin = StorePlugin & {
  storage: PersistenceStorageSynchronous | PersistenceStorageAsynchronous;
  persistenceKey: string;
};

/**
 * typeguard for StorePersistencePlugin.
 * @param obj - The object to check.
 * @returns True if the object is a StorePersistencePlugin, otherwise false.
 */
function isStorePersistencePlugin(
  obj: StorePlugin
): obj is StorePersistencePlugin {
  return (
    obj &&
    typeof obj === 'object' &&
    'storage' in obj &&
    'persistenceKey' in obj
  );
}

/**
 * Clears the value associated with the provided key from local storage.
 *
 * @template TState - The type of state to clear from local storage.
 * @param store - The store instance.
 *
 */
export function clearStoreStorage(store: Store<any>): void {
  const plugin = store.config.plugins.find(isStorePersistencePlugin);
  if (plugin) {
    if (isPersistenceStorageSynchronous(plugin.storage)) {
      clearStorage(plugin.storage, plugin.persistenceKey);
    } else if (isPersistenceStorageAsynchronous(plugin.storage)) {
      plugin.storage.removeItem(plugin.persistenceKey);
    }
  } else {
    throw new Error(
      `Store persistence plugin is not enabed for store ${store.config.name}`
    );
  }
}

/**
 * Saves the provided state to the store's storage.
 * @template TStore - The type of store to save the state for.
 * @param store - The store instance.
 * @param state - The state to save.
 */
export function saveToStoreStorage<TStore extends Store<any>>(
  store: TStore,
  state: StoreState<TStore>
): void {
  const plugin = store.config.plugins.find(isStorePersistencePlugin);
  if (plugin) {
    if (isPersistenceStorageSynchronous(plugin.storage)) {
      console.log('SETTING SYNC');
      saveToStorage(plugin.storage, plugin.persistenceKey, state);
    } else if (isPersistenceStorageAsynchronous(plugin.storage)) {
      console.log('SETTING ASYNC');
      plugin.storage.setItem(plugin.persistenceKey, state);
    }
  }
}

/**
 * Loads and retrieves the stored state for the store.
 * @template TStore - The type of store to load the state for.
 * @param store - The store instance.
 * @returns The stored state for the store, or undefined if not found.
 */
export function loadFromStoreStorage<TStore extends Store<any>>(
  store: TStore
): StoreState<TStore> | undefined {
  const plugin = store.config.plugins.find(isStorePersistencePlugin);
  return plugin && isPersistenceStorageSynchronous(plugin.storage)
    ? loadFromStorage(plugin.storage, plugin.persistenceKey)
    : undefined;
}

/**
 * Enables Storeplugin that persists the store state to a storage (e.g. local storage).
 * State changes are automatically synced with the storage.
 * @param options - Options for configuring the StorePersistencePlugin.
 * @returns A StorePersistencePlugin instance.
 */
export function useStorePersistence(
  options: StorePersistencePluginOptions = {}
): StorePersistencePlugin {
  const plugin: StorePersistencePlugin = {
    name: 'StoreLogger',
    storage: options.persistenceStorage ?? localStorage,
    persistenceKey: options.persistenceKey ?? '',
  };

  plugin.init = store => {
    if (!plugin.persistenceKey) {
      plugin.persistenceKey = `_persisted_state_of_${store.config.name}`;
    }

    if (isPersistenceStorageSynchronous(plugin.storage)) {
      const persistedState = loadFromStoreStorage(store);
      if (persistedState) {
        store.set(persistedState, 'Load state from storage');
      }
    } else if (isPersistenceStorageAsynchronous(plugin.storage)) {
      plugin.storage.init(plugin.persistenceKey, () => {
        if (isPersistenceStorageAsynchronous(plugin.storage)) {
          plugin.storage.getAndProcessValue(
            plugin.persistenceKey,
            persistedState =>
              store.set(persistedState, 'Load state from storage')
          );
        }
      });
    }
  };

  plugin.postprocessCommand = store => saveToStoreStorage(store, store.state());

  return plugin as unknown as StorePersistencePlugin;
}
