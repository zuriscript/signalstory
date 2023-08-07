import { StoreConfig } from './store-config';
import { StoreHistory } from './store-history';
import { CommandPreprocessor } from './store-plugin';

export class StateHistoryPlugin<TState> implements CommandPreprocessor<TState> {
  private readonly history: StoreHistory<TState> = new StoreHistory<TState>();

  preprocessCommand(stateBeforeCommand: TState, commandName: string): void {
    this.history.add(stateBeforeCommand, commandName ?? 'Unspecified');
  }
}

export function createStateHistoryPlugin<TState>(_: StoreConfig<TState>) {
  return new StateHistoryPlugin<TState>();
}
