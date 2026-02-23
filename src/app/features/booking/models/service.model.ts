import type { TranslationKey } from '@core/i18n';

/**
 * Service type union
 * Available service types for booking
 */
export type ServiceType = 'huau' | 'inspection' | 'tire-change';

/**
 * Sub-variant for services with options (e.g. tire change)
 */
export interface ServiceVariant {
  id: string;
  labelKey: TranslationKey;
}

/**
 * Service display model for UI rendering
 */
export interface ServiceDisplay {
  id: ServiceType;
  titleKey: TranslationKey;
  descriptionKey: TranslationKey;
  icon: string;
  variants: ServiceVariant[];
}

/**
 * Selected service with chosen variant
 */
export interface SelectedService {
  serviceId: ServiceType;
  selectedVariantId: string | null;
}

/**
 * Static service data (Click-Dummy)
 */
export const AVAILABLE_SERVICES: ServiceDisplay[] = [
  {
    id: 'huau',
    titleKey: 'booking.services.huau.title',
    descriptionKey: 'booking.services.huau.description',
    icon: 'verified',
    variants: []
  },
  {
    id: 'inspection',
    titleKey: 'booking.services.inspection.title',
    descriptionKey: 'booking.services.inspection.description',
    icon: 'build',
    variants: []
  },
  {
    id: 'tire-change',
    titleKey: 'booking.services.tireChange.title',
    descriptionKey: 'booking.services.tireChange.description',
    icon: 'tire_repair',
    variants: [
      { id: 'without-storage', labelKey: 'booking.services.tireChange.withoutStorage' },
      { id: 'with-storage', labelKey: 'booking.services.tireChange.withStorage' }
    ]
  }
];
