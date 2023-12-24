/* eslint-disable tree-shaking/no-side-effects-in-initialization */
import { delay, lastValueFrom, of, tap } from 'rxjs';
import { Store } from '../lib/store';
import { createEffect } from '../lib/store-effect';
import {
  isAnyEffectRunning,
  isEffectRunning,
  isLoading,
  isModified,
  markAsHavingNoRunningEffects,
  markAsUnmodified,
  runningEffects,
  useStoreStatus,
} from '../lib/store-plugin-status/plugin-status';

describe('StoreStatusPlugin', () => {
  it('should be created using plugin factory method', () => {
    // act
    const store = new Store<{ val: number }>({
      initialState: { val: 5 },
      plugins: [useStoreStatus()],
    });

    // assert
    expect(store['initPostprocessor']).toHaveLength(1);
    expect(store['commandPreprocessor']).toBeUndefined();
    expect(store['commandPostprocessor']).toHaveLength(1);
    expect(store['effectPreprocessor']).toHaveLength(1);
    expect(store['effectPostprocessor']).toHaveLength(1);
  });

  describe('Running effect', () => {
    let store: Store<{ value: number }>;
    const initialValue = 10;

    beforeEach(() => {
      store = new Store<{ value: number }>({
        initialState: { value: initialValue },
        plugins: [useStoreStatus()],
      });
      runningEffects.set([]);
    });

    it('should register observable efffect while it runs', async () => {
      // arrange
      const effect = createEffect('dummyEffect', () =>
        of(0).pipe(
          tap(() => {
            expect(runningEffects()).toHaveLength(1);
            expect(runningEffects()[0][1]).toBe(effect);
          })
        )
      );

      // act & assert
      expect(runningEffects()).toHaveLength(0);

      await lastValueFrom(store.runEffect(effect));

      expect(runningEffects()).toHaveLength(0);
    });

    it('should register throwing observable efffect while it runs', async () => {
      // arrange
      const effect = createEffect('dummyEffect', () =>
        of(0).pipe(
          tap(() => {
            expect(runningEffects()).toHaveLength(1);
            expect(runningEffects()[0][1]).toBe(effect);
            throw new Error('Error');
          })
        )
      );

      // act & assert
      expect(runningEffects()).toHaveLength(0);

      try {
        await lastValueFrom(store.runEffect(effect));
      } catch (_) {
        /* empty */
      }

      expect(runningEffects()).toHaveLength(0);
    });

    it('should handle multiple effects running concurrently', async () => {
      // arrange
      const effect1 = createEffect('effect1', () =>
        of(0).pipe(
          delay(100),
          tap(() => {
            expect(runningEffects().length).toBeGreaterThanOrEqual(1);
          })
        )
      );
      const effect2 = createEffect('effect2', () =>
        of(0).pipe(
          tap(() => {
            expect(runningEffects().length).toBeGreaterThanOrEqual(1);
          })
        )
      );

      // act
      await Promise.all([
        lastValueFrom(store.runEffect(effect1)),
        lastValueFrom(store.runEffect(effect2)),
      ]);

      // assert
      expect(runningEffects()).toHaveLength(0);
    });

    it('should register promise efffect while it runs', async () => {
      // arrange
      const effect = createEffect('dummyEffect', async () => {
        await delay(100);
        expect(runningEffects()).toHaveLength(1);
        expect(runningEffects()[0][1]).toBe(effect);
      });

      // act & assert
      expect(runningEffects()).toHaveLength(0);

      await store.runEffect(effect);

      expect(runningEffects()).toHaveLength(0);
    });

    it('should register throwing promise efffect while it runs', async () => {
      // arrange
      const effect = createEffect('dummyEffect', async () => {
        await delay(100);
        expect(runningEffects()).toHaveLength(1);
        expect(runningEffects()[0][1]).toBe(effect);
        throw new Error('Error');
      });

      // act & assert
      expect(runningEffects()).toHaveLength(0);

      try {
        await store.runEffect(effect);
      } catch (_) {
        /* empty */
      }

      expect(runningEffects()).toHaveLength(0);
    });
  });
});

