import { StorePlugin } from '../store-plugin';
import { deepFreeze } from './deep-freeze';

/**
 * Enables Storeplugin that tracks and maintains a history of the store's state changes.
 * It provides means to perform state undo's and redo's.
 * This plugin is designed to work best with an ImmutableStore, where an optimized immutable
 * data structure is used for managing history. For a regular Store, a naive deep clone method is used.
 *
 * @returns History Storeplugin.
 */
export function useDeepFreeze(): StorePlugin {
  return {
    postprocessCommand(store, _) {
      deepFreeze(store.state());
    },
  };
}
