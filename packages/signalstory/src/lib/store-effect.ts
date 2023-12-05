/* eslint-disable @typescript-eslint/no-explicit-any */
import { Store } from './store';

/**
 * Configuration for a store effect.
 */
export interface StoreEffectConfig {
  withInjectionContext?: boolean; // Indicates whether the effect requires an injection context.
}

/**
 * Represents an effect that can be executed on a store.
 */
export interface StoreEffect<
  TStore extends Store<any>,
  TArgs extends unknown[],
  TResult,
> {
  name: string; // The name of the effect.
  func: (store: TStore, ...args: TArgs) => TResult; // The function representing the effect.
  config: Readonly<Required<StoreEffectConfig>>; // Indicates whether the effect requires an injection context.
}

/**
 * Creates a new store effect with the provided name, function, and configuration.
 * @param name The name of the effect.
 * @param func The function representing the effect.
 * @param config Configuration options for the effect.
 * @returns A store effect object.
 */
export function createEffect<
  TStore extends Store<any>,
  TArgs extends any[],
  TResult,
>(
  name: string,
  func: (store: TStore, ...args: TArgs) => TResult,
  config?: StoreEffectConfig
): StoreEffect<TStore, TArgs, TResult>;

/**
 * Creates a new store effect with the provided name, function, and injection context option.
 * @param name The name of the effect.
 * @param func The function representing the effect.
 * @param withInjectionContext Specifies whether the effect requires an injection context. Default is true.
 * @returns A store effect object.
 * @deprecated Use the overload with a configuration object instead.
 */
export function createEffect<
  TStore extends Store<any>,
  TArgs extends any[],
  TResult,
>(
  name: string,
  func: (store: TStore, ...args: TArgs) => TResult,
  withInjectionContext?: boolean
): StoreEffect<TStore, TArgs, TResult>;

/**
 * Implementation of the createEffect function.
 */
export function createEffect<
  TStore extends Store<any>,
  TArgs extends any[],
  TResult,
>(
  name: string,
  func: (store: TStore, ...args: TArgs) => TResult,
  arg?: boolean | StoreEffectConfig
): StoreEffect<TStore, TArgs, TResult> {
  return {
    name,
    func,
    config: {
      withInjectionContext:
        !arg || arg === true || (arg.withInjectionContext ?? false),
    },
  };
}
