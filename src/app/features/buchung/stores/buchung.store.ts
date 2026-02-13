import { computed, inject } from '@angular/core';

import { patchState,signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';

import { from,pipe, switchMap, tap } from 'rxjs';

import type { Marke, MarkeAnzeige } from '../models/marke.model';
import { BuchungApiService } from '../services/buchung-api.service';

interface BuchungState {
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

  withComputed(({ marken, gewaehlteMarke }) => ({
    hatMarkeGewaehlt: computed(() => gewaehlteMarke() !== null),
    anzahlMarken: computed(() => marken().length)
  })),

  withMethods((store, api = inject(BuchungApiService)) => ({
    ladeMarken: rxMethod<void>(
      pipe(
        tap(() => { patchState(store, { istLaden: true, fehler: null }); }),
        switchMap(() => from(api.holeMarken())),
        tap({
          next: (marken) => {
            console.log('[BuchungStore] Marken geladen:', marken);
            patchState(store, { marken, istLaden: false });
          },
          error: (error) => { patchState(store, { fehler: error.message, istLaden: false }); }
        })
      )
    ),

    setzeMarke(marke: Marke): void {
      console.log('[BuchungStore] setzeMarke:', marke);
      patchState(store, { gewaehlteMarke: marke });
    },

    resetBuchung(): void {
      patchState(store, INITIAL_STATE);
    }
  }))
);
