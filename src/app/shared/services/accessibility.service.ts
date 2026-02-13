import { Injectable } from '@angular/core';

import type {
  AccessibilityState,
  AccessibilityStorageData,
  FontSize} from '../models/accessibility.model';
import {
  ACCESSIBILITY_DEFAULTS,
  ACCESSIBILITY_STORAGE_KEY,
  ACCESSIBILITY_STORAGE_VERSION} from '../models/accessibility.model';

/**
 * Service for accessibility settings
 * Encapsulates LocalStorage access and DOM manipulation
 */
@Injectable({ providedIn: 'root' })
export class AccessibilityService {
  /**
   * Loads settings from LocalStorage
   * Returns defaults with system preference if not available
   */
  getSettings(): AccessibilityState {
    try {
      const stored = localStorage.getItem(ACCESSIBILITY_STORAGE_KEY);
      if (stored) {
        const data: AccessibilityStorageData = JSON.parse(stored);
        return {
          fontSize: this.validateFontSize(data.fontSize),
          highContrast: Boolean(data.highContrast),
          reducedMotion: Boolean(data.reducedMotion)
        };
      }
    } catch {
      // LocalStorage not available or parsing error
    }

    // Defaults with system preference for reduced motion
    return {
      ...ACCESSIBILITY_DEFAULTS,
      reducedMotion: this.checkSystemReducedMotion()
    };
  }

  /**
   * Saves settings to LocalStorage
   */
  saveSettings(state: AccessibilityState): void {
    try {
      const data: AccessibilityStorageData = {
        ...state,
        version: ACCESSIBILITY_STORAGE_VERSION
      };
      localStorage.setItem(ACCESSIBILITY_STORAGE_KEY, JSON.stringify(data));
    } catch {
      // LocalStorage not available (e.g. Private Mode)
    }
  }

  /**
   * Applies accessibility settings to the document element
   */
  applyToDocument(state: AccessibilityState): void {
    const html = document.documentElement;

    html.setAttribute('data-font-size', state.fontSize);
    html.setAttribute('data-high-contrast', String(state.highContrast));

    if (state.reducedMotion) {
      html.classList.add('reduce-motion');
    } else {
      html.classList.remove('reduce-motion');
    }
  }

  /**
   * Checks system preference for reduced motion
   */
  private checkSystemReducedMotion(): boolean {
    if (typeof window === 'undefined') {
      return false;
    }
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /**
   * Validates font size, returns default for invalid values
   */
  private validateFontSize(value: unknown): FontSize {
    const validValues: FontSize[] = ['small', 'normal', 'large', 'x-large'];
    if (typeof value === 'string' && validValues.includes(value as FontSize)) {
      return value as FontSize;
    }
    return 'normal';
  }
}
