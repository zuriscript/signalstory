import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { BookCollectionComponent } from './components/book-collection.component';
import { BookListComponent } from './components/book-list.component';
import { BookSearchComponent } from './components/book-search.component';

@NgModule({
  imports: [BrowserModule, FormsModule, HttpClientModule],
  declarations: [
    AppComponent,
    BookSearchComponent,
    BookListComponent,
    BookCollectionComponent,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
