import { Store } from '../lib/store'; // Import the necessary types and classes
import {
  clearStorage,
  loadFromStorage,
  saveToStorage,
} from '../lib/store-persistence'; // Import the functions to be tested
import { registerAndGetStore } from './helper';

describe('loadFromStorage', () => {
  const initialValue = { val: 'initial' };
  let store: Store<{ val: string }>;

  beforeEach(() => {
    store = registerAndGetStore({
      initialState: initialValue,
      enablePersistence: true,
      persistenceStorage: {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
      },
    });
  });

  it('should load the stored value from persistence storage', () => {
    // arrange
    store.config.persistenceStorage.getItem = jest.fn(() =>
      JSON.stringify(initialValue)
    );

    // act
    const loadedValue = loadFromStorage(store);

    // assert
    expect(loadedValue).toStrictEqual(initialValue);
    expect(store.config.persistenceStorage.getItem).toHaveBeenCalledWith(
      store.config.persistenceKey
    );
  });

  it('should return undefined when unable to parse the stored value', () => {
    // arrange
    store.config.persistenceStorage.getItem = jest.fn(() => 'INVALID STATE');

    // act
    const loadedValue = loadFromStorage(store);

    // assert
    expect(loadedValue).toBeUndefined();
    expect(store.config.persistenceStorage.getItem).toHaveBeenCalledWith(
      store.config.persistenceKey
    );
  });

  it('should return undefined when no stored value is available', () => {
    // arrange
    store.config.persistenceStorage.getItem = jest.fn(() => null);

    //act
    const loadedValue = loadFromStorage(store);

    // assert
    expect(loadedValue).toBeUndefined();
    expect(store.config.persistenceStorage.getItem).toHaveBeenCalledWith(
      store.config.persistenceKey
    );
  });
});

describe('saveToStorage', () => {
  const initialValue = { val: 'initial' };
  let store: Store<{ val: string }>;

  beforeEach(() => {
    store = registerAndGetStore({
      initialState: initialValue,
      enablePersistence: true,
      persistenceStorage: {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
      },
    });
  });

  it('should save the store state to persistence storage', () => {
    // act
    saveToStorage(store, store.state());

    // assert
    expect(store.config.persistenceStorage.setItem).toHaveBeenCalledWith(
      store.config.persistenceKey,
      JSON.stringify(store.state())
    );
  });
});

describe('clearStorage', () => {
  const initialValue = { val: 'initial' };
  let store: Store<{ val: string }>;

  beforeEach(() => {
    store = registerAndGetStore({
      initialState: initialValue,
      enablePersistence: true,
      persistenceStorage: {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
      },
    });
  });
  it('should remove the stored value from persistence storage', () => {
    // act
    clearStorage(store);

    // assert
    expect(store.config.persistenceStorage!.removeItem).toHaveBeenCalledWith(
      store.config.persistenceKey
    );
  });
});
