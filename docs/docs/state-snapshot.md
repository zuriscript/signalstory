---
sidebar_position: 8
---

# State Snapshot

The snapshot feature enables you to capture and restore the state of all stores currently in scope or a selected subset of stores within your application. This can be particularly useful for scenarios where you need to save and later revert application state, such as when performing a rollback or in response to user actions.

While the [history plugin](./plugins/history.md) effectively captures the history of one store, a snapshot allows you to **rollback multiple actions across various stores.** Using snapshots you can provide transactional guarantees spanning the full application state.

## Usage

A snapshot is a representation of the application state at a specific point in time. It includes a timestamp indicating when the snapshot was created and a `restore` method to revert the application state to the captured snapshot.

### Snapshot Creation

The `createSnapshot` function is used to generate a state snapshot. It accepts a variable number of store instances or store class types as parameters. If no stores are provided, the snapshot will include all stores.

```typescript
import { createSnapshot } from 'signalstory';

// Capture all stores
const snapshot1 = createSnapshot();

// You can use the store class types
const snapshot2 = createSnapshot(BookStore, UserStore);

// You can use store instances
const store1 = new Store<string>({ initialState: '' });
const store2 = new Store<string>({ initialState: '' });
const snapshot3 = createSnapshot(store1, store2);

// Or mix
const snapshot4 = createSnapshot(store1, BookStore);
```

### Snapshot Restoration

To restore the application state to a specific snapshot, call the `restore` method on the created snapshot. All captured stores will rollback their respective state. The snapshot can be reused and is destroyed only when garbage collected.

```typescript
snapshot.restore();
```
