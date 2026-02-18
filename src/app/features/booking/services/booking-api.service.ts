import { Injectable } from '@angular/core';

import type { Brand, BrandDisplay } from '../models/brand.model';
import { AVAILABLE_BRANDS } from '../models/brand.model';
import type { LocationDisplay } from '../models/location.model';
import { LOCATIONS_BY_BRAND } from '../models/location.model';

/**
 * API Service for booking data
 * Click-Dummy: Returns static data, no real backend
 */
@Injectable({ providedIn: 'root' })
export class BookingApiService {
  public getBrands(): Promise<BrandDisplay[]> {
    console.debug('[BookingApiService] getBrands() called');
    return Promise.resolve(AVAILABLE_BRANDS);
  }

  public getLocations(brand: Brand): Promise<LocationDisplay[]> {
    console.debug('[BookingApiService] getLocations() called for brand:', brand);
    return Promise.resolve(LOCATIONS_BY_BRAND[brand]);
  }
}
