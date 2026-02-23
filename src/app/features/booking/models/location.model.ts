import type { Brand } from './brand.model';

/**
 * Location display model for UI rendering
 */
export interface LocationDisplay {
  id: string;
  name: string;
  city: string;
}

/**
 * Static location data per brand (Click-Dummy)
 * Locations filtered by brand as specified in REQ-003
 */
export const LOCATIONS_BY_BRAND: Record<Brand, LocationDisplay[]> = {
  audi: [
    { id: 'muc', name: 'München', city: 'München' },
    { id: 'ham', name: 'Hamburg', city: 'Hamburg' },
    { id: 'ber', name: 'Berlin', city: 'Berlin' },
    { id: 'fra', name: 'Frankfurt', city: 'Frankfurt' },
    { id: 'dus', name: 'Düsseldorf', city: 'Düsseldorf' }
  ],
  bmw: [
    { id: 'stu', name: 'Stuttgart', city: 'Stuttgart' },
    { id: 'kol', name: 'Köln', city: 'Köln' },
    { id: 'muc', name: 'München', city: 'München' },
    { id: 'ber', name: 'Berlin', city: 'Berlin' },
    { id: 'ham', name: 'Hamburg', city: 'Hamburg' }
  ],
  mercedes: [
    { id: 'stu', name: 'Stuttgart', city: 'Stuttgart' },
    { id: 'muc', name: 'München', city: 'München' },
    { id: 'fra', name: 'Frankfurt', city: 'Frankfurt' },
    { id: 'dus', name: 'Düsseldorf', city: 'Düsseldorf' },
    { id: 'ber', name: 'Berlin', city: 'Berlin' }
  ],
  mini: [
    { id: 'gar', name: 'Garbsen', city: 'Garbsen' },
    { id: 'han-sued', name: 'Hannover Südstadt', city: 'Hannover' },
    { id: 'ste', name: 'Steinhude', city: 'Steinhude' }
  ],
  volkswagen: [
    { id: 'wob', name: 'Wolfsburg', city: 'Wolfsburg' },
    { id: 'han', name: 'Hannover', city: 'Hannover' },
    { id: 'ber', name: 'Berlin', city: 'Berlin' },
    { id: 'muc', name: 'München', city: 'München' },
    { id: 'ham', name: 'Hamburg', city: 'Hamburg' }
  ]
};
