/* eslint-disable @typescript-eslint/no-explicit-any */
import { Signal, WritableSignal, computed, signal } from '@angular/core';
import { Store } from './store';
import { ImmutableStore } from './store-immutability/immutable-store';
import { isSetTimeoutAvailable } from './utility/feature-detection';

type HistorySingleItem = {
  command: string;
  store: WeakRef<Store<any>>;
  before: any;
};

type HistoryItemGroup = {
  command: string;
  before: WeakMap<Store<any>, any>;
};

type HistoryUndoItem = (HistorySingleItem | HistoryItemGroup) & {
  undoneCommandIndex: number;
};

type HistoryRedoItem = (HistorySingleItem | HistoryItemGroup) & {
  redoneCommandIndex: number;
};

type HistoryItem =
  | HistorySingleItem
  | HistoryItemGroup
  | HistoryUndoItem
  | HistoryRedoItem;

type History = HistoryItem[];

/**
 * Type guard to check if an item is a undo item.
 * @param item The item to be checked.
 */
function isHistoryUndoItem(
  item: HistoryItem | undefined
): item is HistoryUndoItem {
  return !!item && 'undoneCommandIndex' in item;
}

/**
 * Type guard to check if an item is a redo item.
 * @param item The item to be checked.
 */
function isHistoryRedoItem(
  item: HistoryItem | undefined
): item is HistoryRedoItem {
  return !!item && 'redoneCommandIndex' in item;
}

/**
 * Creates a tracker which immediately tracks the history of the specifiedd stores.
 * @param maxLength Maximum number of commands to retain in the history.
 * @param store Initial store to be tracked in the history.
 * @param stores Additional stores to be tracked in the history.
 * @returns An instance of `HistoryTracker`.
 *
 * @remark At least one store has to be specifieid
 */
export function trackHistory(
  maxLength: number,
  store: ImmutableStore<any>,
  ...stores: ImmutableStore<any>[]
): HistoryTracker {
  stores ??= [];
  stores.push(store);
  return new HistoryTrackerBase(
    new Set(stores.map(x => new WeakRef(x))),
    maxLength
  );
}

/**
 * Hhistory tracker for tracking history of a finite set of stores enabling undo and redo functionality.
 */
export interface HistoryTracker {
  /**
   * Signal indicating whether undo operation is available.
   */
  canUndo: Signal<boolean>;

  /**
   * Signal indicating whether redo operation is available.
   */
  canRedo: Signal<boolean>;

  /**
   * History of commands performed.
   */
  getHistory: () => {
    /**
     * Name of the executed command or transaction tag.
     */
    command: string;
    /**
     * Array containing stores and their corresponding state values before the command was executed.
     * Each element is a tuple [store, storeState].
     */
    before: [Store<any> | undefined, any][];
  }[];

  /**
   * Destroys the history tracker, cleaning up any resources.
   */
  destroy: () => void;

  /**
   * Begins a new transaction in the history tracker.
   * @param tag Optional tag to identify the transaction (only used for pretty printing).
   */
  beginTransaction: (tag?: string) => void;

  /**
   * Ends the current transaction in the history tracker.
   */
  endTransaction: () => void;

  /**
   * Undoes the last command or a group of commands if in a transaction.
   * @returns True if the undo operation was successful, false otherwise.
   */
  undo: () => boolean;

  /**
   * Redoes the last undone command or a group of commands (if last undone action was a transaction).
   * @returns True if the redo operation was successful, false otherwise.
   */
  redo: () => boolean;
}

const PRUNE_FRACTION = 0.25;
const UNDO_COMMAND = '_UNDO_';
const REDO_COMMAND = '_REDO_';
const UNSPECIFIED_COMMAND = 'Unspecified';

class HistoryTrackerBase implements HistoryTracker {
  private readonly stores: Set<WeakRef<Store<any>>>;
  private readonly pool: WeakMap<Store<any>, WeakRef<Store<any>>>;
  private readonly lastCommand: WritableSignal<HistoryItem | undefined>;
  private readonly maxLength: number;
  private readonly _history: History;
  private readonly addToHistoryRef = this.addToHistory.bind(this);

