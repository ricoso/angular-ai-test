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
    it('sollte deutsche Übersetzung zurückgeben (Default)', () => {
      service.use('de');
      const result = service.instant('app.title');
      expect(result).toBe('Gottfried Schultz');
    });

    it('sollte englische Übersetzung zurückgeben', () => {
      service.use('en');
      const result = service.instant('app.skipLink');
      expect(result).toBe('Skip to main content');
    });

    it('sollte Key zurückgeben wenn Übersetzung nicht existiert', () => {
      const result = service.instant('nicht.vorhanden' as never);
      expect(result).toBe('nicht.vorhanden');
    });
  });

  describe('use', () => {
    it('sollte Sprache auf Deutsch setzen', () => {
      service.use('de');
      expect(service.getAktuelleSprache()).toBe('de');
    });

    it('sollte Sprache auf Englisch setzen', () => {
      service.use('en');
      expect(service.getAktuelleSprache()).toBe('en');
    });

    it('sollte Sprache im LocalStorage speichern', () => {
      service.use('en');
      expect(localStorage.getItem('app-language')).toBe('en');
    });
  });

  describe('getAktuelleSprache', () => {
    it('sollte aktuelle Sprache zurückgeben', () => {
      service.use('de');
      expect(service.getAktuelleSprache()).toBe('de');

      service.use('en');
      expect(service.getAktuelleSprache()).toBe('en');
    });
  });

  describe('get', () => {
    it('sollte ein Signal für reaktive Übersetzungen zurückgeben', () => {
      service.use('de');
      const signalFn = service.get('header.accessibility.button');

      expect(signalFn()).toBe('Barrierefreiheit');

      service.use('en');
      // Signal sollte nach Language-Wechsel neuen Wert haben
      expect(signalFn()).toBe('Accessibility');
    });
  });

  describe('getSpracheSignal', () => {
    it('sollte ein readonly Signal zurückgeben', () => {
      service.use('de');
      const spracheSignal = service.getSpracheSignal();

      expect(spracheSignal()).toBe('de');

      service.use('en');
      expect(spracheSignal()).toBe('en');
    });
  });

  describe('LocalStorage Wiederherstellung', () => {
    it('sollte gespeicherte Sprache aus LocalStorage laden', () => {
      localStorage.setItem('app-language', 'en');

      // Neuen Service erstellen um LocalStorage zu laden
      const neuerService = new TranslateService();

      expect(neuerService.getAktuelleSprache()).toBe('en');
    });
  });
});
