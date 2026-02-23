import { TestBed } from '@angular/core/testing';

import { ACCESSIBILITY_DEFAULTS } from '../models/accessibility.model';
import { AccessibilityService } from '../services/accessibility.service';

import { AccessibilityStore } from './accessibility.store';

describe('AccessibilityStore', () => {
  let store: InstanceType<typeof AccessibilityStore>;
  let serviceMock: jest.Mocked<AccessibilityService>;

  beforeEach(() => {
    serviceMock = {
      getSettings: jest.fn().mockReturnValue({ ...ACCESSIBILITY_DEFAULTS }),
      saveSettings: jest.fn(),
      applyToDocument: jest.fn()
    } as unknown as jest.Mocked<AccessibilityService>;

    TestBed.configureTestingModule({
      providers: [
        AccessibilityStore,
        { provide: AccessibilityService, useValue: serviceMock }
      ]
    });

    store = TestBed.inject(AccessibilityStore);
  });

  describe('initial state', () => {
    it('should be initialized with default values', () => {
      expect(store.fontSize()).toBe('normal');
      expect(store.highContrast()).toBe(false);
      expect(store.reducedMotion()).toBe(false);
    });
  });

  describe('loadFromStorage', () => {
    it('should load settings from service and apply them', () => {
      serviceMock.getSettings.mockReturnValue({
        fontSize: 'large',
        highContrast: true,
        reducedMotion: true
      });

      store.loadFromStorage();

      expect(serviceMock.getSettings).toHaveBeenCalled();
      expect(serviceMock.applyToDocument).toHaveBeenCalled();
      expect(store.fontSize()).toBe('large');
      expect(store.highContrast()).toBe(true);
      expect(store.reducedMotion()).toBe(true);
    });
  });

  describe('setFontSize', () => {
    it('should change font size and save', () => {
      store.setFontSize('x-large');

      expect(store.fontSize()).toBe('x-large');
      expect(serviceMock.saveSettings).toHaveBeenCalledWith(
        expect.objectContaining({ fontSize: 'x-large' })
      );
      expect(serviceMock.applyToDocument).toHaveBeenCalled();
    });

    it('should accept all font size values', () => {
      const sizes: ('small' | 'normal' | 'large' | 'x-large')[] = ['small', 'normal', 'large', 'x-large'];

      for (const size of sizes) {
        store.setFontSize(size);
        expect(store.fontSize()).toBe(size);
      }
    });
  });

  describe('setHighContrast', () => {
    it('should enable high contrast and save', () => {
      store.setHighContrast(true);

      expect(store.highContrast()).toBe(true);
      expect(serviceMock.saveSettings).toHaveBeenCalledWith(
        expect.objectContaining({ highContrast: true })
      );
      expect(serviceMock.applyToDocument).toHaveBeenCalled();
    });

    it('should disable high contrast and save', () => {
      store.setHighContrast(true);
      store.setHighContrast(false);

      expect(store.highContrast()).toBe(false);
    });
  });

  describe('setReducedMotion', () => {
    it('should enable reduced motion and save', () => {
      store.setReducedMotion(true);

      expect(store.reducedMotion()).toBe(true);
      expect(serviceMock.saveSettings).toHaveBeenCalledWith(
        expect.objectContaining({ reducedMotion: true })
      );
      expect(serviceMock.applyToDocument).toHaveBeenCalled();
    });

    it('should disable reduced motion and save', () => {
      store.setReducedMotion(true);
      store.setReducedMotion(false);

      expect(store.reducedMotion()).toBe(false);
    });
  });

  describe('currentState', () => {
    it('should return the complete current state', () => {
      store.setFontSize('large');
      store.setHighContrast(true);
      store.setReducedMotion(true);

      const state = store.currentState();

      expect(state).toEqual({
        fontSize: 'large',
        highContrast: true,
        reducedMotion: true
      });
    });
  });
});
