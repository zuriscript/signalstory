/* eslint-disable @typescript-eslint/no-explicit-any */
import { StorePlugin } from '../store-plugin';
import { registry } from '../store-plugin-devtools/plugin-devtools';

class PerformanceCounter {
  private count = 0;
  private totalDurationMs = 0;
  private maxDurationMs = 0;
  private minDurationMs = Number.POSITIVE_INFINITY;
  private sumSquares = 0;

  private currentTimer: number | null = null;

  public startTimer() {
    this.currentTimer = performance.now();
  }

  public stopTimer(): void {
    const duration = performance.now() - this.currentTimer!;

    this.count++;
    this.totalDurationMs += duration;
    this.maxDurationMs = Math.max(this.maxDurationMs, duration);
    this.minDurationMs = Math.min(
      this.minDurationMs ?? Number.MAX_SAFE_INTEGER,
      duration
    );
    this.sumSquares += duration * duration;

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

  public get isRunning() {
    return !!this.currentTimer;
  }
}

type KeyValuePair<TValue = unknown> = [string, TValue];
function getOrDefault<TValue>(
  list: KeyValuePair<TValue>[],
  key: string
): TValue | undefined {
  return list.find(x => x[0] === key)?.[1];
}
function hasKey(list: KeyValuePair[], key: string): boolean {
  return !!list.find(x => x[0] === key);
}

class StorePerformanceCounter {
  public readonly commands: [string, PerformanceCounter][] = [];
  public readonly effects: [string, PerformanceCounter][] = [];

  constructor(public name: string) {}

  toggleCommandTimer(command: string | undefined) {
    const commandName = command ?? 'Unspecified';
    let counter = getOrDefault(this.commands, commandName);

    if (!counter) {
      counter = new PerformanceCounter();
      this.commands.push([commandName, counter]);
    }

    counter.toggleTimer();
  }

  toggleEffectTimer(effect: string | undefined) {
    const effectName = effect ?? 'Unspecified';
    let counter = getOrDefault(this.effects, effectName);

    if (!counter) {
      counter = new PerformanceCounter();
      this.effects.push([effectName, counter]);
    }

    counter.toggleTimer();
  }

  public getReport() {
    return {
      commands: this.commands.map(counter => ({
        command: counter[0],
        ...counter[1].getReport(),
      })),
      effects: this.effects.map(counter => ({
        command: counter[0],
        ...counter[1].getReport(),
      })),
    };
  }
}

const counters: [string, StorePerformanceCounter][] = [];
const counterStore = {
  name: '@signalstory/performance-counter',
  state() {
    return getReport();
  },
};

function getReport() {
  return {
    commands: counters
      .flatMap(x =>
        x[1].getReport().commands.map(y => ({
          store: x[0],
          ...y,
        }))
      )
      .sort((a, b) => b.averageDurationMs - a.averageDurationMs),
    effects: counters
      .flatMap(x =>
        x[1].getReport().effects.map(y => ({
          store: x[0],
          ...y,
        }))
      )
      .sort((a, b) => b.averageDurationMs - a.averageDurationMs),
  };
}

/**
 * Enables StorePlugin that logs command and effect execution
 * @returns A StorePlugin instance for logging.
 */
export function useBenchmark(): StorePlugin {
  return {
    init(store) {
      if (!hasKey(counters, store.name)) {
        counters.push([store.name, new StorePerformanceCounter(store.name)]);
      }
      if (!registry.has(counterStore.name)) {
        registry.set(counterStore.name, new WeakRef(counterStore) as any);
      }
    },
    preprocessCommand(store, command) {
      getOrDefault(counters, store.name)?.toggleCommandTimer(command);
    },
    postprocessCommand(store, command) {
      getOrDefault(counters, store.name)?.toggleCommandTimer(command);
    },
    preprocessEffect(store, effect) {
      getOrDefault(counters, store.name)?.toggleEffectTimer(effect.name);
    },
    postprocessEffect(store, effect) {
      getOrDefault(counters, store.name)?.toggleEffectTimer(effect.name);
    },
  };
}
