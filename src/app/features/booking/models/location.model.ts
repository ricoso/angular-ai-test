import type { Brand } from './brand.model';

/**
 * Location display model (returned by API)
 */
export interface LocationDisplay {
  id: string;
  name: string;
}

/**
 * Internal location data with brand associations (for filtering)
 */
interface LocationData {
  id: string;
  name: string;
  city: string;
  brands: Brand[];
}

/**
 * Static location data (Click-Dummy)
 * Locations per brand as specified in REQ-003
 */
const ALL_LOCATIONS: LocationData[] = [
  { id: 'muc', name: 'München', city: 'München', brands: ['audi', 'bmw', 'mercedes', 'volkswagen'] },
  { id: 'ham', name: 'Hamburg', city: 'Hamburg', brands: ['audi', 'bmw', 'volkswagen'] },
  { id: 'ber', name: 'Berlin', city: 'Berlin', brands: ['audi', 'bmw', 'mercedes', 'volkswagen'] },
  { id: 'fra', name: 'Frankfurt', city: 'Frankfurt', brands: ['audi', 'mercedes'] },
  { id: 'dus', name: 'Düsseldorf', city: 'Düsseldorf', brands: ['audi', 'mercedes'] },
  { id: 'stu', name: 'Stuttgart', city: 'Stuttgart', brands: ['bmw', 'mercedes'] },
  { id: 'cgn', name: 'Köln', city: 'Köln', brands: ['bmw'] },
  { id: 'wob', name: 'Wolfsburg', city: 'Wolfsburg', brands: ['volkswagen'] },
  { id: 'han', name: 'Hannover', city: 'Hannover', brands: ['volkswagen'] },
  { id: 'gar', name: 'Garbsen', city: 'Garbsen', brands: ['mini'] },
  { id: 'has', name: 'Hannover Südstadt', city: 'Hannover', brands: ['mini'] },
  { id: 'ste', name: 'Steinhude', city: 'Steinhude', brands: ['mini'] }
];

/**
 * Returns locations filtered by brand (Click-Dummy)
 * BR-1: Locations are brand-dependent
 */
export function getLocationsByBrand(brand: Brand): LocationDisplay[] {
  return ALL_LOCATIONS
    .filter(loc => loc.brands.includes(brand))
    .map(({ id, name }) => ({ id, name }));
}

/**
 * Pre-computed locations per brand (for tests and direct access)
 */
export const LOCATIONS_BY_BRAND: Record<Brand, LocationDisplay[]> = {
  audi: getLocationsByBrand('audi'),
  bmw: getLocationsByBrand('bmw'),
  mercedes: getLocationsByBrand('mercedes'),
  mini: getLocationsByBrand('mini'),
  volkswagen: getLocationsByBrand('volkswagen')
};
