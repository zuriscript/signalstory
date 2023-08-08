/**
 * Represents a history item in the store's history.
 */
export type HistoryItem<TState> = {
  command: string; // The name of the command associated with the history item.
  before: TState; // The state before the command was applied.
};

export const UndoCommand = '_UNDO_';
export const RedoCommand = '_REDO_';

/**
 * Represents the history of a store, tracking the executed commands and their associated states.
 * Provides methods for adding commands, undoing, and redoing actions.
 */
export class StoreHistory<TState> {
  private history: HistoryItem<TState>[] = []; // The array to store the history items.

  /**
   * Returns the array of history items as readonly
   */
  public get entries(): ReadonlyArray<HistoryItem<TState>> {
    return this.history;
  }

  /**
   * Adds a new history item to the store's history.
   * @param state The state before applying the command.
   * @param command The name of the command.
   */
  public add(state: TState, command: string): void {
    this.history.push({ command, before: state });
  }

  /**
   * Performs an undo action by returning the previous state from the history and adding an undo command.
   * @param currentState The current state of the store.
   * @returns The previous state before the undo action, or undefined if no undo action is available.
   */
  public undo(currentState: TState): TState | undefined {
    const lastCommand = this.getLastCommand();

    if (this.history.length > 0) {
      this.history.push({
        command: UndoCommand,
        before: currentState,
      });
    }

    return lastCommand?.before;
  }

  /**
   * Performs a redo action by returning the state before the last undo action from the history and adding a redo command.
   * @param currentState The current state of the store.
   * @returns The state before the last undo action, or undefined if no redo action could be applied because the prior action was not an Undo action
   */
  public redo(currentState: TState): TState | undefined {
    const lastCommand = this.getLastCommand();

    if (lastCommand && lastCommand.command === UndoCommand) {
      this.history.push({
        command: RedoCommand,
        before: currentState,
      });
      return lastCommand.before;
    } else {
      return undefined;
    }
  }

  /**
   * Returns the last executed command in the history, or undefined if the history is empty.
   */
  private getLastCommand(): HistoryItem<TState> | undefined {
    return this.history.length > 0
      ? this.history[this.history.length - 1]
      : undefined;
  }
}
