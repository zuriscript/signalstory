import { StorePlugin } from './store-plugins/store-plugin';

/**
 * Configuration options for a signal store.
 * @typeparam TState The type of the store's initial state.
 */
export interface StoreConfig<TState> {
  initialState: TState; // The initial state of the store.
  name?: string; // The name of the store (optional).
  enableEffectsAndQueries?: boolean; // Indicates whether effects and queries are enabled for this store. (optional, default: false).
  plugins?: ReadonlyArray<StorePlugin<TState>>;
}
