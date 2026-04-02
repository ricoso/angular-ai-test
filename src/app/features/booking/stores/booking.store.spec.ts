import { TestBed } from '@angular/core/testing';

import type { AppointmentSlot } from '../models/appointment.model';
import { AVAILABLE_BRANDS } from '../models/brand.model';
import { LOCATIONS_BY_BRAND } from '../models/location.model';
import { AVAILABLE_SERVICES } from '../models/service.model';
import { AppointmentApiService } from '../services/appointment-api.service';
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
        { provide: BookingApiService, useValue: apiSpy },
        { provide: AppointmentApiService, useValue: { getAppointments: jest.fn().mockResolvedValue([]) } }
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
      store.toggleService('tuv');
      expect(store.selectedServices()).toEqual([{ serviceId: 'tuv', selectedOptionIds: [] }]);
      expect(store.selectedServiceCount()).toBe(1);
      expect(store.hasServicesSelected()).toBe(true);
    });

    it('should toggle service off', () => {
      store.toggleService('tuv');
      store.toggleService('tuv');
      expect(store.selectedServices()).toEqual([]);
      expect(store.selectedServiceCount()).toBe(0);
    });

    it('should support multi-select', () => {
      store.toggleService('tuv');
      store.toggleService('inspection');
      expect(store.selectedServiceCount()).toBe(2);
    });

    it('should confirm service options', () => {
      store.confirmServiceOptions('tire-change', ['bring-own-tires']);
      expect(store.selectedServices()).toEqual([
        { serviceId: 'tire-change', selectedOptionIds: ['bring-own-tires'] }
      ]);
    });

    it('should switch service options', () => {
      store.confirmServiceOptions('tire-change', ['bring-own-tires']);
      store.confirmServiceOptions('tire-change', ['stored-tires']);
      expect(store.selectedServices()).toEqual([
        { serviceId: 'tire-change', selectedOptionIds: ['stored-tires'] }
      ]);
    });

    it('should deselect service', () => {
      store.confirmServiceOptions('tire-change', ['bring-own-tires']);
      store.deselectService('tire-change');
      expect(store.selectedServices()).toEqual([]);
    });

    it('should clear selected services', () => {
      store.toggleService('tuv');
      store.toggleService('inspection');
      store.clearSelectedServices();
      expect(store.selectedServices()).toEqual([]);
    });
  });

  describe('clearSelectedLocation', () => {
    it('should clear selected location', () => {
      store.setLocation(LOCATIONS_BY_BRAND.audi[0]);
      expect(store.selectedLocation()).not.toBeNull();
      store.clearSelectedLocation();
      expect(store.selectedLocation()).toBeNull();
    });

    it('should update hasLocationSelected to false', () => {
      store.setLocation(LOCATIONS_BY_BRAND.audi[0]);
      expect(store.hasLocationSelected()).toBe(true);
      store.clearSelectedLocation();
      expect(store.hasLocationSelected()).toBe(false);
    });

    it('should be idempotent when already null', () => {
      expect(store.selectedLocation()).toBeNull();
      store.clearSelectedLocation();
      expect(store.selectedLocation()).toBeNull();
    });
  });

  describe('clearBookingNote', () => {
    it('should clear booking note', () => {
      store.setBookingNote('Test note');
      expect(store.bookingNote()).toBe('Test note');
      store.clearBookingNote();
      expect(store.bookingNote()).toBeNull();
    });

    it('should update hasBookingNote to false', () => {
      store.setBookingNote('Test note');
      expect(store.hasBookingNote()).toBe(true);
      store.clearBookingNote();
      expect(store.hasBookingNote()).toBe(false);
    });

    it('should be idempotent when already null', () => {
      expect(store.bookingNote()).toBeNull();
      store.clearBookingNote();
      expect(store.bookingNote()).toBeNull();
    });
  });

  describe('clearSelectedAppointment', () => {
    const mockAppointment: AppointmentSlot = {
      id: '2026-02-25-09-00',
      date: '2026-02-25',
      displayDate: '25.02.2026',
      dayAbbreviation: 'Mi',
      time: '09:00',
      displayTime: '09:00 Uhr'
    };

    it('should clear selected appointment', () => {
      store.selectAppointment(mockAppointment);
      expect(store.selectedAppointment()).not.toBeNull();
      store.clearSelectedAppointment();
      expect(store.selectedAppointment()).toBeNull();
    });

    it('should update hasAppointmentSelected to false', () => {
      store.selectAppointment(mockAppointment);
      expect(store.hasAppointmentSelected()).toBe(true);
      store.clearSelectedAppointment();
      expect(store.hasAppointmentSelected()).toBe(false);
    });

    it('should be idempotent when already null', () => {
      expect(store.selectedAppointment()).toBeNull();
      store.clearSelectedAppointment();
      expect(store.selectedAppointment()).toBeNull();
    });
  });

  describe('setCustomerInfo', () => {
    it('should set customerInfo', () => {
      expect(store.customerInfo()).toBeNull();
      store.setCustomerInfo({
        email: 'test@example.com',
        salutation: 'mr',
        firstName: 'Max',
        lastName: 'Mustermann',
        street: 'Musterstraße 1',
        postalCode: '12345',
        city: 'Musterstadt',
        mobilePhone: '+49151123456'
      });
      expect(store.customerInfo()?.email).toBe('test@example.com');
    });
  });

  describe('setVehicleInfo', () => {
    it('should set vehicleInfo', () => {
      expect(store.vehicleInfo()).toBeNull();
      store.setVehicleInfo({ licensePlate: 'B-AB 1234', mileage: 50000, vin: 'WVWZZZ3BZWE689725' });
      expect(store.vehicleInfo()?.licensePlate).toBe('B-AB 1234');
    });
  });

  describe('setPrivacyConsent', () => {
    it('should set privacyConsent to true', () => {
      expect(store.privacyConsent()).toBe(false);
      store.setPrivacyConsent(true);
      expect(store.privacyConsent()).toBe(true);
    });

    it('should set privacyConsent back to false', () => {
      store.setPrivacyConsent(true);
      store.setPrivacyConsent(false);
      expect(store.privacyConsent()).toBe(false);
    });
  });

  describe('clearCarInformation', () => {
    it('should clear all car information fields', () => {
      store.setCustomerInfo({
        email: 'test@example.com',
        salutation: 'ms',
        firstName: 'Erika',
        lastName: 'Musterfrau',
        street: 'Musterstraße 2',
        postalCode: '12345',
        city: 'Musterstadt',
        mobilePhone: '+49151000000'
      });
      store.setVehicleInfo({ licensePlate: 'M-XY 5678', mileage: 10000, vin: '' });
      store.setPrivacyConsent(true);

      store.clearCarInformation();

      expect(store.customerInfo()).toBeNull();
      expect(store.vehicleInfo()).toBeNull();
      expect(store.privacyConsent()).toBe(false);
    });
  });

});
