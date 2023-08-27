/* eslint-disable @typescript-eslint/no-explicit-any */
import { ProviderToken } from '@angular/core';
import { Store } from './store';

/**
 * Represents a store query with the specified result type, store dependencies, and optional argument.
 */
export type StoreQuery<
  TResult,
  TStores extends ProviderToken<any>[],
  TArg = undefined
> = {
  stores: TStores;
  query: TArg extends undefined
    ? (
        ...stores: {
          [K in keyof TStores]: TStores[K] extends ProviderToken<infer U>
            ? U
            : never;
        }
      ) => TResult
    : (
        ...storesAndArg: {
          [K in keyof TStores]: TStores[K] extends ProviderToken<infer U>
            ? U
            : never;
        } & { arg: TArg }
      ) => TResult;
};

/**
 * Creates a store query with the specified result type and store dependencies.
 * @param stores The store dependencies for the query.
 * @param query The query function that operates on the stores.
 * @returns The created store query.
 */
export function createQuery<
  TResult,
  TStore1 extends Store<any>,
  TStore2 extends Store<any>,
  TStore3 extends Store<any>,
  TStore4 extends Store<any>,
  TArg = undefined
>(
  stores: [
    ProviderToken<TStore1>,
    ProviderToken<TStore2>,
    ProviderToken<TStore3>,
    ProviderToken<TStore4>
  ],
  query: (
    store1: TStore1,
    store2: TStore2,
    store3: TStore3,
    store4: TStore4,
    arg: TArg
  ) => TResult
): StoreQuery<
  TResult,
  [
    ProviderToken<TStore1>,
    ProviderToken<TStore2>,
    ProviderToken<TStore3>,
    ProviderToken<TStore4>
  ],
  TArg
>;

export function createQuery<
  TResult,
  TStore1 extends Store<any>,
  TStore2 extends Store<any>,
  TStore3 extends Store<any>,
  TArg = undefined
>(
  stores: [
    ProviderToken<TStore1>,
    ProviderToken<TStore2>,
    ProviderToken<TStore3>
  ],
  query: (
    store1: TStore1,
    store2: TStore2,
    store3: TStore3,
    arg: TArg
  ) => TResult
): StoreQuery<
  TResult,
  [ProviderToken<TStore1>, ProviderToken<TStore2>, ProviderToken<TStore3>],
  TArg
>;

export function createQuery<
  TResult,
  TStore1 extends Store<any>,
  TStore2 extends Store<any>,
  TArg = undefined
>(
  stores: [ProviderToken<TStore1>, ProviderToken<TStore2>],
  query: (store1: TStore1, store2: TStore2, arg: TArg) => TResult
): StoreQuery<TResult, [ProviderToken<TStore1>, ProviderToken<TStore2>], TArg>;

export function createQuery<
  TResult,
  TStore1 extends Store<any>,
  TArg = undefined
>(
  stores: [ProviderToken<TStore1>],
  query: (store1: TStore1, arg: TArg) => TResult
): StoreQuery<TResult, [ProviderToken<TStore1>], TArg>;

export function createQuery<TResult>(
  stores: ProviderToken<any>[],
  query: (...stores: any[]) => TResult
): StoreQuery<TResult, ProviderToken<any>[]> {
  return {
    stores: stores,
    query: query,
  };
}
