/* eslint-disable tree-shaking/no-side-effects-in-initialization */
import { memoize } from './memoize';

/**
 * Extends the Navigator interface to include the scheduling property which is not supported on all environments
 */
interface NavigatorWithScheduling extends Navigator {
  scheduling: {
    isInputPending(options: { includeContinuous: boolean }): boolean;
  };
}

/**
 * Feature detection for navigator.scheduling.isInputPending.
 */
const isInputPendingSupported = /*@__PURE__*/ memoize((): boolean => {
  try {
    const scheduling = (navigator as NavigatorWithScheduling)?.scheduling;
    scheduling?.isInputPending?.({ includeContinuous: true }); // Test invocation
    return true;
  } catch {
    return false;
  }
});

/**
 * Checks if there are no pending user events.
 * @returns {boolean} True if there are no pending user events given the detection feature is supported by the browser, false otherwise.
 */
function noPendingUserEvents(): boolean {
  return (
    isInputPendingSupported() &&
    !(navigator as NavigatorWithScheduling).scheduling.isInputPending({
      includeContinuous: true,
    })
  );
}

/**
 * Executes a batch of tasks with a potentially asynchronous scheduling designed to minimize UI thread blocking
 *
 * @param tasks - An array of functions representing tasks to be executed.
 * @param currentTaskIndex - The index of the current task to start from (optional: default is 0).
 * @param args - An array of arrays, each containing arguments for the corresponding task (optional: default is none).
 *
 * @remarks The function uses a time-based approach to break the execution into non-blocking batches.
 * @remarks The deadline for each batch is set to 45 milliseconds.
 * @remarks If the tasks take longer to execute than the deadline, they will be scheduled in subsequent batches.
 *
 * @example
 * ```typescript
 * // Without parameter:
 * runNonBlockingBatch([() => console.log('1')), () => console.log('2')]);
 *
 * // With parameter:
 * const task1 = () => console.log('Task 1');
 * const task2 = (param: string) => console.log(`Task 2 with ${param}`);
 *
 * runNonBlockingBatch([task1, task2], 0, [[],['parameter']]);
 * ```
 */
export function runNonBlockingBatch(
  tasks: ((...args: never[]) => unknown)[],
  currentTaskIndex = 0,
  args: unknown[][] | undefined = undefined
): void {
  if (tasks && currentTaskIndex < tasks.length) {
    const deadline = performance.now() + 45;

    do {
      const currentArgs = args?.[currentTaskIndex] as never[];
      if (currentArgs && currentArgs.length > 0) {
        tasks[currentTaskIndex](...currentArgs);
      } else {
        tasks[currentTaskIndex]();
      }
      currentTaskIndex++;
    } while (currentTaskIndex < tasks.length && performance.now() < deadline);

    if (currentTaskIndex < tasks.length) {
      if (noPendingUserEvents()) {
        runNonBlockingBatch(tasks, currentTaskIndex, args);
      } else {
        setTimeout(runNonBlockingBatch, 0, tasks, currentTaskIndex, args);
      }
    }
  }
}
