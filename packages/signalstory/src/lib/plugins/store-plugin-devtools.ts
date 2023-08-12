import { Store } from '../store';
import { StorePlugin } from './store-plugin';

export interface DevtoolsPluginOptions {
  /**
   * Indicates whether logging is enabled. (optional, default: false).
   */
  enableLogging?: boolean;
  /**
   * A logging function to output messages and data. Only in combination with enableLogging. (optional, default: console.log).
   *
   * @param {string} message - The message to be logged.
   * @param {...any[]} data - Additional data to be logged.
   */
  logFunc?: (message: string, ...data: any[]) => void;
}

type Action = { type: string };

interface DevtoolsOptions {
  maxAge?: number;
  name?: string;
}

interface DevtoolsMessage {
  type: string;
  payload: { type: string };
  state: string;
}

interface Devtools {
  send(
    data: { type: string } & Record<string, any>,
    state: Record<string, any>
  ): void;
  init(state: Record<string, any>): void;
  unsubscribe(): void;
  subscribe(cb: (message: DevtoolsMessage) => void): () => void;
}

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION__: {
      connect(options: DevtoolsOptions): Devtools;
    };
  }
}

const registry = new Map<string, WeakRef<Store<any>>>();

let devtools: Devtools | undefined;

function initDevtools(options: DevtoolsOptions = {}): void {
  devtools = window.__REDUX_DEVTOOLS_EXTENSION__.connect(options);
  devtools.subscribe(handleDevtoolsMessage);
}

function getStore(name: string): Store<any> | undefined {
  return registry.get(name)?.deref();
}

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

export function sendToDevtools(action: Action): void {
  devtools?.send(action, scavengeAndGetStoresSnapshot());
}

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

export function useDevtools(options: DevtoolsPluginOptions = {}): StorePlugin {
  const log = options.enableLogging ? options?.logFunc ?? console.log : null;
  return {
    init(store) {
      registerForDevtools(store);
      log?.(`[${store.config.name}] - Initialized`, store.config);
    },
    postprocessCommand(store, command) {
      sendToDevtools({
        type: `[${store.name}] - ${command ?? 'Command'}`,
      });
      log?.(
        `[${store.config.name}] - ${command ?? 'Unspecified Command'}`,
        store.state()
      );
    },
  };
}
