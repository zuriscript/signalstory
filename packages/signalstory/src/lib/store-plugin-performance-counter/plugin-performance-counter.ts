/* eslint-disable @typescript-eslint/no-explicit-any */
import { StorePlugin } from '../store-plugin';
import { registry } from '../store-plugin-devtools/plugin-devtools';
import { isDevtoolsAvailable } from '../utility/feature-detection';
import { PerformanceCounter } from './performance-counter';

/**
 * Represents a counter associated with a specific store, tracking command execution metrics.
 */
type StoreCounter = {
  name: string;
  store: string;
  counter: PerformanceCounter;
};

// Counters
const globalCommandCounter: PerformanceCounter =
  /*@__PURE__*/ new PerformanceCounter();
const globalEffectCounter: PerformanceCounter =
  /*@__PURE__*/ new PerformanceCounter();
const commandCounters: StoreCounter[] = [];
const effectCounters: StoreCounter[] = [];

/**
 * Toggles the timer for a specific command, updating the associated counter.
 * @param store - The name of the store.
 * @param command - The name of the command.
 */
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

/**
 * Adds the duration of an effect to the associated counter.
 * @param store - The name of the store.
 * @param effect - The name of the effect.
 * @param duration - The duration of the effect execution.
 */
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

/**
 * Generates and returns a performance report with various metrics.
 * @returns An object containing performance statistics.
 */
export function getReport() {
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

/**
 * Store-Like object for registering the performance counters in redux devtools
 */
const counterStore = {
  name: '@signalstory/performance-counter',
  state() {
    return getReport();
  },
};

/**
 * Returns a StorePlugin that includes initialization and hooks for tracking command and effect performance.
 * @returns The StorePlugin for performance tracking.
 */
export function usePerformanceCounter(): StorePlugin {
  return {
    precedence: 11, // should come early in initialization
    init() {
      if (isDevtoolsAvailable() && !registry.has(counterStore.name)) {
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
