import { AVAILABLE_SERVICES } from './service.model';

describe('Service Model', () => {
  it('should have 3 available services', () => {
    expect(AVAILABLE_SERVICES).toHaveLength(3);
  });

  it('should have correct service IDs', () => {
    const ids = AVAILABLE_SERVICES.map(s => s.id);
    expect(ids).toEqual(['huau', 'inspection', 'tire-change']);
  });

  it('should have no variants for huau', () => {
    const huau = AVAILABLE_SERVICES.find(s => s.id === 'huau');
    expect(huau?.variants).toEqual([]);
  });

  it('should have no variants for inspection', () => {
    const inspection = AVAILABLE_SERVICES.find(s => s.id === 'inspection');
    expect(inspection?.variants).toEqual([]);
  });

  it('should have 2 variants for tire-change', () => {
    const tireChange = AVAILABLE_SERVICES.find(s => s.id === 'tire-change');
    expect(tireChange?.variants).toHaveLength(2);
    expect(tireChange?.variants[0].id).toBe('without-storage');
    expect(tireChange?.variants[1].id).toBe('with-storage');
  });

  it('should have translation keys for all services', () => {
    for (const service of AVAILABLE_SERVICES) {
      expect(service.titleKey).toBeTruthy();
      expect(service.descriptionKey).toBeTruthy();
      expect(service.icon).toBeTruthy();
    }
  });
});
