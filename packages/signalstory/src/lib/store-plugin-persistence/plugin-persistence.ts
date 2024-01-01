/* eslint-disable @typescript-eslint/no-explicit-any */
import { Store } from '../store';
import { StorePlugin } from '../store-plugin';
import { AsyncStorage, isAsyncStorage } from './persistence-async-storage';
import {
  SyncStorage,
  isSyncStorage,
  loadFromStorage,
  saveToStorage,
} from './persistence-sync-storage';

/**
 * Options for configuring the Store Persistence Plugin.
 */
export interface StorePersistencePluginOptions {
  persistenceKey?: string;
  persistenceStorage?: SyncStorage | AsyncStorage;
}

/**
 * Represents the Store Persistence Plugin, enhancing a store with state persistence functionality.
 */
type StorePersistencePlugin<TStorage extends SyncStorage | AsyncStorage> =
  StorePlugin & {
    storage: TStorage;
    persistenceKey: string;
  };

/**
 * typeguard for StorePersistencePlugin.
 * @param obj - The object to check.
 * @returns True if the object is a StorePersistencePlugin, otherwise false.
 */
function isStorePersistencePlugin(
  obj: StorePlugin
): obj is StorePersistencePlugin<any> {
  return (
    obj &&
    typeof obj === 'object' &&
    'name' in obj &&
    obj['name'] === 'StorePersistence'
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
    if (isSyncStorage(plugin.storage)) {
      plugin.storage.removeItem(plugin.persistenceKey);
    } else if (isAsyncStorage(plugin.storage)) {
      plugin.storage.removeItemAsync(plugin.persistenceKey);
    }
  } else {
    throw new Error(
      `Store persistence plugin is not enabled for store ${store.config.name}`
    );
  }
}

function configureSyncStorage(plugin: StorePersistencePlugin<SyncStorage>) {
  plugin.init = store => {
    if (!plugin.persistenceKey) {
      plugin.persistenceKey = `_persisted_state_of_${store.config.name}`;
    }

    const persistedState = loadFromStorage(
      plugin.storage,
      plugin.persistenceKey
    );
    if (persistedState) {
      store.set(persistedState, 'Load state from storage');
    }
  };

  plugin.postprocessCommand = store =>
    saveToStorage(plugin.storage, plugin.persistenceKey, store.state());

  return plugin;
}

function configureAsyncStorage(plugin: StorePersistencePlugin<AsyncStorage>) {
  plugin.init = store => {
    if (!plugin.persistenceKey) {
      plugin.persistenceKey = `_persisted_state_of_${store.config.name}`;
    }

    plugin.storage.initAsync(store.name, () => {
      plugin.storage.getItemAsync(plugin.persistenceKey, persistedState => {
        if (persistedState) {
          store.set(persistedState, 'Load state from storage');
        }
      });
    });
  };

  plugin.postprocessCommand = store =>
    plugin.storage.setItemAsync(plugin.persistenceKey, store.state());

  return plugin;
}

/**
 * Enables Storeplugin that persists the store state to a storage (e.g. local storage).
 * State changes are automatically synced with the storage.
 * @param options - Options for configuring the StorePersistencePlugin.
 * @returns A StorePersistencePlugin instance.
 */
export function useStorePersistence(
  options: StorePersistencePluginOptions = {}
): StorePersistencePlugin<any> {
  const storage = options.persistenceStorage ?? (localStorage as SyncStorage);
  const plugin = <StorePersistencePlugin<any>>{
    name: 'StorePersistence',
    storage,
    persistenceKey: options.persistenceKey ?? '',
  };

  return isAsyncStorage(storage)
    ? configureAsyncStorage(plugin)
    : configureSyncStorage(plugin);
}
