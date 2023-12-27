/* eslint-disable tree-shaking/no-side-effects-in-initialization */

import { PerformanceCounter } from '../lib/store-plugin-performance-counter/performance-counter';

describe('PerformanceCounter', () => {
  let performanceCounter: PerformanceCounter;
  jest.useFakeTimers();

  beforeEach(() => {
    performanceCounter = new PerformanceCounter();
  });

  describe('when initialized', () => {
    it('should have correct initial values', () => {
      // Assert
      expect(performanceCounter.isRunning).toBe(false);
      expect(performanceCounter.getReport()).toEqual({
        count: 0,
        maxDurationMs: 0,
        averageDurationMs: 0,
        standardDeviation: 0,
      });
    });
  });

  describe('when measuring performance', () => {
    it('should correctly measure and report performance', () => {
      // Arrange
      performanceCounter.startTimer();

      // Act
      jest.advanceTimersByTime(100); // Simulate 100ms passing
      performanceCounter.stopTimer();

      // Assert
      const report = performanceCounter.getReport();

      expect(report.count).toBe(1);
      expect(report.maxDurationMs).toBeGreaterThanOrEqual(100);
      expect(report.averageDurationMs).toBeGreaterThanOrEqual(100);
      expect(report.standardDeviation).toBe(0);
    });
    it('should handle multiple measurements and calculate averages', () => {
      // Arrange & Act
      performanceCounter.startTimer();
      jest.advanceTimersByTime(50);
      performanceCounter.stopTimer();

      performanceCounter.startTimer();
      jest.advanceTimersByTime(150);
      performanceCounter.stopTimer();

      // Assert
      const report = performanceCounter.getReport();

      expect(report.count).toBe(2);
      expect(report.maxDurationMs).toBe(150);
      expect(report.averageDurationMs).toBe(100);
      expect(report.standardDeviation).toBe(50);
    });
  });

  describe('when toggling the timer', () => {
    it('should start and stop the timer correctly', () => {
      // Arrange & Act
      performanceCounter.toggleTimer();

      // Assert
      expect(performanceCounter.isRunning).toBe(true);

      // Arrange & Act
      performanceCounter.toggleTimer();

      // Assert
      expect(performanceCounter.isRunning).toBe(false);
    });
  });
});
