/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line tree-shaking/no-side-effects-in-initialization
import { Signal, WritableSignal, computed, signal } from '@angular/core';
import { Store } from '../store';
import { StoreEffect } from '../store-effect';
import { StorePlugin } from '../store-plugin';

const isStoreModifiedMap = new WeakMap<
  Store<unknown>,
  WritableSignal<boolean>
>();

export const runningEffects: WritableSignal<
  [WeakRef<Store<any>>, StoreEffect<any, any, any>][]
> = signal([]);

/**
 * Returns a Signal indicating whether the provided store has been modified.
 *
 * @note A store is initially considered unmodified. Any command (`set`, `update`, `mutate`) applied to the store
 * will mark it as modified. Additionally, an effect created with the `setUnmodifiedStatus` flag can reset the store's
 * modification status to unmodified.
 *
 * @param store - The store to check for modification status.
 * @returns Signal<boolean> - A signal indicating whether the store has been modified.
 */
export function isModified(store: Store<any>): Signal<boolean> {
  const modifiedStatus = isStoreModifiedMap.get(store);
  if (!modifiedStatus) {
    throw new Error(
      `StatusPlugin has not been activated for store ${store.name}`
    );
  }

  return computed(() => modifiedStatus());
}

/**
 * Manually marks the provided store as unmodified.
 *
 * @note This method is intended for exceptional cases. In most scenarios, consider using the `setUnmodifiedStatus`
 * flag on the relevant effects to automatically manage the modification status.
 *
 * @param store - The store to manually mark as unmodified.
 * @returns void
 */
export function markAsUnmodified(store: Store<any>): void {
  isStoreModifiedMap.get(store)?.set(false);
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
      isStoreModifiedMap.set(store, signal(false));
    },
    postprocessCommand(store) {
      isStoreModifiedMap.get(store)?.set(true);
    },
    preprocessEffect(store, effect) {
      runningEffects.update(effects => [
        ...effects,
        [new WeakRef(store), effect],
      ]);
    },
    postprocessEffect(store, effect) {
      runningEffects.update(effects => effects.filter(x => x[1] !== effect));
      if (effect.config.setUnmodifiedStatus) {
        isStoreModifiedMap.get(store)?.set(false);
      }
    },
  };
}
