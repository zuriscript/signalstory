---
sidebar_position: 5
---

# Immutable Store

Immutability means that every modification of an object creates a new one while leaving the original untouched. In the angular community, it has gained attention, particularly when combined with the [OnPush change detection strategy](https://angular.io/guide/change-detection-skipping-subtrees). With this strategy, the change detection algorithm doesn't need to inspect the entire object and its properties for changes; instead, it can focus on checking if the reference has changed, meaning that a new object has been created and passed to the component. This clearly boosts application performance, considering the recurring and resource-intensive nature of the change detection process.

As of Angular version 17, signals updates are required to be **shallowly immutable**. For primitive valued signals (number, boolean, string) that does not change anything. For objects and arrays, this means, that each update should create a new object. Therefore, the `mutate` method has been dropped from the signal API, but you still have to be careful when using `update`, as returning the same object in an update function fails to notify consumers about the change:

```typescript
// Following would not notify consumers about the change
store.update(state => {
  state.numeberValue = 10;
  return state;
});
```

:::info

We've chosen to maintain the status quo for both `Store` and `ImmutableStore`,retaining their pre-Version 17 public API. The reason behind it: We want `Store` to mimic the behavior of a regular signal while retaining the convenience of the `mutate` function as syntactic sugar. Note, however, that `mutate` will create a shallow copy of the state prior to applying the mutation function.

:::

## Immutable Store vs regular Store

At the moment, there is no full immutability support for signals out-of-the-box, eventhough there had been [experiments](https://github.com/angular/angular/pull/49644) in the past. This is unsurprising, given the broad spectrum of applications that signals were initially intended for:

> We specifically didn’t want to "pick sides" in the mutable / immutable
> data discussion and designed the signal library (and other Angular APIs)
> so it works with both.
> &mdash; <cite>[Angular Discussions - Sub-RFC 2: Signal APIs](https://github.com/angular/angular/discussions/49683)</cite>

However, this can potentially result in unexpected behaviors and challenging-to-debug errors. For instance:

```typescript
const sig = signal({ property: 'initial' }).asReadonly();
sig().property = 'new';
console.log(sig()); // prints "{ property: 'new' }"
```

Hence, we can update the signal from everywhere without using `set`, `update`, `mutate` and even without holding the reference to the actual `WritableSignal`.

There are many advantages to immutability, and deep or full immutability provides even greater benefits than shallow immutability. This is because nested objects and arrays are also protected. This approach helps eliminate potential concurrent pitfalls, as state consumers work with their individual deep copies. Moreover, it aligns more closely with the principles of the functional programming paradigm and brings predictability to state modification.

:::tip
`ImmutableStore` comes with full immutability, compile-time immutability check support and the possibility to plugin `immer.js` and the like.

- Choose `ImmutableStore` for securitiy and peace of mind.
- Choose `Store` if you really need peak performance or if you just don't like the syntax and type constraints that `ImmutableStore` brings.

:::

## The store

An immutable store works same as a regular store, but uses a different base class:

```typescript
// highlight-start
class MyImmutableStore extends ImmutableStore<MyState> {
// highlight-end
  constructor() {
    super({
        initialState: { ... },
        name: 'My Store',
        enableLogging: true,
        plugins: [
          useDevtools(),
          useStoreHistory(),
          useStorePersistence(),
          useDeepFreeze(),
        ],
    });
  }
}

```

You can also use it as dynamic store without declaring a class first:

```typescript
const counterStore = new ImmutableStore<{ val: number }>({
  initialState: { val: 5 },
});
counterStore.mutate(state => state.val++, 'Increment');
console.log(counterStore.state()); // prints "{ val: 6 }"
```

## Immutable type

The Immutable store wraps the state object inside a generic `Immutable<T>` type which provides compile time deep immutability for any object type.

Be aware, that typeScript's type system doesn't always prevent violations of `readonly`, and therefore `Immutable<T>` constraints. Scenarios like type assertions, structural typing compatibility, and passing readonly objects to functions that expect mutable ones, can all bypass these immutability checks. For a stronger guarantee of immutability, consider utilizing the [deep freeze store plugin](./plugins/deep-freeze.md).

:::tip

The default implementation for producing immutable state is a basic Clone-and-Mutate approach, leveraging [structuredClone](https://developer.mozilla.org/en-US/docs/Web/API/structuredClone) - or JSON Stringify/Parse as alternative, if structuredClone is unsupported. While this method might be acceptable for various scenarios, the user is expected to pass a more sophisticated implementation from libraries like [immer.js](https://immerjs.github.io/immer/) or [structura.js](https://giusepperaso.github.io/structura.js/) for more robustness and speed.

:::

## Immer.js

Basic example using [immer.js](https://immerjs.github.io/immer/):

```typescript
// highlight-start
import { produce } from 'immer';
// highlight-end

class MyImmerStore extends ImmutableStore<MyState> {
  constructor() {
    super({
        initialState: { ... },
        name: 'My Immmer Store',
        // highlight-start
        mutationProducerFn: produce,
        // highlight-end
    });
  }
}
```

## Structura.js

At the moment, the [structura.js](https://giusepperaso.github.io/structura.js/) `produce` type does not match directly with the expected function type: `(currentState: TState, mutation: (draftState: TState) => void) => TState`. A possible workaround, among other strategies, involves utilizing double assertions:

```typescript
// highlight-start
import { produce } from "structurajs"
// highlight-end

type MutationFn<T> = (currentState: T, mutation: (draftState: T) => void) => T;

class MyStructuraStore extends ImmutableStore<MyState> {
  constructor() {
    super({
        initialState: { ... },
        name: 'My Structura Store',
        // highlight-start
        mutationProducerFn: produce as unknown as MutationFn<MyState>,
        // highlight-end
    });
  }
}
```
