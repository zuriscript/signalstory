---
sidebar_position: 2
---

# Persistence

`signalstory` provides a mechanism for persisting the state of your store, allowing you to save and load the state across different sessions or browser refreshes, or even creating fully offline applications using `indexedDB`. By enabling the `StorePersistencePlugin`, you can ensure that your store's state remains persistent and readily available.

Signalstory provides both synchronous storage implementations like [SessionStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage) or [LocalStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) and asynchronos options such as [IndexedDb](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API). Importantly, you have the freedom to integrate your custom implementations for both synchronous and asynchronous use cases.

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

Certainly! Below is the updated documentation reflecting the new configuration options:

## Configuration

You can configure the following things, note that all properties are optional:

| Option               | Description                                                                                                                                                    | Default Value                      |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| `persistenceKey`     | The key to use for the local storage entry.                                                                                                                    | `_persisted_state_of_<storeName>_` |
| `persistenceStorage` | The storage mechanism for persistence.                                                                                                                         | `localStorage`                     |
| `projection`         | Projection functions applied before storing and after loading from storage. Can be useful for obfuscating sensitive data prior to storing or for saving space. | None                               |

To configure the Store Persistence Plugin, use it like:

```typescript
useStorePersistence({
  persistenceKey: 'My-store-persistence-key',
  persistenceStorage: sessionStorage,
  projection: {
    onWrite: state => transformedStateToBeStored,
    onLoad: projection => transformedStateToBeApplied,
  },
});
```

## Loading the Persisted State

When your application starts up or the store is initialized, signalstory automatically loads the persisted state from the storage, if available.
If a persisted state exists in the storage, signalstory retrieves it and sets it as the initial state of your store. This ensures that your application starts with the most recent state that was saved during the previous session.

## Clearing the Persisted State

To clear the persisted state from storage without affecting the current state of the store, you can use:

```typescript
clearStoreStorage(store); // Clears the persisted state from storage
```

## IndexedDB

Signalstory provides native integration for [IndexedDb](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API), hence no further library is needed. Following configuration scenarios are possible:

- One database per store
- One objectstore per store
- One objectstore for all stores

Note, that you can mix it, for example, you can cluster stores from the same feature in the same database or/and use the same objectStore for Ui and data related stores.

:::tip
Use _One objectstore per store_ whenever possible as this is usually the most balanced approach. Managing IndexedDB is hard. You can only create objectstores inside versionchange transactions, which happens only once when opening a database with a new version. Therefore use `migrateIndexedDb` to setup your database and manage migrations.
:::

### IndexedDB Configuration Options

When configuring the connection to IndexedDB in `signalstory`, you can use the following options provided by the `IndexedDbOptions` interface. The `configureIndexedDb` function takes these options to set up the necessary configuration for store persistence.

| Option            | Description                                                                                                                                                                                                                                                                                    | Default Value  | Required |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- | -------- |
| `dbName`          | The name of the IndexedDB database.                                                                                                                                                                                                                                                            | -              | Yes      |
| `dbVersion`       | The version of the IndexedDB database. If not provided, the adapter attempts to deduce the version by inspecting the pool, relying on prior IDB migration configuration. If you are using the dbMigration function, the db version is automatically infered and does not have to be specified. | auto-detection | No       |
| `objectStoreName` | The name of the object store to connect to within the database. If not provided, it will use the store's name.                                                                                                                                                                                 | storename      | No       |
| `key`             | The key to use when connecting to a specific record within the object store.                                                                                                                                                                                                                   | 1              | No       |
| `handlers`        | Configuration options for IndexedDB setup handlers.                                                                                                                                                                                                                                            | None           | No       |

Example:

```typescript
import { configureIndexedDb } from 'signalstory';

useStorePersistence(
  configureIndexedDb({
    dbName: 'YourDatabaseName',
    dbVersion: 1,
    objectStoreName: 'YourObjectStoreName',
    key: 2,
    handlers: {
      onUpgradeNeeded: event => {
        // Your upgrade needed handler
      },
      onSuccess: () => {
        // Your success handler
      },
      onBlocked: () => {
        // Your blocked handler
      },
      onInitializationError: () => {
        // Your initialization error handler
      },
    },
  })
);
```

#### One database per store

In this configuration, each store is associated with its dedicated IndexedDB database. This makes seting up the database very easy, since we can directly use a dedicated migration function for each store individually. However, this approach introduces potential drawbacks, including storage inefficiency for small data footprints, increased management overhead and challenges in cross-store queries.

```typescript
import { configureIndexedDb } from 'signalstory';

// Store A
useStorePersistence(
  configureIndexedDb({
    dbName: 'StoreADatabase',
    dbVersion: 1,
    handlers: {
      onUpgradeNeeded: event => {
        // Handle Migration duties for Store A
      },
    },
  })
);

// Store B
useStorePersistence(
  configureIndexedDb({
    dbName: 'StoreBDatabase',
    dbVersion: 1,
    handlers: {
      onUpgradeNeeded: event => {
        // Handle Migration duties for Store B
      },
    },
  })
);
```

#### One objectstore per store

This configuration involves creating a distinct object store within the IndexedDB database for each store. Make sure that each plugin is using the same database name.

```typescript
import { configureIndexedDb } from 'signalstory';

// Make sure that you have setup the indexedDb using migrateIndexedDb

// Store A
useStorePersistence(
  configureIndexedDb({
    dbName: 'SharedDatabase',
  })
);

// Store B
useStorePersistence(
  configureIndexedDb({
    dbName: 'SharedDatabase',
  })
);
```

#### One objectstore for multiple stores

Here, a single object store is shared among all stores within the IndexedDB database.

```typescript
import { configureIndexedDb } from 'signalstory';

// If you want to migrate something, you should use migrateIndexedDb

// Store A
useStorePersistence(
  configureIndexedDb({
    dbName: 'SharedDatabase',
    dbVersion: 1,
    objectStoreName: 'SharedObjectStore',
    key: 1,
  })
);

// Store B
useStorePersistence(
  configureIndexedDb({
    dbName: 'SharedDatabase',
    dbVersion: 1,
    objectStoreName: 'SharedObjectStore',
    key: 2,
  })
);
```

### Database Migration

```typescript
const idbMigration = () => {
  migrateIndexedDb('MyApplicationDb', 5, model =>
    model
      .createStoreOrTransform('StoreA', (oldVersion, state) => {
        if (oldVersion > 3) {
          return myMigrationLogicForStoreA(state);
        } else {
          return myVeryOldMigrationLogicForStoreA(state);
        }
      })
      .createStoreOrClearState('StoreB')
      .createStore('StoreC')
      .dropStore('StoreD')
  );
};
```
