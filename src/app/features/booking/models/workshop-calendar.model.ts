import type { DayAbbreviation } from './appointment.model';

/**
 * A single time slot within a workshop calendar day
 * DE: Einzelner Uhrzeitslot im Werkstattkalender / EN: Workshop time slot
 */
export interface WorkshopTimeSlot {
  id: string;
  time: string;
  displayTime: string;
}

/**
 * A single day with its available time slots
 * DE: Einzelner Tag mit Uhrzeitslots / EN: Workshop calendar day
 */
export interface WorkshopCalendarDay {
  date: string;
  displayDate: string;
  dayAbbreviation: DayAbbreviation;
  displayHeading: string;
  slots: WorkshopTimeSlot[];
}

/**
 * View state for the workshop calendar page
 * DE: View-State fuer die Werkstattkalender-Seite / EN: Workshop calendar view state
 */
export type WorkshopCalendarViewState = 'empty' | 'loading' | 'slots-visible';
