import { StorePersistence } from './store-persistence';

/**
 * Configuration options for a signal store.
 *
 * @typeparam TState The type of the store's initial state.
 */
export interface StoreConfig<TState> {
  /**
   * The initial state of the store.
   */
  initialState: TState;
  /**
   * The name of the store (optional, default: constructor name).
   */
  name?: string;
  /**
   * Indicates whether state history is enabled. (optional, default: false).
   */
  enableStateHistory?: boolean;
  /**
   * Indicates whether effects and queries are enabled for this store. In that case an angular injector is provided. (optional, default: false).
   */
  enableEffectsAndQueries?: boolean;
  /**
   * Registers the store for redux devtools. See https://github.com/reduxjs/redux-devtools for further info. (optional, default: false).
   */
  enableDevtools?: boolean;
  /**
   * Persists the actual state to local storage and loads it on initialization rather than the initialState. (optional, default: false).
   */
  enablePersistence?: boolean;
  /**
   * The key to use for the local storage entry. Only in combination with enablePersistence. (optional, default: _persisted_state_of_storeName_).
   */
  persistenceKey?: string;
  /**
   * The storage mechanism for persistence. Only in combination with enablePersistence. (optional, default: localStorage).
   */
  persistenceStorage?: StorePersistence;
  /**
   * Indicates whether logging is enabled. (optional, default: false).
   */
  enableLogging?: boolean;
  /**
   * A logging function to output messages and data. Only in combination with enableLogging. (optional, default: console.log).
   *
   * @param {string} message - The message to be logged.
   * @param {...any[]} data - Additional data to be logged.
   */
  logFunc?: (message: string, ...data: any[]) => void;
}
