/* eslint-disable tree-shaking/no-side-effects-in-initialization */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { StorePlugin } from '../store-plugin';
import { registry } from '../store-plugin-devtools/plugin-devtools';
import { PerformanceCounter } from './performance-counter';

type StoreCounter = {
  name: string;
  store: string;
  counter: PerformanceCounter;
};

const globalCommandCounter: PerformanceCounter =
  /*@__PURE__*/ new PerformanceCounter();
const globalEffectCounter: PerformanceCounter =
  /*@__PURE__*/ new PerformanceCounter();
const commandCounters: StoreCounter[] = [];
const effectCounters: StoreCounter[] = [];

function toggleCommandTimer(store: string, command?: string) {
  const commandName = command ?? 'Unspecified';
  const counterRegistration = commandCounters.find(
    c => c.store === store && c.name === commandName
  );
  const counter = counterRegistration?.counter ?? new PerformanceCounter();

  if (!counterRegistration) {
    commandCounters.push({
      name: commandName,
      store,
      counter,
    });
  }

  counter.toggleTimer();
}

function addEffectDuration(
  store: string,
  effect: string | undefined,
  duration: number
) {
  const effectName = effect ?? 'Unspecified';
  const counterRegistration = effectCounters.find(
    e => e.store === store && e.name === effectName
  );
  const counter = counterRegistration?.counter ?? new PerformanceCounter();

  if (!counterRegistration) {
    effectCounters.push({
      name: effectName,
      store,
      counter,
    });
  }

  counter.addDuration(duration);
}

function getReport() {
  const globalCommandReport = globalCommandCounter.getReport();
  const globalEffectReport = globalEffectCounter.getReport();
  return {
    totalCommandCount: globalCommandReport.count,
    averageCommandDurationMs: globalCommandReport.averageDurationMs,
    commandDurationStandartDeviation: globalCommandReport.standardDeviation,
    totalEffectCount: globalEffectReport.count,
    averageEffectDurationMs: globalEffectReport.averageDurationMs,
    effectDurationStandartDeviation: globalEffectReport.standardDeviation,
    commands: commandCounters
      .map(c => ({
        name: c.name,
        store: c.store,
        ...c.counter.getReport(),
      }))
      .sort((a, b) => b.averageDurationMs - a.averageDurationMs),
    effects: effectCounters
      .map(e => ({
        name: e.name,
        store: e.store,
        ...e.counter.getReport(),
      }))
      .sort((a, b) => b.averageDurationMs - a.averageDurationMs),
  };
}

const counterStore = {
  name: '@signalstory/performance-counter',
  state() {
    return getReport();
  },
};

/**
 * Enables StorePlugin that logs command and effect execution
 * @returns A StorePlugin instance for logging.
 */
export function useBenchmark(): StorePlugin {
  return {
    init() {
      if (!registry.has(counterStore.name)) {
        registry.set(counterStore.name, new WeakRef(counterStore) as any);
      }
    },
    preprocessCommand(store, command) {
      globalCommandCounter.toggleTimer();
      toggleCommandTimer(store.name, command);
    },
    postprocessCommand(store, command) {
      globalCommandCounter.toggleTimer();
      toggleCommandTimer(store.name, command);
    },
    postprocessEffect(store, effect, _, invocationId) {
      const duration = Math.floor(performance.now() - invocationId);
      globalEffectCounter.addDuration(duration);
      addEffectDuration(store.name, effect.name, duration);
    },
  };
}
