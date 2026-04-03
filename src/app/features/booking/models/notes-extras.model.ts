/**
 * Mobility option for replacement vehicle
 */
export type MobilityOption = 'none' | 'compact-car' | 'mid-range' | 'luxury';

/**
 * Appointment preference for scheduling
 */
export type AppointmentPreference = 'anytime' | 'morning' | 'afternoon';

/**
 * Callback option
 */
export type CallbackOption = 'none' | 'yes';

/**
 * Extended notes extras — dropdown selections on notes page
 */
export interface NotesExtras {
  mobilityOption: MobilityOption;
  appointmentPreference: AppointmentPreference;
  callbackOption: CallbackOption;
}

export const DEFAULT_NOTES_EXTRAS: NotesExtras = {
  mobilityOption: 'none',
  appointmentPreference: 'anytime',
  callbackOption: 'none'
};
