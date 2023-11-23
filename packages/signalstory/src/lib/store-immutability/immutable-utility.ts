/**
 * Naively creates a deep clone of a given state object using JSON.parse and JSON.stringify.
 * This approach is simple but not optimal for performance.
 *
 * @template TState - The type of the state object.
 * @param state - The state object to be cloned.
 * @returns A deep clone of the provided state object.
 */
export function naiveDeepClone<TState>(state: TState): TState {
  return JSON.parse(JSON.stringify(state)) as TState;
}

/**
 * Creates a deep clone of a given value object using either the `structuredClone` method if available,
 * or a naive approach using JSON.parse and JSON.stringify if `structuredClone` is not supported.
 * The naive approach is simple but may have shortcomings and is not optimal for performance.
 *
 * @template T - The type of the value object.
 * @param {T} value - The value object to be cloned.
 * @returns {T} A deep clone of the provided value object.
 */
export const deepClone = <TState>(state: TState) =>
  window && 'structuredClone' in window
    ? structuredClone(state)
    : naiveDeepClone(state);

/**
 * Creates a shallow clone of a given value object
 * @param state - The state to be cloned.
 * @returns Shallow cloned state.
 */
export function shallowClone<TState>(state: TState): TState {
  if (!state || typeof state !== 'object') {
    return state;
  }

  if (Array.isArray(state)) return [...state] as TState;
  if (state instanceof Date) return new Date(state) as TState;
  if (state instanceof RegExp) return new RegExp(state) as TState;
  if (state instanceof Set) return new Set(state) as TState;
  if (state instanceof Map) return new Map(state) as TState;

  return Object.assign({}, state) as TState;
}

/**
 * Naive implementation of an immutable update function using a clone-and-mutate approach.
 * This function serves as a placeholder that you can swap with a more optimized
 * solution like the one provided by the 'immer.js' library (https://immerjs.github.io/immer/).
 * Using 'immer.js' will result in more efficient and concise code for managing
 * immutable updates to your state.
 *
 * @template TState - The type of the state object.
 * @param currentState - The current state object to be updated.
 * @param mutation - A function that modifies a draft copy of the state.
 * @returns The new state object after applying the mutation.
 */
export function naiveCloneAndMutateFunc<TState>(
  currentState: TState,
  mutation: (draftState: TState) => void
): TState {
  const clone = deepClone(currentState) as TState;
  mutation(clone);
  return clone;
}
