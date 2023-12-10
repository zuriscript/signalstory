import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { BookCollectionComponent } from './components/book-collection.component';
import { BookListComponent } from './components/book-list.component';
import { BookSearchComponent } from './components/book-search.component';
import { LoadingSpinnerComponent } from './components/loading-spinner.component';

@NgModule({
  imports: [BrowserModule, FormsModule, HttpClientModule],
  declarations: [
    AppComponent,
    BookSearchComponent,
    BookListComponent,
    BookCollectionComponent,
    LoadingSpinnerComponent,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
