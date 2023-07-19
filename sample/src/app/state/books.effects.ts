import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store, createEffect, createEvent } from 'signalstory';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { Book, BookData } from './books.state';
import { BooksStore } from './books.store';
import { FakeService } from '../services/fake.service';

export const googleBooksLoadedSuccess = createEvent<BookData[]>(
  'Google books loaded successfully'
);

export const googleBooksLoadedFailure = createEvent(
  'Google books could not be loaded'
);

export const getGoogleBooksBySearchArgument = createEffect(
  'Get Books from Google',
  (store: Store<any>, searchArgument: string) => {
    if (!searchArgument || searchArgument.trim() === '') {
      store.publish(googleBooksLoadedSuccess, []);
      return of([]);
    }

    const http = inject(HttpClient);
    return http
      .get<{ items: BookData[] }>(
        `https://www.googleapis.com/books/v1/volumes?maxResults=6&orderBy=relevance&q=${searchArgument}`
      )
      .pipe(
        tap(books => {
          store.publish(googleBooksLoadedSuccess, books.items);
        }),
        catchError(error => {
          store.publish(googleBooksLoadedFailure, error);
          return of(error);
        })
      );
  }
);

export const postCollection = createEffect(
  'Post collection book titles',
  (store: BooksStore) => {
    inject(FakeService).postFakeData(
      store.getBooksInCollection().map(b => b.volumeInfo.title)
    );
  }
);
