/* eslint-disable @typescript-eslint/no-explicit-any */
import { Store } from '../store';
import { StorePlugin } from '../store-plugin';
import {
  IndexedDbStorage,
  isIndexedDbStorage,
} from './persistence-idb-storage';
import {
  WebStorage,
  isWebStorage,
  loadFromStorage,
  saveToStorage,
} from './persistence-web-storage';

export interface WebStorageOptions {
  persistenceKey?: string;
  persistenceStorage?: WebStorage;
}

export interface IndexedDbStorageOptions {
  persistenceStorage: IndexedDbStorage;
}

/**
 * Options for configuring the Store Persistence Plugin.
 */
export type StorePersistencePluginOptions =
  | WebStorageOptions
  | IndexedDbStorageOptions;

/**
 * Represents the Store Persistence Plugin, enhancing a store with state persistence functionality.
 */
type StorePersistenceWebStoragePlugin = StorePlugin & {
  storage: WebStorage;
  persistenceKey: string;
};

type StorePersistenceObjectStoragePlugin = StorePlugin & {
  storage: IndexedDbStorage;
};

type StorePersistencePlugin =
  | StorePersistenceWebStoragePlugin
  | StorePersistenceObjectStoragePlugin;

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
    if (isWebStorage(plugin.storage)) {
      plugin.storage.removeItem(plugin.persistenceKey);
    } else if (isIndexedDbStorage(plugin.storage)) {
      plugin.storage.clearState();
    }
  } else {
    throw new Error(
      `Store persistence plugin is not enabled for store ${store.config.name}`
    );
  }
}

function configureWebStorage(plugin: StorePersistenceWebStoragePlugin) {
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

function configureIndexedDbStorage(
  plugin: StorePersistenceObjectStoragePlugin
) {
  plugin.init = store => {
    plugin.storage.init(store.name, () => {
      plugin.storage.getAndProcessState(persistedState => {
        if (persistedState) {
          store.set(persistedState, 'Load state from storage');
        }
      });
    });
  };

  plugin.postprocessCommand = store => plugin.storage.setState(store.state());

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
): StorePersistencePlugin {
  const storage = options.persistenceStorage ?? (localStorage as WebStorage);

  if (isWebStorage(storage)) {
    return configureWebStorage({
      name: 'StorePersistence',
      storage,
      persistenceKey: (options as WebStorageOptions).persistenceKey ?? '',
    });
  } else if (isIndexedDbStorage(storage)) {
    return configureIndexedDbStorage({
      name: 'StorePersistence',
      storage,
    });
  } else {
    throw new Error(
      'Passed StorePersistencePluginOptions is not compatible with the plugin specification.'
    );
  }
}
