/* eslint-disable tree-shaking/no-side-effects-in-initialization */
import { delay, lastValueFrom, of, tap } from 'rxjs';
import { Store } from '../lib/store';
import { createEffect } from '../lib/store-effect';
import {
  isAnyEffectRunning,
  isEffectRunning,
  isLoading,
  isModified,
  runningEffects,
  useStatus,
} from '../lib/store-plugin-status/plugin-status';

describe('StoreStatusPlugin', () => {
  it('should be created using plugin factory method', () => {
    // act
    const store = new Store<{ val: number }>({
      initialState: { val: 5 },
      plugins: [useStatus()],
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
        plugins: [useStatus()],
      });
    });

    it('should register observable efffect while it runs', async () => {
      // arrange
      const newValue = 22;
      const effect = createEffect(
        'dummyEffect',
        (store: Store<{ value: number }>) =>
          of(newValue).pipe(
            tap(val =>
              store.mutate(x => {
                x.value = val;
              })
            ),
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
      expect(store.state().value).toBe(newValue);
    });

    it('should register throwing observable efffect while it runs', async () => {
      // arrange
      const effect = createEffect('dummyEffect', () =>
        of().pipe(
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
      const effect1 = createEffect(
        'effect1',
        (store: Store<{ value: number }>) =>
          of(30).pipe(
            delay(100),
            tap(val =>
              store.mutate(x => {
                x.value = val;
              })
            )
          )
      );
      const effect2 = createEffect(
        'effect2',
        (store: Store<{ value: number }>) =>
          of(40).pipe(
            tap(val =>
              store.mutate(x => {
                x.value = val;
              })
            )
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
  });
});

describe('isLoading', () => {
  let store: Store<{ value: number }>;

  beforeEach(() => {
    runningEffects.set([]);
    store = new Store<{ value: number }>({
      initialState: { value: 10 },
      plugins: [useStatus()],
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
    runningEffects.set([[new WeakRef(store), effect]]);

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
    runningEffects.set([[new WeakRef(store), effect]]);

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
      plugins: [useStatus()],
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
      [new WeakRef(new Store<number>({ initialState: 0 })), effect],
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
    runningEffects.set([[new WeakRef(store), effect]]);

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
      plugins: [useStatus()],
    });
  });

  it('should be false if effect is not running', () => {
    // arrange
    runningEffects.set([
      [new WeakRef(store), createEffect('Other eeffect', () => {})],
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
      [new WeakRef(new Store<number>({ initialState: 0 })), effect],
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
    runningEffects.set([[new WeakRef(store), effect]]);

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
      plugins: [useStatus()],
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
