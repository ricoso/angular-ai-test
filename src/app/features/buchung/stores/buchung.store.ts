import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { from } from 'rxjs';

import { Marke, MarkeAnzeige } from '../models/marke.model';
import { BuchungApiService } from '../services/buchung-api.service';

export interface BuchungState {
  marken: MarkeAnzeige[];
  gewaehlteMarke: Marke | null;
  istLaden: boolean;
  fehler: string | null;
}

const INITIAL_STATE: BuchungState = {
  marken: [],
  gewaehlteMarke: null,
  istLaden: false,
  fehler: null
};

export const BuchungStore = signalStore(
  { providedIn: 'root' },
  withState<BuchungState>(INITIAL_STATE),

  withComputed((store) => ({
    hatMarkeGewaehlt: computed(() => store.gewaehlteMarke() !== null),
    anzahlMarken: computed(() => store.marken().length)
  })),

  withMethods((store, api = inject(BuchungApiService)) => ({
    ladeMarken: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { istLaden: true, fehler: null })),
        switchMap(() => from(api.holeMarken())),
        tap((marken) => {
          console.log('[BuchungStore] ladeMarken() → ', marken);
          patchState(store, { marken, istLaden: false });
        })
      )
    ),

    setzeMarke(marke: Marke): void {
      console.log('[BuchungStore] setzeMarke() → ', marke);
      patchState(store, { gewaehlteMarke: marke });
    },

    resetBuchung(): void {
      console.log('[BuchungStore] resetBuchung()');
      patchState(store, INITIAL_STATE);
    }
  }))
);
