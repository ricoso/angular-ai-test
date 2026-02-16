import { computed, inject } from '@angular/core';

import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';

import { from, pipe, switchMap, tap } from 'rxjs';

import type { Brand, BrandDisplay } from '../models/brand.model';
import { BookingApiService } from '../services/booking-api.service';

interface BookingState {
  brands: BrandDisplay[];
  selectedBrand: Brand | null;
  isLoading: boolean;
  error: string | null;
}

const INITIAL_STATE: BookingState = {
  brands: [],
  selectedBrand: null,
  isLoading: false,
  error: null
};

export const BookingStore = signalStore(
  { providedIn: 'root' },

  withState<BookingState>(INITIAL_STATE),

  withComputed(({ brands, selectedBrand }) => ({
    hasBrandSelected: computed(() => selectedBrand() !== null),
    brandCount: computed(() => brands().length)

  })),

  withMethods((store, api = inject(BookingApiService)) => ({
    loadBrands: rxMethod<void>(
      pipe(
        tap(() => { patchState(store, { isLoading: true, error: null }); }),
        switchMap(() => from(api.getBrands())),
        tap({
          next: (brands) => {
            console.log('[BookingStore] Brands loaded:', brands);
            patchState(store, { brands, isLoading: false });
          },
          error: (error) => { patchState(store, { error: error.message, isLoading: false }); }
        })
      )
    ),


    setBrand(brand: Brand): void {
      console.log('[BookingStore] setBrand:', brand);
      patchState(store, { selectedBrand: brand });
    },


    resetBooking(): void {
      patchState(store, INITIAL_STATE);
    }
  }))
);
