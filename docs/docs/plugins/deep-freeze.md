---
sidebar_position: 3
---

# Deep Freeze

TypeScript's type system cannot prevent violations of `readonly` -and hence `Immutable<T>` constraints in certain scenarios, such as:

1. **Type Assertions:** If you use a type assertion to override the type of an object, you can potentially bypass the `readonly` or `Immutable<T>` constraints.

2. **Type Compatibility:** TypeScript's structural typing means that objects with `readonly` properties are compatible with their mutable counterparts, allowing you to bypass immutability checks.

3. **Function Arguments:** If you pass a `readonly` or `Immutable<T>` object to a function that accepts the non-readonly version of the type, the immutability constraints are not enforced within the function's scope.

By deep freezing the state, you can attain runtime immutability assurance against direct modifications. However, it's important to acknowledge that this introduces some performance overhead. Consequently, it's particularly well-suited for use during development and debugging stages, [read more](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze).

## Enabling Deep Freeze

To activate the DeepFreeze plugin, simply include it in your store's configuration. This automatically deep freezes the state after each change (`set`, `update`, `mutate`);

```typescript
class StoreWithDeepFfreezing extends Store<MyState> {
  constructor() {
    super({
      initialState: { ... },
      name: 'My Deep freezed Store',
      plugins: [
        useDeepFreeze()
      ],
    });
  }
}
```
