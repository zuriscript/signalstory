/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable tree-shaking/no-side-effects-in-initialization */
import { Subject, filter, lastValueFrom, of, tap, throwError } from 'rxjs';
import { Store } from '../lib/store';
import { createEffect } from '../lib/store-effect';
import { StorePlugin } from '../lib/store-plugin';
import { withSideEffect } from '../lib/utility/sideeffect';

describe('StorePlugin', () => {
  it('should not add processors to store if not used', () => {
    // act
    const store = new Store<{ val: number }>({
      initialState: { val: 5 },
    });

    // assert
    expect(store['initPostprocessor']).toBeUndefined();
    expect(store['commandPreprocessor']).toBeUndefined();
    expect(store['commandPostprocessor']).toBeUndefined();
    expect(store['effectPreprocessor']).toBeUndefined();
    expect(store['effectPostprocessor']).toBeUndefined();
  });

  it('should add processors to store successfully', () => {
    // arrange
    const init = jest.fn();
    const preprocessCommand = jest.fn();
    const postprocessCommand = jest.fn();
    const preprocessEffect = jest.fn();
    const postprocessEffect = jest.fn();
    const useTestPlugin = () =>
      <StorePlugin>{
        init,
        preprocessCommand,
        postprocessCommand,
        preprocessEffect,
        postprocessEffect,
      };

    // act
    const store = new Store<{ val: number }>({
      initialState: { val: 5 },
      plugins: [useTestPlugin()],
    });

    // assert
    expect(store['initPostprocessor']![0]).toBe(init);
    expect(store['commandPreprocessor']![0]).toBe(preprocessCommand);
    expect(store['commandPostprocessor']![0]).toBe(postprocessCommand);
    expect(store['effectPreprocessor']![0]).toBe(preprocessEffect);
    expect(store['effectPostprocessor']![0]).toBe(postprocessEffect);
  });

  describe('CommandPreprocessor', () => {
    let store: Store<{ value: number }>;
    let commandPreprocessorMock: (...args: any[]) => void;
    let processedStoreValue: number | undefined;
    const initialValue = 10;
    const commandName = 'My Command';

    beforeEach(() => {
      processedStoreValue = undefined;
      commandPreprocessorMock = jest.fn(store => {
        processedStoreValue = store.state().value;
      });
      store = new Store<{ value: number }>({
        initialState: { value: initialValue },
        plugins: [
          <StorePlugin>{
            preprocessCommand: commandPreprocessorMock,
          },
        ],
      });
    });

    it('should preprocess command on set successfully', () => {
      // act
      store.set({ value: 42 }, commandName);

      // assert
      expect(commandPreprocessorMock).toHaveBeenCalledTimes(1);
      expect(commandPreprocessorMock).toHaveBeenCalledWith(store, commandName);
      expect(processedStoreValue).toBe(initialValue);
    });

    it('should preprocess command on update successfully', () => {
      // act
      store.update(() => ({ value: 42 }), commandName);

      // assert
      expect(commandPreprocessorMock).toHaveBeenCalledTimes(1);
      expect(commandPreprocessorMock).toHaveBeenCalledWith(store, commandName);
      expect(processedStoreValue).toBe(initialValue);
    });

    it('should preprocess command on mutate successfully', () => {
      // act
      store.mutate(state => {
        state.value = 42;
      }, commandName);

      // assert
      expect(commandPreprocessorMock).toHaveBeenCalledTimes(1);
      expect(commandPreprocessorMock).toHaveBeenCalledWith(store, commandName);
      expect(processedStoreValue).toBe(initialValue);
    });
  });

  describe('CommandPostprocessor', () => {
    let store: Store<{ value: number }>;
    let commandPostprocessorMock: (...args: any[]) => void;
    let processedStoreValue: number | undefined;
    const initialValue = 10;
    const newValue = 42;
    const commandName = 'My Command';

    beforeEach(() => {
      processedStoreValue = undefined;
      commandPostprocessorMock = jest.fn(store => {
        processedStoreValue = store.state().value;
      });
      store = new Store<{ value: number }>({
        initialState: { value: initialValue },
        plugins: [
          <StorePlugin>{
            postprocessCommand: commandPostprocessorMock,
          },
        ],
      });
    });

    it('should post-process command on set successfully', () => {
      // act
      store.set({ value: newValue }, commandName);

      // assert
      expect(commandPostprocessorMock).toHaveBeenCalledTimes(1);
      expect(commandPostprocessorMock).toHaveBeenCalledWith(store, commandName);
      expect(processedStoreValue).toBe(newValue);
    });

    it('should post-process command on update successfully', () => {
      // act
      store.update(() => ({ value: newValue }), commandName);

      // assert
      expect(commandPostprocessorMock).toHaveBeenCalledTimes(1);
      expect(commandPostprocessorMock).toHaveBeenCalledWith(store, commandName);
      expect(processedStoreValue).toBe(newValue);
    });

    it('should post-process command on mutate successfully', () => {
      // act
      store.mutate(state => {
        state.value = newValue;
      }, commandName);

      // assert
      expect(commandPostprocessorMock).toHaveBeenCalledTimes(1);
      expect(commandPostprocessorMock).toHaveBeenCalledWith(store, commandName);
      expect(processedStoreValue).toBe(newValue);
    });
  });

  describe('EffectPreprocessor', () => {
    let store: Store<{ value: number }>;
    let effectPreprocessorMock: (...args: any[]) => void;
    let processedStoreValue: number | undefined;
    const initialValue = 10;
    const newValue = 12;

    beforeEach(() => {
      processedStoreValue = undefined;
      effectPreprocessorMock = jest.fn(store => {
        processedStoreValue = store.state().value;
      });
      store = new Store<{ value: number }>({
        initialState: { value: initialValue },
        plugins: [
          <StorePlugin>{
            preprocessEffect: effectPreprocessorMock,
          },
        ],
      });
    });

    it('should preprocess effect successfully', () => {
      // arrange
      const effect = createEffect(
        'dummyEffect',
        (store: Store<{ value: number }>) => {
          store.mutate(x => {
            x.value = newValue;
          });
        }
      );

      // act
      store.runEffect(effect);

      // assert
      expect(effectPreprocessorMock).toHaveBeenCalledTimes(1);
      expect(effectPreprocessorMock).toHaveBeenCalledWith(store, effect);
      expect(processedStoreValue).toBe(initialValue);
    });

    it('should preprocess effect successfully using multiple preprocessors', () => {
      // arrange
      const effectPreprocessorMock2 = jest.fn();
      const effect = createEffect(
        'dummyEffect',
        (store: Store<{ value: number }>) => {
          store.mutate(x => {
            x.value = newValue;
          });
        }
      );
      store['effectPreprocessor']!.push(effectPreprocessorMock2);

      // act
      store.runEffect(effect);

      // assert
      expect(effectPreprocessorMock).toHaveBeenCalledTimes(1);
      expect(effectPreprocessorMock).toHaveBeenCalledWith(store, effect);
      expect(effectPreprocessorMock2).toHaveBeenCalledTimes(1);
      expect(effectPreprocessorMock2).toHaveBeenCalledWith(store, effect);
    });
  });

  describe('EffectPostprocessor', () => {
    let store: Store<{ value: number }>;
    let effectPostprocessorMock: (...args: any[]) => void;
    let processedStoreValue: number | undefined;
    const initialValue = 10;
    const newValue = 12;

    beforeEach(() => {
      processedStoreValue = undefined;
      effectPostprocessorMock = jest.fn((store, _, result) =>
        withSideEffect(result, () => {
          processedStoreValue = store.state().value;
        })
      );
      store = new Store<{ value: number }>({
        initialState: { value: initialValue },
        plugins: [
          <StorePlugin>{
            postprocessEffect: effectPostprocessorMock,
          },
        ],
      });
    });

    it('should postprocess normal effect successfully', () => {
      // arrange
      const effect = createEffect(
        'dummyEffect',
        (store: Store<{ value: number }>) => {
          store.mutate(x => {
            x.value = newValue;
          });
        }
      );

      // act
      store.runEffect(effect);

      // assert
      expect(effectPostprocessorMock).toHaveBeenCalledTimes(1);
      expect(effectPostprocessorMock).toHaveBeenCalledWith(
        store,
        effect,
        undefined
      );
      expect(processedStoreValue).toBe(newValue);
    });

    it('should postprocess observable effect successfully', async () => {
      // arrange
      const effect = createEffect(
        'dummyEffect',
        (store: Store<{ value: number }>) =>
          of(newValue).pipe(
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
      expect(effectPostprocessorMock).toHaveBeenCalledTimes(1);
      expect(effectPostprocessorMock).toHaveBeenCalledWith(
        store,
        effect,
        expect.anything()
      );
      expect(processedStoreValue).toBe(newValue);
    });

    it('should postprocess throwing observable effect successfully', async () => {
      // arrange
      const effect = createEffect('dummyEffect', () =>
        throwError(() => new Error('Error'))
      );

      // act
      try {
        await lastValueFrom(store.runEffect(effect));
      } catch (_) {
        /* empty */
      }

      // assert
      expect(effectPostprocessorMock).toHaveBeenCalledTimes(1);
      expect(effectPostprocessorMock).toHaveBeenCalledWith(
        store,
        effect,
        expect.anything()
      );
      expect(processedStoreValue).toBe(initialValue);
    });

    it('should postprocess filtered observable effect', () => {
      // arrange
      const effect = createEffect(
        'dummyEffect',
        (store: Store<{ value: number }>) =>
          of(newValue).pipe(
            filter(() => false),
            tap(val =>
              store.mutate(x => {
                x.value = val;
              })
            )
          )
      );

      // act
      // since there is no emission the observable can just be subscribed to
      // The postprocessor using finalize should be called nonetheless
      store.runEffect(effect).subscribe();

      // assert
      expect(effectPostprocessorMock).toHaveBeenCalledTimes(1);
      expect(effectPostprocessorMock).toHaveBeenCalledWith(
        store,
        effect,
        expect.anything()
      );
      expect(processedStoreValue).toBe(initialValue);
    });

    it('should postprocess hot observable effect successfully ater hot observable has completed', () => {
      // arrange
      const subject = new Subject<number>();
      const effect = createEffect(
        'dummyEffect',
        (store: Store<{ value: number }>) =>
          subject.pipe(
            tap(val =>
              store.mutate(x => {
                x.value = val;
              })
            )
          )
      );

      // act & assert
      store.runEffect(effect).subscribe();
      expect(processedStoreValue).toBeUndefined(); // No emission yet

      subject.next(2);
      expect(processedStoreValue).toBeUndefined(); // No emission yet

      subject.next(newValue);
      expect(processedStoreValue).toBeUndefined(); // No emission yet

      subject.complete();
      expect(processedStoreValue).toBe(newValue);
    });

    it('should postprocess effect with resolved promise successfully', async () => {
      // arrange
      const effect = createEffect(
        'dummyEffect',
        async (store: Store<{ value: number }>) => {
          await Promise.resolve(newValue);
          store.mutate(x => {
            x.value = newValue;
          });
        }
      );

      // act
      await store.runEffect(effect);

      // assert
      expect(effectPostprocessorMock).toHaveBeenCalledTimes(1);
      expect(effectPostprocessorMock).toHaveBeenCalledWith(
        store,
        effect,
        expect.anything()
      );
      expect(processedStoreValue).toBe(newValue);
    });

    it('should postprocess effect with rejected promise successfully', async () => {
      // arrange
      const error = new Error('Promise rejection error');
      const effect = createEffect('dummyEffect', async () => {
        await Promise.reject(error);
      });

      // act
      try {
        await store.runEffect(effect);
      } catch (_) {
        /* empty */
      }

      // assert
      expect(effectPostprocessorMock).toHaveBeenCalledTimes(1);
      expect(effectPostprocessorMock).toHaveBeenCalledWith(
        store,
        effect,
        expect.anything()
      );
      expect(processedStoreValue).toBe(initialValue);
    });
  });
});
