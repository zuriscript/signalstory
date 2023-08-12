import { assertInInjectionContext, effect } from '@angular/core';
import { Store } from '../store';
import { StoreState } from '../types';
import {
  PersistenceStorage,
  clearStorage,
  loadFromStorage,
  saveToStorage,
} from '../utility/persistence';
import { StorePlugin } from './store-plugin';

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
  getStorePersistenceKey: (store: Store<any>) => string;
  getStoreStorage: () => PersistenceStorage;
  clearStoreStorage: (store: Store<any>) => void;
  saveToStoreStorage: <TStore extends Store<any>>(
    store: TStore,
    state: StoreState<TStore>
  ) => void;
  loadFromStoreStorage: <TStore extends Store<any>>(
    store: TStore
  ) => StoreState<TStore> | undefined;
};

function isStorePersistencePlugin(obj: any): obj is StorePersistencePlugin {
  return (
    obj &&
    typeof obj === 'object' &&
    'getStorePersistenceKey' in obj &&
    typeof obj.getStorePersistenceKey === 'function'
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
    plugin.clearStoreStorage(store);
  }
}

export function saveToStoreStorage<TStore extends Store<any>>(
  store: TStore,
  state: StoreState<TStore>
): void {
  const plugin = store.config.plugins.find(isStorePersistencePlugin);
  if (plugin) {
    plugin.saveToStoreStorage(store, state);
  }
}

export function loadFromStoreStorage<TStore extends Store<any>>(
  store: TStore
): StoreState<TStore> | undefined {
  const plugin = store.config.plugins.find(isStorePersistencePlugin);
  return plugin ? plugin.loadFromStoreStorage(store) : undefined;
}

export function useStorePersistence(
  options: StorePersistencePluginOptions = {}
): StorePersistencePlugin {
  const plugin = <StorePersistencePlugin>{};

  // Helper functions
  plugin.getStorePersistenceKey = (store: Store<any>) =>
    options?.persistenceKey ?? `_persisted_state_of_${store.config.name}_`;
  plugin.getStoreStorage = () => options?.persistenceStorage ?? localStorage;
  plugin.clearStoreStorage = (store: Store<any>) =>
    clearStorage(
      plugin.getStoreStorage(),
      plugin.getStorePersistenceKey(store)
    );
  plugin.saveToStoreStorage = (store: Store<any>) =>
    saveToStorage(
      plugin.getStoreStorage(),
      plugin.getStorePersistenceKey(store),
      store.state()
    );
  plugin.loadFromStoreStorage = (store: Store<any>) =>
    loadFromStorage(
      plugin.getStoreStorage(),
      plugin.getStorePersistenceKey(store)
    );

  // Actual plugin function
  plugin.init = function (store) {
    const persistedState = plugin.loadFromStoreStorage(store);
    if (persistedState) {
      store.set(persistedState, 'Load state from storage');
    }

    if (!store.config.injector) {
      assertInInjectionContext(useStorePersistence);
    }

    effect(
      () => {
        plugin.saveToStoreStorage(store, store.state());
      },
      { injector: store.config.injector ?? undefined }
    );
  };

  return plugin;
}
