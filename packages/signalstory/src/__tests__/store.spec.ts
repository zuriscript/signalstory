import { inject } from '@angular/core';
import { ImmutableStore } from '../lib/immutable-store';
import { Store } from '../lib/store';
import { rootRegistry } from '../lib/store-mediator';
import { createEffect, createEvent, createQuery } from '../public-api';
import {
  ImmutableTestStore,
  TestStore,
  arrayFromOrUndefined,
  registerAndGetStores,
} from './helper';

describe('constructor', () => {
  it('should initialize primitive store with the provided initial state', () => {
    // arrange
    const initialState = 5;

    // act
    const store = new Store({ initialState: initialState });

    // assert
    expect(store.state()).toBe(initialState);
  });

  it('should initialize object store with the provided initial state', () => {
    // arrange
    const initialState = { value: 5 };

    // act
    const store = new Store({ initialState: initialState });

    // assert
    expect(store.state()).toBe(initialState);
  });
});

describe('set', () => {
  it('should update primitive store with the provided new state', () => {
    // arrange
    const store = new Store({ initialState: 5 });
    const newState = 10;

    // act
    store.set(newState);

    // assert
    expect(store.state()).toBe(newState);
  });

  it('should update object store with the provided new state', () => {
    // arrange
    const store = new Store({ initialState: { value: 5 } });
    const newState = { value: 10 };

    // act
    store.set(newState);

    // assert
    expect(store.state()).toBe(newState);
  });
});

describe('update', () => {
  it('should update primitive store with the provided new state', () => {
    // arrange
    const store = new Store({ initialState: 5 });
    const newState = 10;

    // act
    store.update(_ => newState);

    // assert
    expect(store.state()).toBe(newState);
  });

  it('should update object store with the provided new state', () => {
    // arrange
    const store = new Store({ initialState: { value: 5 } });
    const newState = { value: 10 };

    // act
    store.update(_ => newState);

    // assert
    expect(store.state()).toBe(newState);
  });
});

describe('mutate', () => {
  it('should update store with the provided mutation function', () => {
    // arrange
    const initialState = { value: 5 };
    const store = new Store({ initialState: initialState });
    const newStateValue = 10;

    // act
    store.mutate(state => {
      state.value = newStateValue;
    });

    // assert
    expect(store.state()).toBe(initialState);
    expect(store.state().value).toBe(newStateValue);
  });
});

describe('registerHandler', () => {
  let store: Store<{ value: number }>;

  beforeEach(() => {
    store = new Store<{ value: number }>({ initialState: { value: 10 } });
  });

  it('should register Handler in rootRegistry', () => {
    // arrange
    const event = createEvent<number>('event');

    // act
    store.registerHandler(event, () => {});

    // assert
    const handlers = arrayFromOrUndefined(rootRegistry.get(event));
    expect(handlers?.map(x => x.store.deref())).toContain(store);
  });

  it('should register multiple Handler for same store and event in rootRegistry', () => {
    // arrange
    const event = createEvent<number>('event');
    const func1 = () => {};
    const func2 = () => 5;

    // act
    store.registerHandler(event, func1);
    store.registerHandler(event, func2);

    // assert
    const storeHandlers = arrayFromOrUndefined(rootRegistry.get(event))?.filter(
      x => x.store.deref() === store
    );
    expect(storeHandlers).toHaveLength(2);
    expect(storeHandlers?.map(x => x.handler)).toStrictEqual([func1, func2]);
  });
});

describe('unregisterHandler', () => {
  let store: Store<{ value: number }>;

  beforeEach(() => {
    store = new Store<{ value: number }>({ initialState: { value: 10 } });
  });

  it('should unregister existing Handler in rootRegistry', () => {
    // arrange
    const event = createEvent<number>('event');
    store.registerHandler(event, () => {});

    // act
    store.unregisterHandler(event);

    // assert
    expect(rootRegistry.get(event)).toBeUndefined();
  });

  it('should not throw if no Handler exists in rootRegistry', () => {
    // arrange
    const event = createEvent<number>('event');

    // act
    const act = () => store.unregisterHandler(event);

    // assert
    expect(act).not.toThrow();
  });

  it('should unregister multiple existing Handler for same event and store in rootRegistry', () => {
    // arrange
    const event = createEvent<number>('event');
    store.registerHandler(event, () => {});
    store.registerHandler(event, () => 5);

    // act
    store.unregisterHandler(event);

    // assert
    expect(rootRegistry.get(event)).toBeUndefined();
  });
});

describe('runEffect', () => {
  let initialState = {};
  let store: Store<{ value: number }>;
  let supportingStore: ImmutableStore<{ value: number }>;

  beforeEach(() => {
    initialState = { value: 10 };
    [store, supportingStore] = registerAndGetStores({
      initialState: initialState,
    });
  });

  it('should runEffect', () => {
    // arrange
    const func = jest.fn();
    const effect = createEffect('effect', func);
    const argument = 42;

    // act
    store.runEffect(effect, argument);

    // assert
    expect(func).toHaveBeenCalledTimes(1);
    expect(func).toHaveBeenCalledWith(store, argument);
  });

  it('should runEffect in injection context', () => {
    // arrange
    const argumentFunc = jest.fn();
    const effect = createEffect('effect', (_, arg) => {
      const store2 = inject(ImmutableTestStore);
      arg(store2);
    });

    // act
    store.runEffect(effect, argumentFunc);

    // assert
    expect(argumentFunc).toHaveBeenCalledTimes(1);
    expect(argumentFunc).toHaveBeenCalledWith(supportingStore);
  });
});

describe('runQuery', () => {
  let initialState = {};
  let store: Store<{ value: number }>;
  let supportingStore: ImmutableStore<{ value: number }>;

  beforeEach(() => {
    initialState = { value: 10 };
    [store, supportingStore] = registerAndGetStores({
      initialState: initialState,
    });
  });

  it('targeting single store without parameters should return correct computed signal', () => {
    // arrange
    const query = createQuery([TestStore], store => store.state());

    // act
    const result = store.runQuery(query)();

    // assert
    expect(result).toBe(initialState);
  });

  it('targeting single store with parameters should return correct computed signal', () => {
    // arrange
    const summandArg = 45;
    const query = createQuery(
      [TestStore],
      (store: TestStore, summand: number) => store.state().value + summand
    );

    // act
    const result = store.runQuery(query, summandArg)();

    // assert
    expect(result).toBe(store.state().value + summandArg);
  });

  it('targeting multiple stores without parameters should return correct computed signal', () => {
    // arrange
    const query = createQuery(
      [TestStore, ImmutableTestStore],
      (store1, store2) => store1.state().value + store2.state().value
    );

    // act
    const result = store.runQuery(query)();

    // assert
    expect(result).toBe(store.state().value + supportingStore.state().value);
  });

  it('targeting multiple stores with parameters should return correct computed signal', () => {
    // arrange
    const summandArg = 33;
    const query = createQuery(
      [TestStore, ImmutableTestStore],
      (store1, store2, summand: number) =>
        store1.state().value + store2.state().value + summand
    );

    // act
    const result = store.runQuery(query, summandArg)();

    // assert
    expect(result).toBe(
      store.state().value + supportingStore.state().value + summandArg
    );
  });
});
