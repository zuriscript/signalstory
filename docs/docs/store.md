---
sidebar_position: 3
---

# Store

`Stores` serve as a central hub for managing a specific slice of the application's state. A store may be used globally but can also be scoped at a component or service level. Rather than using a single store for the entire application, the state can be distributed across multiple isolated stores. Each store could be responsible for managing state related to a specific domain entity or a feature.

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
