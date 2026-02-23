import { TestBed } from '@angular/core/testing';
import type { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Router } from '@angular/router';

import { BookingApiService } from '../services/booking-api.service';
import { BookingStore } from '../stores/booking.store';

import { brandSelectedGuard } from './brand-selected.guard';

describe('brandSelectedGuard', () => {
  let store: InstanceType<typeof BookingStore>;
  let router: Router;

  beforeEach(() => {
    const mockUrlTree = { toString: () => '/mock' } as unknown as UrlTree;

    TestBed.configureTestingModule({
      providers: [
        BookingStore,
        { provide: BookingApiService, useValue: { getBrands: jest.fn().mockResolvedValue([]) } },
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
      brandSelectedGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
    );
    expect(result).not.toBe(true);
    expect(router.createUrlTree).toHaveBeenCalledWith(['/home/brand']);
  });

  it('should allow access when brand is selected', () => {
    store.setBrand('audi');
    const result = TestBed.runInInjectionContext(() =>
      brandSelectedGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
    );
    expect(result).toBe(true);
    expect(router.createUrlTree).not.toHaveBeenCalled();
  });
});
