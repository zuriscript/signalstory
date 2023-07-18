import { Injectable, computed } from '@angular/core';
import { Store, StoreEvent, createQuery } from 'signalstory';
import {
  googleBooksLoadedFailure,
  googleBooksLoadedSuccess,
} from './books.effects';
import { BookData, Book, BookUI } from './books.state';

@Injectable({ providedIn: 'root' })
export class BooksStore extends Store<Book[]> {
  constructor() {
    super({
      initialState: [],
      enableEffectsAndQueries: true,
      enableEvents: true,
      enableLogging: true,
      enableStateHistory: true,
      enableLocalStorageSync: true,
    });

    this.registerHandler(
      googleBooksLoadedSuccess,
      this.handleGoogleBooksLoadedSuccessfullyEvent.bind(this)
    );

    this.registerHandler(
      googleBooksLoadedFailure,
      this.handleGoogleBooksLoadedFailureEvent.bind(this)
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

    this.setBooks(books);
  }

  private handleGoogleBooksLoadedFailureEvent(_: StoreEvent<never>) {
    this.setBooks([]);
  }
}
