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
export type History<TState> = (
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
 * Adds a new command to the history.
 * @param store The store to add history for.
 * @param command The name of the command to add.
 */
export function addToHistory<TState>(
  history: History<TState>,
  command: string,
  before: TState
): void {
  if (command !== UndoCommand && command !== RedoCommand) {
    history.push({ command, before });
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
export function undo<TState>(
  history: History<TState>,
  currentState: TState
): { newState: TState; command: string } | null {
  const lastCommand = getLastCommand(history);
  if (lastCommand) {
    // Calculate the index of the command to be undone
    const isUndoItem = isHistoryUndoItem(lastCommand);
    const toBeUndoneCommandIndex = isUndoItem
      ? lastCommand.undoneCommandIndex - 1
      : history.length - 1;

    if (toBeUndoneCommandIndex >= 0) {
      const toBeUndoneCommand = history[toBeUndoneCommandIndex];

      history.push({
        command: UndoCommand,
        before: currentState,
        undoneCommandIndex: toBeUndoneCommandIndex,
      });

      return {
        newState: isUndoItem ? toBeUndoneCommand.before : lastCommand.before,
        command: UndoCommand,
      };
    }
  }

  return null;
}

/**
 * Redoes the last undone command for a store.
 * @param store The store to perform the redo operation on.
 */
export function redo<TState>(
  history: History<TState>,
  currentState: TState
): { newState: TState; command: string } | null {
  const lastCommand = getLastCommand(history);
  if (lastCommand) {
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
          before: currentState,
          redoneCommandIndex: toBeRedoneCommandIndex,
        });

        return {
          newState: toBeRedoneCommand.before,
          command: RedoCommand,
        };
      }
    }
  }

  return null;
}
