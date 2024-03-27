---
sidebar_position: 3
---

# Store

`Stores` serve as a central hub for managing a specific slice of the application's state. A store may be used globally but can also be scoped at a component or service level. Rather than using a single store for the entire application, the state can be distributed across multiple isolated stores. Each store could be responsible for managing state related to a specific domain entity or a feature.

A store encapsulates a `WritableSignal` as state. It exposes the functions `set`, `update`, and `mutate` for performing state modifications, as well as the `state` as readonly signal. While Signalstory offers a variety of features for your everyday needs, it goes beyond that by introducing concepts and abstractions to help you build a maintainable and scalable architecture. Some of these abstractions include:

- [Command](./building-blocks/command.md): A structured approach to exposing state-modifying methods.
- [Query](./building-blocks/query.md): Patterns and utilities facilitating testable multi-store queries.
- [Effect Objects](./building-blocks/effect.md): Encapsulation of side effects and action flows into maintainable and testable standalone objects with a single purpose. Use meta attributes to control addtional behaviors.
- [Events](./building-blocks/event.md): Synchronous propagation of events across stores.

:::info
Please note that these abstractions and features are entirely optional and not mandatory for signalstory to function. Feel free to cherry-pick the functionalities that suit your needs!
:::

## Create an Injectable Store Service

Stores can be defined as injectable concrete classes extending the generic `Store` class, that can be injected into Angular components, services, and other classes.

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

  // Expose functions to modify the state
  public selectUser(name: string): void {
    this.mutate(state => {
      const userToSelect = state.find(user => user.name === name);
      if (userToSelect) {
        userToSelect.isSelected = true;
      }
    });
  }

  // Expose functions to query the state
  public get selectedUsers(): Signal<UserState> {
    return computed(() => this.state().filter(user => user.isSelected));
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
