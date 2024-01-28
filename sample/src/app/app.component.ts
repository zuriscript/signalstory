/* eslint-disable @angular-eslint/component-selector */
import { Component, OnDestroy, effect } from '@angular/core';
import {
  HistoryTracker,
  isLoading,
  publishStoreEvent,
  trackHistory,
} from 'signalstory';
import {
  getGoogleBooksBySearchArgument,
  postCollection,
} from './state/books.effects';
import { BooksStore } from './state/books.store';
import { storeResetRequestEvent } from './state/events';

@Component({
  selector: 'app-root',
  template: `
    <div>
      <h2>Books</h2>
      <app-book-search (SearchTextChanged)="onSearchTextChanged($event)">
      </app-book-search>
      <app-loading-spinner *ngIf="isCollectionLoading()"></app-loading-spinner>
      <app-book-list
        [books]="store.getBooksInSearchscope()"
        (add)="store.addToCollection($event)"></app-book-list>
    </div>

    <div>
      <h2>My Collection</h2>
      <button (click)="onPostCollection()">Post and Reset Collection</button>
      <app-book-collection
        [books]="store.getBooksInCollection()"
        (remove)="store.removeFromCollection($event)">
      </app-book-collection>
    </div>

    <div>
      <h2>History</h2>
      <div class="buttons">
        <button [disabled]="!tracker.canUndo()" (click)="tracker.undo()">
          Undo
        </button>
        <button [disabled]="!tracker.canRedo()" (click)="tracker.redo()">
          Redo
        </button>
      </div>
      <div class="chip" *ngFor="let command of history">
        {{ command }}
      </div>
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
export class AppComponent implements OnDestroy {
  tracker: HistoryTracker;
  history: string[] = [];
  isCollectionLoading = isLoading(this.store);

  constructor(public store: BooksStore) {
    this.tracker = trackHistory(10, store);

    effect(() => {
      if (store.state()) {
        this.history = this.tracker.getHistory().map(x => x.command);
      }
    });
  }

  ngOnDestroy(): void {
    this.tracker.destroy();
  }

  onSearchTextChanged(searchText: string) {
    this.store
      .runEffect(getGoogleBooksBySearchArgument, searchText)
      .subscribe();
  }

  onPostCollection() {
    this.store.runEffect(postCollection);
    publishStoreEvent(storeResetRequestEvent);
  }
}
