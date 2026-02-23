/**
 * Font size for accessibility settings
 * - small: 14px (0.875em) - Minimum per WCAG
 * - normal: 16px (1em) - Default
 * - large: 18px (1.125em)
 * - x-large: 20px (1.25em)
 */
export type FontSize = 'small' | 'normal' | 'large' | 'x-large';

/**
 * Accessibility State Interface
 */
export interface AccessibilityState {
  fontSize: FontSize;
  highContrast: boolean;
  reducedMotion: boolean;
}

/**
 * LocalStorage schema for accessibility settings
 */
export interface AccessibilityStorageData {
  fontSize: FontSize;
  highContrast: boolean;
  reducedMotion: boolean;
  version: number;
}

/**
 * Default values for accessibility settings
 */
export const ACCESSIBILITY_DEFAULTS: AccessibilityState = {
  fontSize: 'normal',
  highContrast: false,
  reducedMotion: false
};

/**
 * LocalStorage key for accessibility settings
 */
export const ACCESSIBILITY_STORAGE_KEY = 'accessibility-settings';

/**
 * Current storage schema version
 */
export const ACCESSIBILITY_STORAGE_VERSION = 1;
