---
sidebar_position: 4
---

# Configuration

The store configuration allows you to customize the behavior of your store. It provides various options to tailor the store's functionality according to your specific requirements. The configuration is applied by passing it to the constructor. Since signalstory is a multi store state management library, each store can have its own configuration.

Here are the available configuration options:

| Option                    | Description                                                                                                                 | Default Value | Required |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------- | ------------- | -------- |
| `initialState`            | Specifies the initial state of the store.                                                                                   | -             | Yes      |
| `name`                    | Sets the name of the store. This option is optional and defaults to the constructor name.                                   | Class name    | No       |
| `enableStateHistory`      | Enables the state history feature in signalstory, allowing you to track, undo and redo the store's state changes over time. | `false`       | No       |
| `enableLogging`           | Enables logging for the store's actions and events, providing detailed information about the store's operations.            | `false`       | No       |
| `enableEvents`            | Enables decoupled inter-store and effect communication using event, by providing an internal mediator                       | `false`       | No       |
| `enableEffectsAndQueries` | Enables the use of effects and queries in the store, by providing an injection context                                      | `false`       | No       |
| `enableLocalStorageSync`  | Enables local storage persistence for the store's state, allowing the state to be stored and retrieved from local storage.  | `false`       | No       |

To configure a store, simply provide the desired values for the configuration options when creating an instance of the store. For example:

```typescript

class MyStore extends Store<MyState> {
  constructor() {
    super({
        initialState: { ... },
        name: 'My Store',
        enableStateHistory: true,
        enableLogging: true,
        enableEvents: true,
        enableEffectsAndQueries: true,
        enableLocalStorageSync: true,
    });
  }
}

```
