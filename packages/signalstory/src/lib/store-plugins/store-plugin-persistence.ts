import { effect } from '@angular/core';
import { Store } from '../store';
import { StoreEffect, createNopEffect } from '../store-effect';
import {
  clearLocalStorage,
  loadFromStorage,
  saveToStorage,
} from '../utility/state-persistence';
import { ConstructorPostprocessor } from './store-plugin';

export class StatePersistencePlugin<TState>
  implements ConstructorPostprocessor<TState>
{
  private readonly localStorageKeyPlaceholder = '_UNKNOWN_';
  private localStorageKey: string;

  constructor(localStorageKey: string | undefined = undefined) {
    this.localStorageKey = localStorageKey ?? this.localStorageKeyPlaceholder;
  }

  postprocessConstructor(store: Store<TState>): void {
    if (this.localStorageKey === this.localStorageKeyPlaceholder) {
      this.localStorageKey = `_persisted_state_of_${store.config.name}_`;
    }

    const persistedState = loadFromStorage<TState>(this.localStorageKey);
    if (persistedState) {
      store.set(persistedState, 'Load state from local storage');
    }

    effect(() => {
      saveToStorage(this.localStorageKey, store.state());
    });
  }

  preprocessEffect(
    store: Store<TState>,
    effect: StoreEffect<Store<TState>, any[], any>
  ): void {
    if (effect === clearPersistenceEffect) {
      clearLocalStorage(this.localStorageKey);
    }
  }
}

const clearPersistenceEffect = createNopEffect(
  'Clear Local storage state persistence'
);

/**
 * Clears the persisted state from local storage.
 * Does not affect the current state of the store
 */
export function clearPersistence<TState>(store: Store<TState>) {
  store.runEffect(clearPersistenceEffect);
}
