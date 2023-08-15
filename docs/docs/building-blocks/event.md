---
sidebar_position: 4
---

# Event

:::tip

By utilizing events and event handlers, you can establish communication between stores, propagate side effect results, and coordinate actions across different parts of your application. This decoupled approach enables a more modular and flexible architecture, allowing for better maintainability and extensibility of your Angular application.

:::

## Event Blueprint

An `event` is represented by the `StoreEvent` interface, which typically includes a name and an optional payload. The name serves as a unique identifier for the event, while the payload contains any additional data associated with the event. You can use the `createEvent` function provided by signalstory to create `event blueprints` with the desired name and payload type. Those blueprint can then be published alongside a payload parameter:

```typescript
import { createEvent } from 'signalstory';

const myEventWithPayload = createEvent<MyPayloadType>('My Event');
const myEventWithNoPayload = createEvent('My Event and nothing more');
```

## Event Handlers

`Event handlers`, on the other hand, are functions that are executed when a specific event is published. They define the behavior or actions to be taken in response to the occurrence of an event. An event handler is always registered in the context of a specific store and hence defines how a certain store reacts to a specific event.
To register an event handler, you need to specify the event you want to handle and provide the corresponding handler function.

:::info

Event handlers operate synchronously and are intended for specific use cases. Events should capture meaningful incidents that happened (e.g. http calls, user interaction, meaningful state changes) and that stores need to respond to effectively. Keep in mind that infinite circular updates can occur if additional events are pubblished within a handler.

:::

```typescript
import { Store } from 'signalstory';

export const booksLoadedFailure = createEvent('Books could not be loaded');

@Injectable({ providedIn: 'root' })
export class BooksStore extends Store<Book[]> {
  constructor() {
    super({
      initialState: [],
      enableEvents: true,
    });

    this.registerHandler(
      booksLoadedFailure,
      this.handleBooksLoadedFailureEvent.bind(this)
    );
  }

  private handleBooksLoadedFailureEvent(_: StoreEvent<never>) {
    this.set([], 'Reset Books');
  }
}
```

## Publishing Events

Events can be published using the `publish` method available in the store. Publishing an event triggers the execution of all registered event handlers for that particular event.

```typescript
const myEvent = createEvent<number>('My Event');

// Any store works here
// You can also publish events in a store command
// Or as result of an effect
store.publish(myEvent, 5);
```

## Replay

When registering a new event handler, you can optionally specify the `withReplay` parameter which defaults to false. By using replay, all already published events are replayed only for this specific store at the moment of registration. This is useful for dynamic or lazily initialized stores.
