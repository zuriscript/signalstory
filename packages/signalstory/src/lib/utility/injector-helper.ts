import { Injector, inject } from '@angular/core';

export function getInjectorOrNull(): Injector | null {
  try {
    return inject(Injector);
  } catch (_) {
    return null;
  }
}
