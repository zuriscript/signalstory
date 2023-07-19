/* eslint-disable @angular-eslint/component-selector */
import { Component } from '@angular/core';
import { BooksStore } from './state/books.store';
import {
  getGoogleBooksBySearchArgument,
  postCollection,
} from './state/books.effects';

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

      body {
        font-family: Arial, sans-serif;
      }

      :host {
        display: flex;
        justify-content: space-around;
        flex-wrap: wrap;
      }
    `,
  ],
})
export class AppComponent {
  constructor(public store: BooksStore) {}

  onSearchTextChanged(searchText: string) {
    this.store
      .runEffect(getGoogleBooksBySearchArgument, searchText)
      .subscribe();
  }

  onPostCollection() {
    this.store.runEffect(postCollection);
  }
}
