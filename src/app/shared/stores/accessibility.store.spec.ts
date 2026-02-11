import { TestBed } from '@angular/core/testing';
import { BarrierefreiheitStore } from './accessibility.store';
import { BarrierefreiheitService } from '../services/accessibility.service';
import { BARRIEREFREIHEIT_STANDARDS } from '../models/accessibility.model';

describe('BarrierefreiheitStore', () => {
  let store: InstanceType<typeof BarrierefreiheitStore>;
  let serviceMock: jest.Mocked<BarrierefreiheitService>;

  beforeEach(() => {
    serviceMock = {
      getEinstellungen: jest.fn().mockReturnValue({ ...BARRIEREFREIHEIT_STANDARDS }),
      speichereEinstellungen: jest.fn(),
      aufDokumentAnwenden: jest.fn()
    } as unknown as jest.Mocked<BarrierefreiheitService>;

    TestBed.configureTestingModule({
      providers: [
        BarrierefreiheitStore,
        { provide: BarrierefreiheitService, useValue: serviceMock }
      ]
    });

    store = TestBed.inject(BarrierefreiheitStore);
  });

  describe('initial state', () => {
    it('sollte mit Default-Werten initialisiert werden', () => {
      expect(store.schriftgroesse()).toBe('normal');
      expect(store.hoherKontrast()).toBe(false);
      expect(store.reduzierteBewegung()).toBe(false);
    });
  });

  describe('ladeAusSpeicher', () => {
    it('sollte Einstellungen vom Service laden und anwenden', () => {
      serviceMock.getEinstellungen.mockReturnValue({
        schriftgroesse: 'large',
        hoherKontrast: true,
        reduzierteBewegung: true
      });

      store.ladeAusSpeicher();

      expect(serviceMock.getEinstellungen).toHaveBeenCalled();
      expect(serviceMock.aufDokumentAnwenden).toHaveBeenCalled();
      expect(store.schriftgroesse()).toBe('large');
      expect(store.hoherKontrast()).toBe(true);
      expect(store.reduzierteBewegung()).toBe(true);
    });
  });

  describe('setzeSchriftgroesse', () => {
    it('sollte Schriftgröße ändern und speichern', () => {
      store.setzeSchriftgroesse('x-large');

      expect(store.schriftgroesse()).toBe('x-large');
      expect(serviceMock.speichereEinstellungen).toHaveBeenCalledWith(
        expect.objectContaining({ schriftgroesse: 'x-large' })
      );
      expect(serviceMock.aufDokumentAnwenden).toHaveBeenCalled();
    });

    it('sollte alle Schriftgröße-Werte akzeptieren', () => {
      const groessen: Array<'small' | 'normal' | 'large' | 'x-large'> = ['small', 'normal', 'large', 'x-large'];

      for (const groesse of groessen) {
        store.setzeSchriftgroesse(groesse);
        expect(store.schriftgroesse()).toBe(groesse);
      }
    });
  });

  describe('setzeHohenKontrast', () => {
    it('sollte hohen Kontrast aktivieren und speichern', () => {
      store.setzeHohenKontrast(true);

      expect(store.hoherKontrast()).toBe(true);
      expect(serviceMock.speichereEinstellungen).toHaveBeenCalledWith(
        expect.objectContaining({ hoherKontrast: true })
      );
      expect(serviceMock.aufDokumentAnwenden).toHaveBeenCalled();
    });

    it('sollte hohen Kontrast deaktivieren und speichern', () => {
      store.setzeHohenKontrast(true);
      store.setzeHohenKontrast(false);

      expect(store.hoherKontrast()).toBe(false);
    });
  });

  describe('setzeReduzierteBewegung', () => {
    it('sollte reduzierte Bewegung aktivieren und speichern', () => {
      store.setzeReduzierteBewegung(true);

      expect(store.reduzierteBewegung()).toBe(true);
      expect(serviceMock.speichereEinstellungen).toHaveBeenCalledWith(
        expect.objectContaining({ reduzierteBewegung: true })
      );
      expect(serviceMock.aufDokumentAnwenden).toHaveBeenCalled();
    });

    it('sollte reduzierte Bewegung deaktivieren und speichern', () => {
      store.setzeReduzierteBewegung(true);
      store.setzeReduzierteBewegung(false);

      expect(store.reduzierteBewegung()).toBe(false);
    });
  });

  describe('aktuellerZustand', () => {
    it('sollte den kompletten aktuellen Zustand zurückgeben', () => {
      store.setzeSchriftgroesse('large');
      store.setzeHohenKontrast(true);
      store.setzeReduzierteBewegung(true);

      const zustand = store.aktuellerZustand();

      expect(zustand).toEqual({
        schriftgroesse: 'large',
        hoherKontrast: true,
        reduzierteBewegung: true
      });
    });
  });
});
