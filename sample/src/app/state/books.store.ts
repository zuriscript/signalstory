import { Injectable, computed } from '@angular/core';
import {
  ImmutableStore,
  StoreEvent,
  useDevtools,
  useStoreHistory,
  useStorePersistence,
} from 'signalstory';
import {
  googleBooksLoadedFailure,
  googleBooksLoadedSuccess,
} from './books.effects';
import { Book, BookData } from './books.state';

@Injectable({ providedIn: 'root' })
export class BooksStore extends ImmutableStore<Book[]> {
  constructor() {
    super({
      initialState: [],
      plugins: [
        useDevtools({}),
        useStoreHistory(),
        useStorePersistence({ persistenceKey: 'TempStoreState' }),
      ],
    });

    this.registerHandler(
      googleBooksLoadedSuccess,
      this.handleGoogleBooksLoadedSuccessfullyEvent
    );

    this.registerHandler(
      googleBooksLoadedFailure,
      this.handleGoogleBooksLoadedFailureEvent
    );
  }

  public get getBooksInCollection() {
    return computed(() => this.state().filter(x => x.isInCollection));
  }

  public get getBooksInSearchscope() {
    return computed(() => this.state().filter(x => !x.isInCollection));
  }

  public setBooks(books: Book[]) {
    const collection = this.getBooksInCollection();
    const booksInSearchscope = books.filter(
      b => !collection.some(x => x.id === b.id)
    );

    this.set(collection.concat(booksInSearchscope), 'Set Books');
  }

  public addToCollection(bookId: string) {
    this.mutate(state => {
      const book = state.find(x => x.id === bookId);
      if (book) {
        book.isInCollection = true;
      }
    }, 'Add Book To Collection');
  }

  public resetSearchscopeBooks() {
    this.set(this.getBooksInCollection(), 'Reset Searchscope');
  }

  public removeFromCollection(bookId: string) {
    this.mutate(state => {
      const book = state.find(x => x.id === bookId);
      if (book) {
        book.isInCollection = false;
      }
    }, 'Remove Book From Collection');
  }

  private handleGoogleBooksLoadedSuccessfullyEvent(
    store: this,
    event: StoreEvent<BookData[]>
  ) {
    const books =
      event.payload?.map(
        book =>
          <Book>{
            ...book,
            isInCollection: false,
          }
      ) ?? [];

    store.setBooks(books);
  }

  private handleGoogleBooksLoadedFailureEvent(
    store: this,
    _: StoreEvent<never>
  ) {
    store.setBooks([]);
  }
}
