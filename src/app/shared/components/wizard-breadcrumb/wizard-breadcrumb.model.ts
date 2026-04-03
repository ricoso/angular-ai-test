import type { TranslationKey } from '@core/i18n';

export interface WizardStep {
  label: TranslationKey;
  icon: string;
  route: string;
}

export type WizardStepStatus = 'done' | 'active' | 'future';
