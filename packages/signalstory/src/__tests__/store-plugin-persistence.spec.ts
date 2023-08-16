import { EnvironmentInjector } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { lastValueFrom, take } from 'rxjs';
import { Store } from '../lib/store'; // Import the necessary types and classes
import { PersistenceStorage } from '../lib/store-plugin-persistence/persistence';
import {
  clearStoreStorage,
  loadFromStoreStorage,
  saveToStoreStorage,
  useStorePersistence,
} from '../lib/store-plugin-persistence/plugin-persistence'; // Import the functions to be tested
import { Cmp, registerAndGetStore } from './helper';

describe('loadFromStorage', () => {
  const initialValue = { val: 'initial' };
  const key = 'myStoreKey';
  let store: Store<{ val: string }>;
  let storage: PersistenceStorage;

  beforeEach(() => {
    storage = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
    };
    store = registerAndGetStore({
      initialState: initialValue,
      plugins: [
        useStorePersistence({
          persistenceKey: key,
          persistenceStorage: storage,
        }),
      ],
    });
  });

  it('should load the stored value from persistence storage', () => {
    // arrange
    storage.getItem = jest.fn(() => JSON.stringify(initialValue));

    // act
    const loadedValue = loadFromStoreStorage(store);

    // assert
    expect(loadedValue).toStrictEqual(initialValue);
    expect(storage.getItem).toHaveBeenCalledWith(key);
  });

  it('should return undefined when unable to parse the stored value', () => {
    // arrange
    storage.getItem = jest.fn(() => 'INVALID STATE');

    // act
    const loadedValue = loadFromStoreStorage(store);

    // assert
    expect(loadedValue).toBeUndefined();
    expect(storage.getItem).toHaveBeenCalledWith(key);
  });

  it('should return undefined when no stored value is available', () => {
    // arrange
    storage.getItem = jest.fn(() => null);

    //act
    const loadedValue = loadFromStoreStorage(store);

    // assert
    expect(loadedValue).toBeUndefined();
    expect(storage.getItem).toHaveBeenCalledWith(key);
  });
});

describe('saveToStorage', () => {
  const initialValue = { val: 'initial' };
  const key = 'myStoreKey';
  let store: Store<{ val: string }>;
  let storage: PersistenceStorage;

  beforeEach(() => {
    storage = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
    };
    store = registerAndGetStore({
      initialState: initialValue,
      plugins: [
        useStorePersistence({
          persistenceKey: key,
          persistenceStorage: storage,
        }),
      ],
    });
  });

  it('should save the store state to persistence storage', () => {
    // act
    saveToStoreStorage(store, store.state());

    // assert
    expect(storage.setItem).toHaveBeenCalledWith(
      key,
      JSON.stringify(store.state())
    );
  });
});

describe('clearStorage', () => {
  const initialValue = { val: 'initial' };
  const key = 'myStoreKey';
  let store: Store<{ val: string }>;
  let storage: PersistenceStorage;

  beforeEach(() => {
    storage = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
    };
    store = registerAndGetStore({
      initialState: initialValue,
      plugins: [
        useStorePersistence({
          persistenceKey: key,
          persistenceStorage: storage,
        }),
      ],
    });
  });

  it('should remove the stored value from persistence storage', () => {
    // act
    clearStoreStorage(store);

    // assert
    expect(storage.removeItem).toHaveBeenCalledWith(key);
  });
});

describe('automatic sync', () => {
  const initialValue = { val: 'initial' };
  const initialValueFromStorage = { val: 'initialFromStorage' };
  const key = 'myStoreKey';
  let store!: Store<{ val: string }>;
  let storage!: PersistenceStorage;
  let fixture!: ComponentFixture<unknown>;
  let injector!: EnvironmentInjector;

  function flushEffects(): void {
    fixture.detectChanges();
  }

  beforeEach(() => {
    storage = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
    };
    storage.getItem = jest.fn(() => JSON.stringify(initialValueFromStorage));
    store = registerAndGetStore({
      initialState: initialValue,
      plugins: [
        useStorePersistence({
          persistenceKey: key,
          persistenceStorage: storage,
        }),
      ],
    });
    fixture = TestBed.createComponent(Cmp);
    injector = TestBed.inject(EnvironmentInjector);
  });

  it('Should initialize from storage', () => {
    // assert
    expect(store.state()).toStrictEqual(initialValueFromStorage);
    expect(loadFromStoreStorage(store)).toStrictEqual(initialValueFromStorage);
  });

  it('should persist new state', async () => {
    // arrange
    // Clean prior effect emits and storage applications
    flushEffects();
    storage.setItem = jest.fn();
    const newState = { val: 'newState' };
    const storeChange = lastValueFrom(
      toObservable(store.state, { injector }).pipe(take(1))
    );

    store.set(newState, 'blbal');
    // emits last store change
    flushEffects();

    // act
    const storeChangeResult = await storeChange;

    // assert
    expect(storeChangeResult).toEqual(newState);
    expect(storage.setItem).toHaveBeenCalledTimes(1);
    expect(storage.setItem).toHaveBeenCalledWith(key, JSON.stringify(newState));
  });
});
