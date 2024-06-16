/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Injector,
  ProviderToken,
  Signal,
  WritableSignal,
  assertInInjectionContext,
  computed,
  inject,
  runInInjectionContext,
  signal,
} from '@angular/core';
import { StoreConfig } from './store-config';
import { StoreEffect } from './store-effect';
import { StoreEvent } from './store-event';
import { shallowClone } from './store-immutability/immutable-utility';
import { register, rootRegistry, unregister } from './store-mediator';
import {
  CommandPostprocessor,
  CommandPreprocessor,
  EffectPostprocessor,
  EffectPreprocessor,
  InitPostprocessor,
} from './store-plugin';
import { StoreQuery } from './store-query';
import { addToRegistry } from './store-registry';
import { getInjectorOrNull } from './utility/injector-helper';
import { withSideEffect } from './utility/sideeffect';

/**
 * Represents a signal store that manages a state and provides methods for state mutation, event handling, and more.
 * @typeparam TState The type of the store's state.
 */
export class Store<TState> {
  private readonly _state: WritableSignal<TState>;
  private readonly initPostprocessor?: InitPostprocessor[];
  private readonly commandPreprocessor?: CommandPreprocessor[];
  private readonly commandPostprocessor?: CommandPostprocessor[];
  private readonly effectPreprocessor?: EffectPreprocessor[];
  private readonly effectPostprocessor?: EffectPostprocessor<unknown>[];
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
      injector: config.injector ?? getInjectorOrNull(),
      stateEqualityFn: config.stateEqualityFn ?? null,
      plugins: config.plugins ?? [],
    };

    this._state = signal(this.config.initialState, {
      equal: this.config.stateEqualityFn ?? undefined,
    });

    addToRegistry(this);

    this.config.plugins
      .sort((a, b) => (b.precedence ?? 0) - (a.precedence ?? 0))
      .forEach(plugin => {
        if (plugin.init) {
          (this.initPostprocessor as any) ??= [];
          this.initPostprocessor!.push(plugin.init);
        }
        if (plugin.preprocessCommand) {
          (this.commandPreprocessor as any) ??= [];
          this.commandPreprocessor!.push(plugin.preprocessCommand);
        }
        if (plugin.postprocessCommand) {
          (this.commandPostprocessor as any) ??= [];
          this.commandPostprocessor!.unshift(plugin.postprocessCommand);
        }
        if (plugin.preprocessEffect) {
          (this.effectPreprocessor as any) ??= [];
          this.effectPreprocessor!.push(plugin.preprocessEffect);
        }
        if (plugin.postprocessEffect) {
          (this.effectPostprocessor as any) ??= [];
          this.effectPostprocessor!.unshift(plugin.postprocessEffect);
        }
      });

    this.initPostprocessor?.forEach(p => p(this));
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
    this.commandPreprocessor?.forEach(p => p(this, commandName));

    this._state.set(newState);

    this.commandPostprocessor?.forEach(p => p(this, commandName));
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
    this.commandPreprocessor?.forEach(p => p(this, commandName));

    this._state.update(state => updateFn(state));

    this.commandPostprocessor?.forEach(p => p(this, commandName));
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
    this.commandPreprocessor?.forEach(p => p(this, commandName));

    this._state.update(state => {
      const cloned = shallowClone(state);
      mutator(cloned);
      return cloned;
    });

    this.commandPostprocessor?.forEach(p => p(this, commandName));
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
    const invocationId = performance.now() + Math.random();
    this.effectPreprocessor?.forEach(p => p(this, effect, invocationId));

    const effectResult =
      effect.config.withInjectionContext && this.config.injector
        ? runInInjectionContext(this.config.injector, () =>
            effect.func(this, ...args)
          )
        : effect.func(this, ...args);

    return !this.effectPostprocessor
      ? effectResult
      : withSideEffect(effectResult, () => {
          this.effectPostprocessor?.forEach(action =>
            action(this, effect, effectResult, invocationId)
          );
        });
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
    TArgs = undefined,
  >(
    storeQuery: StoreQuery<TResult, TStores, TArgs>,
    ...args: TArgs extends undefined ? [] : [TArgs]
  ): Signal<TResult> {
    if (!this.config.injector) {
      assertInInjectionContext(this.runQuery);
    }

    return runInInjectionContext(
      this.config.injector ?? inject(Injector),
      () => {
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
      }
    );
  }
}
