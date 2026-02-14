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
  async getBrands(): Promise<BrandDisplay[]> {
    console.log('[BookingApiService] getBrands() called');
    return AVAILABLE_BRANDS;
  }

  async getLocations(brand: Brand): Promise<LocationDisplay[]> {
    console.log('[BookingApiService] getLocations() called for brand:', brand);
    return LOCATIONS_BY_BRAND[brand] ?? [];
  }
}
