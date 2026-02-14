import { TestBed } from '@angular/core/testing';

import { AVAILABLE_BRANDS } from '../models/brand.model';
import { LOCATIONS_BY_BRAND } from '../models/location.model';
import { BookingApiService } from '../services/booking-api.service';

import { BookingStore } from './booking.store';

describe('BookingStore', () => {
  let store: InstanceType<typeof BookingStore>;
  let apiSpy: jest.Mocked<BookingApiService>;

  beforeEach(() => {
    apiSpy = {
      getBrands: jest.fn().mockResolvedValue(AVAILABLE_BRANDS),
      getLocations: jest.fn().mockResolvedValue(LOCATIONS_BY_BRAND.audi)
    } as unknown as jest.Mocked<BookingApiService>;

    TestBed.configureTestingModule({
      providers: [
        BookingStore,
        { provide: BookingApiService, useValue: apiSpy }
      ]
    });

    store = TestBed.inject(BookingStore);
  });

  describe('Initial State', () => {
    it('should have empty brands', () => {
      expect(store.brands()).toEqual([]);
    });

    it('should have no selectedBrand', () => {
      expect(store.selectedBrand()).toBeNull();
    });

    it('should have empty locations', () => {
      expect(store.locations()).toEqual([]);
    });

    it('should have no selectedLocation', () => {
      expect(store.selectedLocation()).toBeNull();
    });

    it('should not be loading', () => {
      expect(store.isLoading()).toBe(false);
    });

    it('should have no error', () => {
      expect(store.error()).toBeNull();
    });
  });

  describe('Computed', () => {
    it('should compute hasBrandSelected as false initially', () => {
      expect(store.hasBrandSelected()).toBe(false);
    });

    it('should compute brandCount as 0 initially', () => {
      expect(store.brandCount()).toBe(0);
    });

    it('should compute hasLocationSelected as false initially', () => {
      expect(store.hasLocationSelected()).toBe(false);
    });

    it('should compute locationCount as 0 initially', () => {
      expect(store.locationCount()).toBe(0);
    });
  });

  describe('setBrand', () => {
    it('should set selectedBrand', () => {
      store.setBrand('bmw');
      expect(store.selectedBrand()).toBe('bmw');
    });

    it('should update hasBrandSelected to true', () => {
      store.setBrand('audi');
      expect(store.hasBrandSelected()).toBe(true);
    });
  });

  describe('setLocation', () => {
    it('should set selectedLocation', () => {
      const location = LOCATIONS_BY_BRAND.audi[0];
      store.setLocation(location);
      expect(store.selectedLocation()).toEqual(location);
    });

    it('should update hasLocationSelected to true', () => {
      store.setLocation(LOCATIONS_BY_BRAND.audi[0]);
      expect(store.hasLocationSelected()).toBe(true);
    });
  });

  describe('loadBrands', () => {
    it('should call API service', () => {
      store.loadBrands();
      expect(apiSpy.getBrands).toHaveBeenCalled();
    });

    it('should load brands from API', async () => {
      store.loadBrands();
      await new Promise(resolve => setTimeout(resolve, 0));
      expect(store.brands()).toEqual(AVAILABLE_BRANDS);
      expect(store.isLoading()).toBe(false);
    });

    it('should update brandCount after load', async () => {
      store.loadBrands();
      await new Promise(resolve => setTimeout(resolve, 0));
      expect(store.brandCount()).toBe(5);
    });
  });

  describe('loadLocations', () => {
    it('should call API service with selected brand', async () => {
      store.setBrand('audi');
      store.loadLocations();
      await new Promise(resolve => setTimeout(resolve, 0));
      expect(apiSpy.getLocations).toHaveBeenCalledWith('audi');
    });

    it('should load locations from API', async () => {
      store.setBrand('audi');
      store.loadLocations();
      await new Promise(resolve => setTimeout(resolve, 0));
      expect(store.locations()).toEqual(LOCATIONS_BY_BRAND.audi);
      expect(store.isLoading()).toBe(false);
    });

    it('should update locationCount after load', async () => {
      store.setBrand('audi');
      store.loadLocations();
      await new Promise(resolve => setTimeout(resolve, 0));
      expect(store.locationCount()).toBe(5);
    });

    it('should return empty locations when no brand selected', async () => {
      store.loadLocations();
      await new Promise(resolve => setTimeout(resolve, 0));
      expect(store.locations()).toEqual([]);
    });
  });

  describe('resetBooking', () => {
    it('should reset to initial state', () => {
      store.setBrand('bmw');
      store.setLocation(LOCATIONS_BY_BRAND.bmw[0]);
      store.resetBooking();
      expect(store.selectedBrand()).toBeNull();
      expect(store.selectedLocation()).toBeNull();
      expect(store.brands()).toEqual([]);
      expect(store.locations()).toEqual([]);
      expect(store.isLoading()).toBe(false);
      expect(store.error()).toBeNull();
    });
  });
});
