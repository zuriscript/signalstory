/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  inject,
  makeStateKey,
  PLATFORM_ID,
  TransferState,
} from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { StorePlugin, StoreState } from '../store-plugin';
import { Store } from '../store';

/**
 * Options for configuring the Store Transfer State Plugin.
 */
export interface StoreTransferStatePluginOptions {
  /**
   * The key to use for the transfer state entry. (optional, default: store name).
   */
  stateKey?: string;
}

/**
 * Represents the Store Transfer State Plugin, enhancing a store with state transfer state functionality.
 */
type StoreTransferStatePlugin = StorePlugin & {
  getStateKeyFromStore: (store: Store<unknown>) => string;
};

/**
 * type guard for StoreTransferStatePlugin.
 * @param obj - The object to check.
 * @returns True if the object is a StoreTransferStatePlugin, otherwise false.
 */
function isStoreTransferStatePlugin(
  obj: StorePlugin
): obj is StoreTransferStatePlugin {
  return obj && typeof obj === 'object' && 'getStateKeyFromStore' in obj;
}

/**
 * Saves the provided state to the transfer state.
 * @template TStore - The type of store to save the state for.
 * @param transferState
 * @param store - The store instance.
 * @param state - The state to save.
 */
export function saveToTransferState<TStore extends Store<any>>(
  transferState: TransferState,
  store: TStore,
  state: StoreState<TStore>
): void {
  const plugin = store.config.plugins.find(isStoreTransferStatePlugin);
  if (plugin) {
    transferState.set(makeStateKey(plugin.getStateKeyFromStore(store)), state);
  }
}

/**
 * Loads and retrieves the stored state for the store.
 * @template TStore - The type of store to load the state for.
 * @param transferState
 * @param store - The store instance.
 */
export function loadFromTransferState<TStore extends Store<any>>(
  transferState: TransferState,
  store: TStore
): void {
  const plugin = store.config.plugins.find(isStoreTransferStatePlugin);

  if (plugin) {
    const storedResponse: string | undefined | null = transferState.get(
      makeStateKey(plugin.getStateKeyFromStore(store)),
      null
    );

    if (storedResponse) {
      store.set(storedResponse, 'Load state from transfer state');
    }
  }
}

/**
 * Enables Store plugin that transfers the store state from server to browser.
 * State changes are automatically synced.
 * @param options - Options for configuring the StoreTransferStatePlugin.
 * @returns A StoreTransferStatePlugin instance.
 */
export function useStoreTransferState(
  options: StoreTransferStatePluginOptions = {}
): StorePlugin {
  const platformId = inject(PLATFORM_ID);
  const transferState: TransferState = inject(TransferState);

  return {
    getStateKeyFromStore: (store: Store<unknown>) =>
      options.stateKey ?? `${store.config.name}`,
    init(store) {
      if (!isPlatformBrowser(platformId)) {
        return;
      }

      loadFromTransferState(transferState, store);
    },
    postprocessCommand(store) {
      if (!isPlatformServer(platformId)) {
        return;
      }

      saveToTransferState(transferState, store, store.state());
    },
  };
}
