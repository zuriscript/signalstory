---
sidebar_position: 8
---

# Testing

Stores are injectable services and can be unit-tested in isolation, much like any other service. You have the option to directly instantiate a store class or use [TestBed](https://angular.io/api/core/testing/TestBed) if your store class has dependencies and you prefer managing them within an injection context during tests. While services can often be tested unmocked as part of the component, it's highly beneficial to conduct unit tests on the store in isolation, as it typically houses your frontend-related business logic.

For testing effect and query objects, signalstory provides utility methods under `signalstory/testing`, offering a more readable and targeted syntax than using `TestBed` as-is.

There are lot of strategies and flavours for unit testing services, or unit testing per se. Following sections will demonstrate some strategies for testing different store aspects using [jest](https://jestjs.io/), although any other testing and mocking framework may work here.

For demonstration, following store class will be used.

```typescript
interface User {
  id: string;
  name: string;
}

class UserStore extends Store<User[]> {
  constructor() {
    super({ initialState: [] });
  }

  get names() {
    return computed(() => this.state().map(x => x.name));
  }

  addUser(name: string) {
    this.mutate(state => state.push({ id: Math.random().toString(), name }));
  }
}
```

## Testing Commands

Commands modify the store's state without causing side effects. Consequently, testing them is relatively straightforward: just confirm that the specified input results in the intended state. In cases where the command logic is complex or involves business logic, we would want to check known edge cases specifically.

```typescript
describe('addUser', () => {
  it('should create User', () => {
    // arrange
    const store = new UserStore();
    const userName = 'Mike';

    // act
    store.addUser(userName);

    // assert
    expect(store.state()).toEqual([
      {
        id: expect.any(String),
        name: userName,
      },
    ]);
  });
});
```

Note, that here we are creating the store as part of the test case. This could also be accomplished in the `beforeEach` hook or entirely offloaded to fixture logic.

## Testing Queries

Queries retrieve data from the store while possibly applying transformation, filtering and aggreation logic. For queries we want to test that a given store state leads to the right query projection. Again, complex query logic should involve testing edge cases.

```typescript
describe('names', () => {
  it('should return empty array if there are no Users', () => {
    // arrange
    const store = new UserStore();

    // act
    const result = store.names();

    // assert
    expect(result).toStrictEqual([]);
  });
  it('should return names of all users', () => {
    // arrange
    const store = new UserStore();
    const names = ['Mike', 'Rowan', 'Sepp'];
    names.forEach(name => store.addUser(name));

    // act
    const result = store.names();

    // assert
    expect(result).toStrictEqual(names);
  });
});
```

## Testing Effect objects

Effect objects encapsulate one or more actions associated with a store, potentially involving side effects. The store either provides data for or is on the receiving end of a state change resulting from the effect function, which runs in an injection context and is intended to utilize other services. Testing effects requires verifying that both the expected outcomes (`happy paths`) and errors (`unhappy paths`) lead to the correct state change of the store, as well as triggering the appropriate side effects in other parts of the application, if any.

Testing involves multiple scenarios, varying in the number of dependent services and responses they can return. It's advisable to prioritize using real implementations of dependencies over creating mocks. Mocks should be used to mimic the correct service interaction, prompting a specific path for testing. While `TestBed` can be utilized for managing dependencies, signalstory stores have their own injection context reference, allowing for the isolation of the test DI context on the store.

Let's look at following effect object:

```typescript
export const fetchUsersEffect = createEffect(
  'Fetch Users',
  (store: UserStore) => {
    const service = inject(UserService);
    const notification = inject(NotificationService);

    return service.fetchUsers().pipe(
      catchError(err => {
        notification.alertError(err);
        return of([]);
      }),
      tap(result => store.set(result, 'Load Users from Backend'))
    );
  }
);
```

The tests could look like:

```typescript
import {
  configureInjectionContext,
  getFromStoreInjector,
} from 'signalstory/testing';

describe('fetchUsersEffect', () => {
  it('should fill the store with users on successfull service response', async () => {
    // arrange
    const store = new UserStore();
    const usersToBeFetched = [<User>{ id: '1', name: 'hans' }];
    configureInjectionContext(store, opt =>
      opt
        .addMocked(UserService, service => {
          service.fetchUsers = jest.fn(() => of(usersToBeFetched));
        })
        .addRegular(NotificationService)
    );

    // act
    await lastValueFrom(store.runEffect(fetchUsersEffect));

    // assert
    expect(store.state()).toBe(usersToBeFetched);
  });

  it('should empty store on error response', async () => {
    // arrange
    const store = new UserStore();
    configureInjectionContext(store, opt =>
      opt
        .addMocked(UserService, service => {
          service.fetchUsers = jest.fn(() =>
            throwError(() => new Error('Http Error'))
          );
        })
        .addMocked(NotificationService, service => {
          service.alertError = jest.fn();
        })
    );

    // act
    await lastValueFrom(store.runEffect(fetchUsersEffect));

    // assert
    expect(store.state()).toEqual([]);
    expect(
      getFromStoreInjector(store, NotificationService)?.alertError
    ).toHaveBeenCalledTimes(1);
  });
});
```

In the `happy path`, we're checking that when we successfully call the user backend to grab users, our store gets filled up with them. To pull this off, we use `configureInjectionContext` to mock the user service, making it return a fixed list of users. Since the effect function doesn't mess with the notification service when everything goes smoothly, we simply register the notification service unmocked in the dependency injection.

Now, on the `unhappy path`, our focus shifts to testing how the system responds when the user backend call encounters issues. We want to ensure that in such scenarios, not only does it reset the user store, but it also uses the notification service to trigger an alert function. Hence, We register a mock for the user service that throws an error upon function call, and then, we mock the specific function of the notification service to confirm its invocation.

## Testing Query objects

Query objects that target multiple stores involve a bit more complexity when it comes to testing. It requires exploring various combinations of initial states and diverse transformation and joining logic across different stores.

To illustrate, let's introduce another store:

```typescript
interface Order {
  id: string | undefined;
  userId: string;
  product: string;
}

class OrderStore extends Store<Order[]> {
  constructor() {
    super({ initialState: [] });
  }

  placeOrder(userId: string, product: string) {
    this.mutate(state =>
      state.push({
        id: undefined,
        product,
        userId,
      })
    );
  }

  hasUserPlacedOrder(userId: string) {
    return this.state().some(order => order.userId === userId);
  }
}
```

Now, envision a query object that targets both the user service and the order service, resembling:

```typescript
export const userWithOrdersQuery = createQuery(
  [OrderStore, UserStore],
  (orders, users) =>
    users.state().filter(x => x.id && orders.hasUserPlacedOrder(x.id))
);
```

A potential test case might be:

```typescript
describe('userWithOrdersQuery', () => {
  it('should return users with orders', () => {
    // arrange
    const userStore = new UserStore();
    const users = ['Mike', 'Daniel', 'Michael'];
    users.forEach(user => userStore.addUser(user));

    const orderStore = new OrderStore();
    const usersWithOrders = userStore.state().slice(0, 2);
    orderStore.placeOrder(usersWithOrders[0].id, 'Banana');
    orderStore.placeOrder(usersWithOrders[1].id, 'Apple');

    configureInjectionContext(orderStore, opt =>
      opt.addExisting(UserStore, userStore)
    );

    // act
    const result = orderStore.runQuery(userWithOrdersQuery)();

    // assert
    expect(result).toStrictEqual(usersWithOrders);
  });
});
```

In preparation for the test case, we set up both stores beforehand and register the prepared instance of the user store in the injection context of the order store. No mocking occurs in this scenario.

## Testing Events

An event involves one producer/publisher and can involve an arbitrary number of handling stores. Since producers are typically unaware of which stores (handlers) are reacting to their events, this principle should guide our testing strategy: Test the producing side and each handler independently, each with its unique edge cases and context. This approach ensures our testing code stays neat and tidy, dealing with the context of one side at a time.

Let's craft an event and have the user store publish it in a new command:

```typescript
export const userRemovedEvent = createEvent<{ id: string }>('User removed');

// Following is inside the user store
removeUser(userId: string) {
  this.update(state => state.filter(x => x.id !== userId));
  publishStoreEvent(userRemovedEvent, { id: userId });
}
```

Now, let's bring in the order store as a handler. Typically, the registration occurs within the store constructors, although it could also take place in other locations:

```typescript
this.registerHandler(userRemovedEvent, (store, event) => {
  this.update(state => state.filter(o => o.userId !== event.payload!.id));
});
```

Ensuring the producing side is on track means making sure the right process publishes the correct event:

```typescript
it('should remove user and publish store event', () => {
  // arrange
  const store = new UserStore();
  store.addUser('Mike');
  const handler = jest.fn();
  store.registerHandler(userRemovedEvent, handler);

  // act
  store.removeUser(store.state()[0].id);

  // assert
  expect(store.state()).toStrictEqual([]);
  expect(handler).toHaveBeenCalledTimes(1);
});
```

Now we have to make sure that the handling store effectively responds to the specific event in the correct way.

```typescript
it('should handle userRemovedEvent and remove user', () => {
  // arrange
  const store = new OrderStore();
  const userId = '1234';
  store.placeOrder(userId, 'Avocado');

  // act
  publishStoreEvent(userRemovedEvent, { id: userId });

  // assert
  expect(store.state()).toStrictEqual([]);
});
```
