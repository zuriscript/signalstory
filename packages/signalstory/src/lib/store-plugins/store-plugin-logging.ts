import { Store } from '../store';
import { StoreEffect } from '../store-effect';
import {
  CommandPostprocessor,
  ConstructorPostprocessor,
  EffectPreprocessor,
} from './store-plugin';

type LogFunction = (message: string, ...data: any[]) => void;

export class StateLoggerPlugin<TState>
  implements
    CommandPostprocessor<TState>,
    ConstructorPostprocessor<TState>,
    EffectPreprocessor<TState>
{
  private storeName: string | undefined;
  private log: LogFunction;

  constructor(log: LogFunction = console.log) {
    this.log = log;
  }

  postprocessConstructor(store: Store<TState>): void {
    this.storeName = store.name;
    this.log(`[${this.storeName}->Init] Store initialized`, store.config);
  }

  postprocessCommand(
    stateAfterCommand: TState,
    commandName: string | undefined
  ): void {
    console.log(
      `[${this.storeName}->Command] ${commandName ?? 'Unspecified Command'}`,
      stateAfterCommand
    );
  }

  preprocessEffect(
    store: Store<TState>,
    effect: StoreEffect<Store<TState>, any[], any>
  ) {
    console.log(
      `[${this.storeName}->Effect] ${effect.name ?? 'Unspecified Effect'}`
    );
  }
}
