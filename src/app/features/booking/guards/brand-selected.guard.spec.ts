import { TestBed } from '@angular/core/testing';
import type { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Router } from '@angular/router';

import { BookingApiService } from '../services/booking-api.service';
import { BookingStore } from '../stores/booking.store';

import { brandSelectedGuard } from './brand-selected.guard';

describe('brandSelectedGuard', () => {
  let store: InstanceType<typeof BookingStore>;
  let router: jest.Mocked<Router>;

  beforeEach(() => {
    router = { navigate: jest.fn() } as unknown as jest.Mocked<Router>;

    TestBed.configureTestingModule({
      providers: [
        BookingStore,
        { provide: BookingApiService, useValue: { getBrands: jest.fn().mockResolvedValue([]) } },
        { provide: Router, useValue: router }
      ]
    });

    store = TestBed.inject(BookingStore);
  });

  it('should redirect to /home/brand when no brand selected', () => {
    const result = TestBed.runInInjectionContext(() =>
      brandSelectedGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
    );
    expect(result).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/home/brand']);
  });

  it('should allow access when brand is selected', () => {
    store.setBrand('audi');
    const result = TestBed.runInInjectionContext(() =>
      brandSelectedGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
    );
    expect(result).toBe(true);
    expect(router.navigate).not.toHaveBeenCalled();
  });
});
