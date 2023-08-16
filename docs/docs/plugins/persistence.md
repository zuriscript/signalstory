---
sidebar_position: 2
---

# Persistence

`signalstory` provides a convenient mechanism for persisting the state of your store, allowing you to save and load the state across different sessions or browser refreshes. By enabling the `StorePersistencePlugin`, you can ensure that your store's state remains persistent and readily available.

## Enabling Local Storage Persistence

To activate the local storage persistence feature in signalstory, you need to include the plugin using the exposed `useStorePersistence` factory method:

```typescript
class PersistedStore extends Store<MyState> {
  constructor() {
    super({
        initialState: { ... },
        name: 'My Persisted Store',
        plugins: [
          useStorePersistence()
        ],
    });
  }
}
```

Enabling local storage persistence ensures that the state of your store is automatically saved to the browser's local storage whenever it undergoes a state change. This allows you to preserve the state even when the application is closed or refreshed.

## Configuration

You can configure the following things:

| Option               | Description                                 | Default Value                      |
| -------------------- | ------------------------------------------- | ---------------------------------- |
| `persistenceKey`     | The key to use for the local storage entry. | `_persisted_state_of_<storeName>_` |
| `persistenceStorage` | The storage mechanism for persistence.      | `localStorage`                     |

And use it like:

```typescript
useStorePersistence({
  persistenceKey: 'My-store-persistence-key',
  persistenceStorage: MyStorageImplementation,
});
```

## Loading the Persisted State

When your application starts up or the store is initialized, signalstory automatically loads the persisted state from the local storage, if available.
If a persisted state exists in the local storage, signalstory retrieves it and sets it as the initial state of your store. This ensures that your application starts with the most recent state that was saved during the previous session.

## Clearing the Persisted State

To clear the persisted state from the local storage without affecting the current state of the store, you can use:

```typescript
clearStoreStorage(store); // Clears the persisted state from storage
```
