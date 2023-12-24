export class PerformanceCounter {
  private count = 0;
  private totalDurationMs = 0;
  private maxDurationMs = 0;
  private minDurationMs = Number.POSITIVE_INFINITY;
  private sumSquares = 0;
  private currentTimer: number | null = null;

  public get isRunning() {
    return !!this.currentTimer;
  }

  public addDuration(duration: number): void {
    this.count++;
    this.totalDurationMs += duration;
    this.maxDurationMs = Math.max(this.maxDurationMs, duration);
    this.minDurationMs = Math.min(
      this.minDurationMs ?? Number.MAX_SAFE_INTEGER,
      duration
    );
    this.sumSquares += duration * duration;
  }

  public startTimer(): void {
    this.currentTimer = performance.now();
  }

  public stopTimer(): void {
    const duration = performance.now() - this.currentTimer!;
    this.addDuration(duration);
    this.currentTimer = null;
  }

  public toggleTimer(): void {
    if (this.isRunning) {
      this.stopTimer();
    } else {
      this.startTimer();
    }
  }

  private getAverageDuration(): number {
    return this.count === 0 ? 0 : this.totalDurationMs / this.count;
  }

  private getStandardDeviation(): number {
    if (this.count === 0) {
      return 0;
    }

    const count = this.count;
    const meanSquared = (this.totalDurationMs / count) ** 2;
    const variance = (this.sumSquares - meanSquared * count) / count;

    return Math.sqrt(variance);
  }

  public getReport() {
    return {
      count: this.count,
      maxDurationMs: this.maxDurationMs,
      minDurationMs: this.minDurationMs,
      averageDurationMs: this.getAverageDuration(),
      standardDeviation: this.getStandardDeviation(),
    };
  }
}
