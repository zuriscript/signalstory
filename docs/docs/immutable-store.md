---
sidebar_position: 5
---

# Immutable Store

Immutability has gained significant attention for its capacity to streamline state management, heighten predictability, and refine debugging processes. Particularly noteworthy is its conventional integration with the [OnPush change detection strategy](https://angular.io/guide/change-detection-skipping-subtrees) where immutable input objects have proved to accelerate performance in complex angular applications. Furthermore, immutability is a core principle in redux and the defining fundament of unidirectional data flow.

At the moment, there is no real immutability support for signals out-of-the-box, eventhough there had been [experiments](https://github.com/angular/angular/pull/49644) in the past. This is unsurprising, given the broad spectrum of applications that signals are intended for:

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

Some other reasons for using `ImmutableStore` over `Store`:

- Improved interoperability with rxjs observables, which may relay on a stream of immutable values (see `buffer`, `shareReplay`, etc.)
- Allows for accumulation of singal emmited values over time
- Helps following unidirectional dataflow principle
- More closely adheres to the principles of the functional programming paradigm, enhancing predictability in state modification (matter of taste)
- Improved signal state change detection, since modification of a signal only then fires a changed event notification if the new value is an actual new object

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
