---
sidebar_position: 1
---

# History

`signalstory` provides a convenient way for consumers to access and navigate the state history of a store. By enabling the `StoreHistoryPlugin`, you can use undo and redo functionality and gain insights into the sequence of actions that have occurred within your application.

## Enabling State History

:::tip

While the plugin works with regular stores, it is recommended to use it exclusively with immutable stores to ensure optimal performance.

:::

To activate the state history feature in signalstory, you need to include the plugin using the exposed `useStoreHistory` factory method:

```typescript
class StoreWithHistory extends Store<MyState> {
  constructor() {
    super({
        initialState: { ... },
        name: 'My Store with history',
        plugins: [
          useStoreHistory()
        ],
    });
  }
}
```

By enabling state history, signalstory will automatically store the history of state changes within the store by tracking `set`, `update` and `mutate` calls.

## Configuration

The `useStoreHistory` function accepts an optional configuration object, providing customization options for the history plugin. The available options are:

| Option      | Description                    | Default Value |
| ----------- | ------------------------------ | ------------- |
| `maxLength` | Maximum length of the history. | `undefined`   |

Example:

```typescript
useStoreHistory({
  maxLength: 100,
});
```

:::caution

By defining `maxLength`, you can control the history size, keeping memory usage in check. If left unspecified (`undefined`), the history will expand without constraints. The choice not to set a default max length aims to maintain compatibility with versions `17.*`, as this would introduce a Breaking Change. A designated default value will be introduced starting from version `18`.

:::

## Accessing State History

Once the state history is enabled, you can access the history of a store using the `getHistory` method.

```typescript
getHistory(store);
```

The `getHistory` method returns an array of `HistoryItem<TState>`, where each item represents a specific state change in the store's history. Each `HistoryItem` contains information about the command or action that caused the state change and the state before the change.

```typescript
interface HistoryItem<TState> {
  command: string; // The name of the command associated with the history item.
  before: TState; // The state before the command was applied.
}
```

## Undo and Redo Actions

signalstory simplifies the process of undoing and redoing state changes by providing dedicated methods: `undo` and `redo`.

```typescript
undo(store); // Undo the last state change
redo(store); // Redo the last undone state change, if available
```

The `undo` method reverts the store's state to the previous state in the history, effectively reversing the last action. On the other hand, the `redo` method reapplies a previously undone state change, if there is one available.
