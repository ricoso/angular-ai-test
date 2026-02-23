import type { Brand } from './brand.model';
import type { LocationDisplay } from './location.model';
import { LOCATIONS_BY_BRAND } from './location.model';

describe('Location Model', () => {
  const allBrands: Brand[] = ['audi', 'bmw', 'mercedes', 'mini', 'volkswagen'];

  it('should have locations for all brands', () => {
    for (const brand of allBrands) {
      expect(LOCATIONS_BY_BRAND[brand]).toBeDefined();
      expect(LOCATIONS_BY_BRAND[brand].length).toBeGreaterThan(0);
    }
  });

  it('should have correct location structure', () => {
    const audiLocations = LOCATIONS_BY_BRAND.audi;
    for (const location of audiLocations) {
      expect(location.id).toBeDefined();
      expect(location.name).toBeDefined();
      expect(location.city).toBeDefined();
    }
  });

  it('should have 5 locations for Audi', () => {
    expect(LOCATIONS_BY_BRAND.audi).toHaveLength(5);
  });

  it('should have 5 locations for BMW', () => {
    expect(LOCATIONS_BY_BRAND.bmw).toHaveLength(5);
  });

  it('should have 5 locations for Mercedes', () => {
    expect(LOCATIONS_BY_BRAND.mercedes).toHaveLength(5);
  });

  it('should have 3 locations for MINI', () => {
    expect(LOCATIONS_BY_BRAND.mini).toHaveLength(3);
  });

  it('should have 5 locations for Volkswagen', () => {
    expect(LOCATIONS_BY_BRAND.volkswagen).toHaveLength(5);
  });

  it('should have unique ids within each brand', () => {
    for (const brand of allBrands) {
      const ids = LOCATIONS_BY_BRAND[brand].map((l: LocationDisplay) => l.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    }
  });
});