describe('isLoading', () => {
  let store: Store<{ value: number }>;

  beforeEach(() => {
    runningEffects.set([]);
    store = new Store<{ value: number }>({
      initialState: { value: 10 },
      plugins: [useStoreStatus()],
    });
  });

  it('should be false if no effect is running', () => {
    // act
    const isLoadingStatus = isLoading(store)();
    const isAnyLoadingStatus = isLoading()();

    // assert
    expect(isLoadingStatus).toBe(false);
    expect(isAnyLoadingStatus).toBe(false);
  });

  it('should be false for a running effect that has not been created with setLoadingStatus enabled', () => {
    // arrange
    const effect = createEffect('effect', () => {});
    runningEffects.set([[new WeakRef(store), effect, 0]]);

    // act
    const isLoadingStatus = isLoading(store)();
    const isAnyLoadingStatus = isLoading()();

    // assert
    expect(isLoadingStatus).toBe(false);
    expect(isAnyLoadingStatus).toBe(false);
  });

  it('should be true for a running effect that has been created with setLoadingStatus enabled', () => {
    // arrange
    const effect = createEffect('effect', () => {}, { setLoadingStatus: true });
    runningEffects.set([[new WeakRef(store), effect, 0]]);

    // act
    const isLoadingStatus = isLoading(store)();
    const isAnyLoadingStatus = isLoading()();

    // assert
    expect(isLoadingStatus).toBe(true);
    expect(isAnyLoadingStatus).toBe(true);
  });
});

describe('isAnyEffectRunning', () => {
  let store: Store<{ value: number }>;
  const effect = createEffect('effect', () => {});

  beforeEach(() => {
    runningEffects.set([]);
    store = new Store<{ value: number }>({
      initialState: { value: 10 },
      plugins: [useStoreStatus()],
    });
  });

  it('should be false if no effect is running', () => {
    // act
    const isRunningForStore = isAnyEffectRunning(store)();
    const isRunningForAnyStore = isAnyEffectRunning()();

    // assert
    expect(isRunningForStore).toBe(false);
    expect(isRunningForAnyStore).toBe(false);
  });

  it('should be false for a running effect that is registered for another store', () => {
    // arrange
    runningEffects.set([
      [new WeakRef(new Store<number>({ initialState: 0 })), effect, 0],
    ]);

    // act
    const isRunningForStore = isAnyEffectRunning(store)();
    const isRunningForAnyStore = isAnyEffectRunning()();

    // assert
    expect(isRunningForStore).toBe(false);
    expect(isRunningForAnyStore).toBe(true);
  });

  it('should be true for a running effect and the corresponding store', () => {
    // arrange
    runningEffects.set([[new WeakRef(store), effect, 0]]);

    // act
    const isRunningForStore = isAnyEffectRunning(store)();
    const isRunningForAnyStore = isAnyEffectRunning()();

    // assert
    expect(isRunningForStore).toBe(true);
    expect(isRunningForAnyStore).toBe(true);
  });
});

describe('isEffectRunning', () => {
  let store: Store<{ value: number }>;
  const effect = createEffect('effect', () => {});

  beforeEach(() => {
    runningEffects.set([]);
    store = new Store<{ value: number }>({
      initialState: { value: 10 },
      plugins: [useStoreStatus()],
    });
  });

  it('should be false if effect is not running', () => {
    // arrange
    runningEffects.set([
      [new WeakRef(store), createEffect('Other effect', () => {}), 0],
    ]);

    // act
    const isRunningForStore = isEffectRunning(effect, store)();
    const isRunningForAnyStore = isEffectRunning(effect)();

    // assert
    expect(isRunningForStore).toBe(false);
    expect(isRunningForAnyStore).toBe(false);
  });

  it('should be false for a running effect that is registered for another store', () => {
    // arrange
    runningEffects.set([
      [new WeakRef(new Store<number>({ initialState: 0 })), effect, 0],
    ]);

    // act
    const isRunningForStore = isEffectRunning(effect, store)();
    const isRunningForAnyStore = isEffectRunning(effect)();

    // assert
    expect(isRunningForStore).toBe(false);
    expect(isRunningForAnyStore).toBe(true);
  });

  it('should be true for a running effect and the corresponding store', () => {
    // arrange
    runningEffects.set([[new WeakRef(store), effect, 0]]);

    // act
    const isRunningForStore = isEffectRunning(effect, store)();
    const isRunningForAnyStore = isEffectRunning(effect)();

    // assert
    expect(isRunningForStore).toBe(true);
    expect(isRunningForAnyStore).toBe(true);
  });
});

