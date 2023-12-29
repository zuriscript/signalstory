/**
 * PerformanceCounter class is used to measure and analyze the performance of a process.
 */
export class PerformanceCounter {
  private count = 0;
  private totalDurationMs = 0;
  private maxDurationMs = 0;
  private sumSquares = 0;

  private currentTimer: number | null = null;

  /**
   * Indicates whether the timer is currently running.
   */
  public get isRunning() {
    return !!this.currentTimer;
  }

  /**
   * Adds the specified duration to the counter, updating relevant statistics.
   * @param duration - The duration to be added in milliseconds.
   */
  public addDuration(duration: number): void {
    this.count++;
    this.totalDurationMs += duration;
    this.maxDurationMs = Math.max(this.maxDurationMs, duration);
    this.sumSquares += duration * duration;
  }

  /**
   * Starts the timer, recording the current timestamp.
   */
  public startTimer(): void {
    this.currentTimer = performance.now();
  }

  /**
   * Stops the timer, calculates the duration, and adds it to the counter.
   */
  public stopTimer(): void {
    const duration = performance.now() - this.currentTimer!;
    this.addDuration(duration);
    this.currentTimer = null;
  }

  /**
   * Toggles the timer between start and stop states.
   */
  public toggleTimer(): void {
    if (this.isRunning) {
      this.stopTimer();
    } else {
      this.startTimer();
    }
  }

  /**
   * Calculates and returns the average duration based on the recorded intervals.
   * @returns The average duration in milliseconds.
   */
  private getAverageDuration(): number {
    return this.count === 0 ? 0 : this.totalDurationMs / this.count;
  }

  /**
   * Calculates and returns the standard deviation of durations.
   * @returns The standard deviation
   */
  private getStandardDeviation(): number {
    if (this.count === 0) {
      return 0;
    }

    const count = this.count;
    const meanSquared = (this.totalDurationMs / count) ** 2;
    const variance = (this.sumSquares - meanSquared * count) / count;

    return Math.sqrt(variance);
  }

  /**
   * Generates and returns a performance report with various statistics.
   * @returns An object containing performance statistics.
   */
  public getReport() {
    return {
      count: this.count,
      maxDurationMs: this.maxDurationMs,
      averageDurationMs: this.getAverageDuration(),
      standardDeviation: this.getStandardDeviation(),
    };
  }
}
