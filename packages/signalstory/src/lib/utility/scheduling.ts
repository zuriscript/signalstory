/**
 * Executes a batch of tasks with a possibly asynchronous scheduling designed to minimize UI thread blocking
 *
 * @param tasks - An array of functions representing tasks to be executed.
 * @param currentTaskIndex - The index of the current task to start from (optional: default is 0).
 * @param args - An array of arrays, each containing arguments for the corresponding task (optional: default is none).
 * @remarks The function uses a time-based approach to break the execution into non-blocking batches.
 * @remarks The deadline for each batch is set to 50 milliseconds.
 * @remarks If the tasks take longer to execute than the deadline, they will be scheduled in subsequent batches.
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
  args: unknown[][] = []
): void {
  const deadline = performance.now() + 50;
  while (currentTaskIndex < tasks.length && performance.now() < deadline) {
    const currentArgs = args?.[currentTaskIndex] as never[];
    currentArgs && currentArgs.length > 0
      ? tasks[currentTaskIndex](...currentArgs)
      : tasks[currentTaskIndex]();
    currentTaskIndex++;
  }

  if (currentTaskIndex < tasks.length) {
    setTimeout(runNonBlockingBatch, 0, tasks, currentTaskIndex, args);
  }
}
