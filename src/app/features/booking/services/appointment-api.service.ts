import { Injectable } from '@angular/core';

import type { AppointmentSlot, DayAbbreviation } from '../models/appointment.model';

const DAY_ABBREVIATIONS = new Map<number, DayAbbreviation>([
  [1, 'Mo'],
  [2, 'Di'],
  [3, 'Mi'],
  [4, 'Do'],
  [5, 'Fr'],
  [6, 'Sa']
]);

const MIN_HOUR = 7;
const MAX_HOUR = 18;
const SLOT_COUNT = 4;

@Injectable({ providedIn: 'root' })
export class AppointmentApiService {
  public async getAppointments(): Promise<AppointmentSlot[]> {
    return await Promise.resolve(this.generateSlots());
  }

  private generateSlots(): AppointmentSlot[] {
    const slots: AppointmentSlot[] = [];
    const today = new Date();
    let candidate = new Date(today);
    candidate.setDate(candidate.getDate() + 1);

    while (slots.length < SLOT_COUNT) {
      const dayOfWeek = candidate.getDay();

      if (dayOfWeek !== 0) {
        const abbreviation = DAY_ABBREVIATIONS.get(dayOfWeek)!;
        const hour = this.generateRandomHour();
        const timeString = `${String(hour).padStart(2, '0')}:00`;
        const isoDate = this.formatIsoDate(candidate);
        const displayDate = this.formatDisplayDate(candidate);

        slots.push({
          id: `${isoDate}-${timeString.replace(':', '-')}`,
          date: isoDate,
          displayDate,
          dayAbbreviation: abbreviation,
          time: timeString,
          displayTime: `${timeString} Uhr`
        });
      }

      candidate = new Date(candidate);
      candidate.setDate(candidate.getDate() + 1);
    }

    return slots;
  }

  private generateRandomHour(): number {
    return MIN_HOUR + Math.floor(Math.random() * (MAX_HOUR - MIN_HOUR + 1));
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
