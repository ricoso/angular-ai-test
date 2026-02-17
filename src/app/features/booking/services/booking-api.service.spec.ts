import { AVAILABLE_BRANDS } from '../models/brand.model';
import { LOCATIONS_BY_BRAND } from '../models/location.model';

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
    it('should return locations for audi', async () => {
      const result = await service.getLocations('audi');
      expect(result).toEqual(LOCATIONS_BY_BRAND.audi);
    });

    it('should return 5 locations for audi', async () => {
      const result = await service.getLocations('audi');
      expect(result).toHaveLength(5);
    });

    it('should return 3 locations for mini', async () => {
      const result = await service.getLocations('mini');
      expect(result).toHaveLength(3);
    });

    it('should return locations with id and name', async () => {
      const result = await service.getLocations('bmw');
      result.forEach(loc => {
        expect(loc).toHaveProperty('id');
        expect(loc).toHaveProperty('name');
      });
    });

    it('should return different locations per brand', async () => {
      const audiLocations = await service.getLocations('audi');
      const miniLocations = await service.getLocations('mini');
      expect(audiLocations).not.toEqual(miniLocations);
    });
  });
});
