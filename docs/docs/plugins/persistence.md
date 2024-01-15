---
sidebar_position: 2
---

# Persistence

`signalstory` provides a mechanism for persisting the state of your store, allowing you to save and load the state across different sessions or browser refreshes, or even creating fully offline applications using `indexedDB`. By enabling the `StorePersistencePlugin`, you can ensure that your store's state remains persistent and readily available.

Signalstory provides both synchronous storage implementations like [SessionStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage) or [LocalStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) and asynchronos options such as [IndexedDb](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API). Additionally, you have the freedom to integrate your custom implementations for both synchronous and asynchronous storages.

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

## Feature detection (SSR)

In cases where the storage providers are not available, for example for SSR, the plugin does not get registered and will not throw an error.
Hence, you can reuse your Store plugin declerations without changing anything. However, note that Angular raises an error if there's an attempt to reference unsupported global variables during SSR. To work around this, instead of using the actual window variable, simply specify the string constant `LOCAL_STORAGE` or `SESSION_STORAGE`.

```typescript
useStorePersistence({
  persistenceStorage: 'SESSION_STORAGE',
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

## IndexedDB (experimental)

:::info

The native indexedDB adapter has undergone testing, though it has not been deployed in production code as of now. Further manual and unit tests are required before we consider removing the experimental flag. Nevertheless, feel free to dive in and start using it - The api is stable and good to go!

:::

Signalstory provides native integration for [IndexedDb](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API), hence no further library is needed. Note, however, that you could also use a third-party library, if you really wanted to, by creating an adapter implementing `AsyncStorage` by yourself.

Following configuration scenarios are possible:

- One database per store
- One objectstore per store
- One objectstore for all stores

It often makes sense to choose one single approach, but if your application has other IDB databases or objectstores, you can mix and match as you wish to get the best setup possible. Other possible use cases for mixing includes clustering stores from the same feature in the same database or using the same objectStore for related stores, etc.

:::tip

Using multiple objectstores for the same database needs a specialized setup, since the objectstores can only be created inside a versionchanged transaction.
You can use [native db migrations](#database-migration) to prepare you objectstores but also for applying data migration and cleanups.

:::

### IndexedDB Configuration Options

When configuring the connection to IndexedDB in `signalstory`, you can use the following options provided by the `IndexedDbOptions` interface. The `configureIndexedDb` function takes these options to set up the necessary configuration for store persistence.

| Option            | Description                                                                                                                                                                                                                                                       | Default Value | Required |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- | -------- |
| `dbName`          | The name of the IndexedDB database.                                                                                                                                                                                                                               | -             | Yes      |
| `dbVersion`       | The version of the IndexedDB database. If not explicitly provided, the adapter attempts to infer the version by inspecting the pool. This inference relies on prior configuration through the `migrateIndexedDb` function or previous usage of the same database. | inference     | No       |
| `objectStoreName` | The name of the object store to connect to within the database.                                                                                                                                                                                                   | storename     | No       |
| `key`             | The key to use when connecting to a specific record within the object store.                                                                                                                                                                                      | storename     | No       |
| `handlers`        | Configuration options for IndexedDB setup handlers.                                                                                                                                                                                                               | None          | No       |

Example:

```typescript
import { configureIndexedDb } from 'signalstory';

useStorePersistence(
  configureIndexedDb({
    dbName: 'YourDatabaseName',
    dbVersion: 1,
    objectStoreName: 'YourObjectStoreName',
    key: 'YourKey',
    handlers: {
      onSuccess: () => {
        // Your success handler is called after successfull initialization
      },
      onBlocked: () => {
        // Your blocked handler is called
        // when an open connection to a database is blocking a versionchange transaction
      },
      onInitializationError: () => {
        // Your error handler is called in the case of an initialization error
      },
    },
    projection: {
      onWrite: state => {
        // Optional projection on write for obfuscation or to slim down the stored state
      },
      onLoad: projection => {
        // If onWrite was specified, you have to tell the store how to consume the stored state
      },
    },
  })
);
```

#### One database per store

In this configuration, each store is associated with its dedicated IndexedDB database.

```typescript
import { configureIndexedDb } from 'signalstory';

