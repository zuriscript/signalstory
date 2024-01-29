/* eslint-disable @typescript-eslint/no-explicit-any */
import { Store } from '../store';
import { ImmutableStore } from '../store-immutability/immutable-store';
import { deepClone } from '../store-immutability/immutable-utility';
import { StorePlugin, StoreState } from '../store-plugin';
import {
  History,
  HistoryItem,
  addToHistory as addToHistoryUtil,
  prune,
  redo as redoUtil,
  undo as undoUtil,
} from './history';

/**
 * Options for configuring the Store History Plugin.
 */
export interface StoreHistoryPluginOptions {
  /**
   * The maximum length of the history. If set, the history will be pruned
   * as older entries will be removed to maintain the specified maximum length.
   * If `undefined`, the history will grow without boundaries.
   *
   * @remarks
   * The `maxLength` property is used as an indicator for pruning, but it is not strictly enforced.
   * This means that the history array may have more elements than the specified `maxLength` for optimization reasons.
   */
  maxLength?: number;
}

/**
 * Registry to associate a store with its history.
 */
const storeHistoryRegistry = new WeakMap<
  Store<unknown>,
  { history: History<unknown>; maxLength?: number }
>();

/**
 * The fraction of elements to be removed during pruning.
 */
const pruneFraction = 0.25;

/**
 * Registers the history for a store.
 * @param store The store to register history for.
 */
export function registerStateHistory<TStore extends Store<any>>(
  store: TStore,
  maxLength?: number
): void {
  storeHistoryRegistry.set(store, {
    history: [],
    maxLength: maxLength
      ? Math.floor(maxLength / (1 - pruneFraction))
      : undefined,
  });
}

/**
 * Gets the history of commands for a store as readonly.
 * @param store The store to get history for.
 * @returns An array of history items as readonly
 */
export function getHistory<TStore extends Store<any>>(
  store: TStore
): ReadonlyArray<HistoryItem<StoreState<TStore>>> {
  return (storeHistoryRegistry.get(store)?.history ?? []) as ReadonlyArray<
    HistoryItem<StoreState<TStore>>
  >;
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
  const { history, maxLength } = storeHistoryRegistry.get(store) ?? {};
  if (history) {
    const stateBeforeCommand =
      store instanceof ImmutableStore
        ? store.state()
        : deepClone(store.state());
    addToHistoryUtil(history, command, stateBeforeCommand);

    if (maxLength && history.length > maxLength) {
      prune(history, pruneFraction);
    }
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
  const history = storeHistoryRegistry.get(store)?.history as History<
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
  const history = storeHistoryRegistry.get(store)?.history as History<
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
 * @deprecated This function is deprecated and will be removed in future versions.
 * Please use the `trackHistory` function from the new history tracking system which offers
 * more features, like cross store tracking and transactions.
 *
 * Enables Storeplugin that tracks and maintains a history of the store's state changes.
 * It provides means to perform state undo's and redo's.
 * This plugin is designed to work best with an ImmutableStore, where an optimized immutable
 * data structure is used for managing history. For a regular Store, a naive deep clone method is used.
 *
 * @returns History Storeplugin.
 *
 */
export function useStoreHistory(
  options: StoreHistoryPluginOptions = {}
): StorePlugin {
  return {
    precedence: 10, // should come early in initialization
    init(store) {
      registerStateHistory(store, options.maxLength);
    },
    preprocessCommand(store, command) {
      addToHistory(store, command ?? 'Unspecified Command');
    },
  };
}
