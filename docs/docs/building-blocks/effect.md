---
sidebar_position: 3
---

# Effect

Effects are basically side effects involving other entities and systems outside the regular flow that may affect the store. They are typically used for handling asynchronous operations, like making HTTP calls, that have an impact on the store's state.

There are multiple ways to implement effects in `signalstory`:

## Store Class Methods (Discouraged)

Effects can be implemented as class methods within the store itself and by injecting needed services into the store directly.
:::caution

While this approach is possible, it is generally discouraged as it can lead to increased coupling between the store and the side effect logic. It can make the store class bloated and harder to test and maintain.

:::

Example usage:

```typescript
class UserStore extends Store<UserState> {
  constructor(private userService: UserService) {
    super({ initialState: { users: [] } });
  }

  // Discouraged approach: Effect implemented as a store method
  // We could also update the state using 'tap' and subscribe at the client
  fetchUsers() {
    this.userService.getUsers().subscribe(
      users => {
        this.set({ users }, 'Fetch Users');
      },
      error => {
        // Handle error
      }
    );
  }
}
```

## Separate Service

A more recommended approach is to use a separate service to encapsulate the effect logic. This promotes better separation of concerns and reduces coupling between the store and the side effect code. The service can communicate with the store through store methods or events. A component would then use the service to perform side effects (like loading the state from backend) and the store for reading and in memory modifications.

```typescript
@Injectable()
class UserEffectService {
  constructor(private userService: UserService, private userStore: UserStore) {}

  // We could also update the state using 'tap' and subscribe at the client
  fetchUsers() {
    this.userService.getUsers().subscribe(
      users => {
        this.userStore.set({ users }, 'Fetch Users');
      },
      error => {
        // Handle error
      }
    );
  }
}
```

## Effect Objects

signalstory provides a `createEffect` function that allows you to create standalone effect objects. This approach promotes even better separation of concerns and modularity. Effect objects can be defined separately from the store and can be used by multiple stores or services. Also testing is simpler and cleaner, since we're handling here with a standalone and fully encapsulated object with only one single purpose.

Effects are imperatively run in an injection context, hence, we can use `inject` inisde the function implementation to make use of registered services like `HttpClient`.

Effects can take parameter, are invoked imperatively can return any type (does not have to be an `observable`). An effect object either targets a specific store (store coupled effect) or can be used more generally (decoupled effect).

### Store coupled effect object

Store coupled effects provide a way to directly modify a specific store within an effect. Unlike decoupled effects that use events to communicate state changes, store coupled effects directly interact with the store's methods and state. This approach is useful when a specific store needs to be modified within an effect, and the coupling between the effect and the store is acceptable within the application's architecture.

```typescript
export const fetchUsers = createEffect(
  'Fetch Users from User Service',
  (store: Store<UserState>, searchArgument: string) => {
    const service = inject(UserService);
    return service.fetchUsers(searchArgument).pipe(
      tap(users => {
        this.userStore.set({ users }, 'Set Users');
      })
    );
  }
);

// Any Component or service:

@Component({
  selector: 'app-root',
  template: '',
  styles: [],
})
export class AppComponent {
  constructor(private readonly userStore: UserStore) {}

  onSearchArgumentChanged(argument: string) {
    // highlight-start
    this.userStore.runEffect(fetchUsers, argument).subscribe();
    // highlight-end
  }
}
```

Using `Covariance`, we can aim for a higher degree of flexibility and reusability by working with stores that share a common structure.
Covariance is a type system property that enables a more generic type to be used in place of a more specific type. In the context of store coupled effects, it means that an effect can accept a store whose state type is compatible with a more specific state type. This allows the effect to work with multiple stores that have similar structures, increasing code reuse.

```typescript
interface User {
  id: string;
  name: string;
}

interface Organization {
  users: User[];
  name: string;
  admin?: User;
}

@Injectable({ providedIn: 'root' })
export class OrganizationStore extends Store<Organization> {
  constructor() {
    super({
      initialState: {
        users: [{ id: '1234', name: 'Martin Hex' }],
        name: 'Org',
      },
    });
  }
}

// Here we are using an effect targeting a less specific type than Organization
// Note: Effects do not have to be async
// But for this use case, a command might be better suited
export const resetUser = createEffect(
  'Reset Users Effect',
  // highlight-start
  (store: Store<{ users: User[] }>) =>
    // highlight-end
    store.mutate(state => (state.users = []), 'Reset Users')
);

// Any Component or service:

@Component({
  selector: 'app-root',
  template: '',
  styles: [],
})
export class AppComponent {
  constructor(private readonly orgStore: OrganizationStore) {}

  onResetClick() {
    // highlight-start
    this.orgStore.runEffect(resetUser).subscribe();
    // highlight-end
  }
}
```

### Decoupled effect object

Decoupled effects allow for a flexible and decoupled approach to handle side effects. They promote code modularity, separation of concerns, testability, and overall flexibility when dealing with asynchronous tasks and side effects. These effect objects are also created using the `createEffect` function but have a parameter of type `Store<any>`, instead of a specific store. Decoupled effects indirectly affect the store by using `events` to communicate state changes. Stores, which need to react to those events, may register an eventhandler. Read more in [Events](./event.md).

```typescript
import { HttpClient } from '@angular/common/http';
import { Store, createEffect, createEvent } from 'signalstory';

// Create events
export const userLoadedSuccess = createEvent<User>('User loaded successfully');
export const userLoadedFailure = createEvent('Failed to load user');

// Create decoupled effect
export const fetchUser = createEffect(
  'Fetch User',
  (store: Store<any>, userId: number) => {
    return inject(HttpClient)
      .get<User>(`/api/users/${userId}`)
      .pipe(
        tap(user => {
          // highlight-start
          store.publish(userLoadedSuccess, user);
          // highlight-end
        }),
        catchError(error => {
          // highlight-start
          store.publish(userLoadedFailure, error);
          // highlight-end
          return of(error);
        })
      );
  }
);
```
