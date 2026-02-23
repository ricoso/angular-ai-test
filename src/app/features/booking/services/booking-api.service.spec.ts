import { AVAILABLE_BRANDS } from '../models/brand.model';
import { LOCATIONS_BY_BRAND } from '../models/location.model';
import { AVAILABLE_SERVICES } from '../models/service.model';

import { BookingApiService } from './booking-api.service';

describe('BookingApiService', () => {
  let service: BookingApiService;

  beforeEach(() => {
    service = new BookingApiService();
  });

  describe('getBrands', () => {
    it('should return available brands', async () => {
      const result = await service.getBrands();
      expect(result).toEqual(AVAILABLE_BRANDS);
    });

    it('should return 5 brands', async () => {
      const result = await service.getBrands();
      expect(result).toHaveLength(5);
    });

    it('should include all expected brand ids', async () => {
      const result = await service.getBrands();
      const ids = result.map(m => m.id);
      expect(ids).toEqual(['audi', 'bmw', 'mercedes', 'mini', 'volkswagen']);
    });
  });

  describe('getLocations', () => {
    it('should return locations for Audi', async () => {
      const result = await service.getLocations('audi');
      expect(result).toEqual(LOCATIONS_BY_BRAND.audi);
      expect(result).toHaveLength(5);
    });

    it('should return locations for MINI', async () => {
      const result = await service.getLocations('mini');
      expect(result).toEqual(LOCATIONS_BY_BRAND.mini);
      expect(result).toHaveLength(3);
    });

    it('should return correct locations for each brand', async () => {
      const audiLocations = await service.getLocations('audi');
      const bmwLocations = await service.getLocations('bmw');
      expect(audiLocations).not.toEqual(bmwLocations);
    });

    it('should return locations with id, name, and city', async () => {
      const result = await service.getLocations('audi');
      for (const location of result) {
        expect(location.id).toBeDefined();
        expect(location.name).toBeDefined();
        expect(location.city).toBeDefined();
      }
    });
  });

  describe('getServices', () => {
    it('should return available services', async () => {
      const result = await service.getServices();
      expect(result).toEqual(AVAILABLE_SERVICES);
    });

    it('should return 3 services', async () => {
      const result = await service.getServices();
      expect(result).toHaveLength(3);
    });

    it('should include tire-change with variants', async () => {
      const result = await service.getServices();
      const tireChange = result.find(s => s.id === 'tire-change');
      expect(tireChange?.variants).toHaveLength(2);
    });
  });
});
