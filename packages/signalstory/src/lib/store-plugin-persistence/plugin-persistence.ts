/* eslint-disable @typescript-eslint/no-explicit-any */
import { assertInInjectionContext, effect } from '@angular/core';
import { Store } from '../store';
import { StorePlugin, StoreState } from '../store-plugin';
import {
  PersistenceStorage,
  clearStorage,
  loadFromStorage,
  saveToStorage,
} from './persistence';

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
  persistenceStorage?: PersistenceStorage;
}

/**
 * Represents the Store Persistence Plugin, enhancing a store with state persistence functionality.
 */
type StorePersistencePlugin = StorePlugin & {
  storage: PersistenceStorage;
  getPersistenceKeyFromStore: (store: Store<unknown>) => string;
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
    'getPersistenceKeyFromStore' in obj
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
    clearStorage(plugin.storage, plugin.getPersistenceKeyFromStore(store));
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
export function saveToStoreStorage<TStore extends Store<unknown>>(
  store: TStore,
  state: StoreState<TStore>
): void {
  const plugin = store.config.plugins.find(isStorePersistencePlugin);
  if (plugin) {
    saveToStorage(
      plugin.storage,
      plugin.getPersistenceKeyFromStore(store),
      state
    );
  }
}

/**
 * Loads and retrieves the stored state for the store.
 * @template TStore - The type of store to load the state for.
 * @param store - The store instance.
 * @returns The stored state for the store, or undefined if not found.
 */
export function loadFromStoreStorage<TStore extends Store<unknown>>(
  store: TStore
): StoreState<TStore> | undefined {
  const plugin = store.config.plugins.find(isStorePersistencePlugin);
  return plugin
    ? loadFromStorage(plugin.storage, plugin.getPersistenceKeyFromStore(store))
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
    storage: options.persistenceStorage ?? localStorage,
    getPersistenceKeyFromStore: store =>
      options.persistenceKey ?? `_persisted_state_of_${store.config.name}`,
    init(store) {
      const persistedState = loadFromStoreStorage(store);
      if (persistedState) {
        store.set(persistedState, 'Load state from storage');
      }

      if (!store.config.injector) {
        assertInInjectionContext(useStorePersistence);
      }

      effect(
        () => {
          saveToStoreStorage(store, store.state());
        },
        { injector: store.config.injector ?? undefined }
      );
    },
  };

  return plugin;
}
