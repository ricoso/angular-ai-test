import { getLocationsByBrand, LOCATIONS_BY_BRAND } from './location.model';

describe('Location Model', () => {
  describe('getLocationsByBrand', () => {
    it('should return 5 locations for audi', () => {
      const result = getLocationsByBrand('audi');
      expect(result).toHaveLength(5);
    });

    it('should return 5 locations for bmw', () => {
      const result = getLocationsByBrand('bmw');
      expect(result).toHaveLength(5);
    });

    it('should return 5 locations for mercedes', () => {
      const result = getLocationsByBrand('mercedes');
      expect(result).toHaveLength(5);
    });

    it('should return 3 locations for mini', () => {
      const result = getLocationsByBrand('mini');
      expect(result).toHaveLength(3);
    });

    it('should return 5 locations for volkswagen', () => {
      const result = getLocationsByBrand('volkswagen');
      expect(result).toHaveLength(5);
    });

    it('should return locations with id and name only', () => {
      const result = getLocationsByBrand('audi');
      result.forEach(loc => {
        expect(Object.keys(loc)).toEqual(['id', 'name']);
      });
    });

    it('should include München for audi', () => {
      const result = getLocationsByBrand('audi');
      const names = result.map(l => l.name);
      expect(names).toContain('München');
    });

    it('should include Garbsen for mini', () => {
      const result = getLocationsByBrand('mini');
      const names = result.map(l => l.name);
      expect(names).toContain('Garbsen');
    });
  });

  describe('LOCATIONS_BY_BRAND', () => {
    it('should have entries for all 5 brands', () => {
      expect(Object.keys(LOCATIONS_BY_BRAND)).toHaveLength(5);
    });

    it('should match getLocationsByBrand results', () => {
      expect(LOCATIONS_BY_BRAND.audi).toEqual(getLocationsByBrand('audi'));
      expect(LOCATIONS_BY_BRAND.mini).toEqual(getLocationsByBrand('mini'));
    });
  });
});
