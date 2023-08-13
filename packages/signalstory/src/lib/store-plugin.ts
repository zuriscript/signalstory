import { Store } from './store';

/**
 * Extracts the state type from a generic store type.
 */
export type StoreState<TStore> = TStore extends Store<infer TState>
  ? TState
  : never;

export type InitPostprocessor = (store: Store<any>) => void;

export type CommandPreprocessor = (
  store: Store<any>,
  command: string | undefined
) => void;

export type CommandPostprocessor = (
  store: Store<any>,
  command: string | undefined
) => void;

export type StorePlugin = {
  init?: InitPostprocessor;
  preprocessCommand?: CommandPreprocessor;
  postprocessCommand?: (store: Store<any>, command: string | undefined) => void;
  [others: string]: any;
};
