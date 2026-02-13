import { inject } from '@angular/core';
import type { ResolveFn } from '@angular/router';

import { BuchungStore } from '../stores/buchung.store';

export const markenResolver: ResolveFn<void> = () => {
  const store = inject(BuchungStore);
  store.ladeMarken();
  return;
};
