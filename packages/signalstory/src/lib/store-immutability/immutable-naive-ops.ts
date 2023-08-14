/**
 * Naively creates a deep clone of a given state object using JSON.parse and JSON.stringify.
 * This approach is simple but not optimal for performance.
 *
 * @template TState - The type of the state object.
 * @param {TState} state - The state object to be cloned.
 * @returns {TState} A deep clone of the provided state object.
 */
export function naiveDeepClone<TState>(state: TState): TState {
  return JSON.parse(JSON.stringify(state)) as TState;
}

/**
 * Naive implementation of an immutable update function using a clone-and-mutate approach.
 * This function serves as a placeholder that you can swap with a more optimized
 * solution like the one provided by the 'immer.js' library (https://immerjs.github.io/immer/).
 * Using 'immer.js' will result in more efficient and concise code for managing
 * immutable updates to your state.
 *
 * @template TState - The type of the state object.
 * @param {TState} currentState - The current state object to be updated.
 * @param {(draftState: TState) => void} mutation - A function that modifies a draft copy of the state.
 * @returns {TState} The new state object after applying the mutation.
 */
export function naiveCloneAndMutateFunc<TState>(
  currentState: TState,
  mutation: (draftState: TState) => void
): TState {
  const clone = naiveDeepClone(currentState) as TState;
  mutation(clone);
  return clone;
}
