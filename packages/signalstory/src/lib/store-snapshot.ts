/* eslint-disable @typescript-eslint/no-explicit-any */
import { ProviderToken } from '@angular/core';
import { Store } from './store';
import { ImmutableStore } from './store-immutability/immutable-store';
import { deepClone } from './store-immutability/immutable-utility';
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

  stores ??= [];

  forEachStoreInScope(store => {
    if (
      stores.length === 0 ||
      stores.some(x => x === store || store.constructor === x)
    ) {
      const stateSnapshot =
        store instanceof ImmutableStore
          ? store.state()
          : deepClone(store.state());
      storesWithState.set(store, stateSnapshot);
    }
  });

  return new StateSnapshotBase(storesWithState);
}