  private activeTransactions: number;

  constructor(stores: Set<WeakRef<Store<any>>>, maxLength: number) {
    this.stores = stores;
    this.maxLength = Math.floor(maxLength * (1 + PRUNE_FRACTION));
    this.pool = new WeakMap<Store<any>, WeakRef<Store<any>>>();
    this._history = [];
    this.activeTransactions = 0;
    this.lastCommand = signal(undefined);

    this.foreachStore(store => {
      if (store instanceof ImmutableStore) {
        (store['commandPreprocessor'] as any) ??= [];
        store['commandPreprocessor']!.push(this.addToHistoryRef);
        this.pool.set(store, new WeakRef(store));
      } else {
        throw new Error(
          `${store.name} is not immutable: HistoryTracker does only support ImmutableStores`
        );
      }
    });
  }

  private foreachStore(callbackFn: (store: Store<unknown>) => void) {
    this.stores.forEach(storeRef => {
      const store = storeRef.deref();
      if (store) {
        callbackFn(store);
      } else {
        this.stores.delete(storeRef);
      }
    });
  }

  private pushToHistory(historyItem: HistoryItem) {
    this._history.push(historyItem);
    this.lastCommand.set(historyItem);

    if (this._history.length > this.maxLength) {
      if (isSetTimeoutAvailable()) {
        setTimeout(this.prune.bind(this), 0);
      } else {
        this.prune();
      }
    }
  }

  private popFromHistory() {
    const poped = this._history.pop();
    this.lastCommand.set(this._history[this._history.length - 1]);
    return poped;
  }

  private addToHistory<TState>(
    store: Store<TState>,
    command: string | undefined
  ) {
    if (
      this.activeTransactions === 0 &&
      command !== UNDO_COMMAND &&
      command !== REDO_COMMAND
    ) {
      this.pushToHistory({
        command: command ?? UNSPECIFIED_COMMAND,
        before: store.state(),
        store: this.pool.get(store) ?? new WeakRef(store),
      });
    }
  }

  private collectCurrentStates() {
    const values = new WeakMap<Store<any>, any>();
    this.foreachStore(store => values.set(store, store.state()));
    return values;
  }

  private getCommandToUndo(): [number, HistoryItem | undefined] {
    let toBeUndoneCommandIndex = this._history.length - 1;
    let toBeUndoneCommand = this.lastCommand();

    while (
      toBeUndoneCommandIndex >= 0 &&
      isHistoryUndoItem(toBeUndoneCommand)
    ) {
      toBeUndoneCommandIndex = toBeUndoneCommand.undoneCommandIndex - 1;
      toBeUndoneCommand =
        toBeUndoneCommandIndex >= 0
          ? this._history[toBeUndoneCommandIndex]
          : undefined;
    }

    return toBeUndoneCommandIndex >= 0
      ? [toBeUndoneCommandIndex, toBeUndoneCommand]
      : [-1, undefined];
  }

  private getCommandToRedo(): [number, HistoryItem | undefined] {
    let toBeRedoneCommandIndex = this._history.length - 1;
    let toBeRedoneCommand = this.lastCommand();

    while (
      toBeRedoneCommandIndex >= 0 &&
      isHistoryRedoItem(toBeRedoneCommand)
    ) {
      toBeRedoneCommandIndex = toBeRedoneCommand.redoneCommandIndex - 1;
      toBeRedoneCommand =
        toBeRedoneCommandIndex >= 0
          ? this._history[toBeRedoneCommandIndex]
          : undefined;
    }

    return toBeRedoneCommandIndex >= 0 && isHistoryUndoItem(toBeRedoneCommand)
      ? [toBeRedoneCommandIndex, toBeRedoneCommand]
      : [-1, undefined];
  }

  private prune(): void {
    const deleteCount = Math.floor(this._history.length * PRUNE_FRACTION);

    if (deleteCount > 0) {
      this._history.splice(0, deleteCount);

      this._history.forEach(command => {
        if (isHistoryRedoItem(command)) {
          command.redoneCommandIndex -= deleteCount;
        } else if (isHistoryUndoItem(command)) {
          command.undoneCommandIndex -= deleteCount;
        }
      });
    }
  }

