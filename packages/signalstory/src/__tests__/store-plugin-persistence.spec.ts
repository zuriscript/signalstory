/* eslint-disable tree-shaking/no-side-effects-in-initialization */
import { Store } from '../lib/store';
import { SyncStorage } from '../lib/store-plugin-persistence/persistence-sync-storage';
import {
  clearStoreStorage,
  useStorePersistence,
} from '../lib/store-plugin-persistence/plugin-persistence';
import { registerAndGetStore } from './helper';

describe('load from storage', () => {
  let storage: SyncStorage;
  const key = 'key';

  beforeEach(() => {
    storage = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
    };
  });

  it('should load the stored value from persistence storage on init', () => {
    // arrange
    const storedValue = { val: 'stored' };
    storage.getItem = jest.fn(() => JSON.stringify(storedValue));

    // act
    const store = new Store({
      initialState: { val: 'dummy' },
      plugins: [
        useStorePersistence({
          persistenceStorage: storage,
          persistenceKey: key,
        }),
      ],
    });

    // assert
    expect(store.state()).toStrictEqual(storedValue);
    expect(storage.getItem).toHaveBeenCalledWith(key);
  });

  it('should not set initial state when unable to parse the stored value', () => {
    // arrange
    const stateBeforeInit = { val: 'dummy' };
    storage.getItem = jest.fn(() => 'INVALID STATE');

    // act
    const store = new Store({
      initialState: stateBeforeInit,
      plugins: [
        useStorePersistence({
          persistenceStorage: storage,
          persistenceKey: key,
        }),
      ],
    });

    // assert
    expect(store.state()).toStrictEqual(stateBeforeInit);
    expect(storage.getItem).toHaveBeenCalledWith(key);
  });

  it('should not set initial state when there is no stored value', () => {
    // arrange
    const stateBeforeInit = { val: 'dummy' };
    storage.getItem = jest.fn(() => null);

    //act
    const store = new Store({
      initialState: stateBeforeInit,
      plugins: [
        useStorePersistence({
          persistenceStorage: storage,
          persistenceKey: key,
        }),
      ],
    });

    // assert
    expect(store.state()).toStrictEqual(stateBeforeInit);
    expect(storage.getItem).toHaveBeenCalledWith(key);
  });
});

describe('save to storage', () => {
  const key = 'myStoreKey';
  let store: Store<{ val: string }>;
  let storage: SyncStorage;

  beforeEach(() => {
    storage = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
    };
    store = registerAndGetStore({
      initialState: { val: 'initial' },
      plugins: [
        useStorePersistence({
          persistenceKey: key,
          persistenceStorage: storage,
        }),
      ],
    });
  });

  it('should save the store state to persistence storage on set', () => {
    // arrange
    const newValue = { val: 'newValue' };

    // act
    store.set(newValue);

    // assert
    expect(storage.setItem).toHaveBeenCalledWith(key, JSON.stringify(newValue));
  });

  it('should save the store state to persistence storage on update', () => {
    // arrange
    const newValue = { val: 'newValue' };

    // act
    store.update(() => newValue);

    // assert
    expect(storage.setItem).toHaveBeenCalledWith(key, JSON.stringify(newValue));
  });

  it('should save the store state to persistence storage on mutate', () => {
    // arrange
    let newValue: { val: string } | undefined;

    // act
    store.mutate(state => {
      state.val = 'newValue';
      newValue = state;
    });

    // assert
    expect(storage.setItem).toHaveBeenCalledWith(key, JSON.stringify(newValue));
  });
});

describe('clearStorage', () => {
  const key = 'myStoreKey';
  let store: Store<{ val: string }>;
  let storage: SyncStorage;

  beforeEach(() => {
    storage = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
    };
    store = registerAndGetStore({
      initialState: { val: 'initial' },
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
