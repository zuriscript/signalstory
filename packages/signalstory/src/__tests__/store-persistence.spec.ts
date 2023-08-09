import { Store } from '../lib/store'; // Import the necessary types and classes
import { StoreConfig } from '../lib/store-config';
import {
  clearStorage,
  loadFromStorage,
  saveToStorage,
} from '../lib/store-persistence'; // Import the functions to be tested
import { registerAndGetStore } from './helpers';

describe('store-persistence', () => {
  // Mocks for StoreConfig and StorePersistence
  const mockStoreConfig: StoreConfig<number> = {
    initialState: 0,
    name: 'TestStore',
    enableStateHistory: true,
    enableEffectsAndQueries: true,
    enablePersistence: true,
    persistenceKey: 'test-store-key',
    persistenceStorage: {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
    },
  };

  // Mock Store instance for testing
  const mockStore = new Store(mockStoreConfig);

  // Mocked values for local storage interactions
  const mockStoredValue = JSON.stringify(42);

  beforeEach(() => {
    jest.clearAllMocks();
  });
});

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
    // Arrange
    store.config.persistenceStorage.getItem = jest.fn(() =>
      JSON.stringify(initialValue)
    );

    // Act
    const loadedValue = loadFromStorage(store);

    // Assert
    expect(loadedValue).toStrictEqual(initialValue);
    expect(store.config.persistenceStorage.getItem).toHaveBeenCalledWith(
      store.config.persistenceKey
    );
  });

  it('should return undefined when unable to parse the stored value', () => {
    // Arrange
    store.config.persistenceStorage.getItem = jest.fn(() => 'INVALID STATE');

    // Act
    const loadedValue = loadFromStorage(store);

    // Assert
    expect(loadedValue).toBeUndefined();
    expect(store.config.persistenceStorage.getItem).toHaveBeenCalledWith(
      store.config.persistenceKey
    );
  });

  it('should return undefined when no stored value is available', () => {
    // Arrange
    store.config.persistenceStorage.getItem = jest.fn(() => null);

    // Act
    const loadedValue = loadFromStorage(store);

    // Assert
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
    store = new Store({
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
    // Arrange & Act
    saveToStorage(store);

    // Assert
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
    store = new Store({
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
    // Act
    clearStorage(store);

    // Assert
    expect(store.config.persistenceStorage!.removeItem).toHaveBeenCalledWith(
      store.config.persistenceKey
    );
  });
});
