import { TestBed } from '@angular/core/testing';

import { VERFUEGBARE_MARKEN } from '../models/marke.model';
import { BuchungApiService } from './buchung-api.service';

describe('BuchungApiService', () => {
  let service: BuchungApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BuchungApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('holeMarken', () => {
    it('should return all 5 brands', async () => {
      const marken = await service.holeMarken();
      expect(marken).toEqual(VERFUEGBARE_MARKEN);
      expect(marken).toHaveLength(5);
    });

    it('should return correct brand ids', async () => {
      const marken = await service.holeMarken();
      const ids = marken.map(m => m.id);
      expect(ids).toEqual(['audi', 'bmw', 'mercedes', 'mini', 'volkswagen']);
    });

    it('should log to console', async () => {
      const spy = jest.spyOn(console, 'log').mockImplementation();
      await service.holeMarken();
      expect(spy).toHaveBeenCalledWith(expect.stringContaining('holeMarken'));
      spy.mockRestore();
    });
  });
});
