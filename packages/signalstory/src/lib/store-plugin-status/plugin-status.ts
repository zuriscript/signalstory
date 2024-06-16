/* eslint-disable @typescript-eslint/no-explicit-any */
import { Signal, WritableSignal, computed, signal } from '@angular/core';
import { Store } from '../store';
import { StoreEffect } from '../store-effect';
import { StorePlugin } from '../store-plugin';

const storeStatusMap = new WeakMap<
  Store<unknown>,
  WritableSignal<{
    hasBeenModified: boolean;
    hasBeenInitialized: boolean;
  }>
>();

export const runningEffects: WritableSignal<
  [WeakRef<Store<any>>, StoreEffect<any, any, any>, number][]
> = /*@__PURE__*/ signal([]);

/**
 * Returns a Signal indicating whether the provided store has been modified.
 *
 * @note A store is initially considered unmodified. Any command (`set`, `update`, `mutate`) applied to the store
 * will mark it as modified. Additionally, an effect created with the `setInitializedStatus` flag will reset the store's
 * modification status to unmodified.
 *
 * @param store - The store to check for modification status.
 * @returns Signal<boolean> - A signal indicating whether the store has been modified.
 */
export function modified(store: Store<any>): Signal<boolean> {
  const status = storeStatusMap.get(store);
  if (!status) {
    throw new Error(
      `StatusPlugin has not been activated for store ${store.name}`
    );
  }

  return computed(() => status().hasBeenModified);
}

/**
 * Returns a Signal indicating whether the provided store has been initialized by an initializing effect.
 *
 * @note A store is initially considered as deinitialized. An effect created with the `setInitializedStatus` flag will set the store's
 * initialization status to `true`.
 *
 * @param store - The store to check for initialization status.
 * @returns Signal<boolean> - A signal indicating whether the store has been initialized.
 */
export function initialized(store: Store<any>): Signal<boolean> {
  const status = storeStatusMap.get(store);
  if (!status) {
    throw new Error(
      `StatusPlugin has not been activated for store ${store.name}`
    );
  }

  return computed(() => status().hasBeenInitialized);
}

/**
 * Manually resets the status indicators for the provided store, marking it as deinitialized and unmodified.
 * This means that both `unmodified()` and `initialized()` will return false. For manual reset of the loading status,
 * use `markAsHavingNoRunningEffects`.
 *
 * @note This method is intended for exceptional cases.
 *
 * @param store - The store to manually reset the status.
 * @returns void
 */
export function resetStoreStatus(store: Store<any>): void {
  storeStatusMap.get(store)?.set({
    hasBeenInitialized: false,
    hasBeenModified: false,
  });
}

/**
 * Returns a Signal indicating whether any of the provided stores is in a loading state.
 * If no stores are provided, the returned signal indicates if any store is in a loading state.
 *
 * @note An effect created with `setLoadingStatus` will mark the associated store as loading while the effect is running.
 *
 * @param stores - Stores to check for loading status. If no stores are provided, the signal checks all stores.
 * @returns Signal<boolean> - A signal indicating whether any store is loading.
 */
export function isLoading(...stores: Store<any>[]): Signal<boolean> {
  if (!stores || stores.length === 0) {
    return computed(() =>
      runningEffects().some(effect => effect[1].config.setLoadingStatus)
    );
  } else {
    return computed(() =>
      runningEffects().some(runningEffect => {
        const affectedStore = runningEffect[0].deref();
        return (
          affectedStore &&
          runningEffect[1].config.setLoadingStatus &&
          stores.some(store => store === affectedStore)
        );
      })
    );
  }
}

/**
 * Manually marks the provided store as not having any running effects.
 *
 * @note This method is intended for exceptional cases, specifically when you observe
 * that an effect is not removed from the running state by signalstory automatically.
 * If you encounter such a situation, use this method as a temporary workaround and
 * be sure to file an issue on GitHub for further investigation and resolution.
 *
 * @param store - The store to manually mark as not having running effects.
 * @returns void
 */
export function markAsHavingNoRunningEffects(store: Store<any>): void {
  runningEffects.update(state =>
    state.filter(runningEffect => runningEffect[0].deref() !== store)
  );
}

/**
 * Returns a Signal indicating whether any effect is currently running for any of the provided stores.
 * If no Store is provided the returned signal indicates if any store has an effect running
 * @param stores - Stores to check for running effects.
 * @returns Signal<boolean> - A signal indicating whether any effect is running for any store.
 */
export function isAnyEffectRunning(...stores: Store<any>[]): Signal<boolean> {
  if (!stores || stores.length === 0) {
    return computed(() => runningEffects().length > 0);
  } else {
    return computed(() =>
      runningEffects().some(runningEffect => {
        const affectedStore = runningEffect[0].deref();
        return affectedStore && stores.some(store => store === affectedStore);
      })
    );
  }
}

/**
 * Returns a Signal indicating whether the specified effect is currently running for any of the provided stores.
 * If no Store is provided the returned signal indicates if any store has the given effect running
 * @param effect - The effect to check for.
 * @param stores - Stores to check for the specified effect.
 * @returns Signal<boolean> - A signal indicating whether the specified effect is running for any store.
 */
export function isEffectRunning(
  effect: StoreEffect<any, any, any>,
  ...stores: Store<any>[]
): Signal<boolean> {
  if (!stores || stores.length === 0) {
    return computed(() => runningEffects().some(x => x[1] === effect));
  } else {
    return computed(() =>
      runningEffects()
        .filter(runningEffect => runningEffect[1] === effect)
        .some(runningEffect => {
          const affectedStore = runningEffect[0].deref();
          return affectedStore && stores.some(store => store === affectedStore);
        })
    );
  }
}

/**
 * Enables StorePlugin that tracks the loading and modification status of a store.
 * @returns A StorePlugin instance for loading and modification status tracking.
 */
export function useStoreStatus(): StorePlugin {
  return {
    init(store) {
      storeStatusMap.set(
        store,
        signal({
          hasBeenInitialized: false,
          hasBeenModified: false,
        })
      );
    },
    postprocessCommand(store) {
      const status = storeStatusMap.get(store);
      if (status && !status().hasBeenModified) {
        storeStatusMap.get(store)?.update(state => ({
          ...state,
          hasBeenModified: true,
        }));
      }
    },
    preprocessEffect(store, effect, invocationId) {
      runningEffects.update(effects => [
        ...effects,
        [new WeakRef(store), effect, invocationId],
      ]);
    },
    postprocessEffect(store, effect, _, invocationId) {
      runningEffects.update(effects =>
        effects.filter(x => x[2] !== invocationId)
      );
      if (effect.config.setInitializedStatus) {
        storeStatusMap.get(store)?.set({
          hasBeenInitialized: true,
          hasBeenModified: false,
        });
      }
    },
  };
}