describe('isModified', () => {
  let store: Store<{ value: number }>;

  beforeEach(() => {
    store = new Store<{ value: number }>({
      initialState: { value: 10 },
      plugins: [useStoreStatus()],
    });
  });

  it('should be unmodified initially', () => {
    // assert
    expect(isModified(store)()).toBe(false);
  });

  it('should mark the store as modified after a command is processed', () => {
    // act
    store.set({ value: 10 });

    // assert
    expect(isModified(store)()).toBe(true);
  });

  it('should mark the store as modified after an effect is processed', async () => {
    // arrange
    const effect = createEffect(
      'dummyEffect',
      (store: Store<{ value: number }>) =>
        of(30).pipe(
          tap(val =>
            store.mutate(x => {
              x.value = val;
            })
          )
        )
    );

    // act
    await lastValueFrom(store.runEffect(effect));

    // assert
    expect(isModified(store)()).toBe(true);
  });

  it('should mark the store as unmodified after an effect with setUnmodifiedStatus is processed', async () => {
    // arrange
    const effect = createEffect(
      'dummyEffect',
      (store: Store<{ value: number }>) =>
        of(30).pipe(
          tap(val =>
            store.mutate(x => {
              x.value = val;
            })
          )
        ),
      { setUnmodifiedStatus: true }
    );

    // act
    await lastValueFrom(store.runEffect(effect));

    // assert
    expect(isModified(store)()).toBe(false);
  });
});

describe('markAsUnmodified', () => {
  let store: Store<{ value: number }>;

  beforeEach(() => {
    store = new Store<{ value: number }>({
      initialState: { value: 10 },
      plugins: [useStoreStatus()],
    });
  });

  it('should manually mark the store as unmodified', () => {
    // arrange
    store.set({ value: 20 });
    expect(isModified(store)()).toBe(true); // sanity check

    // act
    markAsUnmodified(store);

    // assert
    expect(isModified(store)()).toBe(false);
  });
});

describe('markAsHavingNoRunningEffects', () => {
  let store: Store<{ value: number }>;
  const effect = createEffect('dummyEffect', () => of(30));

  beforeEach(() => {
    store = new Store<{ value: number }>({
      initialState: { value: 10 },
      plugins: [useStoreStatus()],
    });
    runningEffects.set([]);
  });

  it('should manually mark the store as not having running effects', () => {
    // arrange
    runningEffects.set([[new WeakRef(store), effect, 0]]);

    // act
    markAsHavingNoRunningEffects(store);

    // assert
    expect(runningEffects()).toHaveLength(0);
  });

  it('should not affect effects from other stores', () => {
    // arrange
    const otherStore = new Store<{ value: number }>({
      initialState: { value: 20 },
      plugins: [useStoreStatus()],
    });
    runningEffects.set([
      [new WeakRef(store), effect, 0],
      [new WeakRef(otherStore), effect, 0],
    ]);

    // act
    markAsHavingNoRunningEffects(otherStore);

    // assert
    expect(runningEffects()).toHaveLength(1);
    expect(runningEffects()[0][0].deref()).toBe(store);
    expect(runningEffects()[0][1]).toBe(effect);
  });

  it('should handle multiple effects running concurrently for the same store', () => {
    // arrange
    const otherEffect = createEffect('dummyOtherEffect', () => of(50));

    runningEffects.set([
      [new WeakRef(store), effect, 0],
      [new WeakRef(store), otherEffect, 0],
    ]);

    // act
    markAsHavingNoRunningEffects(store);

    // assert
    expect(runningEffects()).toHaveLength(0);
  });
});
