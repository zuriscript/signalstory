---
sidebar_position: 7
---

# Custom

Custom plugins allow you to integrate additional behaviors to stores. You can design plugins that perform targeted tasks, integrating external services, validating inputs, or enhancing data management in any other way. This flexibility ensures that your store aligns perfectly with your application's unique use cases.

## Plugin Structure

A custom plugin in signalstory follows a defined structure using the `StorePlugin` type:

```typescript
type StorePlugin = {
  init?: (store: Store<any>) => void;
  preprocessCommand?: (store: Store<any>, command: string | undefined) => void;
  postprocessCommand?: (store: Store<any>, command: string | undefined) => void;
  preprocessEffect?: (
    store: Store<any>,
    effect: StoreEffect<any, any, any>,
    invocationId: number
  ) => void;
  postprocessEffect?: <TResult>(
    store: Store<any>,
    effect: StoreEffect<any, any, TResult>,
    result: TResult,
    invocationId: number
  ) => TResult;
};
```

Here's a breakdown of the available hooks:

- **init**: This function is called during the initialization of a store. It allows you to perform any setup or configuration specific to your plugin and the store.
- **preprocessCommand**: This function is called before a command is executed on a store.
- **postprocessCommand**: This function is called after a command has been executed on a store.
- **preprocessEffect**: This function is called before an effect is executed on a store.
- **postprocessEffect**: This function is called after an effect has been executed on a store.

:::info

`invocationId` is used to distinguish between running effect invocations. Given the potentially asynchronous nature of effect objects, the same effects can run concurrently. An `invocationId` is composed by `performance.now() + Math.random()`. The addition of the random suffix is essential to differentiate running effects, that have been called close after each other.

:::

## Creating a custom plugin

To create a custom plugin, you'll need to define an object or factory method that conforms to the StorePlugin structure. You can include any of the available functions based on your plugin's requirements. Here's an example of a custom plugin that logs every command executed on a store:

```typescript
import { StorePlugin, Store } from 'signalstory';

// Define Plugin
function useCustomLogPlugin(): StorePlugin {
  return {
    postprocessCommand(store, command) {
      console.log(`Command "${command}" executed on store "${store.name}"`);
    },
  };
}

// Use Plugin
class MyCustomStore extends Store<MyState> {
  constructor() {
    super({
      initialState: { ... },
      name: 'My Custom Store',
      plugins: [
        useCustomLogPlugin(),
      ],
    });
  }
}
```
