import { inject } from '@angular/core';

import { patchState,signalStore, withHooks, withMethods, withState } from '@ngrx/signals';

import type {
  AccessibilityState,
  FontSize} from '../models/accessibility.model';
import {
  ACCESSIBILITY_DEFAULTS} from '../models/accessibility.model';
import { AccessibilityService } from '../services/accessibility.service';

/**
 * Global store for accessibility settings
 * Uses withHooks for onInit since accessibility is global app config
 */
export const AccessibilityStore = signalStore(
  { providedIn: 'root' },

  withState<AccessibilityState>(ACCESSIBILITY_DEFAULTS),

  withMethods((store, service = inject(AccessibilityService)) => ({
    /**
     * Loads settings from LocalStorage and applies them
     */
    loadFromStorage(): void {
      const settings = service.getSettings();
      patchState(store, settings);
      service.applyToDocument(settings);
    },

    /**
     * Sets the font size
     */
    setFontSize(fontSize: FontSize): void {
      patchState(store, { fontSize });
      const state = this.currentState();
      service.saveSettings(state);
      service.applyToDocument(state);
    },

    /**
     * Sets high contrast mode
     */
    setHighContrast(highContrast: boolean): void {
      patchState(store, { highContrast });
      const state = this.currentState();
      service.saveSettings(state);
      service.applyToDocument(state);
    },

    /**
     * Sets reduced motion
     */
    setReducedMotion(reducedMotion: boolean): void {
      patchState(store, { reducedMotion });
      const state = this.currentState();
      service.saveSettings(state);
      service.applyToDocument(state);
    },

    /**
     * Returns the current state as an object
     */
    currentState(): AccessibilityState {
      return {
        fontSize: store.fontSize(),
        highContrast: store.highContrast(),
        reducedMotion: store.reducedMotion()
      };
    }
  })),

  withHooks({
    // onInit is allowed here since accessibility is global app config
    onInit(store) {
      store.loadFromStorage();
    }
  })
);
