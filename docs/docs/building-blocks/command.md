---
sidebar_position: 2
---

# Command

Commands are the only actions that may modify the state of a store. They are exposed via functions `set`, `update`, and `mutate` to perform state modifications. All of those are based on the [native signal modification functions](https://angular.io/guide/signals#writable-signals).

All modification methods take an optional `commandName` parameter, which is used for logging and history utilities.

:::tip

Although, the consumer can use `set`, `update` and `mutate` directly and even pass a decorative command name as argument, it is recommendet to expose store class methods that encapsulate the modification logic, as this follows a well structured and discoverable `repository` approach and consolidates modification in a more controlled fashion.

:::

## `Set`

The `set` method is used to set the store's state to the provided `newState`.

`set(newState: TState, commandName?: string): void`

```typescript
@Injectable({ providedIn: 'root' })
export class CounterStore extends Store<{ count: number }> {
  constructor() {
    super({ initialState: { count: 0 } });
  }

  increment() {
    this.set({ count: this.state().count + 1 }, 'Increment');
  }
}
```

## `Update`

The `update` method is used to update the store's state based on the current state. It takes an `updateFn` function that receives the current state as a parameter and returns the updated state.

`update(updateFn: (currentState: TState) => TState, commandName?: string): void`

```typescript
increment() {
    this.update(state => ({ count: state.count + 1 }), 'Increment');
}
```

## `Mutate`

The `mutate` method is used to directly mutate the store's state using the provided `mutator` function. The `mutator` function receives the current state as a parameter and performs in-place mutations on it.

`mutate(mutator: (currentState: TState) => void, commandName?: string): void`

```typescript
increment() {
    this.mutate(state => {
        state.count++;
    }, 'Increment');
}
```
