import { Store } from '../lib/store';
import { createEvent, StoreEvent } from '../lib/store-event';
import {
  createRegistry,
  publish,
  register,
  unregister,
} from '../lib/store-mediator';

class DummyStore extends Store<number> {
  constructor() {
    super({ initialState: 0, name: 'Dummy' });
  }
}

function arrayFromOrUndefined<T>(
  iterable: Iterable<T> | ArrayLike<T> | undefined
): T[] | undefined {
  return iterable ? Array.from(iterable) : undefined;
}

describe('register', () => {
  it('should register an event handler in the MediatorRegistry', () => {
    // Arrange
    const registry = createRegistry();
    const storeEvent = createEvent<number>('event1');
    const store = new DummyStore();
    const handler = jest.fn();

    // Act
    register(registry, store, storeEvent, handler);

    // Assert
    const handlers = arrayFromOrUndefined(registry.get(storeEvent));
    expect(handlers).toHaveLength(1);
    expect(handlers?.map(x => x.store.deref())).toContain(store);
    expect(handlers?.map(x => x.handler)).toContain(handler);
  });

  it('should register multiple event handlers for different events', () => {
    // Arrange
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

    // Act
    register(registry, store1, storeEvent1, handler1);
    register(registry, store2, storeEvent2, handler2);
    register(registry, store3, storeEvent3, handler3);

    // Assert
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
    // Arrange
    const registry = createRegistry();
    const storeEvent = createEvent<number>('event');
    const handler1 = jest.fn();
    const handler2 = jest.fn();
    const store1 = new DummyStore();
    const store2 = new DummyStore();

    // Act
    register(registry, store1, storeEvent, handler1);
    register(registry, store2, storeEvent, handler2);

    // Assert
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
    // Arrange
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

    // Act
    publish(registry, storeEvent, paylaod);

    // Assert
    storeEvent.payload = paylaod;
    expect(handler1).toHaveBeenCalledTimes(1);
    expect(handler1).toHaveBeenCalledWith(store1, storeEvent);

    expect(handler2).toHaveBeenCalledTimes(1);
    expect(handler2).toHaveBeenCalledWith(store2, storeEvent);

    expect(handler3).toHaveBeenCalledTimes(1);
    expect(handler3).toHaveBeenCalledWith(store3, storeEvent);
  });
});

describe('unregister', () => {
  it('should remove the associated event handlers for a single store and not chaning anything for other stores', () => {
    // Arrange
    const registry = createRegistry();
    const storeEvent = createEvent<number>('event');
    const handler1 = jest.fn();
    const handler2 = jest.fn();
    const store1 = new DummyStore();
    const store2 = new DummyStore();

    register(registry, store1, storeEvent, handler1);
    register(registry, store2, storeEvent, handler2);

    // Act
    unregister(registry, store1, storeEvent);

    // Assert
    const handlers = arrayFromOrUndefined(registry.get(storeEvent));
    expect(handlers).toHaveLength(1);
    expect(handlers?.map(x => x.store.deref())).not.toContain(store1);
    expect(handlers?.map(x => x.handler)).not.toContain(handler1);
    expect(handlers?.map(x => x.store.deref())).toContain(store2);
    expect(handlers?.map(x => x.handler)).toContain(handler2);
  });

  it('should remove the associated event handlers for a single store for multiple events', () => {
    // Arrange
    const registry = createRegistry();
    const storeEvent1 = createEvent<number>('event1');
    const storeEvent2 = createEvent<string>('event2');
    const handler1 = jest.fn();
    const handler2 = jest.fn();
    const store1 = new DummyStore();

    register(registry, store1, storeEvent1, handler1);
    register(registry, store1, storeEvent2, handler2);

    // Act
    unregister(registry, store1, storeEvent1, storeEvent2);

    // Assert
    expect(registry.get(storeEvent1)).toBeUndefined();
    expect(registry.get(storeEvent2)).toBeUndefined();
  });

  it('should not throw if the store has not attached any handler to the event', () => {
    // Arrange
    const registry = createRegistry();
    const storeEvent = createEvent<number>('event1');
    const handler2 = jest.fn();
    const store1 = new DummyStore();
    const store2 = new DummyStore();

    register(registry, store2, storeEvent, handler2);

    // Act
    const act = () => unregister(registry, store1, storeEvent);

    // Assert
    expect(act).not.toThrow();
  });
});
