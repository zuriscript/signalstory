import { Immutable } from './immutable-type';
import { StoreConfig } from './store-config';

/**
 * Configuration options for an immutable signal store.
 * @typeparam TState - The type of the store's state.
 */
export interface ImmutableStoreConfig<TState>
  extends StoreConfig<Immutable<TState>> {
  /**
   * Indicates whether state history is enabled.
   * @remarks Setting this option to true enables state history tracking.
   * @default false
   */
  enableStateHistory?: boolean;
  /**
   * Custom clone and mutate strategy function.
   * @remarks You can provide your own cloning and mutation strategy function similar to libraries like 'immer.js'.
   * @param currentState - The current state object to be cloned and mutated.
   * @param mutation - A function that modifies a draft copy of the state.
   * @returns The new state object after applying the mutation.
   * @default Naive implementation using JSON serialize and deserialize.
   */
  cloneAndMutateFunc?: (
    currentState: TState,
    mutation: (draftState: TState) => void
  ) => TState;
}
