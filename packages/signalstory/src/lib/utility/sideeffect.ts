import { finalize, isObservable } from 'rxjs';

/**
 * Type to indicate that a given object is a Promise
 * @template T - The type of the resolved value of the promise.
 */
type PromiseLike<T> = {
  then(
    onfulfilled?: (value: T) => unknown | PromiseLike<unknown>
  ): PromiseLike<unknown>;
  finally(onfinally?: () => void): PromiseLike<unknown>;
};

/**
 * Checks if the provided object is a promise
 * @param obj - The object to be checked.
 * @returns True if the object is a promise, false otherwise.
 * @template T - The type of the resolved value of the promise.
 */
function isPromise<T>(obj: T | PromiseLike<T>): obj is PromiseLike<T> {
  return (
    obj &&
    typeof (obj as PromiseLike<T>).then === 'function' &&
    typeof (obj as PromiseLike<T>).finally === 'function'
  );
}

/**
 * Executes a side effect when the provided source
 * @param source - The source object
 * @param sideEffect - The side effect function to be executed.
 * @returns The source object with the side effect applied.
 * @template T - The type of the source object.
 */
export function withSideEffect<T>(source: T, sideEffect: () => void): T {
  if (isObservable(source)) {
    return source.pipe(finalize(sideEffect)) as T;
  } else if (isPromise(source)) {
    return source.finally(sideEffect) as T;
  }

  sideEffect();
  return source;
}
