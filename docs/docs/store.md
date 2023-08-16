---
sidebar_position: 3
---

# Store

`signalstory` provides a powerful and flexible way to manage the state of your Angular application through its store implementation. Stores serve as a central hub for managing the application's state and facilitating state changes.

## Multi Store Pattern

You have the flexibility to distribute your application's state across multiple isolated stores rather than using a single store for the entire application. You can divide your application's state into logical domains, where each store is responsible for managing the state related to a specific domain or feature.

Inter-store communication is made possible through events and synchronous event handlers. Stores can communicate with each other by publishing events and subscribing to them. This decoupled communication mechanism ensures loose coupling between stores, promoting better maintainability and extensibility.

Cross-store projections are achieved using `multi-store query objects`. These query objects allow you to retrieve and combine data from multiple stores to derive derived or computed state. By defining queries that span across multiple stores, you can create a unified view of the application's state, making it easier to consume and display data in components or services.

Effects can be utilized to apply side effects -like asynchronous http calls- that may span across multiple stores.

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
