import { Store } from '../store';
import { StoreConfig } from '../store-config';
import { StoreEffect } from '../store-effect';

/**
 * Represents a command preprocessor for a store.
 */
export interface CommandPreprocessor<TState> {
  preprocessCommand: (
    stateBeforeCommand: TState,
    commandName: string | undefined
  ) => void;
}

/**
 * Type guard for CommandPreprocessor.
 */
export function isCommandPreprocessor<TState>(
  obj: any
): obj is CommandPreprocessor<TState> {
  return (
    typeof obj === 'object' &&
    'preprocessCommand' in obj &&
    typeof obj.preprocessCommand === 'function'
  );
}

/**
 * Represents a command postprocessor for a store.
 */
export interface CommandPostprocessor<TState> {
  postprocessCommand: (
    stateAfterCommand: TState,
    commandName: string | undefined
  ) => void;
}

/**
 * Type guard for CommandPostprocessor.
 */
export function isCommandPostprocessor<TState>(
  obj: any
): obj is CommandPostprocessor<TState> {
  return (
    typeof obj === 'object' &&
    'postprocessCommand' in obj &&
    typeof obj.postprocessCommand === 'function'
  );
}

/**
 * Represents an initialization postprocessor for a store.
 */
export interface ConstructorPostprocessor<TState> {
  postprocessConstructor: (store: Store<TState>) => void;
}

/**
 * Type guard for ConstructorPostprocessor.
 */
export function isConstructorPostprocessor<TState>(
  obj: any
): obj is ConstructorPostprocessor<TState> {
  return (
    typeof obj === 'object' &&
    'postprocessConstructor' in obj &&
    typeof obj.postprocessConstructor === 'function'
  );
}

/**
 * Represents am effect preprocessor for a store.
 */
export interface EffectPreprocessor<TState> {
  preprocessEffect: (
    store: Store<TState>,
    effect: StoreEffect<Store<TState>, any[], any>
  ) => void;
}

/**
 * Type guard for CommandPreprocessor.
 */
export function isEffectPreprocessor<TState>(
  obj: any
): obj is EffectPreprocessor<TState> {
  return (
    typeof obj === 'object' &&
    'preprocessEffect' in obj &&
    typeof obj.preprocessEffect === 'function'
  );
}

export type StorePlugin<TState> =
  | CommandPreprocessor<TState>
  | CommandPostprocessor<TState>
  | ConstructorPostprocessor<TState>
  | EffectPreprocessor<TState>;

export type StorePluginFactory<TState> = (
  config: StoreConfig<TState>
) => StorePlugin<TState>;

type Constructor<T> = new (...args: any[]) => T;

export function tryGetPlugin<TState, TPlugin extends StorePlugin<TState>>(
  plugins: ReadonlyArray<StorePlugin<TState>>,
  filterType: Constructor<TPlugin>
): TPlugin | undefined {
  return plugins.find(p => p instanceof filterType) as TPlugin | undefined;
}
