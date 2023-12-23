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

class StorePerformanceCounter {
  public readonly commands = new Map<string, PerformanceCounter>();
  public readonly effects = new Map<string, PerformanceCounter>();

  constructor(public name: string) {}

  toggleCommandTimer(command: string | undefined) {
    const commandName = command ?? 'Unspecified';
    let counter = this.commands.get(commandName);

    if (!counter) {
      counter = new PerformanceCounter();
      this.commands.set(commandName, counter);
    }

    counter.toggleTimer();
  }

  toggleEffectTimer(effect: string | undefined) {
    const effectName = effect ?? 'Unspecified';
    let counter = this.effects.get(effectName);

    if (!counter) {
      counter = new PerformanceCounter();
      this.effects.set(effectName, counter);
    }

    counter.toggleTimer();
  }
}

const counters = new Map<string, StorePerformanceCounter>();
const counterStore = {
  name: '@signalstory/performance-counter',
  state() {
    return getReport();
  },
};

function getReport() {
  const flatResult: any = {
    commands: [],
    effects: [],
  };

  const flattenCounterEntries = (
    key: string,
    entries: Map<string, PerformanceCounter>,
    storeName: string
  ) => {
    entries.forEach((counter, counterName) => {
      flatResult[key].push({
        store: storeName,
        name: counterName,
        ...counter.getReport(),
      });
    });
  };

  counters.forEach((counter, storeName) => {
    flattenCounterEntries('commands', counter.commands, storeName);
    flattenCounterEntries('effects', counter.effects, storeName);
  });

  return flatResult;
}

/**
 * Enables StorePlugin that logs command and effect execution
 * @returns A StorePlugin instance for logging.
 */
export function useBenchmark(): StorePlugin {
  return {
    init(store) {
      if (!counters.has(store.name)) {
        counters.set(store.name, new StorePerformanceCounter(store.name));
      }
      if (!registry.has(counterStore.name)) {
        registry.set(counterStore.name, new WeakRef(counterStore) as any);
      }
    },
    preprocessCommand(store, command) {
      counters.get(store.name)?.toggleCommandTimer(command);
    },
    postprocessCommand(store, command) {
      counters.get(store.name)?.toggleCommandTimer(command);
    },
    preprocessEffect(store, effect) {
      console.log(`${effect.name} STARTED`);
      counters.get(store.name)?.toggleEffectTimer(effect.name);
    },
    postprocessEffect(store, effect) {
      console.log(`${effect.name} ENDED`);
      counters.get(store.name)?.toggleEffectTimer(effect.name);
    },
  };
}
