import { Store } from '../store';
import { naiveDeepClone } from '../store-immutability/immutable-naive-ops';
import { ImmutableStore } from '../store-immutability/immutable-store';
import { StorePlugin, StoreState } from '../store-plugin';
import {
  History,
  HistoryItem,
  addToHistory as addToHistoryUtil,
  redo as redoUtil,
  undo as undoUtil,
} from './history';

/**
 * Registry to associate a store with its history.
 */
const storeHistoryRegistry = new WeakMap<Store<any>, History<any>>();

/**
 * Registers the history for a store.
 * @param store The store to register history for.
 */
export function registerStateHistory<TStore extends Store<any>>(
  store: TStore
): void {
  storeHistoryRegistry.set(store, []);
}

/**
 * Clears the history for a store.
 * @param store The store to clear history for.
 */
export function clearStateHistory<TStore extends Store<any>>(
  store: TStore
): void {
  storeHistoryRegistry.delete(store);
}

/**
 * Gets the history of commands for a store as readonly.
 * @param store The store to get history for.
 * @returns An array of history items as readonly
 */
export function getHistory<TStore extends Store<any>>(
  store: TStore
): ReadonlyArray<HistoryItem<StoreState<TStore>>> {
  const history = storeHistoryRegistry.get(store);
  return history ? history : [];
}

/**
 * Adds a new command to the history.
 * @param store The store to add history for.
 * @param command The name of the command to add.
 */
export function addToHistory<TStore extends Store<any>>(
  store: TStore,
  command: string
): void {
  const history = storeHistoryRegistry.get(store);
  if (history) {
    const stateBeforeCommand =
      store instanceof ImmutableStore
        ? store.state()
        : naiveDeepClone(store.state());
    addToHistoryUtil(history, command, stateBeforeCommand);
  } else {
    throw new Error(
      `Attempted to call addToHistory on ${store.name} but history is disabled for this store`
    );
  }
}

/**
 * Undoes the last command for a store.
 * @param store The store to perform the undo operation on.
 */
export function undo<TStore extends Store<any>>(store: TStore): void {
  const history = storeHistoryRegistry.get(store) as History<
    StoreState<TStore>
  >;
  if (history) {
    const result = undoUtil(history, store.state());
    if (result) {
      store.set(result.newState, result.command);
    }
  } else {
    throw new Error(
      `Attempted to call undo on ${store.name} but history is disabled for this store`
    );
  }
}

/**
 * Redoes the last undone command for a store.
 * @param store The store to perform the redo operation on.
 */
export function redo<TStore extends Store<any>>(store: TStore): void {
  const history = storeHistoryRegistry.get(store) as History<
    StoreState<TStore>
  >;

  if (history) {
    const result = redoUtil(history, store.state());
    if (result) {
      store.set(result.newState, result.command);
    }
  } else {
    throw new Error(
      `Attempted to call redo on ${store.name} but history is disabled for this store`
    );
  }
}

/**
 * Enables Storeplugin that tracks and maintains a history of the store's state changes.
 * It provides means to perform state undo's and redo's.
 * This plugin is designed to work best with an ImmutableStore, where an optimized immutable
 * data structure is used for managing history. For a regular Store, a naive deep clone method is used.
 *
 * @returns History Storeplugin.
 */
export function useStoreHistory(): StorePlugin {
  return {
    precedence: 10, // should come early in initialization
    init(store) {
      registerStateHistory(store);
    },
    preprocessCommand(store, command) {
      addToHistory(store, command ?? 'Unspecified Command');
    },
  };
}
