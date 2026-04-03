import { Injectable } from '@angular/core';

import type { BranchConfig, BranchConfigFile } from '../models/branch-config.model';
import type { Brand, BrandDisplay } from '../models/brand.model';
import { AVAILABLE_BRANDS, BRANDS_BY_LOCATION } from '../models/brand.model';
import type { LocationDisplay } from '../models/location.model';
import { ALL_LOCATIONS, LOCATIONS_BY_BRAND } from '../models/location.model';
import type { ServiceDisplay } from '../models/service.model';
import { AVAILABLE_SERVICES } from '../models/service.model';

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

  /** REQ-013: Load brands filtered by location */
  public getBrandsByLocation(locationId: string): Promise<BrandDisplay[]> {
    console.debug('[BookingApiService] getBrandsByLocation() called for location:', locationId);
    return Promise.resolve(BRANDS_BY_LOCATION[locationId] ?? []);
  }

  /** REQ-013: Load brands available at a specific branch */
  public getBrandsByBranch(brandNames: string[]): Promise<BrandDisplay[]> {
    console.debug('[BookingApiService] getBrandsByBranch() called for brands:', brandNames);
    const brands: BrandDisplay[] = brandNames.map(name => ({
      id: name.toLowerCase().replace(/\s+/g, '-').replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue') as Brand,
      name
    }));
    return Promise.resolve(brands);
  }

  public getLocations(brand: Brand): Promise<LocationDisplay[]> {
    console.debug('[BookingApiService] getLocations() called for brand:', brand);
    return Promise.resolve(LOCATIONS_BY_BRAND[brand]);
  }

  /** REQ-013: Load ALL locations without brand filter */
  public getAllLocations(): Promise<LocationDisplay[]> {
    console.debug('[BookingApiService] getAllLocations() called');
    return Promise.resolve(ALL_LOCATIONS);
  }

  /** REQ-013: Load branch configs from JSON */
  async getBranches(): Promise<BranchConfig[]> {
    console.debug('[BookingApiService] getBranches() called');
    const response = await fetch('assets/branch-config.json');
    const data = await response.json() as BranchConfigFile;
    return data.branches;
  }

  public getServices(): Promise<ServiceDisplay[]> {
    console.debug('[BookingApiService] getServices() called');
    return Promise.resolve(AVAILABLE_SERVICES);
  }
}
