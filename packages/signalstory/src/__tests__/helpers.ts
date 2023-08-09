import { InjectionToken, inject } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Store, StoreConfig } from '../public-api';

export const STORE_CONFIG = new InjectionToken<StoreConfig<any>>(
  'STORE_CONFIG'
);

export class TestStore extends Store<any> {
  constructor() {
    super(inject(STORE_CONFIG));
  }
}

export function registerAndGetStore(config: StoreConfig<any>): TestStore {
  TestBed.configureTestingModule({
    providers: [{ provide: STORE_CONFIG, useValue: config }, TestStore],
  });

  return TestBed.inject(TestStore);
}
