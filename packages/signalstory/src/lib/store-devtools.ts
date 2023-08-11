import { toObservable } from '@angular/core/rxjs-interop';
import { Subject, Subscription } from 'rxjs';
import { Store } from './store';
import { getHistory } from './store-history';

type Action = { type: string } & Record<string, any>;

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

interface DevtoolsController {
  lock: boolean;
  externalEvents$: Subject<Action>;
  subscriptions: Map<string, Subscription>;
  devtools: Devtools;
}

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION__: {
      connect(options: DevtoolsOptions): Devtools;
    };
  }
}

const registry: Map<string, WeakRef<Store<any>>> = new Map<
  string,
  WeakRef<Store<any>>
>();

let devtoolsController: DevtoolsController | undefined;

function initAndGetDevtools(options: DevtoolsOptions = {}): DevtoolsController {
  devtoolsController = {
    lock: false,
    externalEvents$: new Subject<Action>(),
    subscriptions: new Map<string, Subscription>(),
    devtools: window.__REDUX_DEVTOOLS_EXTENSION__.connect(options),
  };

  devtoolsController.subscriptions.set(
    'externalSend',
    devtoolsController?.externalEvents$.subscribe(sendToDevtools)
  );

  devtoolsController.devtools.subscribe(handleDevtoolsMessage);

  return devtoolsController;
}

function getOrCreateDevtoolsController(
  options: DevtoolsOptions = {}
): DevtoolsController {
  return !devtoolsController ? initAndGetDevtools(options) : devtoolsController;
}

function getStore(name: string): Store<any> | undefined {
  return registry.get(name)?.deref();
}

function scavengeAndGetStoresSnapshot<T extends Record<string, any>>(): T {
  const stores: T = {} as T;
  const devtools = getOrCreateDevtoolsController();

  registry.forEach((storeRef, name) => {
    const store = storeRef.deref();
    if (store) {
      stores[store.name as keyof T] = store.state();
    } else {
      registry.delete(name);
      removeStore(devtools, name);
    }
  });

  return stores;
}

function sendToDevtools(action: Action): void {
  devtoolsController?.devtools?.send(action, scavengeAndGetStoresSnapshot());
}

function handleDevtoolsMessage(message: DevtoolsMessage): void {
  console.log(message);
  if (devtoolsController) {
    if (message.type === 'DISPATCH') {
      const payloadType = message.payload.type;

      if (payloadType === 'COMMIT') {
        devtoolsController.devtools.init(scavengeAndGetStoresSnapshot());
        return;
      }

      if (payloadType === 'JUMP_TO_STATE' || payloadType === 'JUMP_TO_ACTION') {
        const state = JSON.parse(message.state);

        for (const [name, value] of Object.entries(state)) {
          devtoolsController.lock = true;
          const store = getStore(name);
          if (store) {
            store['_state'].set(value);
          }
        }
      }
    }
  }
}

function addStore(devtools: DevtoolsController, store: Store<any>): void {
  const name = store.name;
  sendToDevtools({ type: `[${name}] - @Init` });

  const update = toObservable(store.state, {
    injector: store['injector'],
  }).subscribe(() => {
    if (devtools && devtools.lock) {
      devtools.lock = false;
      return;
    }

    const history = getHistory(store);
    const lastCommand =
      history.length > 0
        ? history[history.length - 1].command
        : 'Unknown Command';
    sendToDevtools({ type: `[${name}] - ${lastCommand}` });
  });

  devtools?.subscriptions.set(name, update);
}

function removeStore(devtools: DevtoolsController, storeName: string): void {
  devtools.subscriptions.get(storeName)?.unsubscribe();
  devtools.subscriptions.delete(storeName);
  sendToDevtools({ type: `[${storeName}] - @Removal` });
}

export function registerForDevtools<TStore extends Store<any>>(store: TStore) {
  registry.set(store.name, new WeakRef(store));
  addStore(getOrCreateDevtoolsController(), store);
}

export function removeFromDevtools<TStore extends Store<any>>(store: TStore) {
  if (devtoolsController) {
    registry.delete(store.name);
    removeStore(devtoolsController, store.name);
  }
}
