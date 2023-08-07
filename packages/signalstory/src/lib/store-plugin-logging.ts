import { StoreConfig } from './store-config';
import { CommandPostprocessor, ConstructorPostprocessor } from './store-plugin';

export class StateLoggerPlugin<TState>
  implements CommandPostprocessor<TState>, ConstructorPostprocessor<TState>
{
  private storeName: string | undefined;

  postprocessConstructor(config: Required<StoreConfig<TState>>): void {
    this.storeName = config.name;
    console.log(`[${this.storeName}->Init] Store initialized`, config);
  }

  postprocessCommand(
    stateAfterCommand: TState,
    commandName: string,
    commandArguments: any[]
  ): void {
    console.log(
      `[${this.storeName}->Command] ${commandName}`,
      ...commandArguments
    );
  }
}

export function createStoreLoggerPlugin<TState>(_: StoreConfig<TState>) {
  return new StateLoggerPlugin<TState>();
}
