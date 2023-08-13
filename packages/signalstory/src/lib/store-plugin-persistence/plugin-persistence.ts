import { assertInInjectionContext, effect } from '@angular/core';
import { Store } from '../store';
import { StorePlugin, StoreState } from '../store-plugin';
import {
  PersistenceStorage,
  clearStorage,
  loadFromStorage,
  saveToStorage,
} from './persistence';

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

type StorePersistencePlugin = StorePlugin & {
  storage: PersistenceStorage;
  getPersistenceKeyFromStore: (store: Store<any>) => string;
};

function isStorePersistencePlugin(obj: any): obj is StorePersistencePlugin {
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
 * @param {Store<TState>} store - The store instance.
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

export function saveToStoreStorage<TStore extends Store<any>>(
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

export function loadFromStoreStorage<TStore extends Store<any>>(
  store: TStore
): StoreState<TStore> | undefined {
  const plugin = store.config.plugins.find(isStorePersistencePlugin);
  return plugin
    ? loadFromStorage(plugin.storage, plugin.getPersistenceKeyFromStore(store))
    : undefined;
}

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
