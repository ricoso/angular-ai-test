import { TestBed } from '@angular/core/testing';

import { AppointmentApiService } from './appointment-api.service';

describe('AppointmentApiService', () => {
  let service: AppointmentApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppointmentApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return exactly 4 appointment slots', async () => {
    const slots = await service.getAppointments();
    expect(slots).toHaveLength(4);
  });

  it('should return slots with all required fields', async () => {
    const slots = await service.getAppointments();

    for (const slot of slots) {
      expect(slot.id).toBeDefined();
      expect(slot.date).toBeDefined();
      expect(slot.displayDate).toBeDefined();
      expect(slot.dayAbbreviation).toBeDefined();
      expect(slot.time).toBeDefined();
      expect(slot.displayTime).toBeDefined();
    }
  });

  it('should not return slots on Sunday', async () => {
    const slots = await service.getAppointments();
    const sundayAbbreviation = 'So';

    for (const slot of slots) {
      expect(slot.dayAbbreviation).not.toBe(sundayAbbreviation);
    }
  });

  it('should return valid day abbreviations (Mo-Sa)', async () => {
    const validAbbreviations = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
    const slots = await service.getAppointments();

    for (const slot of slots) {
      expect(validAbbreviations).toContain(slot.dayAbbreviation);
    }
  });

  it('should return times between 07:00 and 18:00', async () => {
    const slots = await service.getAppointments();

    for (const slot of slots) {
      const hour = parseInt(slot.time.split(':')[0], 10);
      expect(hour).toBeGreaterThanOrEqual(7);
      expect(hour).toBeLessThanOrEqual(18);
    }
  });

  it('should return future dates (after today)', async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const slots = await service.getAppointments();

    for (const slot of slots) {
      const slotDate = new Date(slot.date);
      expect(slotDate.getTime()).toBeGreaterThan(today.getTime());
    }
  });

  it('should return unique slot IDs', async () => {
    const slots = await service.getAppointments();
    const ids = slots.map(s => s.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('should format displayDate as DD.MM.YYYY', async () => {
    const slots = await service.getAppointments();

    for (const slot of slots) {
      expect(slot.displayDate).toMatch(/^\d{2}\.\d{2}\.\d{4}$/);
    }
  });

  it('should format displayTime with "Uhr" suffix', async () => {
    const slots = await service.getAppointments();

    for (const slot of slots) {
      expect(slot.displayTime).toMatch(/^\d{2}:\d{2} Uhr$/);
    }
  });
});
