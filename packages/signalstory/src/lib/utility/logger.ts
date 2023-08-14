export type Logger = (message?: any, ...optionalParams: any[]) => void;

export let log: Logger | undefined;

let defaultLogger = console.log;

export const enableLogging = () => (log = defaultLogger);

export const disableLogging = () => (log = undefined);

export function setLogger(logger: Logger) {
  defaultLogger = logger;
  enableLogging();
}
