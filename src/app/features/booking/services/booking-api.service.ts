import { Injectable } from '@angular/core';

import type { BrandDisplay } from '../models/brand.model';
import { AVAILABLE_BRANDS } from '../models/brand.model';

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
}
