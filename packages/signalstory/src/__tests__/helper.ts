import { InjectionToken, inject } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ImmutableStore } from '../lib/immutable-store';
import { Store, StoreConfig } from '../public-api';

const STORE_CONFIG = new InjectionToken<StoreConfig<any>>('STORE_CONFIG');

export class TestStore extends Store<any> {
  constructor() {
    super(inject(STORE_CONFIG));
  }
}

export class ImmutableTestStore extends ImmutableStore<any> {
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

export function registerAndGetImmutableStore(
  config: StoreConfig<any>
): ImmutableTestStore {
  TestBed.configureTestingModule({
    providers: [
      { provide: STORE_CONFIG, useValue: config },
      ImmutableTestStore,
    ],
  });

  return TestBed.inject(ImmutableTestStore);
}

export function registerAndGetStores(
  config: StoreConfig<any>
): [TestStore, ImmutableTestStore] {
  TestBed.configureTestingModule({
    providers: [
      { provide: STORE_CONFIG, useValue: config },
      TestStore,
      ImmutableTestStore,
    ],
  });

  return [TestBed.inject(TestStore), TestBed.inject(ImmutableTestStore)];
}

export function arrayFromOrUndefined<T>(
  iterable: Iterable<T> | ArrayLike<T> | undefined
): T[] | undefined {
  return iterable ? Array.from(iterable) : undefined;
}
