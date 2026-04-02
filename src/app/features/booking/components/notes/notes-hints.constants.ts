import type { TranslationKey } from '@core/i18n';
import { i18nKeys } from '@core/i18n';

import type { ServiceType } from '../../models/service.model';

export interface ServiceHint {
  serviceId: ServiceType;
  svgIcon: string;
  hintKey: TranslationKey;
}

export const SERVICE_HINTS: ServiceHint[] = [
  {
    serviceId: 'inspection',
    svgIcon: 'assets/icons/services/inspection.svg',
    hintKey: i18nKeys.booking.notes.hints.inspection as TranslationKey
  },
  {
    serviceId: 'tuv',
    svgIcon: 'assets/icons/services/tuv.svg',
    hintKey: i18nKeys.booking.notes.hints.tuv as TranslationKey
  },
  {
    serviceId: 'brake-fluid',
    svgIcon: 'assets/icons/services/brake-fluid.svg',
    hintKey: i18nKeys.booking.notes.hints.brakeFluid as TranslationKey
  },
  {
    serviceId: 'tire-change',
    svgIcon: 'assets/icons/services/tire-change.svg',
    hintKey: i18nKeys.booking.notes.hints.tireChange as TranslationKey
  },
  {
    serviceId: 'actions-checks',
    svgIcon: 'assets/icons/services/actions-checks.svg',
    hintKey: i18nKeys.booking.notes.hints.actionsChecks as TranslationKey
  },
  {
    serviceId: 'repair',
    svgIcon: 'assets/icons/services/repair.svg',
    hintKey: i18nKeys.booking.notes.hints.repair as TranslationKey
  },
  {
    serviceId: 'bodywork',
    svgIcon: 'assets/icons/services/bodywork.svg',
    hintKey: i18nKeys.booking.notes.hints.bodywork as TranslationKey
  }
];
