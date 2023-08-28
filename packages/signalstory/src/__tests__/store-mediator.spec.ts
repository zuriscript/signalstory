/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable tree-shaking/no-side-effects-in-initialization */
import { Store } from '../lib/store';
import { createEvent, StoreEvent } from '../lib/store-event';
import {
  createRegistry,
  publish,
  publishStoreEvent,
  register,
  rootRegistry,
  unregister,
} from '../lib/store-mediator';
import { arrayFromOrUndefined } from './helper';

class DummyStore extends Store<number> {
  constructor() {
    super({ initialState: 0, name: 'Dummy' });
  }
}

describe('register', () => {
  it('should register an event handler in the MediatorRegistry', () => {
    // arrange
    const registry = createRegistry();
    const storeEvent = createEvent<number>('event1');
    const store = new DummyStore();
    const handler = jest.fn();

    // act
    register(registry, store, storeEvent, handler);

    // assert
    const handlers = arrayFromOrUndefined(registry.get(storeEvent));
    expect(handlers).toHaveLength(1);
    expect(handlers?.map(x => x.store.deref())).toContain(store);
    expect(handlers?.map(x => x.handler)).toContain(handler);
  });

  it('should register multiple event handlers for different events', () => {
    // arrange
    const registry = createRegistry();
    const storeEvent1 = createEvent<number>('event1');
    const storeEvent2 = createEvent<string>('event2');
    const storeEvent3 = createEvent<boolean>('event3');
    const store1 = new DummyStore();
    const store2 = new DummyStore();
    const store3 = new DummyStore();
    const handler1 = jest.fn();
    const handler2 = jest.fn();
    const handler3 = jest.fn();

    // act
    register(registry, store1, storeEvent1, handler1);
    register(registry, store2, storeEvent2, handler2);
    register(registry, store3, storeEvent3, handler3);

    // assert
    const assertForEvent = (
      event: StoreEvent<any>,
      store: any,
      handler: any
    ) => {
      const handlersForEvent = arrayFromOrUndefined(registry.get(event));
      expect(handlersForEvent).toHaveLength(1);
      expect(handlersForEvent?.map(x => x.store.deref())).toContain(store);
      expect(handlersForEvent?.map(x => x.handler)).toContain(handler);
    };

    assertForEvent(storeEvent1, store1, handler1);
    assertForEvent(storeEvent2, store2, handler2);
    assertForEvent(storeEvent3, store3, handler3);
  });

  it('should register multiple event handlers for the same event', () => {
    // arrange
    const registry = createRegistry();
    const storeEvent = createEvent<number>('event');
    const handler1 = jest.fn();
    const handler2 = jest.fn();
    const store1 = new DummyStore();
    const store2 = new DummyStore();

    // act
    register(registry, store1, storeEvent, handler1);
    register(registry, store2, storeEvent, handler2);

    // assert
    const handlers = arrayFromOrUndefined(registry.get(storeEvent));
    expect(handlers).toHaveLength(2);
    expect(handlers?.map(x => x.store.deref())).toContain(store1);
    expect(handlers?.map(x => x.store.deref())).toContain(store2);
    expect(handlers?.map(x => x.handler)).toContain(handler1);
    expect(handlers?.map(x => x.handler)).toContain(handler2);
  });
});

