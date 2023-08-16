import { Injector, inject } from '@angular/core';

/**
 * Attempts to retrieve the Angular injector or returns null if not available.
 *
 * This function utilizes the `inject` function from Angular's dependency injection system
 * to obtain an instance of the Angular `Injector`. If the injector is not available, it
 * gracefully returns null.
 *
 * @returns The Angular injector if available, otherwise null.
 */
export function getInjectorOrNull(): Injector | null {
  try {
    return inject(Injector);
  } catch (_) {
    return null;
  }
}
