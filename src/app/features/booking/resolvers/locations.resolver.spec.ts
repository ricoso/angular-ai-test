import { TestBed } from '@angular/core/testing';
import type { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { BookingApiService } from '../services/booking-api.service';
import { BookingStore } from '../stores/booking.store';

import { locationsResolver } from './locations.resolver';

describe('locationsResolver', () => {
  let store: InstanceType<typeof BookingStore>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BookingStore,
        {
          provide: BookingApiService,
          useValue: {
            getBrands: jest.fn().mockResolvedValue([]),
            getLocations: jest.fn().mockResolvedValue([])
          }
        }
      ]
    });

    store = TestBed.inject(BookingStore);
  });

  it('should call loadLocations on the store', () => {
    const spy = jest.spyOn(store, 'loadLocations');
    TestBed.runInInjectionContext(() =>
      locationsResolver({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
    );
    expect(spy).toHaveBeenCalled();
  });

  it('should return void', () => {
    const result = TestBed.runInInjectionContext(() =>
      locationsResolver({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
    );
    expect(result).toBeUndefined();
  });
});
