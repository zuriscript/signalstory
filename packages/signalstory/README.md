# signalstory

**Simplify State Management, Embrace the Signal-way-of-doing**

signalstory is a flexible and powerful TypeScript library designed specifically for Angular applications. By leveraging signals, signalstory simplifies state management and greatly reduces the reliance on asynchronous observables in components and templates.It offers a range of architectural options, from simple repository-based state management to decoupled commands, side effects, and inter-store communication using an event-based approach. With signalstory, you have the freedom to choose the store implementation that best suits your needs.

> 🚧 **Heads Up: signalstory is Evolving!**
>
> signalstory is designed and developed alongside real-world projects. Hence, api and functionality are subject to change.

## Features

- **Signal-Based State Management:** Utilizes a signal-based approach to state management, as everything, except side effects, is completely signal-based. This eliminates the need for asynchronous observables in components and templates, making the state management process more streamlined.
- **Tailored for Angular:** Is specifically tailored to Angular applications, ensuring seamless integration and optimal performance within the Angular framework.
- **Event Handling:** Supports event handling, enabling communication and interaction between different stores. Events can be used for inter-store communication or for triggering side effects.
- **Open Architecture:** Offers an open architecture, allowing you to choose between different store implementations. You can use plain repository-based stores or even Redux-like stores depending on your needs and preferences.
- **Flexible Side Effect Execution:** Side effects can be implemented in different ways in signalstory. You have the option to include side effects directly as part of the store, use service-based side effects, or execute effects imperatively on the store based on your specific requirements.
- **Automatic Persistence to Local Storage:** Provides automatic persistence of store state to local storage. Any changes made to the store are automatically synchronized with local storage, ensuring that the state is preserved across page reloads. Initialization of the store can also be directly performed from the persisted state in local storage.
- **State History:** With signalstory, you can enable store history to track state changes over time and perform undo and redo commands.

> ✨ **Planned Features and Enhancements:**
>
> - Integration with Redux DevTools: Compatibility with Redux DevTools is in the making, allowing you to leverage the powerful debugging capabilities they provide.
> - Advanced Middleware Support: signalstory is being enhanced to support more advanced middleware options, enabling you to customize and extend its functionality.
> - Time-Travel Debugging: It is planned to introduce time-travel debugging capabilities, empowering you to navigate and inspect the state at different points in time.
> - Many more ideas...

## Installation

Install the library using npm:

```shell
npm install signalstory
```

## Configuration Options

The Library provides various configuration options that allow you to customize its behaviour. Here are the available configuration options:

| Option                    | Type      | Description                                                                                                                                                                                   |
| ------------------------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`                    | `string`  | (Optional) The name of the store. If not provided, the constructor's name will be used as the default value.                                                                                  |
| `initialState`            | `any`     | (Required) The initial state of the store                                                                                                                                                     |
| `enableEffectsAndQueries` | `boolean` | (Optional) Specifies whether to enable effects in the store. When enabled, effects and effect-handler can be registered and executed. Defaults to `false`.                                    |
| `enableEvents`            | `boolean` | (Optional) Specifies whether to enable events in the store. When enabled, a mediator can be used to pass events from publisher to subscriber using handler registration. Defaults to `false`. |
| `enableLogging`           | `boolean` | (Optional) Specifies whether to enable logging for store actions. When enabled, actions will be logged to the console. Defaults to `false`.                                                   |
| `enableStateHistory`      | `boolean` | (Optional) Specifies whether to enable state history tracking. When enabled, the store will keep track of state changes and provide a history. Defaults to `false`.                           |
| `enableLocalStorageSync`  | `boolean` | (Optional) Specifies whether to enable automatic synchronization of the store state with local storage. Defaults to `false`.                                                                  |

To configure the signalstory, simply pass an object with the desired configuration options to the constructor when creating a new instance of the store.

Here's an improved usage section based on the provided sample app code:

## Usage

To demonstrate the usage of signalstory, let's create a very simple counter application.
Please look at the sample app for more realistic use cases.

First, let's create a `CounterStore` that extends `signalstory<number>`. This store will manage the counter state.

```typescript
import { Injectable } from '@angular/core';
import { signalstory } from 'signalstory';

@Injectable({
  providedIn: 'root',
})
export class CounterStore extends signalstory<number> {
  constructor() {
    super({ initialState: 0 });
  }

  increment = () => this.update(state => state + 1);

  decrement = () => this.update(state => state - 1);
}
```

Next, inject the `CounterStore` into a component.

```typescript
import { Component } from '@angular/core';
import { CounterStore } from './counter.store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(public store: CounterStore) {}
}
```

In the corresponding HTML template (`app.component.html`), you can bind the store's state and methods to the UI elements.

```html
<p>{{ store.state() }}</p>
<button (click)="store.increment()">Increment</button>
<button (click)="store.decrement()">Decrement</button>
```

That's it! You've set up the counter application using signalstory for state management. The store keeps track of the counter value, and the buttons trigger the corresponding store methods to update the state.

Feel free to customize the example and explore other features and functionalities offered by signalstory for more complex state management scenarios in your Angular applications.
