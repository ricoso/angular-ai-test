/**
 * Day abbreviation type for German weekdays (Monday–Saturday, no Sunday)
 * DE: Wochentag-Abkürzung / EN: Day abbreviation
 */
export type DayAbbreviation = 'Mo' | 'Di' | 'Mi' | 'Do' | 'Fr' | 'Sa';

/**
 * Single appointment slot proposal
 * DE: Terminvorschlag / EN: Appointment slot
 */
export interface AppointmentSlot {
  id: string;
  date: string;
  displayDate: string;
  dayAbbreviation: DayAbbreviation;
  time: string;
  displayTime: string;
}
