import { memoize } from './memoize';

/**
 * Creates a memoized function for feature detection.
 *
 * @param detectionFn - Function that performs the feature detection.
 * @returns Memoized function for feature detection.
 */
function makeFeatureDetector(detectionFn: () => boolean) {
  return memoize(() => {
    try {
      return detectionFn();
    } catch {
      return false;
    }
  });
}

/**
 * Feature detection for IndexedDB availability.
 */
export const isIndexedDbAvailable = /*@__PURE__*/ makeFeatureDetector(
  () => !!indexedDB
);

/**
 * Feature detection for Local Storage availability.
 */
export const isLocalStorageAvailable = /*@__PURE__*/ makeFeatureDetector(
  () => !!localStorage
);

/**
 * Feature detection for Session Storage availability.
 */
export const isSessionStorageAvailable = /*@__PURE__*/ makeFeatureDetector(
  () => !!sessionStorage
);

/**
 * Feature detection for Redux DevTools availability.
 */
export const isDevtoolsAvailable = /*@__PURE__*/ makeFeatureDetector(
  () => window && '__REDUX_DEVTOOLS_EXTENSION__' in window
);

/**
 * Feature detection for setTimeout availability.
 */
export const isSetTimeoutAvailable = /*@__PURE__*/ makeFeatureDetector(
  () => !!setTimeout
);
