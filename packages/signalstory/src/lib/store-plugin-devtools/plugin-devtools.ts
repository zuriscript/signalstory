import { Store } from '../store';
import { StorePlugin } from '../store-plugin';

/**
 * Represents a Redux action.
 */
type Action = { type: string };

/**
 * Options for configuring the Redux DevTools extension.
 */
interface DevtoolsOptions {
  // At the moment, no support for custom Enhancer options for Redux DevTools
}

/**
 * Represents a message sent to the Redux DevTools extension.
 */
interface DevtoolsMessage {
  type: string;
  payload: { type: string };
  state: string;
}

/**
 * Represents the Redux DevTools extension interface.
 */
interface Devtools {
  send(
    data: { type: string } & Record<string, any>,
    state: Record<string, any>
  ): void;
  init(state: Record<string, any>): void;
  unsubscribe(): void;
  subscribe(cb: (message: DevtoolsMessage) => void): () => void;
}

/**
 * Augments the global Window interface to include Redux DevTools extension functionality.
 */
declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION__: {
      connect(options: DevtoolsOptions): Devtools;
    };
  }
}

/**
 * Registry for store with attached redux devtools monitoring
 * It maps the store name to a Weak reference of the store
 */
const registry = new Map<string, WeakRef<Store<any>>>();

/**
 * Retrieves a store from the registry by name.
 * @param name Name of the store.
 * @returns The store, if found.
 */
function getStore(name: string): Store<any> | undefined {
  return registry.get(name)?.deref();
}

/**
 * The DevTools extension instance.
 */
let devtools: Devtools | undefined;

/**
 * Initializes the Redux DevTools extension.
 * @param options DevTools options.
 */
function initDevtools(options: DevtoolsOptions = {}): void {
  devtools = window.__REDUX_DEVTOOLS_EXTENSION__.connect(options);
  devtools.subscribe(handleDevtoolsMessage);
}

/**
 * Scavenges and retrieves a snapshot of registered stores.
 * @returns Snapshot of registered stores.
 * @modifies registry - Deletes references to garbage collected stores
 */
function scavengeAndGetStoresSnapshot<T extends Record<string, any>>(): T {
  const stores: T = {} as T;

  registry.forEach((storeRef, name) => {
    const store = storeRef.deref();
    if (store) {
      stores[store.name as keyof T] = store.state();
    } else {
      registry.delete(name);
      sendToDevtools({ type: `[${name}] - @Removal` });
    }
  });

  return stores;
}

/**
 * Sends an action to the Redux DevTools extension.
 * @param action Action to send.
 */
export function sendToDevtools(action: Action): void {
  devtools?.send(action, scavengeAndGetStoresSnapshot());
}

/**
 * Handles messages received from the Redux DevTools extension.
 * @param message DevTools message.
 */
function handleDevtoolsMessage(message: DevtoolsMessage): void {
  console.log(message);
  if (devtools) {
    if (message.type === 'DISPATCH') {
      const payloadType = message.payload.type;

      if (payloadType === 'COMMIT') {
        devtools.init(scavengeAndGetStoresSnapshot());
        return;
      }

      if (payloadType === 'JUMP_TO_STATE' || payloadType === 'JUMP_TO_ACTION') {
        const state = JSON.parse(message.state);

        for (const [name, value] of Object.entries(state)) {
          const store = getStore(name);
          if (store) {
            store['_state'].set(value);
          }
        }
      }
    }
  }
}

/**
 * Registers a store for Devtools monitoring.
 *
 * @param store - Store to be registered.
 */
export function registerForDevtools<TStore extends Store<any>>(store: TStore) {
  if (!devtools) {
    initDevtools();
  }
  registry.set(store.name, new WeakRef(store));
  sendToDevtools({ type: `[${store.name}] - @Init` });
}

/**
 * Removes a store from Devtools monitoring.
 *
 * @param store - Store to be removed.
 */
export function removeFromDevtools<TStore extends Store<any>>(store: TStore) {
  registry.delete(store.name);
  sendToDevtools({ type: `[${store.name}] - @Removal` });
}

/**
 * Enables Storeplugin that links the store activity with the Redux DevTools extension.
 * @returns Devtools Storeplugin
 */
export function useDevtools(): StorePlugin {
  return {
    init(store) {
      registerForDevtools(store);
    },
    postprocessCommand(store, command) {
      sendToDevtools({
        type: `[${store.name}] - ${command ?? 'Command'}`,
      });
    },
  };
}
