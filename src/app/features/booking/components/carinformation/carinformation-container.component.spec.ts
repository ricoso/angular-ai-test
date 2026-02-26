import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import type { AppointmentSlot } from '../../models/appointment.model';
import { AppointmentApiService } from '../../services/appointment-api.service';
import { BookingApiService } from '../../services/booking-api.service';
import { WorkshopCalendarApiService } from '../../services/workshop-calendar-api.service';
import { BookingStore } from '../../stores/booking.store';

import { CarinformationContainerComponent } from './carinformation-container.component';

describe('CarinformationContainerComponent', () => {
  let component: CarinformationContainerComponent;
  let fixture: ComponentFixture<CarinformationContainerComponent>;
  let store: InstanceType<typeof BookingStore>;
  let router: jest.Mocked<Router>;

  const mockAppointment: AppointmentSlot = {
    id: '2026-02-25-09-00',
    date: '2026-02-25',
    displayDate: '25.02.2026',
    dayAbbreviation: 'Mi',
    time: '09:00',
    displayTime: '09:00 Uhr'
  };

  beforeEach(async () => {
    router = { navigate: jest.fn() } as unknown as jest.Mocked<Router>;

    await TestBed.configureTestingModule({
      imports: [CarinformationContainerComponent],
      providers: [
        BookingStore,
        { provide: BookingApiService, useValue: { getBrands: jest.fn().mockResolvedValue([]), getLocations: jest.fn().mockResolvedValue([]), getServices: jest.fn().mockResolvedValue([]) } },
        { provide: AppointmentApiService, useValue: { getAppointments: jest.fn().mockResolvedValue([]) } },
        { provide: WorkshopCalendarApiService, useValue: { getWorkshopCalendarDays: jest.fn().mockResolvedValue([]) } },
        { provide: Router, useValue: router }
      ]
    })
      .overrideComponent(CarinformationContainerComponent, {
        set: { template: '<div class="mocked">Mocked Carinformation</div>' }
      })
      .compileComponents();

    store = TestBed.inject(BookingStore);
    fixture = TestBed.createComponent(CarinformationContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onBack', () => {
    it('should clear selected appointment and navigate back', () => {
      store.selectAppointment(mockAppointment);
      expect(store.selectedAppointment()).not.toBeNull();

      const exposed = component as unknown as { onBack: () => void };
      exposed.onBack();

      expect(store.selectedAppointment()).toBeNull();
      expect(router.navigate).toHaveBeenCalledWith(['/home/appointment']);
    });
  });

  describe('onRetrieveData', () => {
    it('should log a debug message (click-dummy)', () => {
      const consoleSpy = jest.spyOn(console, 'debug').mockImplementation();
      const exposed = component as unknown as { onRetrieveData: () => void };
      exposed.onRetrieveData();

      expect(consoleSpy).toHaveBeenCalledWith(
        '[CarinformationContainer] Retrieve data clicked (Click-Dummy — no action)'
      );
      consoleSpy.mockRestore();
    });
  });

  describe('onSubmit', () => {
    it('should not navigate when forms are invalid', () => {
      const exposed = component as unknown as { onSubmit: () => void };
      exposed.onSubmit();

      expect(router.navigate).not.toHaveBeenCalled();
    });

    it('should save data to store and navigate when forms are valid', () => {
      const exposed = component as unknown as {
        onSubmit: () => void;
        customerForm: () => { patchValue: (val: Record<string, unknown>) => void; markAllAsTouched: () => void; valid: boolean };
        vehicleForm: () => { patchValue: (val: Record<string, unknown>) => void; markAllAsTouched: () => void; valid: boolean };
        privacyConsent: () => boolean;
      };

      const customerFormGroup = exposed.customerForm();
      customerFormGroup.patchValue({
        email: 'max@mustermann.de',
        salutation: 'mr',
        firstName: 'Max',
        lastName: 'Mustermann',
        street: 'Musterweg 1',
        postalCode: '30159',
        city: 'Berlin',
        mobilePhone: '017012345678'
      });

      const vehicleFormGroup = exposed.vehicleForm();
      vehicleFormGroup.patchValue({
        licensePlate: 'B-MS1234',
        mileage: '50000',
        vin: 'WBAPH5C55BA123456'
      });

      const consentSetter = component as unknown as { onPrivacyConsentChange: (checked: boolean) => void };
      consentSetter.onPrivacyConsentChange(true);

      exposed.onSubmit();

      expect(store.customerInfo()).toEqual({
        email: 'max@mustermann.de',
        salutation: 'mr',
        firstName: 'Max',
        lastName: 'Mustermann',
        street: 'Musterweg 1',
        postalCode: '30159',
        city: 'Berlin',
        mobilePhone: '017012345678'
      });
      expect(store.vehicleInfo()).toEqual({
        licensePlate: 'B-MS1234',
        mileage: 50000,
        vin: 'WBAPH5C55BA123456'
      });
      expect(store.privacyConsent()).toBe(true);
      expect(router.navigate).toHaveBeenCalledWith(['/home/carinformation']);
    });
  });

  describe('onPrivacyConsentChange', () => {
    it('should update privacy consent signal', () => {
      const exposed = component as unknown as {
        onPrivacyConsentChange: (checked: boolean) => void;
        privacyConsent: () => boolean;
      };

      expect(exposed.privacyConsent()).toBe(false);
      exposed.onPrivacyConsentChange(true);
      expect(exposed.privacyConsent()).toBe(true);
    });
  });

  describe('isFormValid', () => {
    it('should be false initially', () => {
      const exposed = component as unknown as { isFormValid: () => boolean };
      expect(exposed.isFormValid()).toBe(false);
    });
  });

  describe('prefill forms', () => {
    it('should prefill customer form when store has customerInfo', () => {
      store.setCustomerInfo({
        email: 'test@test.de',
        salutation: 'ms',
        firstName: 'Anna',
        lastName: 'Schmidt',
        street: 'Testweg 2',
        postalCode: '12345',
        city: 'Hamburg',
        mobilePhone: '015012345678'
      });

      fixture = TestBed.createComponent(CarinformationContainerComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      const exposed = component as unknown as { customerForm: () => { get: (name: string) => { value: string } } };
      expect(exposed.customerForm().get('email').value).toBe('test@test.de');
      expect(exposed.customerForm().get('firstName').value).toBe('Anna');
    });

    it('should prefill vehicle form when store has vehicleInfo', () => {
      store.setVehicleInfo({
        licensePlate: 'HH-AB123',
        mileage: 75000,
        vin: 'WBAPH5C55BA999999'
      });

      fixture = TestBed.createComponent(CarinformationContainerComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      const exposed = component as unknown as { vehicleForm: () => { get: (name: string) => { value: string } } };
      expect(exposed.vehicleForm().get('licensePlate').value).toBe('HH-AB123');
      expect(exposed.vehicleForm().get('mileage').value).toBe('75000');
    });
  });
});
