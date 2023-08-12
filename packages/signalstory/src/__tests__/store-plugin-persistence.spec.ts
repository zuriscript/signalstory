import { effect } from '@angular/core';
import {
  clearStoreStorage,
  loadFromStoreStorage,
  saveToStoreStorage,
  useStorePersistence,
} from '../lib/plugins/store-plugin-persistence'; // Import the functions to be tested
import { Store } from '../lib/store'; // Import the necessary types and classes
import { PersistenceStorage } from '../lib/utility/persistence';
import { registerAndGetStore } from './helper';

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
  let store: Store<{ val: string }>;
  let storage: PersistenceStorage;

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
  });

  it('Should initialize from storage', () => {
    // assert
    expect(store.state()).toStrictEqual(initialValueFromStorage);
    expect(loadFromStoreStorage(store)).toStrictEqual(initialValueFromStorage);
  });

  it('Should persist new state', done => {
    // arrange
    const newState = { val: 'newState' };
    effect(
      () => {
        if (store['_state']) {
          console.warn('STATE CHANGED');
          expect(storage.setItem).toHaveBeenLastCalledWith(newState);
          done();
        }
      },
      { injector: store.config.injector! }
    );

    // act
    store.set(newState, 'blbal');
  });
});
