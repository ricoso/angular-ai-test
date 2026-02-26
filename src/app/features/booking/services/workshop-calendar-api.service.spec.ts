import { TestBed } from '@angular/core/testing';

import { WorkshopCalendarApiService } from './workshop-calendar-api.service';

describe('WorkshopCalendarApiService', () => {
  let service: WorkshopCalendarApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkshopCalendarApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return exactly 3 workshop calendar days', async () => {
    const days = await service.getWorkshopCalendarDays('2026-03-02');
    expect(days).toHaveLength(3);
  });

  it('should return days with all required fields', async () => {
    const days = await service.getWorkshopCalendarDays('2026-03-02');

    for (const day of days) {
      expect(day.date).toBeDefined();
      expect(day.displayDate).toBeDefined();
      expect(day.dayAbbreviation).toBeDefined();
      expect(day.displayHeading).toBeDefined();
      expect(day.slots).toBeDefined();
    }
  });

  it('should return 11 time slots per day (07:00-17:00)', async () => {
    const days = await service.getWorkshopCalendarDays('2026-03-02');

    for (const day of days) {
      expect(day.slots).toHaveLength(11);
    }
  });

  it('should return time slots from 07:00 to 17:00', async () => {
    const days = await service.getWorkshopCalendarDays('2026-03-02');

    for (const day of days) {
      expect(day.slots[0].time).toBe('07:00');
      expect(day.slots[10].time).toBe('17:00');
    }
  });

  it('should not return days on Sunday', async () => {
    const days = await service.getWorkshopCalendarDays('2026-03-01');

    for (const day of days) {
      expect(day.dayAbbreviation).not.toBe('So');
    }
  });

  it('should return valid day abbreviations (Mo-Sa)', async () => {
    const validAbbreviations = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
    const days = await service.getWorkshopCalendarDays('2026-03-02');

    for (const day of days) {
      expect(validAbbreviations).toContain(day.dayAbbreviation);
    }
  });

  it('should format displayDate as DD.MM.YYYY', async () => {
    const days = await service.getWorkshopCalendarDays('2026-03-02');

    for (const day of days) {
      expect(day.displayDate).toMatch(/^\d{2}\.\d{2}\.\d{4}$/);
    }
  });

  it('should format displayHeading as abbreviation + date', async () => {
    const days = await service.getWorkshopCalendarDays('2026-03-02');

    for (const day of days) {
      expect(day.displayHeading).toContain(day.dayAbbreviation);
      expect(day.displayHeading).toContain(day.displayDate);
    }
  });

  it('should format slot displayTime with "Uhr" suffix', async () => {
    const days = await service.getWorkshopCalendarDays('2026-03-02');

    for (const day of days) {
      for (const slot of day.slots) {
        expect(slot.displayTime).toMatch(/^\d{2}:\d{2} Uhr$/);
      }
    }
  });

  it('should return unique slot IDs', async () => {
    const days = await service.getWorkshopCalendarDays('2026-03-02');
    const allIds = days.flatMap(d => d.slots.map(s => s.id));
    const uniqueIds = new Set(allIds);
    expect(uniqueIds.size).toBe(allIds.length);
  });

  it('should skip Sunday when start date is Saturday', async () => {
    // 2026-02-28 is a Saturday
    const days = await service.getWorkshopCalendarDays('2026-02-28');

    const abbreviations = days.map(d => d.dayAbbreviation);
    expect(abbreviations).not.toContain('So');
    // First day should be Sa (28.02), then Mo (02.03), Di (03.03)
    expect(days[0].dayAbbreviation).toBe('Sa');
    expect(days[1].dayAbbreviation).toBe('Mo');
  });

  it('should skip Sunday when start date is Sunday', async () => {
    // 2026-03-01 is a Sunday
    const days = await service.getWorkshopCalendarDays('2026-03-01');

    const abbreviations = days.map(d => d.dayAbbreviation);
    expect(abbreviations).not.toContain('So');
    // First workday after Sunday 01.03 should be Mo (02.03)
    expect(days[0].dayAbbreviation).toBe('Mo');
  });
});
