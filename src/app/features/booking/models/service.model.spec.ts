import { AVAILABLE_SERVICES } from './service.model';

describe('Service Model', () => {
  it('should have 7 available services', () => {
    expect(AVAILABLE_SERVICES).toHaveLength(7);
  });

  it('should have correct service IDs', () => {
    const ids = AVAILABLE_SERVICES.map(s => s.id);
    expect(ids).toEqual(['inspection', 'tuv', 'brake-fluid', 'tire-change', 'actions-checks', 'repair', 'bodywork']);
  });

  it('should have options for inspection', () => {
    const inspection = AVAILABLE_SERVICES.find(s => s.id === 'inspection');
    expect(inspection?.options.length).toBeGreaterThan(0);
  });

  it('should have options for tuv', () => {
    const tuv = AVAILABLE_SERVICES.find(s => s.id === 'tuv');
    expect(tuv?.options.length).toBeGreaterThan(0);
  });

  it('should have no options for brake-fluid', () => {
    const brakeFluid = AVAILABLE_SERVICES.find(s => s.id === 'brake-fluid');
    expect(brakeFluid?.options).toEqual([]);
  });

  it('should have 4 options for tire-change', () => {
    const tireChange = AVAILABLE_SERVICES.find(s => s.id === 'tire-change');
    expect(tireChange?.options).toHaveLength(4);
    expect(tireChange?.options[0].id).toBe('bring-own-tires');
    expect(tireChange?.options[1].id).toBe('stored-tires');
  });

  it('should have translation keys for all services', () => {
    for (const service of AVAILABLE_SERVICES) {
      expect(service.titleKey).toBeTruthy();
      expect(service.descriptionKey).toBeTruthy();
      expect(service.svgIcon).toBeTruthy();
    }
  });
});
