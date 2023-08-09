import { StorePersistence } from './store-persistence';

/**
 * Configuration options for a signal store.
 * @typeparam TState The type of the store's initial state.
 */
export interface StoreConfig<TState> {
  initialState: TState; // The initial state of the store.
  name?: string; // The name of the store (optional).
  enableStateHistory?: boolean; // Indicates whether state history is enabled (optional, default: false).
  enableEffectsAndQueries?: boolean; // Indicates whether effects and queries are enabled for this store. (optional, default: false).
  enablePersistence?: boolean; // Persists the actual state to local storage and loads it on initialization rather than the initialState (optional, default: false).
  persistenceKey?: string; // The key to use for the local storage entry. Only in combination with enableLocalStorageSync. (optional, default: _persisted_state_of_<storeName>_)
  persistenceStorage?: StorePersistence;
}
