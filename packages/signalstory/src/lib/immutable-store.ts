import { ImmutableStoreConfig } from './immutable-store-config';
import { Store } from './store';
import { Immutable } from './types';
import { naiveCloneAndMutateFunc } from './utility/immutable-naive-ops';

export class ImmutableStore<TState> extends Store<Immutable<TState>> {
  private readonly cloneAndMutateFunc: (
    currentState: TState,
    mutation: (draftState: TState) => void
  ) => TState;

  public constructor(config: ImmutableStoreConfig<TState>) {
    super(config);
    this.cloneAndMutateFunc =
      config.cloneAndMutateFunc ?? naiveCloneAndMutateFunc;
  }

  /**
   * Clones and mutates the store's state using the provided mutator function, with an optional command name.
   * @param mutator A function that mutates the current state.
   * @param commandName The name of the command associated with the state mutation.
   */
  public override mutate(
    mutator: (currentState: TState) => void,
    commandName?: string
  ): void;
  public override mutate(
    mutator: (currentState: Immutable<TState>) => void,
    commandName?: string
  ): void;
  public override mutate(
    mutator:
      | ((currentState: TState) => void)
      | ((currentState: Immutable<TState>) => void),
    commandName?: string
  ): void {
    this.update(
      state =>
        this.cloneAndMutateFunc(
          state as TState,
          mutator as (currentState: TState) => void
        ) as Immutable<TState>,
      commandName
    );
  }
}
