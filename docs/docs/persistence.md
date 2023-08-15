---
sidebar_position: 8
---

# Persistence

`signalstory` provides a convenient mechanism for persisting the state of your store, allowing you to save and load the state across different sessions or browser refreshes. By enabling the `enableLocalStorageSync` configuration option, you can ensure that your store's state remains persistent and readily available.

## Enabling Local Storage Persistence

To activate the local storage persistence feature in signalstory, you need to set the `enableLocalStorageSync` option to `true` in the store's configuration.

```typescript
const storeConfig: StoreConfig<TState> = {
  // Other configuration options
  enableLocalStorageSync: true,
};
```

Enabling local storage persistence ensures that the state of your store is automatically saved to the browser's local storage whenever it undergoes a state change. This allows you to preserve the state even when the application is closed or refreshed.

## Loading the Persisted State

When your application starts up or the store is initialized, signalstory automatically loads the persisted state from the local storage, if available.
If a persisted state exists in the local storage, signalstory retrieves it and sets it as the initial state of your store. This ensures that your application starts with the most recent state that was saved during the previous session.

## Clearing the Persisted State

To clear the persisted state from the local storage without affecting the current state of the store, you can use:

```typescript
store.clearPersistence(); // Clears the persisted state from local storage
```
