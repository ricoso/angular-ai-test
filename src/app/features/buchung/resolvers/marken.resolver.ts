import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { of } from 'rxjs';

import { BuchungStore } from '../stores/buchung.store';

export const markenResolver: ResolveFn<void> = () => {
  inject(BuchungStore).ladeMarken();
  return of(void 0);
};
