import { Injectable } from '@angular/core';

import type { DayAbbreviation } from '../models/appointment.model';
import type { WorkshopCalendarDay, WorkshopTimeSlot } from '../models/workshop-calendar.model';

const DAY_ABBREVIATIONS = new Map<number, DayAbbreviation>([
  [1, 'Mo'],
  [2, 'Di'],
  [3, 'Mi'],
  [4, 'Do'],
  [5, 'Fr'],
  [6, 'Sa']
]);

const MIN_HOUR = 7;
const MAX_HOUR = 17;
const WORKDAY_COUNT = 3;

/**
 * Generates workshop calendar days with time slots (click-dummy, no API call)
 * DE: Generiert Werkstattkalender-Tage mit Uhrzeitslots / EN: Workshop calendar API service
 */
@Injectable({ providedIn: 'root' })
export class WorkshopCalendarApiService {
  /**
   * Generates 3 weekday slots (Mo-Sa, no Sunday) starting from given ISO date
   * Each day has 11 hourly slots from 07:00 to 17:00
   */
  public async getWorkshopCalendarDays(fromDate: string): Promise<WorkshopCalendarDay[]> {
    const startDate = new Date(`${fromDate}T00:00:00`);
    const workdays = this.getNextWorkdays(startDate, WORKDAY_COUNT);
    return await Promise.resolve(workdays.map(date => this.generateDaySlots(date)));
  }

  /**
   * Generates 11 hourly time slots (07:00-17:00) for a single day
   */
  private generateDaySlots(date: Date): WorkshopCalendarDay {
    const isoDate = this.formatIsoDate(date);
    const displayDate = this.formatDisplayDate(date);
    const dayAbbreviation = DAY_ABBREVIATIONS.get(date.getDay())!;

    const slots: WorkshopTimeSlot[] = [];
    for (let hour = MIN_HOUR; hour <= MAX_HOUR; hour++) {
      const time = `${String(hour).padStart(2, '0')}:00`;
      slots.push({
        id: `${isoDate}-${String(hour).padStart(2, '0')}-00`,
        time,
        displayTime: `${time} Uhr`
      });
    }

    return {
      date: isoDate,
      displayDate,
      dayAbbreviation,
      displayHeading: `${dayAbbreviation}, ${displayDate}`,
      slots
    };
  }

  /**
   * Calculates next n workdays (Mo-Sa, skipping Sunday)
   */
  private getNextWorkdays(fromDate: Date, count: number): Date[] {
    const days: Date[] = [];
    const current = new Date(fromDate);

    while (days.length < count) {
      if (current.getDay() !== 0) {
        days.push(new Date(current));
      }
      current.setDate(current.getDate() + 1);
    }

    return days;
  }

  private formatIsoDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private formatDisplayDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  }
}
