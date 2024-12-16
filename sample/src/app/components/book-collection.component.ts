/* eslint-disable @angular-eslint/component-selector */
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Immutable } from 'signalstory';
import { BookData } from '../state/books.state';

@Component({
  selector: 'app-book-collection',
  template: `
    <div class="book-item" *ngFor="let book of books">
      <p>{{ book.volumeInfo.title }}</p>
      <span class="author"> by {{ book.volumeInfo.authors }}</span>
      <button class="remove-button" (click)="remove.emit(book.id)">
        Remove from Collection
      </button>
    </div>
  `,
  styles: [
    `
      p {
        max-width: 400px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .book-item {
        background-color: #f7f7f7;
        padding: 10px;
        margin-bottom: 10px;
        border-radius: 5px;
      }

      .author {
        font-style: italic;
        color: #777;
      }

      .remove-button {
        background-color: #dc3545;
        color: #fff;
        border: none;
        padding: 5px 10px;
        border-radius: 3px;
        cursor: pointer;
        margin-left: 10px;
      }
    `,
  ],
  standalone: false,
})
export class BookCollectionComponent {
  @Input() books: Array<Immutable<BookData>> = [];
  @Output() remove = new EventEmitter();
}
