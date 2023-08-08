import { Store } from '../store';
import { StoreEffect, createNopEffect } from '../store-effect';
import {
  HistoryItem,
  RedoCommand,
  StoreHistory,
  UndoCommand,
} from '../utility/state-history';
import {
  CommandPreprocessor,
  EffectPreprocessor,
  tryGetPlugin,
} from './store-plugin';

export class StateHistoryPlugin<TState>
  implements CommandPreprocessor<TState>, EffectPreprocessor<TState>
{
  private readonly history: StoreHistory<TState> = new StoreHistory<TState>();

  preprocessCommand(
    stateBeforeCommand: TState,
    commandName: string | undefined
  ): void {
    if (commandName !== UndoCommand && commandName !== RedoCommand) {
      this.history.add(stateBeforeCommand, commandName ?? 'Unspecified');
    }
  }

  preprocessEffect(
    store: Store<TState>,
    effect: StoreEffect<Store<TState>, any[], any>
  ): void {
    if (effect === undoEffect) {
      const newState = this.history.undo(store.state());
      if (newState) {
        store.set(newState, UndoCommand);
      }
    } else if (effect === redoEffect) {
      const newState = this.history.redo(store.state());
      if (newState) {
        store.set(newState, RedoCommand);
      }
    }
  }

  getHistory(): ReadonlyArray<HistoryItem<TState>> {
    return this.history.entries ?? [];
  }
}

const undoEffect = createNopEffect(UndoCommand);
const redoEffect = createNopEffect(RedoCommand);

export function undo(store: Store<any>) {
  store.runEffect(undoEffect);
}

export function redo(store: Store<any>) {
  store.runEffect(redoEffect);
}

/**
 * Gets the history of this store from creation until before current state
 */
export function getHistory<TState, TStore extends Store<TState>>(
  store: TStore
): ReadonlyArray<HistoryItem<TState>> {
  const plugin = tryGetPlugin(store.config.plugins, StateHistoryPlugin<TState>);
  return plugin?.getHistory() ?? [];
}
