/**
 * Represents an event which may affect a store.
 */
export interface StoreEvent<TPayload> {
  name: string; // The name of the event.
  payload?: TPayload; // The payload associated with the event.
}

/**
 * Creates a store event blueprint with the provided name.
 * @param name The name of the event.
 * @returns A store event blueprint object.
 */
export function createEvent<TPayload = never>(
  name: string
): StoreEvent<TPayload> {
  return { name };
}
