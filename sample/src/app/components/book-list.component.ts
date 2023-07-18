/* eslint-disable @angular-eslint/component-selector */
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BookData } from '../state/books.state';

@Component({
  selector: 'app-book-list',
  template: `
    <div class="book-item" *ngFor="let book of books">
      <p>{{ book.volumeInfo.title }}</p>
      <small>id: {{ book.id }}</small>
      <br />
      <span class="author">
        by {{ book.volumeInfo.authors }}
        <small> on {{ book.volumeInfo.publishedDate }}</small></span
      >

      <button class="add-button" (click)="add.emit(book.id)">
        Add to Collection
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
        background-color: #f3f3f3;
        padding: 10px;
        margin-bottom: 10px;
        border-radius: 5px;
      }

      small {
        font-style: italic;
      }

      .author {
        font-style: italic;
        color: #777;
      }

      .add-button {
        background-color: #007bff;
        color: #fff;
        border: none;
        padding: 5px 10px;
        border-radius: 3px;
        cursor: pointer;
        margin-left: 10px;
      }
    `,
  ],
})
export class BookListComponent {
  @Input() books: Array<BookData> = [];
  @Output() add = new EventEmitter();
}
