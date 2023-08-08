import {
  Injector,
  ProviderToken,
  Signal,
  WritableSignal,
  computed,
  inject,
  runInInjectionContext,
  signal,
} from '@angular/core';
import { StoreConfig } from './store-config';
import { StoreEffect } from './store-effect';
import { StoreEvent } from './store-event';
import { register, rootRegistry, unregister } from './store-mediator';
import {
  CommandPostprocessor,
  CommandPreprocessor,
  ConstructorPostprocessor,
  EffectPreprocessor,
  isCommandPostprocessor,
  isCommandPreprocessor,
  isConstructorPostprocessor,
  isEffectPreprocessor,
} from './store-plugins/store-plugin';
import { StoreQuery } from './store-query';

/**
 * Represents a signal store that manages a state and provides methods for state mutation, event handling, and more.
 * @typeparam TState The type of the store's state.
 */
export class Store<TState> {
  private readonly _state: WritableSignal<TState>;
  private readonly injector: Injector | undefined;
  private readonly commandPreprocessors: CommandPreprocessor<TState>[];
  private readonly commandPostprocessors: CommandPostprocessor<TState>[];
  private readonly effectPreprocessors: EffectPreprocessor<TState>[];
  private readonly constructorPostprocessors: ConstructorPostprocessor<TState>[];

  /**
   * The config of the store as readonly
   */
  public readonly config: Readonly<Required<StoreConfig<TState>>>;

  /**
   * Creates a new instance of the store class.
   * @param config The configuration options for the store.
   */
  public constructor(config: StoreConfig<TState>) {
    this.config = {
      name: config.name ?? this.constructor.name,
      initialState: config.initialState,
      enableEffectsAndQueries: config.enableEffectsAndQueries ?? false,
      plugins: config.plugins ?? [],
    };

    this.commandPreprocessors = this.config.plugins.filter(
      isCommandPreprocessor<TState>
    );
    this.commandPostprocessors = this.config.plugins.filter(
      isCommandPostprocessor<TState>
    );
    this.effectPreprocessors = this.config.plugins.filter(
      isEffectPreprocessor<TState>
    );
    this.constructorPostprocessors = this.config.plugins.filter(
      isConstructorPostprocessor<TState>
    );

    if (this.config.enableEffectsAndQueries) {
      this.injector = inject(Injector);
    }

    this._state = signal(this.config.initialState);

    this.constructorPostprocessors.forEach(plugin => {
      plugin.postprocessConstructor(this);
    });
  }

  /**
   * Gets the name of the store
   */
  public get name(): string {
    return this.config.name;
  }

  /**
   * Gets the signal representing the store's current state.
   */
  public get state(): Signal<TState> {
    return this._state.asReadonly();
  }

  /**
   * Sets the store's state to the provided state, with an optional command name.
   * @param newState The new state of the store.
   * @param commandName The name of the command associated with the state change.
   */
  public set(newState: TState, commandName?: string): void {
    this.commandPreprocessors.forEach(plugin => {
      plugin.preprocessCommand(this.state(), commandName);
    });

    this._state.set(newState);

    this.commandPostprocessors.forEach(plugin => {
      plugin.postprocessCommand(this.state(), commandName);
    });
  }

  /**
   * Updates the store's state based on the current state, with an optional command name.
   * @param updateFn A function that updates the current state.
   * @param commandName The name of the command associated with the state change.
   */
  public update(
    updateFn: (currentState: TState) => TState,
    commandName?: string
  ): void {
    this.commandPreprocessors.forEach(plugin => {
      plugin.preprocessCommand(this.state(), commandName);
    });

    this._state.update(state => updateFn(state));

    this.commandPostprocessors.forEach(plugin => {
      plugin.postprocessCommand(this.state(), commandName);
    });
  }

  /**
   * Mutates the store's state using the provided mutator function, with an optional command name.
   * @param mutator A function that mutates the current state.
   * @param commandName The name of the command associated with the state mutation.
   */
  public mutate(
    mutator: (currentState: TState) => void,
    commandName?: string
  ): void {
    this.commandPreprocessors.forEach(plugin => {
      plugin.preprocessCommand(this.state(), commandName);
    });

    this._state.mutate(mutator);

    this.commandPostprocessors.forEach(plugin => {
      plugin.postprocessCommand(this.state(), commandName);
    });
  }

  /**
   * Registers a handler for the specified event in the store's mediator.
   * @param event The event to register the handler for.
   * @param handler The handler function to be executed when the event is published.
   */
  public registerHandler<TPayload>(
    event: StoreEvent<TPayload>,
    handler: (store: this, event: StoreEvent<TPayload>) => void
  ) {
    register(rootRegistry, this, event, handler);
  }

  /**
   * Unregister a handler for the specified event(s) in the store's mediator.
   * @param event The event to remove the handler for.
   * @param events Additional events to remove the handlers for.
   */
  public unregisterHandler(
    event: StoreEvent<any>,
    ...events: StoreEvent<any>[]
  ): void;
  public unregisterHandler(...events: StoreEvent<any>[]): void {
    unregister(rootRegistry, this, ...events);
  }

  /**
   * Runs an effect with the provided arguments and returns the result.
   * The effect may be associated with the store itself but it may also be unrelated
   * @typeparam TStore The types of the effect's target store.
   * @typeparam TArgs The types of the effect's arguments.
   * @typeparam TResult The type of the effect's result.
   * @param effect The store effect to run.
   * @param args The arguments to pass to the effect.
   * @returns The result of the effect.
   */
  public runEffect<TArgs extends any[], TResult>(
    effect: StoreEffect<this, TArgs, TResult>,
    ...args: TArgs
  ): TResult {
    this.effectPreprocessors.forEach(plugin => {
      plugin.preprocessEffect(
        this,
        effect as StoreEffect<Store<TState>, any[], TResult>
      );
    });

    if (effect.withInjectionContext && this.injector) {
      return runInInjectionContext(this.injector, () => {
        return effect.func(this, ...args);
      });
    } else {
      return effect.func(this, ...args);
    }
  }

  /**
   * Runs a store query potentially targeting many differnt stores with the provided arguments and returns the result.
   * @typeparam TResult The type of the query's result.
   * @typeparam TStores The types of the stores used in the query.
   * @typeparam TArgs The type of the query's arguments.
   * @param storeQuery The store query to run.
   * @param args The arguments to pass to the query.
   * @returns The result of the query as computed signal.
   */
  public runQuery<
    TResult,
    TStores extends ProviderToken<any>[],
    TArgs = undefined
  >(
    storeQuery: StoreQuery<TResult, TStores, TArgs>,
    ...args: TArgs extends undefined ? [] : [TArgs]
  ): Signal<TResult> {
    return runInInjectionContext(this.injector!, () => {
      const queryArgs = [
        ...(storeQuery.stores.map(x =>
          x === this.constructor ? this : inject(x)
        ) as {
          [K in keyof TStores]: TStores[K] extends ProviderToken<infer U>
            ? U
            : never;
        }),
        ...(args as any[]),
      ];

      return computed(() => storeQuery.query(...(queryArgs as any)));
    });
  }
}
