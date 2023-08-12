import { Injector } from '@angular/core';
import { StorePlugin } from './store-plugin';

/**
 * Configuration options for a signal store.
 *
 * @typeparam TState The type of the store's initial state.
 */
export interface StoreConfig<TState> {
  /**
   * The initial state of the store.
   */
  initialState: TState;
  /**
   * The name of the store (optional, default: constructor name).
   */
  name?: string;
  /**
   * Optional Di injector can be passed for effects and query objects. Only useful for dynamic stores, that are not registered in DI (optional, default: false)
   */
  injector?: Injector | null;
  /**
   * A logging function to output messages and data. Only in combination with enableLogging. (optional, default: console.log).
   *
   * @param {string} message - The message to be logged.
   * @param {...any[]} data - Additional data to be logged.
   */
  logFunc?: (message: string, ...data: any[]) => void;
  /**
   * A list of plugins to use
   */
  plugins?: StorePlugin[];
}
