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

`Event handlers` are functions that are executed when a specific event is published. They define the behavior or actions to be taken in response to the occurrence of an event. An event handler is always registered in the context of a specific store and hence defines how a certain store reacts to a specific event.
To register an event handler, you need to specify the event you want to handle and provide the corresponding handler function.

:::info

Event handlers are invoked **synchronously** and are intended for specific use cases. Events should capture meaningful incidents that happened (e.g. http calls, user interaction, cross cutting state changes) and that stores need to respond to effectively. Keep in mind that infinite circular updates can occur if further events are pubblished within a handler which transitively invokes the handler again.

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
      googleBooksLoadedFailure,
      this.handleGoogleBooksLoadedFailureEvent
    );
  }

  private handleGoogleBooksLoadedFailureEvent(
    store: this,
    _: StoreEvent<never>
  ) {
    store.setBooks([]);
  }
}
```

## Publishing Events

Events can be published using the `publishStoreEvent` method. Publishing an event triggers the execution of all registered event handlers synchronously for that particular event.

```typescript
import { createEvent, publishStoreEvent } from 'signalstory';

const myEvent = createEvent<number>('My Event');

// You can also publish events in a store command
// Or as result of an effect
publishStoreEvent(myEvent, 5);
```
