---
sidebar_position: 5
---

# Immutable Store

Immutability has gained significant attention for its capacity to streamline state management, heighten predictability, and refine debugging processes. Particularly noteworthy is its conventional integration with the [OnPush change detection strategy](https://angular.io/guide/change-detection-skipping-subtrees) where immutable input objects have proved to accelerate performance in complex angular applications. Furthermore, immutability is a core principle in redux and the defining fundament of unidirectional data flow.

There have been [experiments](https://github.com/angular/angular/pull/49644) to introduce immutability directly into signals. However, this approach has been set aside as the associated drawbacks outweigh the potential advantages. Considering the wide-ranging applications of signals, we believe that incorporating immutability into store management could offer substantial gains in terms of safety and predictability.

For example, this is possible with signals:

```typescript
const sig = signal({ property: 'initial' }).asReadonly();
sig().property = 'new';
console.log(sig()); // prints "{ property: 'new' }"
```

Hence we can update the signal from everywhere without using `set`, `update`, `mutate` and even without holding the reference to the actual `WritableSignal`.

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

The default implementation for producing immutable state is a naive json stringify/parse algorithm. The user is expected to pass a more sophisticated implementation from libraries like [immer.js](https://immerjs.github.io/immer/) or [structura.js](https://giusepperaso.github.io/structura.js/).

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
        cloneAndMutateFunc: produce,
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
        cloneAndMutateFunc: produce  as unknown as MutationFn<MyState>,
        // highlight-end
    });
  }
}
```
