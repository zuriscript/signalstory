/**
 * Represents a logger function that can be used for logging messages.
 * @param message - The message to be logged.
 * @param optionalParams - Optional parameters to include in the log.
 */
export type Logger = (message?: any, ...optionalParams: any[]) => void;

let defaultLogger = console.log;

/**
 * The current logger function used for logging.
 */
export let log: Logger | undefined;

/**
 * Enables logging
 */
export const enableLogging = () => (log = defaultLogger);

/**
 * Disables logging
 */
export const disableLogging = () => (log = undefined);

/**
 * Sets a custom logger function to be used for logging.
 *
 * @param logger - The custom logger function to set.
 */
export function setLogger(logger: Logger) {
  defaultLogger = logger;
  enableLogging();
}
