/* eslint-disable tree-shaking/no-side-effects-in-initialization */
import { computed } from '@angular/core';
import { ImmutableStore } from '../lib/store-immutability/immutable-store';
import { deepFreeze } from '../lib/store-plugin-deep-freeze/deep-freeze';
import { useDeepFreeze } from '../lib/store-plugin-deep-freeze/plugin-deep-freeze';

describe('deepFreeze', () => {
  it('should freeze all properties', () => {
    const state = {
      pString: '',
      pNumber: 5,
      pBoolean: true,
      pDate: new Date(),
      pObject: {
        pString: 'Ha',
        pNumber: 10,
        pObject: {
          pString: 'In',
        },
      },
      pArray: [
        {
          pString: 'Hallo',
          pNumber: 20,
        },
      ],
    };

    deepFreeze(state);

    expect(Object.isFrozen(state.pString)).toBeTruthy();
    expect(Object.isFrozen(state.pNumber)).toBeTruthy();
    expect(Object.isFrozen(state.pBoolean)).toBeTruthy();
    expect(Object.isFrozen(state.pDate)).toBeTruthy();
    expect(Object.isFrozen(state.pObject)).toBeTruthy();
    expect(Object.isFrozen(state.pObject.pString)).toBeTruthy();
    expect(Object.isFrozen(state.pObject.pNumber)).toBeTruthy();
    expect(Object.isFrozen(state.pObject.pObject)).toBeTruthy();
    expect(Object.isFrozen(state.pObject.pObject.pString)).toBeTruthy();
    expect(Object.isFrozen(state.pArray)).toBeTruthy();
    expect(Object.isFrozen(state.pArray[0].pString)).toBeTruthy();
    expect(Object.isFrozen(state.pArray[0].pNumber)).toBeTruthy();
  });
});

describe('DeepFreeze plugin', () => {
  let store: ImmutableStore<{ pString: string }>;

  beforeEach(() => {
    store = new ImmutableStore<{ pString: string }>({
      initialState: { pString: '' },
      plugins: [useDeepFreeze()],
    });
  });

  it('should deep freeze after set without creating new object', () => {
    // arrange
    const newState = { pString: 'Ha' };

    // act
    store.set(newState);

    // assert
    expect(Object.isFrozen(store.state())).toBeTruthy();
    expect(store.state()).toBe(newState);
  });

  it('should deep freeze after update without creating new object', () => {
    // arrange
    const newState = { pString: 'Ha' };

    // act
    store.update(() => newState);

    // assert
    expect(Object.isFrozen(store.state())).toBeTruthy();
    expect(store.state()).toBe(newState);
  });

  it('should deep freeze after mutate', () => {
    // act
    store.mutate(state => (state.pString = 'New'));

    // assert
    expect(Object.isFrozen(store.state())).toBeTruthy();
  });

  it('should not notify changes after deep freeze', () => {
    // arrange
    let computeCount = 0;
    const derived = computed(() => `${typeof store.state()}:${++computeCount}`);
    expect(derived()).toEqual('object:1'); // sanity check

    // act && assert
    store.set({ pString: 'NewSet' });
    expect(derived()).toEqual('object:2');

    // act && assert
    store.update(() => ({ pString: 'NewUpdate' }));
    expect(derived()).toEqual('object:3');

    // act && assert
    store.mutate(() => ({ pString: 'NewMutate' }));
    expect(derived()).toEqual('object:4');
  });
});
