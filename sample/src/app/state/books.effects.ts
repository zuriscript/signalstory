import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { createEffect } from 'signalstory';
import { FakeService } from '../services/fake.service';
import { BookData } from './books.state';
import { BooksStore } from './books.store';

export const getGoogleBooksBySearchArgument = createEffect(
  'Get Books from Google',
  (store: BooksStore, searchArgument: string): Observable<unknown> => {
    if (!searchArgument || searchArgument.trim() === '') {
      store.setBooks([]);
      return of([]);
    }

    const http = inject(HttpClient);
    return http
      .get<{ items: BookData[] }>(
        `https://www.googleapis.com/books/v1/volumes?maxResults=6&orderBy=relevance&q=${searchArgument}`
      )
      .pipe(tap(books => store.setBookData(books.items)));
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
