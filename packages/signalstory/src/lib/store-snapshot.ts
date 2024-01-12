/* eslint-disable @typescript-eslint/no-explicit-any */
import { ProviderToken } from '@angular/core';
import { Store } from './store';
import { forEachStoreInScope } from './store-registry';

/**
 * Represents the snapshot restore command.
 */
export const RestoreCommand = '_SNAPSHOT_RESTORE_';

/**
 * Represents a snapshot of the application state.
 */
export interface StateSnapshot {
  /**
   * The timestamp when the snapshot was created.
   */
  readonly timestamp: number;

  /**
   * Restores the application state to the captured snapshot.
   */
  restore: () => void;
}

/**
 * Base implementation of the StateSnapshot interface.
 */
class StateSnapshotBase implements StateSnapshot {
  readonly timestamp = performance.now();

  constructor(
    private readonly storesWithState: WeakMap<Store<unknown>, unknown>
  ) {}

  restore(): void {
    forEachStoreInScope(store => {
      if (this.storesWithState.has(store)) {
        const snapshotValue = this.storesWithState.get(store);
        if (snapshotValue !== store.state()) {
          store.set(snapshotValue, RestoreCommand);
        }
      }
    });
  }
}

/**
 * Creates a state snapshot either for specified stores or all stores in scope.
 *
 * If no stores are provided, the snapshot will include all stores currently in scope.
 * Stores can be specified either as instances of Store or as ProviderTokens representing
 * Store classes.
 *
 * @param stores - The stores for which to create a snapshot. Can be either instances
 * of Store or ProviderTokens representing Store classes.
 * @returns A StateSnapshot instance representing the application state snapshot.
 */
export function createSnapshot(
  ...stores: (Store<any> | ProviderToken<Store<any>>)[]
): StateSnapshot {
  const storesWithState = new WeakMap<Store<unknown>, unknown>();

  if (stores && stores.length > 0) {
    forEachStoreInScope(store => {
      if (stores.some(x => x === store || store.constructor === x)) {
        storesWithState.set(store, store.state());
      }
    });
  } else {
    forEachStoreInScope(store => storesWithState.set(store, store.state()));
  }

  return new StateSnapshotBase(storesWithState);
}
