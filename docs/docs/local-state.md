---
sidebar_position: 7
---

# Local state

State management becomes even more challenging when dealing with the combination of domain data and UI-related state. This is a common scenario in modern web applications, where data fetched from backend services needs to be presented and interacted with in the user interface.

:::info

Consider an application that displays a list of books fetched from a backend API. Each book has various properties, such as title, author, publication date, and genre. In addition to displaying this technical data, the application may also need to track the UI-related state, such as whether a book is selected, highlighted, or expanded in a collapsible section. Moreover, there might be situations where the application requires presenting the fetched data differently, possibly by augmenting it with additional data from other API resources and other stores.

:::

## Component state

In many cases, it's convenient to keep UI-related code within the component itself. This approach allows us to directly reference both the UI state and the store state separately in the template. Additionally, we can leverage the `computed` signal API to merge the store's data with the UI data.

It gets more complicated if the component state has to react to state changes in a store. We can sync component and store states using observable subscriptions or signal effects (while considering the points mentioned [here](https://angular.io/guide/signals#effects)). However, integrating UI state into stores can be advantageous as it helps separating concerns, reusing UI logic, enabling time-travel debugging, and simplifying cross-component communication.

## All in one Store

One approach to implement this functionality is to use a single store that handles both the technical state and the UI-related state. By utilizing intersection types, we can distinguish between the technical and UI-related data and provide separate commands to modify each aspect independently.

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
        book.isInMyCollection = true;
      }
    }, 'Add Book To Collection');
  }
}
```

## UI Store

Another way is to use a dedicated store for the UI state and to interact with one or more data stores. Often, it is not enough to just combine the data and UI store using projections (query object or `computed` signal) as the UI side also has to react to changes in the data store. This can be done using [synchronous events](./building-blocks/event.md) or asychronously using the [effect API](https://angular.io/guide/signals#effects) or [signal-transformed observables](https://angular.io/api/core/rxjs-interop/toObservable). Be aware, that especially the asynchronous way of state propagation could come with some potential risks:

> Avoid using effects for propagation of state changes. This can result in ExpressionChangedAfterItHasBeenChecked errors, infinite circular updates, or unnecessary
> change detection cycles.
> Because of these risks, setting signals is disallowed by default in effects, but can be enabled if absolutely necessary.
> &mdash; <cite>[Angular - When not to use effects](https://angular.io/guide/signals#effects)</cite>

```typescript
// Note: Could also be a class typed Store instead of a dynamic one
const uiStore = new Store<{ id: string; isMarked: boolean }[]>({
  initialState: [],
});

uiStore.registerHandler(booksLoaded, (store, event) => {
  store.set(event.payload?.map(b => ({ id: b.id, isMarked: false })) ?? []);
});

uiStore.registerHandler(bookFetched, (store, event) => {
  store.mutate(state => {
    if (event.payload) {
      state.push({ id: event.payload.id, isMarked: false });
    }
  });
});

// Alternatively or additionally, the uiStore could also react to
// general state changes of the dependent dataStore
const dataStoreSubscription = toObservable(dataStore.state).subscribe(books => {
  uiStore.set(books.map(b => ({ id: b.id, isMarked: false })));
});
```
