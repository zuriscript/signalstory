/* eslint-disable @angular-eslint/component-selector */
import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-book-search',
  template: `
    <input
      type="text"
      [value]="searchInput"
      (input)="onInputChange($event)"
      placeholder="Search books" />
  `,
  styles: [
    `
      input {
        width: 400px;
        margin-bottom: 10px;
      }
    `,
  ],
})
export class BookSearchComponent implements OnInit {
  searchInput = 'sapowski';
  @Output() SearchTextChanged = new EventEmitter<string>();

  ngOnInit(): void {
    this.SearchTextChanged.emit(this.searchInput);
  }

  onInputChange(event: Event) {
    this.searchInput = (event.target as HTMLInputElement).value;
    this.SearchTextChanged.emit(this.searchInput);
  }
}
