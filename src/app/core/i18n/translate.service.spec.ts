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
      expect(result).toBe('Autohaus GmbH');
    });

    it('should return English translation', () => {
      service.use('en');
      const result = service.instant('app.skipLink');
      expect(result).toBe('Skip to main content');
    });

    it('should return Ukrainian translation', () => {
      service.use('uk');
      const result = service.instant('app.skipLink');
      expect(result).toBe('Перейти до основного вмісту');
    });

    it('should return French translation', () => {
      service.use('fr');
      const result = service.instant('app.skipLink');
      expect(result).toBe('Aller au contenu principal');
    });

    it('should return Arabic translation', () => {
      service.use('ar');
      const result = service.instant('app.skipLink');
      expect(result).toBe('انتقل إلى المحتوى الرئيسي');
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

    it('should set language to Ukrainian', () => {
      service.use('uk');
      expect(service.getCurrentLanguage()).toBe('uk');
    });

    it('should set language to French', () => {
      service.use('fr');
      expect(service.getCurrentLanguage()).toBe('fr');
    });

    it('should set language to Arabic', () => {
      service.use('ar');
      expect(service.getCurrentLanguage()).toBe('ar');
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

    it('should load Ukrainian from LocalStorage', () => {
      localStorage.setItem('app-language', 'uk');

      const newService = new TranslateService();

      expect(newService.getCurrentLanguage()).toBe('uk');
    });

    it('should load French from LocalStorage', () => {
      localStorage.setItem('app-language', 'fr');

      const newService = new TranslateService();

      expect(newService.getCurrentLanguage()).toBe('fr');
    });

    it('should load Arabic from LocalStorage', () => {
      localStorage.setItem('app-language', 'ar');

      const newService = new TranslateService();

      expect(newService.getCurrentLanguage()).toBe('ar');
    });
  });

  describe('RTL support', () => {
    it('should return true for isRtl when language is Arabic', () => {
      service.use('ar');
      expect(service.isRtl()).toBe(true);
    });

    it('should return false for isRtl when language is not Arabic', () => {
      service.use('de');
      expect(service.isRtl()).toBe(false);
    });

    it('should set dir attribute to rtl for Arabic', () => {
      service.use('ar');
      expect(document.documentElement.getAttribute('dir')).toBe('rtl');
    });

    it('should set dir attribute to ltr for non-RTL languages', () => {
      service.use('de');
      expect(document.documentElement.getAttribute('dir')).toBe('ltr');
    });

    it('should set lang attribute on document', () => {
      service.use('fr');
      expect(document.documentElement.getAttribute('lang')).toBe('fr');
    });
  });
});