  get canUndo() {
    return computed(
      () => !!this.lastCommand() && this.getCommandToUndo()[0] >= 0
    );
  }

  get canRedo() {
    return computed(
      () =>
        !!this.lastCommand() &&
        this.activeTransactions === 0 &&
        this.getCommandToRedo()[0] >= 0
    );
  }

  getHistory() {
    const scopedStores = Array.from(this.stores);
    return this._history.map(x => {
      const stores = 'store' in x ? [x.store] : scopedStores;

      const before = stores.map(storeRef => {
        const store = storeRef.deref();
        return [
          store,
          x.before instanceof WeakMap
            ? store
              ? x.before.get(store)
              : undefined
            : x.before,
        ] as [Store<any> | undefined, any];
      });

      return {
        command: x.command,
        before,
      };
    });
  }

  destroy() {
    this.foreachStore(store => {
      if (store instanceof ImmutableStore) {
        const trackerRefIndex = store['commandPreprocessor']?.indexOf(
          this.addToHistoryRef
        );
        if (trackerRefIndex !== undefined && trackerRefIndex > -1) {
          store['commandPreprocessor']!.splice(trackerRefIndex, 1);
        }
      }
    });
  }

  beginTransaction(tag?: string) {
    if (this.activeTransactions === 0) {
      this.pushToHistory({
        command: tag ?? UNSPECIFIED_COMMAND,
        before: this.collectCurrentStates(),
      });
    }

    this.activeTransactions++;
  }

  endTransaction() {
    if (this.activeTransactions > 0) {
      this.activeTransactions--;
    }
  }

  undo(): boolean {
    if (this.activeTransactions > 0) {
      const toBeUndone = this.popFromHistory();
      if (toBeUndone && toBeUndone.before instanceof WeakMap) {
        this.foreachStore(store =>
          store.set(toBeUndone.before.get(store), UNDO_COMMAND)
        );
      }

      this.activeTransactions = 0;
      return true;
    }

    const [toBeUndoneCommandIndex, toBeUndoneCommand] = this.getCommandToUndo();

    if (toBeUndoneCommand) {
      const newState = toBeUndoneCommand.before;

      if (newState instanceof WeakMap) {
        this.pushToHistory({
          command: UNDO_COMMAND,
          before: this.collectCurrentStates(),
          undoneCommandIndex: toBeUndoneCommandIndex,
        });
        this.foreachStore(store =>
          store.set(newState.get(store), UNDO_COMMAND)
        );
      } else if ('store' in toBeUndoneCommand) {
        const store = toBeUndoneCommand.store.deref();
        if (store) {
          this.pushToHistory({
            command: UNDO_COMMAND,
            store: toBeUndoneCommand.store,
            before: store.state(),
            undoneCommandIndex: toBeUndoneCommandIndex,
          });
          store.set(newState, UNDO_COMMAND);
        }
      }

      return true;
    }

    return false;
  }

  redo(): boolean {
    if (this.activeTransactions > 0) {
      return false;
    }

    const [toBeRedoneCommandIndex, toBeRedoneCommand] = this.getCommandToRedo();

    if (toBeRedoneCommand) {
      const newState = toBeRedoneCommand.before;
      if (newState instanceof WeakMap) {
        this.pushToHistory({
          command: REDO_COMMAND,
          before: this.collectCurrentStates(),
          redoneCommandIndex: toBeRedoneCommandIndex,
        });
        this.foreachStore(store =>
          store.set(newState.get(store), REDO_COMMAND)
        );
      } else if ('store' in toBeRedoneCommand) {
        const store = toBeRedoneCommand.store.deref();
        if (store) {
          this.pushToHistory({
            command: REDO_COMMAND,
            store: toBeRedoneCommand.store,
            before: store.state(),
            redoneCommandIndex: toBeRedoneCommandIndex,
          });
          store.set(newState, REDO_COMMAND);
        }
      }

      return true;
    }

    return false;
  }
}
