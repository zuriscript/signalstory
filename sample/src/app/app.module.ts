import { APP_INITIALIZER, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import {
  provideHttpClient,
  withInterceptorsFromDi,
  withXhr,
} from '@angular/common/http';
import { AppComponent } from './app.component';
import { BookCollectionComponent } from './components/book-collection.component';
import { BookListComponent } from './components/book-list.component';
import { BookSearchComponent } from './components/book-search.component';
import { LoadingSpinnerComponent } from './components/loading-spinner.component';
import { idbMigration } from './idbMigration';

@NgModule({
  declarations: [
    AppComponent,
    BookSearchComponent,
    BookListComponent,
    BookCollectionComponent,
    LoadingSpinnerComponent,
  ],
  bootstrap: [AppComponent],
  imports: [BrowserModule, FormsModule],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: () => idbMigration,
      multi: true,
    },
    provideHttpClient(withXhr(), withInterceptorsFromDi()),
  ],
})
export class AppModule {}
