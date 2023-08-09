import { Store } from './store';

/**
 * Represents a history item in the store's history.
 */
export type HistoryItem<TState> = {
  command: string; // The name of the command associated with the history item.
  before: TState; // The state before the command was applied.
};

/**
 * Represents a history item for an undone command.
 */
type HistoryUndoItem<TState> = HistoryItem<TState> & {
  undoneCommandIndex: number; // Index of the undone command in the history.
};

/**
 * Type guard to check if an item is a history undo item.
 * @param item The item to be checked.
 */
function isHistoryUndoItem<TState>(
  item: HistoryItem<TState> | undefined
): item is HistoryUndoItem<TState> {
  return !!item && 'undoneCommandIndex' in item;
}

/**
 * Represents a history item for a redone command.
 */
type HistoryRedoItem<TState> = HistoryItem<TState> & {
  redoneCommandIndex: number; // Index of the redone command in the history.
};

/**
 * Type guard to check if an item is a history redo item.
 * @param item The item to be checked.
 */
function isHistoryRedoItem<TState>(
  item: HistoryItem<TState> | undefined
): item is HistoryRedoItem<TState> {
  return !!item && 'redoneCommandIndex' in item;
}

/**
 * Represents the history of commands and their associated states in a store.
 */
type History<TState> = (
  | HistoryItem<TState>
  | HistoryUndoItem<TState>
  | HistoryRedoItem<TState>
)[];

/**
 * Represents the undo command.
 */
export const UndoCommand = '_UNDO_';

/**
 * Represents the redo command.
 */
export const RedoCommand = '_REDO_';

/**
 * Registry to associate a store with its history.
 */
const storeHistoryRegistry = new WeakMap<Store<any>, History<any>>();

/**
 * Registers the history for a store.
 * @param store The store to register history for.
 */
export function registerStateHistory<TState>(store: Store<TState>): void {
  storeHistoryRegistry.set(store, []);
}

/**
 * Clears the history for a store.
 * @param store The store to clear history for.
 */
export function clearStateHistory<TState>(store: Store<TState>): void {
  storeHistoryRegistry.delete(store);
}

/**
 * Gets the history of commands for a store as readonly.
 * @param store The store to get history for.
 * @returns An array of history items as readonly
 */
export function getHistory<TState>(
  store: Store<TState>
): ReadonlyArray<HistoryItem<TState>> {
  const history = storeHistoryRegistry.get(store);
  return history ? history : [];
}

/**
 * Adds a new command to the history.
 * @param store The store to add history for.
 * @param command The name of the command to add.
 */
export function addToHistory<TState>(
  store: Store<TState>,
  command: string
): void {
  if (command !== UndoCommand && command !== RedoCommand) {
    const history = storeHistoryRegistry.get(store);
    if (history) {
      history.push({ command, before: store.state() });
    } else {
      console.warn(
        `Attempted to call addToHistory on ${store.name} but history is disabled for this store`
      );
    }
  }
}

/**
 * Gets the last command from the history.
 * @param history The history to retrieve the last command from.
 * @returns The last history item.
 */
function getLastCommand<TState>(
  history: History<TState>
): HistoryItem<TState> | undefined {
  return history.length > 0 ? history[history.length - 1] : undefined;
}

/**
 * Undoes the last command for a store.
 * @param store The store to perform the undo operation on.
 */
export function undo<TState>(store: Store<TState>): void {
  const history = storeHistoryRegistry.get(store) as History<TState>;

  if (!history) {
    // History is disabled for this store
    console.warn(
      `Attempted to call undo on ${store.name} but history is disabled for this store`
    );
    return;
  }

  const lastCommand = getLastCommand(history);
  if (!lastCommand) {
    return; // Nothing to undo here
  }

  // Calculate the index of the command to be undone
  const isUndoItem = isHistoryUndoItem(lastCommand);
  const toBeUndoneCommandIndex = isUndoItem
    ? lastCommand.undoneCommandIndex - 1
    : history.length - 1;

  if (toBeUndoneCommandIndex >= 0) {
    const toBeUndoneCommand = history[toBeUndoneCommandIndex];

    history.push({
      command: UndoCommand,
      before: store.state(),
      undoneCommandIndex: toBeUndoneCommandIndex,
    });

    store.set(
      isUndoItem ? toBeUndoneCommand.before : lastCommand.before,
      UndoCommand
    );
  }
}

/**
 * Redoes the last undone command for a store.
 * @param store The store to perform the redo operation on.
 */
export function redo<TState>(store: Store<TState>): void {
  const history = storeHistoryRegistry.get(store) as History<TState>;

  if (!history) {
    // History is disabled for this store
    console.warn(
      `Attempted to call redo on ${store.name} but history is disabled for this store`
    );
    return;
  }

  const lastCommand = getLastCommand(history);
  if (!lastCommand) {
    return; // Nothing to redo here
  }

  // Calculate the index of the command to be redone
  const toBeRedoneCommandIndex = isHistoryRedoItem(lastCommand)
    ? lastCommand.redoneCommandIndex - 1
    : history.length - 1;

  if (toBeRedoneCommandIndex >= 0) {
    const toBeRedoneCommand = history[toBeRedoneCommandIndex];
    if (isHistoryUndoItem(toBeRedoneCommand)) {
      // Redo is only possible for Undo commands
      history.push({
        command: RedoCommand,
        before: store.state(),
        redoneCommandIndex: toBeRedoneCommandIndex,
      });

      store.set(toBeRedoneCommand.before, RedoCommand);
    }
  }
}
