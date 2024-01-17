---
sidebar_position: 4
---

# Event

:::tip

By utilizing events and event handlers, you can establish communication between stores, propagate side effect results, and coordinate actions across different parts of your application. This decoupled approach enables a more modular and flexible architecture, allowing for better maintainability and extensibility of your Angular application.

:::

## Wyh should I use Events?

Events can be used for untangling and breaking down dependencies among stores, commands, and actions. They also provide means for propagating state across stores. For instance, if you want `store2` to immediately react when the state of `store1` changes without directly invoking `store2`, events offer an elegant solution. Unlike signal effects, where modifying signals within the effect's scope is forbidden by default, signalstory events and handlers operate synchronously. This helps mitigate potential issues stemming from asynchronous dispatches, such as errors or unnecessary change detection cycles.

Instead of the imperative sequence:

```typescript
store1.updateSomething();
store2.doSomething();
store3.updateBecauseTheOtherStoresDid();
```

Adopt a more streamlined approach:

```typescript
publishStoreEvent(somethingHappenedEvent);
// All relevant stores (store1, store2, store3) react immediately and synchronously
// -> As if they were called imperatively after each other
```

Considerations:

- You can still handle effects asynchronously by leveraging mechanisms like `setTimeout` inside the handler to offload execution to the macrotask queue.
- Eventhandler registration does not prohibit circular dependencies, so you have to make sure yourself, that there are no infinite circular updates

## Event Blueprint

An `event` is represented by the `StoreEvent` interface, which includes a name and an optional payload. The name serves as a unique identifier for the event, while the payload contains any additional data associated with the event. You can use the `createEvent` function provided by signalstory to create `event blueprints` with a name and payload type. Those blueprint can then be published alongside a payload parameter:

```typescript
import { createEvent } from 'signalstory';

const myEventWithPayload = createEvent<MyPayloadType>('My Event');
const myEventWithNoPayload = createEvent('My Event and nothing more');
```

## Event Handlers

`Event handlers` are functions that are executed when a specific event is published. They define the behavior or actions to be taken in response to the occurrence of an event. An event handler is always registered in the context of a specific store and hence defines how a certain store reacts to a specific event.
To register an event handler, you need to specify the event you want to handle and provide the corresponding handler function.

:::info

Event handlers are invoked **synchronously** and are intended for specific use cases. Events should capture meaningful incidents that happened (e.g. http calls, user interaction, cross cutting state changes) and that stores need to respond to effectively. Keep in mind that infinite circular updates can occur if further events are pubblished within a handler which transitively invokes the same handler again.

:::

```typescript
import { Store } from 'signalstory';

export const booksLoadedFailure = createEvent('Books could not be loaded');

@Injectable({ providedIn: 'root' })
export class BooksStore extends Store<Book[]> {
  constructor() {
    super({
      initialState: [],
    });

    // Registration may also happen outside of the class
    // You can also register an anonymous function
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
