import { ImmutableStore } from '../lib/immutable-store';
import { rootRegistry } from '../lib/store-mediator';
import { createEffect, createEvent, createQuery } from '../public-api';
import {
  ImmutableTestStore,
  arrayFromOrUndefined,
  registerAndGetImmutableStore,
} from './helper';

describe('constructor', () => {
  it('should initialize object store with the provided initial state', () => {
    // arrange
    const initialState = { value: 5 };

    // act
    const store = new ImmutableStore({ initialState: initialState });

    // assert
    expect(store.state()).toBe(initialState);
  });
});

describe('set', () => {
  it('should update object store with the provided new state', () => {
    // arrange
    const store = new ImmutableStore<{ value: number }>({
      initialState: { value: 5 },
    });
    const newState = { value: 10 };

    // act
    store.set(newState);

    // assert
    expect(store.state()).toBe(newState);
  });
});

describe('update', () => {
  it('should update object store with the provided new state', () => {
    // arrange
    const store = new ImmutableStore<{ value: number }>({
      initialState: { value: 5 },
    });
    const newState = { value: 10 };

    // act
    store.update(_ => newState);

    // assert
    expect(store.state()).toBe(newState);
  });
});

describe('mutate', () => {
  it('should update store with the provided mutation function creating a new instance', () => {
    // arrange
    const initialState = { value1: 5, value2: 'test' };
    const store = new ImmutableStore<{ value1: number; value2: string }>({
      initialState: initialState,
    });
    const newStateValue = 10;

    // act
    store.mutate(state => {
      state.value1 = newStateValue;
    });

    // assert
    expect(store.state()).not.toBe(initialState);
    expect(store.state().value1).toBe(newStateValue);
    expect(store.state().value2).toBe(initialState.value2);
  });
});

describe('registerHandler', () => {
  it('should register Handler in rootRegistry', () => {
    // arrange
    const store = new ImmutableStore<{ value: number }>({
      initialState: { value: 10 },
    });
    const event = createEvent<number>('event');

    // act
    store.registerHandler(event, () => {});

    // assert
    const handlers = arrayFromOrUndefined(rootRegistry.get(event));
    expect(handlers?.map(x => x.store.deref())).toContain(store);
  });
});

describe('unregisterHandler', () => {
  it('should unregister existing Handler in rootRegistry', () => {
    // arrange
    const store = new ImmutableStore<{ value: number }>({
      initialState: { value: 10 },
    });
    const event = createEvent<number>('event');
    store.registerHandler(event, () => {});

    // act
    store.unregisterHandler(event);

    // assert
    expect(rootRegistry.get(event)).toBeUndefined();
  });
});

describe('runEffect', () => {
  it('should runEffect', () => {
    // arrange
    const store = new ImmutableStore<{ value: number }>({
      initialState: { value: 10 },
    });
    const func = jest.fn();
    const effect = createEffect('effect', func);
    const argument = 42;

    // act
    store.runEffect(effect, argument);

    // assert
    expect(func).toHaveBeenCalledTimes(1);
    expect(func).toHaveBeenCalledWith(store, argument);
  });
});

describe('runQuery', () => {
  it('targeting single store without parameters should return correct computed signal', () => {
    // arrange
    const initialState = { value: 10 };
    const store = registerAndGetImmutableStore({
      initialState: initialState,
      enableEffectsAndQueryObjects: true,
    });
    const query = createQuery([ImmutableTestStore], store => store.state());

    // act
    const result = store.runQuery(query)();

    // assert
    expect(result).toBe(initialState);
  });

  it('targeting single store with parameters should return correct computed signal', () => {
    // arrange
    const initialState = { value: 10 };
    const store = registerAndGetImmutableStore({
      initialState: initialState,
      enableEffectsAndQueryObjects: true,
    });
    const summandArg = 45;
    const query = createQuery(
      [ImmutableTestStore],
      (store: ImmutableTestStore, summand: number) =>
        store.state().value + summand
    );

    // act
    const result = store.runQuery(query, summandArg)();

    // assert
    expect(result).toBe(store.state().value + summandArg);
  });
});
