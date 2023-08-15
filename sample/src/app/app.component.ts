/* eslint-disable @angular-eslint/component-selector */
import { Component, effect } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { Store, createEvent, getHistory, redo, undo } from 'signalstory';
import {
  getGoogleBooksBySearchArgument,
  postCollection,
} from './state/books.effects';
import { Book } from './state/books.state';
import { BooksStore } from './state/books.store';

@Component({
  selector: 'app-root',
  template: `
    <div>
      <h2>Books</h2>
      <app-book-search (SearchTextChanged)="onSearchTextChanged($event)">
      </app-book-search>
      <app-book-list
        [books]="store.getBooksInSearchscope()"
        (add)="store.addToCollection($event)"></app-book-list>
    </div>

    <div>
      <h2>My Collection</h2>
      <button (click)="onPostCollection()">Post Collection</button>
      <app-book-collection
        [books]="store.getBooksInCollection()"
        (remove)="store.removeFromCollection($event)">
      </app-book-collection>
    </div>

    <div>
      <h2>History</h2>
      <div class="buttons">
        <button (click)="undo(store)">Undo</button>
        <button (click)="redo(store)">Redo</button>
      </div>
      <div class="chip" *ngFor="let command of history">{{ command }}</div>
    </div>
  `,
  styles: [
    `
      h2 {
        color: #333;
        text-align: center;
        margin-bottom: 20px;
        font-family: 'Helvetica', sans-serif;
      }

      button {
        width: 100%;
        margin-bottom: 10px;
      }

      .buttons {
        display: flex;
        gap: 10px;
      }

      .chip {
        padding: 5px 12px;
        margin-bottom: 15px;
        border-radius: 32px;
        background: #d3d3da;
      }

      body {
        font-family: Arial, sans-serif;
      }

      :host {
        display: flex;
        justify-content: space-evenly;
        flex-wrap: wrap;
      }
    `,
  ],
})
export class AppComponent {
  history: string[] = [];
  undo = undo;
  redo = redo;

  constructor(public store: BooksStore) {
    effect(() => {
      if (store.state()) {
        this.history = getHistory(store).map(x => x.command);
      }
    });

    const bookFetched = createEvent<Book>('BookAddedToCollectionEvent');
    const booksLoaded = createEvent<Book[]>('BookAddedToCollectionEvent');

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

    const dataStoreSubscription = toObservable(store.state).subscribe(books => {
      uiStore.set(books.map(b => ({ id: b.id, isMarked: false })));
    });
  }

  onSearchTextChanged(searchText: string) {
    this.store
      .runEffect(getGoogleBooksBySearchArgument, searchText)
      .subscribe();
  }

  onPostCollection() {
    this.store.runEffect(postCollection);
  }
}
