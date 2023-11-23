/* eslint-disable tree-shaking/no-side-effects-in-initialization */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  naiveCloneAndMutateFunc,
  naiveDeepClone,
  shallowClone,
} from '../lib/store-immutability/immutable-utility';

describe('naiveDeepClone', () => {
  it('should deeply clone a given state object', () => {
    // Arrange
    const initialState = { a: 1, b: { c: 2 } };

    // Act
    const clonedState = naiveDeepClone(initialState);

    // Assert
    expect(clonedState).toEqual(initialState);
    expect(clonedState).not.toBe(initialState);
  });

  it('should handle empty object', () => {
    // Arrange
    const initialState = {};

    // Act
    const clonedState = naiveDeepClone(initialState);

    // Assert
    expect(clonedState).toEqual(initialState);
    expect(clonedState).not.toBe(initialState);
  });

  it('should handle empty array', () => {
    // Arrange
    const initialState: any[] = [];

    // Act
    const clonedState = naiveDeepClone(initialState);

    // Assert
    expect(clonedState).toEqual(initialState);
    expect(clonedState).not.toBe(initialState);
  });

  it('should handle deep objects and arrays', () => {
    // Arrange
    const initialState = {
      a: [1, 2, { x: 3 }],
      b: { c: { d: [4, { y: 5 }] } },
    };

    // Act
    const clonedState = naiveDeepClone(initialState);

    // Assert
    expect(clonedState).toEqual(initialState);
    expect(clonedState).not.toBe(initialState);
  });
});

describe('naiveCloneAndMutate', () => {
  it('should apply a mutation to a cloned state', () => {
    // Arrange
    const initialState = { a: 1, b: { c: 2 } };
    const mutation = (state: any) => {
      state.a = 42;
      state.b.c = 99;
    };

    // Act
    const newState = naiveCloneAndMutateFunc(initialState, mutation);

    // Assert
    expect(newState).not.toBe(initialState);
    expect(newState.a).toBe(42);
    expect(newState.b.c).toBe(99);
    expect(initialState.a).toBe(1);
    expect(initialState.b.c).toBe(2);
  });

  it('should not modify the original state when mutation fails', () => {
    // Arrange
    const initialState = { a: 1 };
    const mutation = () => {
      throw new Error('Mutation error');
    };

    // Act
    try {
      naiveCloneAndMutateFunc(initialState, mutation);
    } catch (_) {
      /* empty */
    }

    // Assert
    expect(initialState.a).toEqual(1);
  });

  it('should handle empty initial state', () => {
    // Arrange
    const initialState = {};
    const mutation = (state: any) => {
      state.a = 42;
    };

    // Act
    const newState = naiveCloneAndMutateFunc(initialState, mutation);

    // Assert
    expect(newState).toEqual({ a: 42 });
  });
});

describe('shallowClone', () => {
  const truthyObjectsTestCases = [
    { name: 'Date object', original: new Date() },
    { name: 'Empty object', original: {} },
    { name: 'Object with values', original: { val: 10 } },
    { name: 'Empty array', original: [] },
    { name: 'Array with values', original: [1, 2, 3] },
    { name: 'RegExp object', original: /pattern/ },
    { name: 'Set object', original: new Set([1, 2, 3]) },
    {
      name: 'Map object',
      original: new Map([
        ['key1', 'value1'],
        ['key2', 'value2'],
      ]),
    },
    {
      name: 'Nested object',
      original: { a: { b: { c: 'value' } } },
    },
    {
      name: 'Nested array',
      original: [[1, 2, 3], [4, 5, 6], [{ val: 1 }]],
    },
    {
      name: 'Mixed Data Types',
      original: { a: 1, b: 'two', c: [3, 4, { d: 'five' }], e: new Date() },
    },
  ];

  test.each(truthyObjectsTestCases)(
    'should shallow clone %s',
    ({ original }) => {
      // Act
      const cloned = shallowClone(original);

      // Assert
      expect(cloned).toEqual(original);
      expect(cloned).not.toBe(original);
    }
  );

  it('should handle regular primitives and strings', () => {
    // Arrange
    const numberValue = 42;
    const booleanValue = true;
    const stringValue = 'hello';

    // Act
    const resultNumber = shallowClone(numberValue);
    const resultBoolean = shallowClone(booleanValue);
    const resultString = shallowClone(stringValue);

    // Assert
    expect(resultNumber).toBe(numberValue);
    expect(resultBoolean).toBe(booleanValue);
    expect(resultString).toBe(stringValue);
  });

  it('should handle falsy primitives and strings', () => {
    // Arrange
    const numberValue = 0;
    const booleanValue = false;
    const stringValue = '';

    // Act
    const resultNumber = shallowClone(numberValue);
    const resultBoolean = shallowClone(booleanValue);
    const resultString = shallowClone(stringValue);

    // Assert
    expect(resultNumber).toBe(numberValue);
    expect(resultBoolean).toBe(booleanValue);
    expect(resultString).toBe(stringValue);
  });

  it('should handle null and undefined', () => {
    // Arrange
    const nullValue = null;
    const undefinedValue = undefined;

    // Act
    const resultNull = shallowClone(nullValue);
    const resultUndefined = shallowClone(undefinedValue);

    // Assert
    expect(resultNull).toBe(nullValue);
    expect(resultUndefined).toBe(undefinedValue);
  });
});
