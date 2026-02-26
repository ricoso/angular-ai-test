import type { TranslationKey } from '@core/i18n';
import { i18nKeys } from '@core/i18n';

import type { ServiceType } from '../../models/service.model';

export interface ServiceHint {
  serviceId: ServiceType;
  icon: string;
  hintKey: TranslationKey;
}

export const SERVICE_HINTS: ServiceHint[] = [
  {
    serviceId: 'huau',
    icon: 'verified',
    hintKey: i18nKeys.booking.notes.hints.huau as TranslationKey
  },
  {
    serviceId: 'inspection',
    icon: 'build',
    hintKey: i18nKeys.booking.notes.hints.inspection as TranslationKey
  },
  {
    serviceId: 'tire-change',
    icon: 'tire_repair',
    hintKey: i18nKeys.booking.notes.hints.tireChange as TranslationKey
  }
];
