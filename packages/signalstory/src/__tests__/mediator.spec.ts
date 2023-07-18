import { Mediator } from '../lib/mediator';
import { StoreEvent } from '../lib/store-event';

describe('Mediator', () => {
  let mediator: Mediator;

  beforeEach(() => {
    mediator = new Mediator();
  });

  it('should publish an event', () => {
    // Arrange
    const event: StoreEvent<number> = { name: 'ExampleEvent' };
    let appliedEvent: StoreEvent<any> | undefined = undefined;

    const handler = jest.fn((event: StoreEvent<any>) => {
      appliedEvent = event;
    });

    mediator.register(event, 'source', handler);

    // Act
    mediator.publish(event, 42);

    // Assert
    expect(appliedEvent).toBeDefined();
    expect(appliedEvent!.payload).toBe(42);
  });

  it('should publish an event without payload', () => {
    // Arrange
    const event: StoreEvent<never> = { name: 'ExampleEvent' };
    let appliedEvent: StoreEvent<any> | undefined = undefined;

    const handler = jest.fn((event: StoreEvent<any>) => {
      appliedEvent = event;
    });

    mediator.register(event, 'source', handler);

    // Act
    mediator.publish(event);

    // Assert
    expect(appliedEvent).toBeDefined();
    expect(appliedEvent!.payload).toBeUndefined();
  });

  it('should throw an error when publishing an event with an invalid name', () => {
    // Arrange
    const event: StoreEvent<number> = { name: '' };

    // Act & Assert
    expect(() => {
      mediator.publish(event, 42);
    }).toThrowError('Invalid event name');
  });

  it('should throw an AggregateError when publishing an event with a handler error', () => {
    // Arrange
    const event: StoreEvent<number> = { name: 'ExampleEvent' };
    const errorHandler = jest.fn().mockImplementation(() => {
      throw new Error('Handler error');
    });

    mediator.register(event, 'source', errorHandler);

    // Act & Assert
    expect(() => {
      mediator.publish(event, 42);
    }).toThrowError(AggregateError);
  });

  it('should replay events for a specific source', () => {
    // Arrange
    const event1: StoreEvent<never> = { name: 'ExampleEvent1' };
    const event2: StoreEvent<number> = { name: 'ExampleEvent2' };
    const handler = jest.fn();

    mediator.publish(event1);
    mediator.publish(event2, 100);

    mediator.register(event1, 'source1', handler);
    mediator.register(event1, 'source2', handler);
    mediator.register(event2, 'source1', handler);
    mediator.register(event2, 'source2', handler);

    // Act
    mediator.replay('source1');

    // Assert
    expect(handler).toHaveBeenCalledTimes(2);
    expect(handler).toHaveBeenCalledWith(event1);
    expect(handler).toHaveBeenCalledWith({
      name: 'ExampleEvent2',
      payload: 100,
    });
  });

  it('should replay all events', () => {
    // Arrange
    const event1: StoreEvent<never> = { name: 'ExampleEvent1' };
    const event2: StoreEvent<number> = { name: 'ExampleEvent2' };
    const handler = jest.fn();

    mediator.publish(event1);
    mediator.publish(event2, 100);

    mediator.register(event1, 'source1', handler);
    mediator.register(event1, 'source2', handler);
    mediator.register(event2, 'source1', handler);
    mediator.register(event2, 'source2', handler);

    // Act
    mediator.replay();

    // Assert
    expect(handler).toHaveBeenCalledTimes(4);
  });
});
