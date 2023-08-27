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
import { register, rootRegistry, unregister } from './store-mediator';
import {
  CommandPostprocessor,
  CommandPreprocessor,
  InitPostprocessor,
} from './store-plugin';
import { StoreQuery } from './store-query';
import { getInjectorOrNull } from './utility/injector-helper';
import { enableLogging, log } from './utility/logger';

/**
 * Represents a signal store that manages a state and provides methods for state mutation, event handling, and more.
 * @typeparam TState The type of the store's state.
 */
export class Store<TState> {
  private readonly _state: WritableSignal<TState>;
  private readonly initPostprocessor: InitPostprocessor[] = [];
  private readonly commandPreprocessor: CommandPreprocessor[] = [];
  private readonly commandPostprocessor: CommandPostprocessor[] = [];
  private log?: (
    action: string,
    description?: string,
    ...data: unknown[]
  ) => void;
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
      enableLogging: config.enableLogging ?? false,
      plugins: config.plugins ?? [],
    };

    this._state = signal(this.config.initialState);

    if (this.config.enableLogging) {
      enableLogging();
      this.log = (a: string, d?: string, ...p: unknown[]) =>
        log?.(`[${this.config.name}->${a}] ${d ?? 'Unspecified'}`, ...p);
    }

    this.config.plugins
      .sort((a, b) => (b.precedence ?? 0) - (a.precedence ?? 0))
      .forEach(plugin => {
        if (plugin.init) {
          this.initPostprocessor.push(plugin.init);
        }
        if (plugin.preprocessCommand) {
          this.commandPreprocessor.push(plugin.preprocessCommand);
        }
        if (plugin.postprocessCommand) {
          this.commandPostprocessor.push(plugin.postprocessCommand);
        }
      });

    this.initPostprocessor.forEach(p => p(this));
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
    this.commandPreprocessor.forEach(p => p(this, commandName));

    this._state.set(newState);

    this.commandPostprocessor.forEach(p => p(this, commandName));
    this.log?.('Command', commandName, this.state());
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
    this.commandPreprocessor.forEach(p => p(this, commandName));

    this._state.update(state => updateFn(state));

    this.commandPostprocessor.forEach(p => p(this, commandName));
    this.log?.('Command', commandName, this.state());
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
    this.commandPreprocessor.forEach(p => p(this, commandName));

    this._state.mutate(mutator);

    this.commandPostprocessor.forEach(p => p(this, commandName));
    this.log?.('Command', commandName, this.state());
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
    this.log?.('Event', `Register handler for ${event.name}`);
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
    this.log?.('Event', `Unegister handler for ${events.join(', ')}`);
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
    this.log?.('Effect', `Running ${effect.name}`, ...args);

    if (effect.withInjectionContext && this.config.injector) {
      return runInInjectionContext(this.config.injector, () => {
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
