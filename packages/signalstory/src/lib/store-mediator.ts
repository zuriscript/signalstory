/* eslint-disable @typescript-eslint/no-explicit-any */
import { Store } from './store';
import { StoreEvent } from './store-event';
import { runNonBlockingBatch } from './utility/scheduling';

type EventHandler<TStore extends Store<unknown>, TPayload> = {
  store: WeakRef<TStore>;
  handler: (store: TStore, event: StoreEvent<TPayload>) => void;
};

type MediatorRegistry = WeakMap<
  StoreEvent<unknown>,
  Set<EventHandler<Store<unknown>, unknown>>
>;

/**
 * Creates an empty Mediator registry.
 */
export function createRegistry(): MediatorRegistry {
  return new WeakMap<
    StoreEvent<unknown>,
    Set<EventHandler<Store<unknown>, unknown>>
  >();
}

/**
 * Root mediator registry instance.
 */
export const rootRegistry: MediatorRegistry = createRegistry();

/**
 * Register an event handler for a specific event.
 *
 * @param {MediatorRegistry} registry - The mediator registry to register the handler in.
 * @param {TStore} store - The store instance associated with the event handler.
 * @param {StoreEvent<TPayload>} event - The event to register.
 * @param {(store: TStore, event: StoreEvent<TPayload>) => void} handler - The handler function to be executed when the event occurs.
 * @throws {Error} if the event name is invalid.
 */
export function register<TStore extends Store<any>, TPayload>(
  registry: MediatorRegistry,
  store: TStore,
  event: StoreEvent<TPayload>,
  handler: (store: TStore, event: StoreEvent<TPayload>) => void
) {
  const existingHandlers =
    registry.get(event) || new Set<EventHandler<Store<unknown>, unknown>>();
  existingHandlers.add({
    store: new WeakRef(store),
    handler,
  } as unknown as EventHandler<Store<unknown>, unknown>);
  registry.set(event, existingHandlers);
}

/**
 * Unregister event handlers for a specific store and events.
 *
 * @param {MediatorRegistry} registry - The mediator registry to unregister the handlers from.
 * @param {TStore} store - The store instance to remove event handlers from.
 * @param {...StoreEvent<any>[]} events - The events to remove handlers for.
 */
export function unregister<TStore extends Store<any>>(
  registry: MediatorRegistry,
  store: TStore,
  ...events: StoreEvent<unknown>[]
) {
  for (const event of events) {
    const handlers = registry.get(event);
    if (handlers) {
      handlers.forEach(handler => {
        const handlingStore = handler.store.deref();
        if (!handlingStore || handlingStore === store) {
          handlers.delete(handler);
        }
      });
      if (handlers.size === 0) {
        registry.delete(event);
      }
    }
  }
}

/**
 * Publishes an event, executing all associated event handlers.
 *
 * @param {MediatorRegistry} registry - The mediator registry containing the event handlers.
 * @param {StoreEvent<never>} event - The event to publish.
 * @param {undefined} payload - The payload to pass to the event handlers.
 * @throws {Error} if the event name is invalid.
 * @throws {AggregateError} if there are errors in any event handler.
 */
export function publish(
  registry: MediatorRegistry,
  event: StoreEvent<never>,
  payload?: undefined
): void;
export function publish<T>(
  registry: MediatorRegistry,
  event: StoreEvent<T>,
  payload: T
): void;
export function publish<T>(
  registry: MediatorRegistry,
  event: StoreEvent<T>,
  payload?: T
): void {
  const handlers = registry.get(event);

  const eventWithPayload = {
    name: event.name,
    payload: payload,
  };

  if (handlers) {
    const relevantHandlers: EventHandler<any, unknown>[] = [];
    handlers.forEach(handler => {
      if (handler.store.deref()) {
        relevantHandlers.push(handler);
      } else {
        handlers.delete(handler);
      }
    });

    runNonBlockingBatch(
      relevantHandlers.map(x => x.handler),
      0,
      relevantHandlers.map(x => [x.store.deref(), eventWithPayload])
    );
  }
}

/**
 * Publishes a store event, executing all associated event handlers.
 *
 * @param {StoreEvent<never>} event - The event to publish.
 * @param {undefined} payload - The payload to pass to the event handlers.
 * @throws {Error} if the event name is invalid.
 * @throws {AggregateError} if there are errors in any event handler.
 */
export function publishStoreEvent(
  event: StoreEvent<never>,
  payload?: undefined
): void;
export function publishStoreEvent<T>(event: StoreEvent<T>, payload: T): void;
export function publishStoreEvent<T>(event: StoreEvent<T>, payload?: T): void {
  publish(rootRegistry, event, payload);
}
