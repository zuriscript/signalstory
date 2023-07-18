---
sidebar_position: 6
---

# History

`signalstory` provides a convenient way for consumers to access and navigate the state history of a store. By enabling the `enableStateHistory` configuration option, you can unlock powerful features such as undo and redo functionality and gain insights into the sequence of actions that have occurred within your application.

## Enabling State History

To activate the state history feature in signalstory, you need to set the `enableStateHistory` option to `true` in the store's configuration.

```typescript
const storeConfig: StoreConfig<TState> = {
  // Other configuration options
  enableStateHistory: true,
};
```

By enabling state history, signalstory will automatically store the history of state changes within the store by tracking `set`, `update` and `mutate` calls.

## Accessing State History

Once the state history is enabled, you can access the history of a store using the `getHistory` method provided by signalstory.

```typescript
const history = store.getHistory();
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
store.undo(); // Undo the last state change
store.redo(); // Redo the next state change, if available
```

The `undo` method reverts the store's state to the previous state in the history, effectively reversing the last action. On the other hand, the `redo` method reapplies a previously undone state change, if there is one available.
