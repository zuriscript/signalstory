import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import {
  Store,
  createEffect,
  createEvent,
  publishStoreEvent,
} from 'signalstory';
import { FakeService } from '../services/fake.service';
import { BookData } from './books.state';
import { BooksStore } from './books.store';

export const googleBooksLoadedSuccess = createEvent<BookData[]>(
  'Google books loaded successfully'
);

export const googleBooksLoadedFailure = createEvent(
  'Google books could not be loaded'
);

export const getGoogleBooksBySearchArgument = createEffect(
  'Get Books from Google',
  (_: Store<any>, searchArgument: string) => {
    if (!searchArgument || searchArgument.trim() === '') {
      publishStoreEvent(googleBooksLoadedSuccess, []);
      return of([]);
    }

    const http = inject(HttpClient);
    return http
      .get<{ items: BookData[] }>(
        `https://www.googleapis.com/books/v1/volumes?maxResults=6&orderBy=relevance&q=${searchArgument}`
      )
      .pipe(
        tap(books => {
          publishStoreEvent(googleBooksLoadedSuccess, books.items);
        }),
        catchError(error => {
          publishStoreEvent(googleBooksLoadedFailure, error);
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
