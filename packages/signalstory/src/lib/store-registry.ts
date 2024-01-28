/* eslint-disable @typescript-eslint/no-explicit-any */
import { Store } from './store';

/**
 * Store registry of stores currently in scope
 */
export const storeRegistry = new Set<WeakRef<Store<unknown>>>();

/**
 * Iterates over each store in the registry and executes the specified callback function.
 *
 * @param callbackFn - The callback function to be executed for each store in the registry.
 */
export function forEachStoreInScope(
  callbackFn: (store: Store<unknown>) => void
) {
  storeRegistry.forEach(registration => {
    const store = registration.deref();
    if (store) {
      callbackFn(store);
    } else {
      storeRegistry.delete(registration);
    }
  });
}

/**
 * Adds a store to the registry.
 *
 * @param store - The store to be added to the registry.
 */
export function addToRegistry(store: Store<any>) {
  storeRegistry.add(new WeakRef(store));
}

/**
 * Cleare Store registry.
 * Only used for tests
 *
 */
export function clearRegistry() {
  storeRegistry.clear();
}
