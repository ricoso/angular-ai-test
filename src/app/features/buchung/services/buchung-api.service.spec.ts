import { VERFUEGBARE_MARKEN } from '../models/marke.model';

import { BuchungApiService } from './buchung-api.service';

describe('BuchungApiService', () => {
  let service: BuchungApiService;

  beforeEach(() => {
    service = new BuchungApiService();
  });

  it('should return available brands', async () => {
    const result = await service.holeMarken();
    expect(result).toEqual(VERFUEGBARE_MARKEN);
  });

  it('should return 5 brands', async () => {
    const result = await service.holeMarken();
    expect(result).toHaveLength(5);
  });

  it('should include all expected brand ids', async () => {
    const result = await service.holeMarken();
    const ids = result.map(m => m.id);
    expect(ids).toEqual(['audi', 'bmw', 'mercedes', 'mini', 'volkswagen']);
  });
});
