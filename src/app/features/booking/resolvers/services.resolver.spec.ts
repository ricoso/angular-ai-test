import { TestBed } from '@angular/core/testing';
import type { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AVAILABLE_SERVICES } from '../models/service.model';
import { BookingApiService } from '../services/booking-api.service';
import { BookingStore } from '../stores/booking.store';

import { servicesResolver } from './services.resolver';

describe('servicesResolver', () => {
  let store: InstanceType<typeof BookingStore>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BookingStore,
        {
          provide: BookingApiService,
          useValue: {
            getBrands: jest.fn().mockResolvedValue([]),
            getLocations: jest.fn().mockResolvedValue([]),
            getServices: jest.fn().mockResolvedValue(AVAILABLE_SERVICES)
          }
        }
      ]
    });

    store = TestBed.inject(BookingStore);
  });

  it('should call store.loadServices', () => {
    const spy = jest.spyOn(store, 'loadServices');
    TestBed.runInInjectionContext(() =>
      servicesResolver({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
    );
    expect(spy).toHaveBeenCalled();
  });

  it('should return void', () => {
    const result = TestBed.runInInjectionContext(() =>
      servicesResolver({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
    );
    expect(result).toBeUndefined();
  });
});
