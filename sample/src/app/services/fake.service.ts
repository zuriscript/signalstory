import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FakeService {
  postFakeData(...arg: unknown[]) {
    alert('FakeService posted collection ' + JSON.stringify(arg, null, 4));
  }
}
