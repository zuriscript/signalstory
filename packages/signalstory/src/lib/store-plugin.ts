import { StoreConfig } from './store-config';

/**
 * Represents a command preprocessor for a store.
 */
export interface CommandPreprocessor<TState> {
  preprocessCommand: (
    stateBeforeCommand: TState,
    commandName: string,
    commandArguments: any[]
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
    commandName: string,
    commandArguments: any[]
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
 * Represents an initialization preprocessor for a store.
 */
export interface ConstructorPreprocessor<TState> {
  preprocessConstructor: (passedConfig: StoreConfig<TState>) => void;
}

/**
 * Type guard for ConstructorPreprocessor.
 */
export function isConstructorPreprocessor<TState>(
  obj: any
): obj is ConstructorPreprocessor<TState> {
  return (
    typeof obj === 'object' &&
    'preprocessConstructor' in obj &&
    typeof obj.preprocessConstructor === 'function'
  );
}

/**
 * Represents an initialization postprocessor for a store.
 */
export interface ConstructorPostprocessor<TState> {
  postprocessConstructor: (config: Required<StoreConfig<TState>>) => void;
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

export type StorePlugin<TState> =
  | CommandPreprocessor<TState>
  | CommandPostprocessor<TState>
  | ConstructorPostprocessor<TState>;

export type StorePluginFactory<TState> = (
  config: StoreConfig<TState>
) => StorePlugin<TState>;