describe('publish', () => {
  it('should execute the associated event handlers for a single event', () => {
    // arrange
    const registry = createRegistry();
    const storeEvent = createEvent<number>('event');
    const paylaod = 42;
    const handler1 = jest.fn();
    const handler2 = jest.fn();
    const handler3 = jest.fn();
    const store1 = new DummyStore();
    const store2 = new DummyStore();
    const store3 = new DummyStore();

    register(registry, store1, storeEvent, handler1);
    register(registry, store2, storeEvent, handler2);
    register(registry, store3, storeEvent, handler3);

    // act
    publish(registry, storeEvent, paylaod);

    // assert
    storeEvent.payload = paylaod;
    expect(handler1).toHaveBeenCalledTimes(1);
    expect(handler1).toHaveBeenCalledWith(store1, storeEvent);

    expect(handler2).toHaveBeenCalledTimes(1);
    expect(handler2).toHaveBeenCalledWith(store2, storeEvent);

    expect(handler3).toHaveBeenCalledTimes(1);
    expect(handler3).toHaveBeenCalledWith(store3, storeEvent);
  });
  it('should execute the associated event handlers for a single event and store', () => {
    // arrange
    const registry = createRegistry();
    const storeEvent = createEvent<number>('event');
    const paylaod = 42;
    const handler1 = jest.fn();
    const handler2 = jest.fn();
    const store = new DummyStore();

    register(registry, store, storeEvent, handler1);
    register(registry, store, storeEvent, handler2);

    // act
    publish(registry, storeEvent, paylaod);

    // assert
    storeEvent.payload = paylaod;
    expect(handler1).toHaveBeenCalledTimes(1);
    expect(handler1).toHaveBeenCalledWith(store, storeEvent);

    expect(handler2).toHaveBeenCalledTimes(1);
    expect(handler2).toHaveBeenCalledWith(store, storeEvent);
  });
});

describe('publishStoreEvent', () => {
  it('should execute the associated event handlers for a single event', () => {
    // arrange
    const storeEvent = createEvent<number>('event');
    const paylaod = 42;
    const handler1 = jest.fn();
    const handler2 = jest.fn();
    const handler3 = jest.fn();
    const store1 = new DummyStore();
    const store2 = new DummyStore();

    register(rootRegistry, store1, storeEvent, handler1);
    register(rootRegistry, store1, storeEvent, handler2);
    register(rootRegistry, store2, storeEvent, handler3);

    // act
    publishStoreEvent(storeEvent, paylaod);

    // assert
    storeEvent.payload = paylaod;
    expect(handler1).toHaveBeenCalledTimes(1);
    expect(handler1).toHaveBeenCalledWith(store1, storeEvent);

    expect(handler2).toHaveBeenCalledTimes(1);
    expect(handler2).toHaveBeenCalledWith(store1, storeEvent);

    expect(handler3).toHaveBeenCalledTimes(1);
    expect(handler3).toHaveBeenCalledWith(store2, storeEvent);
  });
});

describe('unregister', () => {
  it('should remove the associated event handlers for a single store and not chaning anything for other stores', () => {
    // arrange
    const registry = createRegistry();
    const storeEvent = createEvent<number>('event');
    const handler1 = jest.fn();
    const handler2 = jest.fn();
    const store1 = new DummyStore();
    const store2 = new DummyStore();

    register(registry, store1, storeEvent, handler1);
    register(registry, store2, storeEvent, handler2);

    // act
    unregister(registry, store1, storeEvent);

    // assert
    const handlers = arrayFromOrUndefined(registry.get(storeEvent));
    expect(handlers).toHaveLength(1);
    expect(handlers?.map(x => x.store.deref())).not.toContain(store1);
    expect(handlers?.map(x => x.handler)).not.toContain(handler1);
    expect(handlers?.map(x => x.store.deref())).toContain(store2);
    expect(handlers?.map(x => x.handler)).toContain(handler2);
  });

  it('should remove the associated event handlers for a single store for multiple events', () => {
    // arrange
    const registry = createRegistry();
    const storeEvent1 = createEvent<number>('event1');
    const storeEvent2 = createEvent<string>('event2');
    const handler1 = jest.fn();
    const handler2 = jest.fn();
    const store1 = new DummyStore();

    register(registry, store1, storeEvent1, handler1);
    register(registry, store1, storeEvent2, handler2);

    // act
    unregister(registry, store1, storeEvent1, storeEvent2);

    // assert
    expect(registry.get(storeEvent1)).toBeUndefined();
    expect(registry.get(storeEvent2)).toBeUndefined();
  });

  it('should not throw if the store has not attached any handler to the event', () => {
    // arrange
    const registry = createRegistry();
    const storeEvent = createEvent<number>('event1');
    const handler2 = jest.fn();
    const store1 = new DummyStore();
    const store2 = new DummyStore();

    register(registry, store2, storeEvent, handler2);

    // act
    const act = () => unregister(registry, store1, storeEvent);

    // assert
    expect(act).not.toThrow();
  });
});
