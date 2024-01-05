---
sidebar_position: 4
---

# Configuration

The store configuration allows you to customize the behavior of your store upon creation. Therefore, the configuration is applied by passing it to the constructor. Since signalstory is a multi store state management library, each store can have its own configuration.

Here are the available configuration options:

| Option         | Description                                                                                                                 | Default Value | Required |
| -------------- | --------------------------------------------------------------------------------------------------------------------------- | ------------- | -------- |
| `initialState` | Specifies the initial state of the store.                                                                                   | -             | Yes      |
| `name`         | Sets the name of the store. This option is optional and defaults to the constructor name.                                   | Class name    | No       |
| `injector`     | Optional DI injector that can be passed for effects and query objects. Only useful for dynamic stores not registered in DI. | `null`        | No       |
| `plugins`      | A list of plugins to use with the store.                                                                                    | `[]`          | No       |

```typescript

class MyStore extends Store<MyState> {
  constructor() {
    super({
        initialState: { ... },
        name: 'My Store',
        enableLogging: true,
        plugins: [
          useDevtools(),
          useStoreHistory(),
          useStorePersistence(),
        ],
    });
  }
}

```
