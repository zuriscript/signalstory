---
sidebar_position: 3
---

# Store

`Stores` serve as a central hub for managing a specific slice of the application's state. A store may be used globally but can also be scoped at a component or service level. Rather than using a single store for the entire application, the state can be distributed across multiple isolated stores. Each store could be responsible for managing state related to a specific domain entity or a feature.

A store encapsulates a `WrtiableSignal` as state. It exposes the functions `set`, `update`, and `mutate` for performing state modifications. You may visit [Command](./building-blocks/command.md) to read more about semantics.

:::info

Starting from Angular version 17, the `mutate` feature has been removed from the signal public API ([read more](https://github.com/angular/angular/commit/9ea54d47f50e2c6028fe9a70ff734fd455f75660)). Additionally, the base equality function for signals has been changed, as now signal updates will trigger a notification only when the actual reference of the value object changes (applicable if the signal value is not primitive). While `signalstory` will continue to provide the `mutate` method, starting from version 17, `mutate` will implicitly create a [shallow copy](https://developer.mozilla.org/en-US/docs/Glossary/Shallow_copy) for the mutation, ensuring that consumers receive notifications. For those seeking full immutability, check out [Immutable Store](./immutable-store.md).

:::

## Create an Injectable Store

signalstory stores can be defined as injectable concrete classes extending the generic `Store` class, that can be injected into Angular components, services, and other classes.

```typescript
export interface UserData {
  name: string;
  birthday: Date;
}

export interface UserUI {
  isSelected: boolean;
}

export type UserState = (UserData & UserUI)[];

@Injectable({ providedIn: 'root' })
export class UserStore extends Store<UserState> {
  constructor() {
    super({ initialState: [] });
  }
}
```

## Create a Dynamic Store

signalstory also provides the flexibility to create generic store instances dynamically at runtime, which may be useful for certain scenarios.

```typescript
const counterStore = new Store<number>({ initialState: 5 });
counterStore.update(state => state++, 'Increment');
console.log(counterStore.state());
```
