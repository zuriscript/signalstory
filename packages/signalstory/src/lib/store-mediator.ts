import { Store } from './store';
import { StoreEvent } from './store-event';
import { log } from './utility/logger';

type EventHandler<TStore extends Store<any>, TPayload> = {
  store: WeakRef<TStore>;
  handler: (store: TStore, event: StoreEvent<TPayload>) => void;
};

type MediatorRegistry = WeakMap<
  StoreEvent<any>,
  Set<EventHandler<Store<any>, any>>
>;

/**
 * Creates an empty Mediator registry.
 */
export function createRegistry(): MediatorRegistry {
  return new WeakMap<StoreEvent<any>, Set<EventHandler<Store<any>, any>>>();
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
    registry.get(event) || new Set<EventHandler<Store<any>, any>>();
  existingHandlers.add({
    store: new WeakRef(store),
    handler,
  } as any);
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
  ...events: StoreEvent<any>[]
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
    const errors: Error[] = [];
    for (const handler of handlers) {
      const store = handler.store.deref();
      if (store) {
        try {
          handler.handler(store, eventWithPayload);
          log?.(`[${store.name}->Event] handeled event ${event.name}`);
        } catch (error) {
          errors.push(error as Error);
        }
      } else {
        handlers.delete(handler);
      }
    }
    if (errors.length > 0) {
      throw new AggregateError(
        errors,
        `Errors in Handler for event ${eventWithPayload.name}`
      );
    }
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
  log?.(`[Event] Published event ${event.name}`, payload);
  publish(rootRegistry, event, payload);
}
