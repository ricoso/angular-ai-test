import { TestBed } from '@angular/core/testing';
import type { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Router } from '@angular/router';

import { LOCATIONS_BY_BRAND } from '../models/location.model';
import { AppointmentApiService } from '../services/appointment-api.service';
import { BookingApiService } from '../services/booking-api.service';
import { WorkshopCalendarApiService } from '../services/workshop-calendar-api.service';
import { BookingStore } from '../stores/booking.store';

import { carInformationGuard } from './car-information.guard';

describe('carInformationGuard', () => {
  let store: InstanceType<typeof BookingStore>;
  let router: Router;

  beforeEach(() => {
    const mockUrlTree = { toString: () => '/mock' } as unknown as UrlTree;

    TestBed.configureTestingModule({
      providers: [
        BookingStore,
        {
          provide: BookingApiService,
          useValue: {
            getBrands: jest.fn().mockResolvedValue([]),
            getLocations: jest.fn().mockResolvedValue([]),
            getServices: jest.fn().mockResolvedValue([])
          }
        },
        {
          provide: AppointmentApiService,
          useValue: {
            getAppointments: jest.fn().mockResolvedValue([])
          }
        },
        {
          provide: WorkshopCalendarApiService,
          useValue: {
            getWorkshopCalendarDays: jest.fn().mockResolvedValue([])
          }
        },
        {
          provide: Router,
          useValue: {
            createUrlTree: jest.fn().mockReturnValue(mockUrlTree)
          }
        }
      ]
    });

    store = TestBed.inject(BookingStore);
    router = TestBed.inject(Router);
  });

  it('should redirect to /home/brand when no brand selected', () => {
    const result = TestBed.runInInjectionContext(() =>
      carInformationGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
    );
    expect(result).not.toBe(true);
    expect(router.createUrlTree).toHaveBeenCalledWith(['/home/brand']);
  });

  it('should redirect to /home/location when brand selected but no location', () => {
    store.setBrand('audi');
    const result = TestBed.runInInjectionContext(() =>
      carInformationGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
    );
    expect(result).not.toBe(true);
    expect(router.createUrlTree).toHaveBeenCalledWith(['/home/location']);
  });

  it('should redirect to /home/services when no services selected', () => {
    store.setBrand('audi');
    store.setLocation(LOCATIONS_BY_BRAND.audi[0]);
    const result = TestBed.runInInjectionContext(() =>
      carInformationGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
    );
    expect(result).not.toBe(true);
    expect(router.createUrlTree).toHaveBeenCalledWith(['/home/services']);
  });

  it('should redirect to /home/appointment when no appointment selected', () => {
    store.setBrand('audi');
    store.setLocation(LOCATIONS_BY_BRAND.audi[0]);
    store.toggleService('huau');
    const result = TestBed.runInInjectionContext(() =>
      carInformationGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
    );
    expect(result).not.toBe(true);
    expect(router.createUrlTree).toHaveBeenCalledWith(['/home/appointment']);
  });

  it('should allow access when all prerequisites are met', () => {
    store.setBrand('audi');
    store.setLocation(LOCATIONS_BY_BRAND.audi[0]);
    store.toggleService('huau');
    store.selectAppointment({
      id: 'apt-1',
      date: '2026-03-10',
      displayDate: '10.03.2026',
      dayAbbreviation: 'Di',
      time: '09:00',
      displayTime: '09:00 Uhr'
    });
    const result = TestBed.runInInjectionContext(() =>
      carInformationGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
    );
    expect(result).toBe(true);
  });
});
