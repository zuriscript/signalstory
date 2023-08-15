---
sidebar_position: 6
---

# Local state

State management becomes even more challenging when dealing with the combination of domain data and UI-related state. This is a common scenario in modern web applications, where data fetched from backend services needs to be presented and interacted with in the user interface.

Consider an application that displays a list of books fetched from a backend API. Each book has various properties, such as title, author, publication date, and genre. In addition to displaying this technical data, the application may also need to track the UI-related state, such as whether a book is selected, highlighted, or expanded in a collapsible section. Moreover, there might be situations where the application requires presenting the fetched data differently, possibly by augmenting it with additional data from other API resources (hence other stores).

## Single Store

One approach to implement this functionality is to use a single store that handles both the technical state and the UI-related state. By utilizing intersection types, we can distinguish between the technical and UI-related data and provide separate commands to modify each aspect independently.

Furthermore, if there is a need to combine the store's state with data from other stores, we have two options. The first option is to use a `query object` that fetches and merges data from multiple stores, and using this directly transforms the local state to desired shape. Alternatively, we can use events to subscribe to changes in dependent stores and react accordingly, incorporating their data into the current store's state when necessary.

```typescript
// Technical (domain) data type
interface BookData {
  id: string;
  volumeInfo: {
    title: string;
    publishedDate: string;
  };
}

// UI related data type
interface BookUI {
  isInMyCollection: boolean;
}

// Final state type
type Book = BookData & BookUI;

class BooksStore extends Store<Book[]> {
  constructor() {
    super({ initialState: [] });
  }

  public get getBooksInCollection() {
    return computed(() => this.state().filter(x => x.isInCollection));
  }

  public addToCollection(bookId: string) {
    this.mutate(state => {
      const book = state.find(x => x.id === bookId);
      if (book) {
        book.isInCollection = true;
      }
    }, 'Add Book To Collection');
  }
}
```

## Composite Store

The CompositeStore class represents a specialized extension of the Store that facilitates the segregation of domain data from UI-related data. Its primary purpose is to merge local state with a data stream obtained from one or more stores, leveraging a query object.

By adopting this approach, we can create a separate store dedicated solely to managing UI state, allowing us to implement specific mechanics, such as state history, targeting the local state alone.

The CompositeStore class requires two main components: `query object` and `stateUpdateFn`. The `query object` determines the underlying data stream fetchedfrom other stores, while the `stateUpdateFn` is a function that updates the local state based on the data retrieved from the query and the current local state. `stateUpdateFn` is triggered initially on store creation and whenever the data query stream emits a new value.

It takes a `query object` and and `stateUpdateFn`, a function that updates the local state, based on the data query and the current local state.

It has the same exposed members and and methods like a regular store and it optionally takes a store configuration.

```typescript
// Assume we have a UserStore that manages logged in user data like user preferences
const userQuery = createQuery([UserStore], userStore => userStore.state());

interface UserUI {
  sideBarIsOpen: boolean;
}

class UserUiStore extends CompositeStore<UserData, UserUI> {
  constructor() {
    super(
      userQuery,
      (data, currentState) =>
        <UserUI>{
          sideBarIsOpen:
            currentState?.sideBarIsOpen ??
            data?.settings?.sideBarInitiallyOpen ??
            false,
        }
    );
  }
}
```

Here is a more complicated example using lists.

```typescript
// A helper function to inner join two arrays based on a shared key identifier
function join<
  T,
  U,
  TKey extends keyof T & keyof U,
  TVal extends T[TKey] & U[TKey]
>(array1: T[], array2: U[], key: TKey): Array<T & U> {
  return array1.reduce<Array<T & U>>((result, item1) => {
    const matchingItem = array2.find(
      item2 => (item2[key] as TVal) === (item1[key] as TVal)
    );
    if (matchingItem) {
      result.push({ ...item1, ...matchingItem });
    }
    return result;
  }, []);
}
```
