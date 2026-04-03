import { i18nKeys } from '@core/i18n';

import type { WizardStep } from './wizard-breadcrumb.model';

export const WIZARD_STEPS: WizardStep[] = [
  { label: i18nKeys.booking.wizard.location, icon: 'location_on', route: '/home/location' },
  { label: i18nKeys.booking.wizard.brand, icon: 'directions_car', route: '/home/brand' },
  { label: i18nKeys.booking.wizard.service, icon: 'build', route: '/home/services' },
  { label: i18nKeys.booking.wizard.notes, icon: 'info', route: '/home/notes' },
  { label: i18nKeys.booking.wizard.appointment, icon: 'event', route: '/home/appointment' },
  { label: i18nKeys.booking.wizard.vehicle, icon: 'drive_eta', route: '/home/carinformation' },
  { label: i18nKeys.booking.wizard.overview, icon: 'check_circle', route: '/home/booking-overview' }
];
