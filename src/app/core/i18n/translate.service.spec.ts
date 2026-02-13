import { TestBed } from '@angular/core/testing';

import { TranslateService } from './translate.service';

describe('TranslateService', () => {
  let service: TranslateService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(TranslateService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('instant', () => {
    it('should return German translation (default)', () => {
      service.use('de');
      const result = service.instant('app.title');
      expect(result).toBe('Gottfried Schultz');
    });

    it('should return English translation', () => {
      service.use('en');
      const result = service.instant('app.skipLink');
      expect(result).toBe('Skip to main content');
    });

    it('should return key when translation does not exist', () => {
      const result = service.instant('not.existing' as never);
      expect(result).toBe('not.existing');
    });
  });

  describe('use', () => {
    it('should set language to German', () => {
      service.use('de');
      expect(service.getCurrentLanguage()).toBe('de');
    });

    it('should set language to English', () => {
      service.use('en');
      expect(service.getCurrentLanguage()).toBe('en');
    });

    it('should save language to LocalStorage', () => {
      service.use('en');
      expect(localStorage.getItem('app-language')).toBe('en');
    });
  });

  describe('getCurrentLanguage', () => {
    it('should return current language', () => {
      service.use('de');
      expect(service.getCurrentLanguage()).toBe('de');

      service.use('en');
      expect(service.getCurrentLanguage()).toBe('en');
    });
  });

  describe('get', () => {
    it('should return a signal for reactive translations', () => {
      service.use('de');
      const signalFn = service.get('header.accessibility.button');

      expect(signalFn()).toBe('Barrierefreiheit');

      service.use('en');
      expect(signalFn()).toBe('Accessibility');
    });
  });

  describe('getLanguageSignal', () => {
    it('should return a readonly signal', () => {
      service.use('de');
      const languageSignal = service.getLanguageSignal();

      expect(languageSignal()).toBe('de');

      service.use('en');
      expect(languageSignal()).toBe('en');
    });
  });

  describe('LocalStorage Recovery', () => {
    it('should load saved language from LocalStorage', () => {
      localStorage.setItem('app-language', 'en');

      const newService = new TranslateService();

      expect(newService.getCurrentLanguage()).toBe('en');
    });
  });
});
