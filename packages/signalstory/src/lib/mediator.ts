import { StoreEvent } from './store-event';

type EventHandler = {
  source: string;
  handler: (event: StoreEvent<any>) => void;
};

export class Mediator {
  // Private registry to store the event handlers
  private readonly _registry: Map<string, Set<EventHandler>> = new Map();
  // Stores passed events
  private readonly _history: StoreEvent<any>[] = [];

  /**
   * Register an event handler for a specific event.
   * @param event The event to register.
   * @param source The source identifier to be stored along with the handler.
   * @param handler The handler function to be executed when the event occurs.
   * @throws Error if the event name is invalid.
   */
  public register<T>(
    event: StoreEvent<T>,
    source: string,
    handler: (eventPayload: StoreEvent<any>) => void
  ) {
    if (!event.name) {
      throw new Error('Invalid event name');
    }

    const existingHandlers =
      this._registry.get(event.name) || new Set<EventHandler>();
    existingHandlers.add({ source, handler });
    this._registry.set(event.name, existingHandlers);
  }

  /**
   * Publishes an event, executing all associated event handlers.
   * @param event The event to publish.
   * @param payload The payload to pass to the event handlers.
   * @returns An array of strings denoting the origins of the executed handlers.
   * @throws Error if the event name is invalid.
   * @throws AggregateError if there are errors in any event handler.
   */
  public publish(event: StoreEvent<never>, payload?: undefined): string[];
  public publish<T>(event: StoreEvent<T>, payload: T): string[];
  public publish<T>(event: StoreEvent<T>, payload?: T): string[] {
    if (!event.name) {
      throw new Error('Invalid event name');
    }

    const eventWithPayload = {
      name: event.name,
      payload: payload,
    };

    this._history.push(eventWithPayload);
    const handlers = this._registry.get(eventWithPayload.name);

    if (handlers) {
      const errors: Error[] = [];
      const handlerSources: string[] = [];
      for (const handler of handlers) {
        try {
          handlerSources.push(handler.source);
          handler.handler(eventWithPayload);
        } catch (error) {
          errors.push(error as Error);
        }
      }
      if (errors.length > 0) {
        throw new AggregateError(
          errors,
          `Errors in Handler for event ${eventWithPayload.name}`
        );
      }
      return handlerSources;
    }

    return [];
  }

  /**
   * Replay all the passed events and execute the registered handlers.
   * @param source (Optional) The source identifier to limit the replay to a specific source.
   */
  public replay(source?: string) {
    this._history.forEach(event => {
      const handlers = this._registry.get(event.name);
      if (handlers) {
        for (const handler of handlers) {
          if (!source || handler.source === source) {
            handler.handler(event);
          }
        }
      }
    });
  }
}
