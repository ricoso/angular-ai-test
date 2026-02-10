/**
 * Schriftgröße für Accessibility-Einstellungen
 * - small: 14px (0.875em) - Minimum nach WCAG
 * - normal: 16px (1em) - Standard
 * - large: 18px (1.125em)
 * - x-large: 20px (1.25em)
 */
export type Schriftgroesse = 'small' | 'normal' | 'large' | 'x-large';

/**
 * Accessibility State Interface
 * Wird im AccessibilityStore verwendet
 */
export interface BarrierefreiheitZustand {
  schriftgroesse: Schriftgroesse;
  hoherKontrast: boolean;
  reduzierteBewegung: boolean;
}

/**
 * LocalStorage Schema für Accessibility-Einstellungen
 * Inklusive Versionsnummer für zukünftige Migrationen
 */
export interface BarrierefreiheitSpeicherDaten {
  schriftgroesse: Schriftgroesse;
  hoherKontrast: boolean;
  reduzierteBewegung: boolean;
  version: number;
}

/**
 * Standard-Werte für Accessibility-Einstellungen
 */
export const BARRIEREFREIHEIT_STANDARDS: BarrierefreiheitZustand = {
  schriftgroesse: 'normal',
  hoherKontrast: false,
  reduzierteBewegung: false
};

/**
 * LocalStorage Key für Accessibility-Einstellungen
 */
export const BARRIEREFREIHEIT_STORAGE_KEY = 'accessibility-settings';

/**
 * Aktuelle Version des Storage-Schemas
 */
export const BARRIEREFREIHEIT_STORAGE_VERSION = 1;
