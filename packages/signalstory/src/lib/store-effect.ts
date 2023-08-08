import { Store } from './store';

/**
 * Represents an effect that can be executed on a store.
 */
export interface StoreEffect<
  TStore extends Store<any>,
  TArgs extends any[],
  TResult
> {
  name: string; // The name of the effect.
  func: (store: TStore, ...args: TArgs) => TResult; // The function representing the effect.
  withInjectionContext: boolean; // Indicates whether the effect requires an injection context.
}

/**
 * Creates a new store effect with the provided name, function, and injection context option.
 * @param name The name of the effect.
 * @param func The function representing the effect.
 * @param withInjectionContext Specifies whether the effect requires an injection context. Default is true.
 * @returns A store effect object.
 */
export function createEffect<
  TStore extends Store<any>,
  TArgs extends any[],
  TResult
>(
  name: string,
  func: (store: TStore, ...args: TArgs) => TResult,
  withInjectionContext = true
): StoreEffect<TStore, TArgs, TResult> {
  return {
    name,
    func,
    withInjectionContext,
  };
}

export function createNopEffect<TStore extends Store<any>>(
  name: string
): StoreEffect<TStore, any[], void> {
  return {
    name,
    func: _ => {},
    withInjectionContext: false,
  };
}
