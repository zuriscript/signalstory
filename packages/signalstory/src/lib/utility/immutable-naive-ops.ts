/**
 * Naively creates a deep clone of a given state object using JSON.parse and JSON.stringify.
 * This approach is simple but not optimal for performance.
 *
 * @template TAnyState - The type of the state object.
 * @param {TAnyState} state - The state object to be cloned.
 * @returns {TAnyState} A deep clone of the provided state object.
 */
export function naiveDeepClone<TAnyState>(state: TAnyState): TAnyState {
  return JSON.parse(JSON.stringify(state)) as TAnyState;
}

/**
 * Naive implementation of an immutable update function using a clone-and-mutate approach.
 * This function serves as a placeholder that you can swap with a more optimized
 * solution like the one provided by the 'immer.js' library (https://immerjs.github.io/immer/).
 * Using 'immer.js' will result in more efficient and concise code for managing
 * immutable updates to your state.
 *
 * @template TAnyState - The type of the state object.
 * @param {TAnyState} currentState - The current state object to be updated.
 * @param {(draftState: TAnyState) => void} mutation - A function that modifies a draft copy of the state.
 * @returns {TAnyState} The new state object after applying the mutation.
 */
export function naiveCloneAndMutateFunc<TAnyState>(
  currentState: TAnyState,
  mutation: (draftState: TAnyState) => void
): TAnyState {
  // This is a naive implementation that clones the state using JSON.stringify
  // and applies the mutation. It is not optimized for performance and
  // should be replaced with a library like 'immer.js'.

  const clone = naiveDeepClone(currentState) as TAnyState;
  mutation(clone);
  return clone;
}
