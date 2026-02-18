import { computed, inject } from '@angular/core';

import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';

import { catchError, EMPTY, from, pipe, switchMap, tap } from 'rxjs';

import type { Brand, BrandDisplay } from '../models/brand.model';
import type { LocationDisplay } from '../models/location.model';
import type { SelectedService, ServiceDisplay, ServiceType } from '../models/service.model';
import { BookingApiService } from '../services/booking-api.service';

interface BookingState {
  brands: BrandDisplay[];
  selectedBrand: Brand | null;
  locations: LocationDisplay[];
  selectedLocation: LocationDisplay | null;
  services: ServiceDisplay[];
  selectedServices: SelectedService[];
  isLoading: boolean;
  error: string | null;
}

const INITIAL_STATE: BookingState = {
  brands: [],
  selectedBrand: null,
  locations: [],
  selectedLocation: null,
  services: [],
  selectedServices: [],
  isLoading: false,
  error: null
};

export const BookingStore = signalStore(
  { providedIn: 'root' },

  withState<BookingState>(INITIAL_STATE),

  withComputed(({ brands, selectedBrand, locations, selectedLocation, selectedServices }) => ({
    hasBrandSelected: computed(() => selectedBrand() !== null),
    brandCount: computed(() => brands().length),
    filteredLocations: computed(() => locations()),
    locationCount: computed(() => locations().length),
    hasLocationSelected: computed(() => selectedLocation() !== null),
    selectedServiceCount: computed(() => selectedServices().length),
    hasServicesSelected: computed(() => selectedServices().length > 0)
  })),

  withMethods((store, api = inject(BookingApiService)) => ({
    loadBrands: rxMethod<void>(
      pipe(
        tap(() => { patchState(store, { isLoading: true, error: null }); }),
        switchMap(() => from(api.getBrands()).pipe(
          tap((brands) => {
            console.debug('[BookingStore] Brands loaded:', brands);
            patchState(store, { brands, isLoading: false });
          }),
          catchError((err: unknown) => {
            const message = err instanceof Error ? err.message : 'Unknown error';
            patchState(store, { error: message, isLoading: false });
            return EMPTY;
          })
        ))
      )
    ),

    loadLocations: rxMethod<void>(
      pipe(
        tap(() => { patchState(store, { isLoading: true, error: null }); }),
        switchMap(() => {
          const brand = store.selectedBrand();
          if (!brand) {
            patchState(store, { locations: [], isLoading: false });
            return EMPTY;
          }
          return from(api.getLocations(brand)).pipe(
            tap((locations) => {
              console.debug('[BookingStore] Locations loaded:', locations);
              patchState(store, { locations, isLoading: false });
            }),
            catchError((err: unknown) => {
              const message = err instanceof Error ? err.message : 'Unknown error';
              patchState(store, { error: message, isLoading: false });
              return EMPTY;
            })
          );
        })
      )
    ),

    loadServices: rxMethod<void>(
      pipe(
        tap(() => { patchState(store, { isLoading: true, error: null }); }),
        switchMap(() => from(api.getServices()).pipe(
          tap((services) => {
            console.debug('[BookingStore] Services loaded:', services);
            patchState(store, { services, isLoading: false });
          }),
          catchError((err: unknown) => {
            const message = err instanceof Error ? err.message : 'Unknown error';
            patchState(store, { error: message, isLoading: false });
            return EMPTY;
          })
        ))
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

    toggleService(serviceId: ServiceType): void {
      const current = store.selectedServices();
      const exists = current.some(s => s.serviceId === serviceId);
      if (exists) {
        console.debug('[BookingStore] Deselecting service:', serviceId);
        patchState(store, { selectedServices: current.filter(s => s.serviceId !== serviceId) });
      } else {
        console.debug('[BookingStore] Selecting service:', serviceId);
        patchState(store, { selectedServices: [...current, { serviceId, selectedVariantId: null }] });
      }
    },

    confirmTireChange(variantId: string): void {
      console.debug('[BookingStore] Confirming tire change with variant:', variantId);
      const current = store.selectedServices();
      const filtered = current.filter(s => s.serviceId !== 'tire-change');
      patchState(store, {
        selectedServices: [...filtered, { serviceId: 'tire-change', selectedVariantId: variantId }]
      });
    },

    deselectTireChange(): void {
      console.debug('[BookingStore] Deselecting tire change');
      const current = store.selectedServices();
      patchState(store, { selectedServices: current.filter(s => s.serviceId !== 'tire-change') });
    },

    clearSelectedServices(): void {
      patchState(store, { selectedServices: [] });
    },

    resetBooking(): void {
      patchState(store, INITIAL_STATE);
    }
  }))
);
