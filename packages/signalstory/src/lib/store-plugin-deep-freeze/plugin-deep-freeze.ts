import { StorePlugin } from '../store-plugin';
import { deepFreeze } from './deep-freeze';

/**
 * Enables Storeplugin that deep freezes the state after each command
 * This middleware introduces some overhead
 *
 * @returns DeepFreeze Storeplugin.
 */
export function useDeepFreeze(): StorePlugin {
  return {
    postprocessCommand(store, _) {
      deepFreeze(store.state());
    },
  };
}
