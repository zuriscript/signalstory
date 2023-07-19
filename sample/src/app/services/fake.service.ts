import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FakeService {
  postFakeData(...arg: any) {
    alert('FakeService posted collection ' + JSON.stringify(arg, null, 4));
  }
}
