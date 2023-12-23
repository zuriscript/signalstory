import { StorePlugin } from '../store-plugin';

/**
 * Represents a logger function that can be used for logging messages.
 * @param message - The message to be logged.
 * @param optionalParams - Optional parameters to include in the log.
 */
export type Logger = (message?: unknown, ...optionalParams: unknown[]) => void;

/**
 * Options for configuring the Store Logger Plugin.
 */
export interface StoreLoggerPluginOptions {
  /**
   * Log Function for logging commands and effects. Defaults to `console.log`
   */
  logFunction?: Logger;
}

/**
 * Enables StorePlugin that logs command and effect execution
 * @returns A StorePlugin instance for logging.
 */
export function useLogger(
  options: StoreLoggerPluginOptions = {}
): StorePlugin & { log: Logger; name: string } {
  const plugin: StorePlugin & { log: Logger; name: string } = {
    name: 'StoreLogger',
    log: options.logFunction ?? console.log,
  };

  plugin.init = store => plugin.log(`[${store.name}->Init]`, store.state());
  plugin.postprocessCommand = (store, command) =>
    plugin.log(
      `[${store.name}->Command] ${command ?? 'Unspecified'}`,
      store.state()
    );
  plugin.preprocessEffect = (store, effect) =>
    plugin.log(
      `[${store.name}->Effect STARTED] ${effect.name ?? 'Unspecified'}`,
      store.state()
    );
  plugin.postprocessEffect = (store, effect) =>
    plugin.log(
      `[${store.name}->Effect FINNISHED] ${effect.name ?? 'Unspecified'}`,
      store.state()
    );

  return plugin;
}
