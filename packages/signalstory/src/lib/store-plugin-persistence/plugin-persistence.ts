/* eslint-disable @typescript-eslint/no-explicit-any */
import { Store } from '../store';
import { StorePlugin } from '../store-plugin';
import {
  isIndexedDbAvailable,
  isLocalStorageAvailable,
  isSessionStorageAvailable,
} from '../utility/feature-detection';
import { IndexedDbAdapter } from './idb/idb-adapter';
import { AsyncStorage, isAsyncStorage } from './persistence-async-storage';
import {
  SyncStorage,
  isSyncStorage,
  loadFromStorage,
  saveToStorage,
} from './persistence-sync-storage';

/**
 * Projection functions which are applied before storing and after loading from storage
 * This can be useful for obfuscating sensitive data prior to storing or for saving space
 */
export interface PersistenceProjection<TState = never, TProjection = never> {
  /**
   * Function to transform the state before saving it to storage.
   * @param state - The current state of the store.
   * @returns The transformed state to be stored.
   */
  onWrite: (state: TState) => TProjection;

  /**
   * Function to transform the loaded projection from storage before applying it to the store.
   * @param projection - The loaded projection from storage.
   * @returns The transformed state to be applied to the store.
   */
  onLoad: (projection: TProjection) => TState;
}

/**
 * Options for configuring the Store Persistence Plugin.
 */
export interface StorePersistencePluginOptions<
  TState = never,
  TProjection = never,
> {
  /**
   * The key used for storing the state in the persistence storage (Optional, default _persisted_state_of_[storename]).
   */
  persistenceKey?: string;

  /**
   * The storage medium used for persistence (Optional, default localStorage).
   */
  persistenceStorage?:
    | SyncStorage
    | AsyncStorage
    | 'LOCAL_STORAGE'
    | 'SESSION_STORAGE';

  /**
   * Projection functions which are applied before storing and after loading from storage
   * This can be useful for obfuscating sensitive data prior to storing or for saving space.
   * Optional, default nothing.
   */
  projection?: PersistenceProjection<TState, TProjection>;
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

function configureSyncStorage<TState = never, TProjection = never>(
  plugin: StorePersistencePlugin<SyncStorage>,
  projection?: PersistenceProjection<TState, TProjection>
) {
  plugin.init = store => {
    if (!plugin.persistenceKey) {
      plugin.persistenceKey = `_persisted_state_of_${store.config.name}`;
    }

    const persistedState = loadFromStorage(
      plugin.storage,
      plugin.persistenceKey
    );
    if (persistedState) {
      store.set(
        projection
          ? projection.onLoad(persistedState as TProjection)
          : persistedState,
        'Load state from storage'
      );
    }
  };

  plugin.postprocessCommand = projection
    ? store =>
        saveToStorage(
          plugin.storage,
          plugin.persistenceKey,
          projection.onWrite(store.state())
        )
    : store =>
        saveToStorage(plugin.storage, plugin.persistenceKey, store.state());

  return plugin;
}

function configureAsyncStorage<TState = never, TProjection = never>(
  plugin: StorePersistencePlugin<AsyncStorage>,
  projection?: PersistenceProjection<TState, TProjection>
) {
  plugin.init = store => {
    if (!plugin.persistenceKey) {
      plugin.persistenceKey = `_persisted_state_of_${store.config.name}`;
    }

    plugin.storage.initAsync(store.name, () => {
      plugin.storage.getItemAsync(plugin.persistenceKey, persistedState => {
        if (persistedState) {
          store.set(
            projection
              ? projection.onLoad(persistedState as TProjection)
              : persistedState,
            'Load state from storage'
          );
        }
      });
    });
  };

  plugin.postprocessCommand = projection
    ? store =>
        plugin.storage.setItemAsync(
          plugin.persistenceKey,
          projection.onWrite(store.state())
        )
    : store =>
        plugin.storage.setItemAsync(plugin.persistenceKey, store.state());

  return plugin;
}

/**
 * Enables Storeplugin that persists the store state to a storage (e.g. local storage).
 * State changes are automatically synced with the storage.
 * @param options - Options for configuring the StorePersistencePlugin.
 * @returns A StorePersistencePlugin instance.
 */
export function useStorePersistence<TState = never, TProjection = never>(
  options: StorePersistencePluginOptions<TState, TProjection> = {}
): StorePersistencePlugin<any> {
  const storageProvider = options.persistenceStorage ?? 'LOCAL_STORAGE';
  if (
    (storageProvider === 'LOCAL_STORAGE' && !isLocalStorageAvailable()) ||
    (storageProvider === 'SESSION_STORAGE' && !isSessionStorageAvailable()) ||
    (storageProvider instanceof IndexedDbAdapter && !isIndexedDbAvailable())
  ) {
    return {} as StorePersistencePlugin<any>;
  }

  const storage =
    storageProvider === 'LOCAL_STORAGE'
      ? localStorage
      : storageProvider === 'SESSION_STORAGE'
        ? sessionStorage
        : storageProvider;

  const plugin = <StorePersistencePlugin<any>>{
    name: 'StorePersistence',
    storage,
    persistenceKey: options.persistenceKey ?? '',
  };

  return isAsyncStorage(storage)
    ? configureAsyncStorage(plugin, options.projection)
    : configureSyncStorage(plugin, options.projection);
}
