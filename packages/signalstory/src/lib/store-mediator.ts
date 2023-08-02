import { Store } from './store';
import { StoreEvent } from './store-event';

type EventHandler<TStore extends Store<any>, TPayload> = {
  store: WeakRef<TStore>;
  handler: (store: TStore, event: StoreEvent<TPayload>) => void;
};

type MediatorRegistry = WeakMap<
  StoreEvent<any>,
  Set<EventHandler<Store<any>, any>>
>;

/**
 * Creates an empty Mediator registry
 */
export function createRegistry(): MediatorRegistry {
  return new WeakMap<StoreEvent<any>, Set<EventHandler<Store<any>, any>>>();
}

/**
 * Root mediator registry instance
 */
export const rootRegistry: MediatorRegistry = createRegistry();

/**
 * Register an event handler for a specific event.
 * @param event The event to register.
 * @param source The source identifier to be stored along with the handler.
 * @param handler The handler function to be executed when the event occurs.
 * @throws Error if the event name is invalid.
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
 * Publishes an event, executing all associated event handlers.
 * @param event The event to publish.
 * @param payload The payload to pass to the event handlers.
 * @returns An array of strings denoting the origins of the executed handlers.
 * @throws Error if the event name is invalid.
 * @throws AggregateError if there are errors in any event handler.
 */
export function publish(
  registry: MediatorRegistry,
  event: StoreEvent<never>,
  payload?: undefined
): string[];
export function publish<T>(
  registry: MediatorRegistry,
  event: StoreEvent<T>,
  payload: T
): string[];
export function publish<T>(
  registry: MediatorRegistry,
  event: StoreEvent<T>,
  payload?: T
): string[] {
  const handlers = registry.get(event);

  const eventWithPayload = {
    name: event.name,
    payload: payload,
  };

  if (handlers) {
    const errors: Error[] = [];
    const reactedStoreNames: string[] = [];
    for (const handler of handlers) {
      const store = handler.store.deref();
      if (store) {
        reactedStoreNames.push(store.name);
        try {
          handler.handler(store, eventWithPayload);
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
    return reactedStoreNames;
  }

  return [];
}

/**
 * Unregister event handlers for a specific store and events.
 * @param registry The mediator registry.
 * @param store The store to remove event handlers from.
 * @param events The events to remove handlers for.
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
