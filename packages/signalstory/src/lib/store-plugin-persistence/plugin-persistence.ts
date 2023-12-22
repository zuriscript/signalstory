/* eslint-disable @typescript-eslint/no-explicit-any */
import { Store } from '../store';
import { StorePlugin } from '../store-plugin';
import { ObjectStorage, isObjectStorage } from './persistence-object-storage';
import {
  WebStorage,
  isWebStorage,
  loadFromStorage,
  saveToStorage,
} from './persistence-web-storage';

/**
 * Options for configuring the Store Persistence Plugin.
 */
export interface StorePersistencePluginOptions {
  persistenceKey?: string;
  persistenceStorage?: WebStorage | ObjectStorage;
}

/**
 * Represents the Store Persistence Plugin, enhancing a store with state persistence functionality.
 */
type StorePersistenceWebStoragePlugin = StorePlugin & {
  storage: WebStorage;
  persistenceKey: string;
};

type StorePersistenceObjectStoragePlugin = StorePlugin & {
  storage: ObjectStorage;
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
    } else if (isObjectStorage(plugin.storage)) {
      plugin.storage.clearState();
    }
  } else {
    throw new Error(
      `Store persistence plugin is not enabed for store ${store.config.name}`
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

function configureObjectStorage(plugin: StorePersistenceObjectStoragePlugin) {
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
      persistenceKey: options.persistenceKey ?? '',
    });
  } else if (isObjectStorage(storage)) {
    return configureObjectStorage({
      name: 'StorePersistence',
      storage,
    });
  } else {
    throw new Error(
      'Passed StorePersistencePluginOptions is not coompatible with the plugin specification.'
    );
  }
}
