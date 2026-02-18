import { computed, inject } from '@angular/core';

import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';

import { from, pipe, switchMap, tap } from 'rxjs';

import type { Brand, BrandDisplay } from '../models/brand.model';
import type { LocationDisplay } from '../models/location.model';
import { BookingApiService } from '../services/booking-api.service';

interface BookingState {
  brands: BrandDisplay[];
  selectedBrand: Brand | null;
  locations: LocationDisplay[];
  selectedLocation: LocationDisplay | null;
  isLoading: boolean;
  error: string | null;
}

const INITIAL_STATE: BookingState = {
  brands: [],
  selectedBrand: null,
  locations: [],
  selectedLocation: null,
  isLoading: false,
  error: null
};

export const BookingStore = signalStore(
  { providedIn: 'root' },

  withState<BookingState>(INITIAL_STATE),

  withComputed(({ brands, selectedBrand, locations, selectedLocation }) => ({
    hasBrandSelected: computed(() => selectedBrand() !== null),
    brandCount: computed(() => brands().length),
    filteredLocations: computed(() => locations()),
    locationCount: computed(() => locations().length),
    hasLocationSelected: computed(() => selectedLocation() !== null)
  })),

  withMethods((store, api = inject(BookingApiService)) => ({
    loadBrands: rxMethod<void>(
      pipe(
        tap(() => { patchState(store, { isLoading: true, error: null }); }),
        switchMap(() => from(api.getBrands())),
        tap({
          next: (brands) => {
            console.debug('[BookingStore] Brands loaded:', brands);
            patchState(store, { brands, isLoading: false });
          },
          error: (err: unknown) => {
            const message = err instanceof Error ? err.message : 'Unknown error';
            patchState(store, { error: message, isLoading: false });
          }
        })
      )
    ),

    loadLocations: rxMethod<void>(
      pipe(
        tap(() => { patchState(store, { isLoading: true, error: null }); }),
        switchMap(() => {
          const brand = store.selectedBrand();
          if (!brand) {
            patchState(store, { locations: [], isLoading: false });
            return [];
          }
          return from(api.getLocations(brand));
        }),
        tap({
          next: (locations) => {
            console.debug('[BookingStore] Locations loaded:', locations);
            patchState(store, { locations, isLoading: false });
          },
          error: (err: unknown) => {
            const message = err instanceof Error ? err.message : 'Unknown error';
            patchState(store, { error: message, isLoading: false });
          }
        })
      )
    ),

    setBrand(brand: Brand): void {
      console.debug('[BookingStore] setBrand:', brand);
      patchState(store, { selectedBrand: brand });
    },

    setLocation(location: LocationDisplay): void {
      console.debug('[BookingStore] setLocation:', location);
      patchState(store, { selectedLocation: location });
    },

    resetBooking(): void {
      patchState(store, INITIAL_STATE);
    }
  }))
);
