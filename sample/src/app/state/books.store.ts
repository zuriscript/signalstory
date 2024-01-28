import { Injectable, computed } from '@angular/core';
import {
  ImmutableStore,
  clearStoreStorage,
  configureIndexedDb,
  useDeepFreeze,
  useDevtools,
  useLogger,
  usePerformanceCounter,
  useStorePersistence,
  useStoreStatus,
} from 'signalstory';
import { Book, BookData } from './books.state';
import { storeResetRequestEvent } from './events';

@Injectable({ providedIn: 'root' })
export class BooksStore extends ImmutableStore<Book[]> {
  constructor() {
    super({
      initialState: [],
      name: 'BookStore',
      plugins: [
        useDevtools(),
        useDeepFreeze(),
        useStorePersistence(
          configureIndexedDb({
            dbName: 'Sample',
          })
        ),
        useLogger(),
        useStoreStatus(),
        usePerformanceCounter(),
      ],
    });

    this.registerHandler(storeResetRequestEvent, store => {
      store.set(this.getBooksInSearchscope(), 'Reset');
      clearStoreStorage(store);
    });
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

  public setBookData(books: BookData[]) {
    this.setBooks(
      books.map(
        b =>
          <Book>{
            ...b,
            isInCollection: false,
          }
      )
    );
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
}
