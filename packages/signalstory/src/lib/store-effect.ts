/* eslint-disable @typescript-eslint/no-explicit-any */
import { Store } from './store';

/**
 * Configuration for a store effect.
 */
export interface StoreEffectConfig {
  /**
   * Indicates whether the effect requires an injection context. Defaults to true.
   */
  withInjectionContext?: boolean;

  /**
   * Indicates whether the effect sets loading status.
   * Only applicable if the `StoreStatus` plugin is used.
   * Defaults to false.
   */
  setLoadingStatus?: boolean;

  /**
   * Indicates whether the effect sets initialized status.
   * Only applicable if the `StoreStatus` plugin is used.
   * Defaults to false.
   */
  setInitializedStatus?: boolean;
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
  config: Readonly<Required<StoreEffectConfig>>; // effect configuration
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
        !arg || arg === true || (arg.withInjectionContext ?? true),
      setLoadingStatus: (arg as StoreEffectConfig)?.setLoadingStatus ?? false,
      setInitializedStatus:
        (arg as StoreEffectConfig)?.setInitializedStatus ?? false,
    },
  };
}
