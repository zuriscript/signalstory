import { StoreConfig } from '../store-config';
import { Immutable } from './immutable-type';

/**
 * Configuration options for an immutable signal store.
 * @typeparam TState - The type of the store's state.
 */
export interface ImmutableStoreConfig<TState>
  extends StoreConfig<Immutable<TState>> {
  /**
   * @deprecated Has been renamed and will be droped in the next minor release. Use mutationProducerFn instead (has same semantics)
   */
  cloneAndMutateFunc?: (
    currentState: TState,
    mutation: (draftState: TState) => void
  ) => TState;
  /**
   * Custom mutation strategy function that returns a new state object instead of operating on the currentState directly.
   * @remarks You can provide your own cloning and mutation strategy function similar to libraries like 'immer.js'.
   * @param currentState - The current state object to be cloned and mutated.
   * @param mutation - A function that modifies a draft copy of the state.
   * @returns The new state object after applying the mutation.
   * @default Naive implementation using structuredClone or JSON serialize and deserialize @see naiveCloneAndMutateFunc.
   */
  mutationProducerFn?: (
    currentState: TState,
    mutation: (draftState: TState) => void
  ) => TState;
}
