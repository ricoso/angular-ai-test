import { TestBed } from '@angular/core/testing';

import { AVAILABLE_BRANDS } from '../models/brand.model';
import { LOCATIONS_BY_BRAND } from '../models/location.model';
import { AVAILABLE_SERVICES } from '../models/service.model';
import { BookingApiService } from '../services/booking-api.service';

import { BookingStore } from './booking.store';

describe('BookingStore', () => {
  let store: InstanceType<typeof BookingStore>;
  let apiSpy: jest.Mocked<BookingApiService>;

  beforeEach(() => {
    apiSpy = {
      getBrands: jest.fn().mockResolvedValue(AVAILABLE_BRANDS),
      getLocations: jest.fn().mockResolvedValue(LOCATIONS_BY_BRAND.audi),
      getServices: jest.fn().mockResolvedValue(AVAILABLE_SERVICES)
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

    it('should handle API error with Error instance', async () => {
      apiSpy.getBrands.mockRejectedValueOnce(new Error('Network error'));
      store.loadBrands();
      await new Promise(resolve => setTimeout(resolve, 0));
      expect(store.error()).toBe('Network error');
      expect(store.isLoading()).toBe(false);
    });

    it('should handle API error with non-Error value', async () => {
      apiSpy.getBrands.mockRejectedValueOnce('string error');
      store.loadBrands();
      await new Promise(resolve => setTimeout(resolve, 0));
      expect(store.error()).toBe('Unknown error');
      expect(store.isLoading()).toBe(false);
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

    it('should handle API error with Error instance', async () => {
      store.setBrand('audi');
      apiSpy.getLocations.mockRejectedValueOnce(new Error('Location error'));
      store.loadLocations();
      await new Promise(resolve => setTimeout(resolve, 0));
      expect(store.error()).toBe('Location error');
      expect(store.isLoading()).toBe(false);
    });

    it('should handle API error with non-Error value', async () => {
      store.setBrand('audi');
      apiSpy.getLocations.mockRejectedValueOnce(42);
      store.loadLocations();
      await new Promise(resolve => setTimeout(resolve, 0));
      expect(store.error()).toBe('Unknown error');
      expect(store.isLoading()).toBe(false);
    });
  });

  describe('Services', () => {
    it('should have empty services initially', () => {
      expect(store.services()).toEqual([]);
      expect(store.selectedServices()).toEqual([]);
    });

    it('should compute selectedServiceCount as 0 initially', () => {
      expect(store.selectedServiceCount()).toBe(0);
    });

    it('should compute hasServicesSelected as false initially', () => {
      expect(store.hasServicesSelected()).toBe(false);
    });

    it('should load services from API', async () => {
      store.loadServices();
      await new Promise(resolve => setTimeout(resolve, 0));
      expect(store.services()).toEqual(AVAILABLE_SERVICES);
      expect(apiSpy.getServices).toHaveBeenCalled();
    });

    it('should handle loadServices API error with Error instance', async () => {
      apiSpy.getServices.mockRejectedValueOnce(new Error('Service error'));
      store.loadServices();
      await new Promise(resolve => setTimeout(resolve, 0));
      expect(store.error()).toBe('Service error');
      expect(store.isLoading()).toBe(false);
    });

    it('should handle loadServices API error with non-Error value', async () => {
      apiSpy.getServices.mockRejectedValueOnce(null);
      store.loadServices();
      await new Promise(resolve => setTimeout(resolve, 0));
      expect(store.error()).toBe('Unknown error');
      expect(store.isLoading()).toBe(false);
    });

    it('should toggle service on', () => {
      store.toggleService('huau');
      expect(store.selectedServices()).toEqual([{ serviceId: 'huau', selectedVariantId: null }]);
      expect(store.selectedServiceCount()).toBe(1);
      expect(store.hasServicesSelected()).toBe(true);
    });

    it('should toggle service off', () => {
      store.toggleService('huau');
      store.toggleService('huau');
      expect(store.selectedServices()).toEqual([]);
      expect(store.selectedServiceCount()).toBe(0);
    });

    it('should support multi-select', () => {
      store.toggleService('huau');
      store.toggleService('inspection');
      expect(store.selectedServiceCount()).toBe(2);
    });

    it('should confirm tire change with variant', () => {
      store.confirmTireChange('without-storage');
      expect(store.selectedServices()).toEqual([
        { serviceId: 'tire-change', selectedVariantId: 'without-storage' }
      ]);
    });

    it('should switch tire change variant', () => {
      store.confirmTireChange('without-storage');
      store.confirmTireChange('with-storage');
      expect(store.selectedServices()).toEqual([
        { serviceId: 'tire-change', selectedVariantId: 'with-storage' }
      ]);
    });

    it('should deselect tire change', () => {
      store.confirmTireChange('without-storage');
      store.deselectTireChange();
      expect(store.selectedServices()).toEqual([]);
    });

    it('should clear selected services', () => {
      store.toggleService('huau');
      store.toggleService('inspection');
      store.clearSelectedServices();
      expect(store.selectedServices()).toEqual([]);
    });
  });

  describe('resetBooking', () => {
    it('should reset to initial state', () => {
      store.setBrand('bmw');
      store.setLocation(LOCATIONS_BY_BRAND.bmw[0]);
      store.toggleService('huau');
      store.resetBooking();
      expect(store.selectedBrand()).toBeNull();
      expect(store.selectedLocation()).toBeNull();
      expect(store.brands()).toEqual([]);
      expect(store.locations()).toEqual([]);
      expect(store.services()).toEqual([]);
      expect(store.selectedServices()).toEqual([]);
      expect(store.isLoading()).toBe(false);
      expect(store.error()).toBeNull();
    });
  });
});
