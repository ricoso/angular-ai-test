import { TestBed } from '@angular/core/testing';
import { BarrierefreiheitService } from './accessibility.service';
import {
  BARRIEREFREIHEIT_STORAGE_KEY,
  BarrierefreiheitZustand
} from '../models/accessibility.model';

describe('BarrierefreiheitService', () => {
  let service: BarrierefreiheitService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BarrierefreiheitService);
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-font-size');
    document.documentElement.removeAttribute('data-high-contrast');
    document.documentElement.classList.remove('reduce-motion');
  });

  describe('getEinstellungen', () => {
    it('sollte Default-Werte zurückgeben wenn LocalStorage leer ist', () => {
      const einstellungen = service.getEinstellungen();

      expect(einstellungen.schriftgroesse).toBe('normal');
      expect(einstellungen.hoherKontrast).toBe(false);
    });

    it('sollte gespeicherte Einstellungen aus LocalStorage laden', () => {
      const gespeichert: BarrierefreiheitZustand = {
        schriftgroesse: 'large',
        hoherKontrast: true,
        reduzierteBewegung: true
      };
      localStorage.setItem(
        BARRIEREFREIHEIT_STORAGE_KEY,
        JSON.stringify({ ...gespeichert, version: 1 })
      );

      const einstellungen = service.getEinstellungen();

      expect(einstellungen.schriftgroesse).toBe('large');
      expect(einstellungen.hoherKontrast).toBe(true);
      expect(einstellungen.reduzierteBewegung).toBe(true);
    });

    it('sollte ungültige Schriftgröße auf normal zurücksetzen', () => {
      localStorage.setItem(
        BARRIEREFREIHEIT_STORAGE_KEY,
        JSON.stringify({ schriftgroesse: 'invalid', hoherKontrast: false, reduzierteBewegung: false, version: 1 })
      );

      const einstellungen = service.getEinstellungen();

      expect(einstellungen.schriftgroesse).toBe('normal');
    });

    it('sollte bei ungültigem JSON Default-Werte zurückgeben', () => {
      localStorage.setItem(BARRIEREFREIHEIT_STORAGE_KEY, 'invalid-json');

      const einstellungen = service.getEinstellungen();

      expect(einstellungen.schriftgroesse).toBe('normal');
      expect(einstellungen.hoherKontrast).toBe(false);
    });
  });

  describe('speichereEinstellungen', () => {
    it('sollte Einstellungen im LocalStorage speichern', () => {
      const zustand: BarrierefreiheitZustand = {
        schriftgroesse: 'x-large',
        hoherKontrast: true,
        reduzierteBewegung: false
      };

      service.speichereEinstellungen(zustand);

      const gespeichert = JSON.parse(localStorage.getItem(BARRIEREFREIHEIT_STORAGE_KEY) || '{}');
      expect(gespeichert.schriftgroesse).toBe('x-large');
      expect(gespeichert.hoherKontrast).toBe(true);
      expect(gespeichert.reduzierteBewegung).toBe(false);
      expect(gespeichert.version).toBe(1);
    });
  });

  describe('aufDokumentAnwenden', () => {
    it('sollte data-font-size Attribut setzen', () => {
      const zustand: BarrierefreiheitZustand = {
        schriftgroesse: 'large',
        hoherKontrast: false,
        reduzierteBewegung: false
      };

      service.aufDokumentAnwenden(zustand);

      expect(document.documentElement.getAttribute('data-font-size')).toBe('large');
    });

    it('sollte data-high-contrast Attribut setzen', () => {
      const zustand: BarrierefreiheitZustand = {
        schriftgroesse: 'normal',
        hoherKontrast: true,
        reduzierteBewegung: false
      };

      service.aufDokumentAnwenden(zustand);

      expect(document.documentElement.getAttribute('data-high-contrast')).toBe('true');
    });

    it('sollte reduce-motion Klasse hinzufügen wenn aktiviert', () => {
      const zustand: BarrierefreiheitZustand = {
        schriftgroesse: 'normal',
        hoherKontrast: false,
        reduzierteBewegung: true
      };

      service.aufDokumentAnwenden(zustand);

      expect(document.documentElement.classList.contains('reduce-motion')).toBe(true);
    });

    it('sollte reduce-motion Klasse entfernen wenn deaktiviert', () => {
      document.documentElement.classList.add('reduce-motion');
      const zustand: BarrierefreiheitZustand = {
        schriftgroesse: 'normal',
        hoherKontrast: false,
        reduzierteBewegung: false
      };

      service.aufDokumentAnwenden(zustand);

      expect(document.documentElement.classList.contains('reduce-motion')).toBe(false);
    });
  });
});