// Store A
useStorePersistence(
  configureIndexedDb({
    dbName: 'StoreADatabase',
    dbVersion: 1,
  })
);

// Store B
useStorePersistence(
  configureIndexedDb({
    dbName: 'StoreBDatabase',
    dbVersion: 1,
  })
);
```

#### One objectstore per store

This configuration involves creating a distinct object store within the IndexedDB database for each store. Make sure that each plugin is using the same database name.
It is recommended to use [db migrations](#database-migration) to establish the idb structure. An additional advantage of using the migration feature is the automatic setup of a database pool, allowing the required database version to be auto-detected.

```typescript
import { configureIndexedDb } from 'signalstory';

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

Here, a single object store is shared among all stores within the IndexedDB database. If you are using [db migrations](#database-migration), you also don't have to specify the database version.

```typescript
import { configureIndexedDb } from 'signalstory';

// Store A
useStorePersistence(
  configureIndexedDb({
    dbName: 'SharedDatabase',
    dbVersion: 1,
    objectStoreName: 'SharedObjectStore',
  })
);

// Store B
useStorePersistence(
  configureIndexedDb({
    dbName: 'SharedDatabase',
    dbVersion: 1,
    objectStoreName: 'SharedObjectStore',
  })
);
```

### Database Migration

When setting up `signalstory` with IndexedDB, database migration becomes essential for managing schema changes, applying data migrations, and performing cleanups. The `migrateIndexedDb` function allows you to define and execute these migrations. This will also setup a database pool, which makes the configuration at the stores simpler.

`migrateIndexedDb` has to be called for all used databases individually and should be called before the first store is used. One possible approach is to use the [`APP_INITIALIZER`](https://angular.io/api/core/APP_INITIALIZER) DI token to register migrations. It's important to note that migrations are registered lazily and will only be applied during the first usage of the database.

Here's an example of using `migrateIndexedDb` to configure the IndexedDB database with store registrations and migration operations.

```typescript
// Somewhere very early in the application
idbMigration();

// idbMigration.ts
import { migrateIndexedDb } from 'signalstory';

const idbMigration = () => {
  migrateIndexedDb('MyApplicationDb', 5, model =>
    model
      .createStore('StoreA')
      .createStoreOrClearState('StoreB')
      .createStoreOrTransform('StoreC', (oldVersion, state) => {
        if (oldVersion > 3) {
          return myMigrationLogicForStoreA(state);
        } else {
          return myVeryOldMigrationLogicForStoreA(state);
        }
      })
      .dropStore('StoreD')
      .createStoreOrMigrateRecords('SharedObjectStore', records =>
        records
          .createStoreOrClearState('StoreX')
          .createStoreOrTransform('StoreY', (oldVersion, state) => {
            return myMigrationLogicForStoreY(state);
          })
          .dropStore('StoreZ')
      )
  );
};
```

In this example, the migration is applied if:

- The user doesn't have an IDB database named _MyApplicationDb_ in their browser storage.
- The user has an IDB database named _MyApplicationDb_, but with a version smaller than 5.

The migration operations:

- `createStore` creates an object store if it doesn't exist. It's crucial to list all the object stores you're using here, unless you've registered them through another operation below.
- `createStoreOrClearState` creates an object store or clears its current state.
- `createStoreOrTransform` creates an object store or applies a custom transformation (data migration) on the existing state.
- `createStoreOrMigrateRecords` creates an object store or migrates its records using the specified migration logic. This is only useful, if you are using a _single-objectstore-for-multiple-stores_ approach and you have to migrate stores on a record level.
- `dropStore` deletes an object store if it exists.
