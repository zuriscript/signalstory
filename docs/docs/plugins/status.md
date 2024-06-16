---
sidebar_position: 2
---

# Store Status

Enable your store to track the loading, initialization and modification status. By utilizing the `StoreStatusPlugin`, you can monitor whether your store is currently loading (running an effect) and if it has been initialized or modified.

## Enabling Store Status

To activate the store status tracking feature in signalstory, include the plugin using the exposed `useStoreStatus` factory method:

```typescript
class StoreWithStatus extends Store<MyState> {
  constructor() {
    super({
      initialState: { ... },
      name: 'My Store with Status',
      plugins: [
        useStoreStatus()
      ],
    });
  }
}
```

## Supported Effect Types

This plugin works only with [effects objects](../building-blocks/effect.md#effect-objects). Generally, it works well with effects that return observables or promises which makes it particularly useful when dealing with asynchronous operations such as HTTP calls or other asynchronous tasks that modify or retrieve information from a store's state.

1. **Effect returning Observables**: The plugin can monitor the loading status and modification status of the store during the asynchronous execution of the observable. It works even if the effect's observable encounters errors, uses the filter operator, or operates as a hot observable (i.e., a subject).

   ```typescript
   const myObservableEffect = createEffect(
     'My Observable Effect',
     (store, params) => {
       return inject(MyService)
         .getData(params)
         .pipe(
           tap(data => {
             store.set(data, 'Data Loaded');
           })
         );
     }
   );
   ```

2. **Effect returning Promises**: the plugin fully supports effects that return promises, whether utilizing an async block or directly returning a promise.

   ```typescript
   // Example of using a promise in an effect
   const myPromiseEffect = createEffect(
     'My Promise Effect',
     async (store, params) => {
       const data = await inject(MyService).getData(params);
       store.set(data, 'Data Loaded');
     }
   );
   ```

#### Considerations for Synchronous Effects

While the Store Status Plugin can technically work with synchronous effects, it's essential to know that change detection doesn't run during their execution. As a result, consumers won't be notified of status changes, making status tracking less beneficial for synchronous effects.

:::info

If you have a specific need to track status in synchronous effects, signalstory could potentially provide a solution by scheduling such effects using the macrotask queue. This approach introduces a slight delay in the execution of the effect, but it ensures the ability to notify consumers about status changes. Feel free to raise a request on GitHub for us to further explore and consider this implementation.

:::

#### Limitations with Effects Using in-function-scope Subscribed Observables

If an effect contains an observable that is subscribed to within the effect function scope, the Store Status Plugin may not work as expected. This is because the plugin does not have information about the observable and cannot hook into its execution. In such cases, it's advisable to structure the effect to avoid subscribing to observables within the effect function.

```typescript
const myNotSoObservableEffect = createEffect(
  'My not so observable Effect',
  (store, params) => {
    inject(MyService)
      .getData(params)
      .subscribe(data => {
        store.set(data, 'Data Loaded');
      });
  }
);
```

## Tracking Running Effects

### Check If Any Effect Is Running

The `isAnyEffectRunning` function returns a Signal indicating whether any effect is currently running for any of the provided stores. If no stores are provided, it returns a signal indicating if any store has an effect running.

```typescript
const anyEffectRunningSignal = isAnyEffectRunning(); // returns true if any store has any effect running
const singleEffectRunningSignal = isAnyEffectRunning(store); // returns true if the given store has any effect running
const multipleEffectRunningSignal = isAnyEffectRunning(store1, store2); // returns true if store1 or store2 has any effect running
```

### Checking If a Specific Effect Is Running

The `isEffectRunning` function returns a Signal indicating whether the specified effect is currently running for any of the provided stores. If no stores are provided, it returns a signal indicating if any store has the given effect running.

```typescript
const anyEffectRunningSignal = isEffectRunning(effect); // returns true if any store has the specified effect running
const singleEffectRunningSignal = isEffectRunning(effect, store); // returns true if the given store has the specified effect running
const multipleEffectRunningSignal = isEffectRunning(effect, store1, store2); // returns true if store1 or store2 has the specified effect running
```

### Manually Marking as Having No Running Effects

It should not happen but in rare situations where an effect is not automatically removed from the running state, you can manually mark a store as not having any running effects using the `markAsHavingNoRunningEffects` function.

```typescript
markAsHavingNoRunningEffects(store);
```

:::info

If you encounter such a situation, use this method as a temporary workaround and be sure to file an issue on GitHub for further investigation and resolution.

:::

## Tracking Loading Status

The `isLoading` function provides a Signal indicating whether any of the specified stores is currently in a loading state. If no stores are provided, it returns a signal indicating if any store is in a loading state. This is a specialized feature of the prior section: Instead of tracking any running effect, it is scoped to marked effects.

```typescript
const anyLoadingSignal = isLoading(); // returns true if any store is loading
const singelLoadingSignal = isLoading(store); // returns true if the given store is loading
const multipleLoadingSignal = isLoading(store1, store2); // returns true if store1 or store2 is loading
```

An effect created with `setLoadingStatus` will mark the associated store as loading while the effect is running.

```typescript
const effectThatLoadsBooks = createEffect(
  'Load Books',
  (store: BookStore): Observable<unknown> => {
    return inject(BookService);
    loadBooks().pipe(tap(books => store.setBookData(books.items)));
  },
  // highlight-start
  {
    setLoadingStatus: true,
  }
  // highlight-end
);
```

## Tracking Initialization Status

The `initialized` function returns a Signal indicating whether the specified store has been initialized by an initializing effect.

```typescript
const initializedSignal = initialized(store);
```

A store is initially **not initialized** and any command (`set`, `update`, `mutate`) applied to the store will not change this status.
Only an effect created with the `setInitializedStatus` flag can set the store's initialization status to **initialized**.

```typescript
const effectThatInitializesStore = createEffect(
  'Load Books',
  (store: BookStore): Observable<unknown> => {
    return inject(BookService);
    loadBooks().pipe(tap(books => store.setBookData(books.items)));
  },
  // highlight-start
  {
    setInitializedStatus: true,
  }
  // highlight-end
);
```

## Tracking Modification Status

The `modified` function returns a Signal indicating whether the specified store has been modified.

```typescript
const modifiedSignal = modified(store);
```

A store is initially **unmodified**. Any command (`set`, `update`, `mutate`) applied to the store will mark it as **modified**. Additionally, an effect created with the `setInitializedStatus` flag can reset the store's modification status back to **unmodified**.

## Reset store status

In some cases, it could be necessary to manually reset the store status to `unmodified` and `deinitialized` using the `resetStoreStatus` function.

```typescript
resetStoreStatus(store);
```
