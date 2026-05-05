import { inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { createEffect } from 'signalstory';
import { FakeService } from '../services/fake.service';
import { BookData } from './books.state';
import { BooksStore } from './books.store';

const MOCK_BOOKS: BookData[] = [
  {
    id: 'mock-1',
    volumeInfo: {
      title: 'The Pragmatic Programmer',
      authors: ['Andrew Hunt', 'David Thomas'],
      publishedDate: '1999-10-20',
    },
  },
  {
    id: 'mock-2',
    volumeInfo: {
      title: 'Clean Code',
      authors: ['Robert C. Martin'],
      publishedDate: '2008-08-01',
    },
  },
  {
    id: 'mock-3',
    volumeInfo: {
      title: 'Refactoring',
      authors: ['Martin Fowler'],
      publishedDate: '1999-07-08',
    },
  },
  {
    id: 'mock-4',
    volumeInfo: {
      title: 'Design Patterns',
      authors: ['Erich Gamma', 'Richard Helm', 'Ralph Johnson', 'John Vlissides'],
      publishedDate: '1994-10-31',
    },
  },
  {
    id: 'mock-5',
    volumeInfo: {
      title: 'Domain-Driven Design',
      authors: ['Eric Evans'],
      publishedDate: '2003-08-30',
    },
  },
  {
    id: 'mock-6',
    volumeInfo: {
      title: 'You Don’t Know JS',
      authors: ['Kyle Simpson'],
      publishedDate: '2015-12-27',
    },
  },
];

export const getGoogleBooksBySearchArgument = createEffect(
  'Get Books from Google',
  (store: BooksStore, searchArgument: string): Observable<unknown> => {
    if (!searchArgument || searchArgument.trim() === '') {
      store.setBooks([]);
      return of([]);
    }

    const needle = searchArgument.toLowerCase();
    const matches = MOCK_BOOKS.filter(b =>
      [b.volumeInfo.title, ...b.volumeInfo.authors]
        .join(' ')
        .toLowerCase()
        .includes(needle)
    );
    const items = matches.length > 0 ? matches : MOCK_BOOKS;

    return of(items).pipe(
      delay(150),
      tap(books => store.setBookData(books))
    );
  },
  {
    setLoadingStatus: true,
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
