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


});
