import { TestBed } from '@angular/core/testing';

import { VERFUEGBARE_MARKEN } from '../models/marke.model';
import { BuchungApiService } from '../services/buchung-api.service';
import { BuchungStore } from './buchung.store';

describe('BuchungStore', () => {
  let store: InstanceType<typeof BuchungStore>;
  let apiMock: jest.Mocked<BuchungApiService>;

  beforeEach(() => {
    apiMock = {
      holeMarken: jest.fn().mockResolvedValue([...VERFUEGBARE_MARKEN])
    } as unknown as jest.Mocked<BuchungApiService>;

    TestBed.configureTestingModule({
      providers: [
        BuchungStore,
        { provide: BuchungApiService, useValue: apiMock }
      ]
    });

    store = TestBed.inject(BuchungStore);
  });

  describe('initial state', () => {
    it('should have empty marken array', () => {
      expect(store.marken()).toEqual([]);
    });

    it('should have no gewaehlteMarke', () => {
      expect(store.gewaehlteMarke()).toBeNull();
    });

    it('should not be loading', () => {
      expect(store.istLaden()).toBe(false);
    });

    it('should have no error', () => {
      expect(store.fehler()).toBeNull();
    });
  });

  describe('computed signals', () => {
    it('should compute hatMarkeGewaehlt as false initially', () => {
      expect(store.hatMarkeGewaehlt()).toBe(false);
    });

    it('should compute hatMarkeGewaehlt as true after selection', () => {
      store.setzeMarke('audi');
      expect(store.hatMarkeGewaehlt()).toBe(true);
    });

    it('should compute anzahlMarken', () => {
      expect(store.anzahlMarken()).toBe(0);
    });
  });

  describe('setzeMarke', () => {
    it('should set the selected brand', () => {
      store.setzeMarke('bmw');
      expect(store.gewaehlteMarke()).toBe('bmw');
    });

    it('should allow changing the brand', () => {
      store.setzeMarke('audi');
      store.setzeMarke('mini');
      expect(store.gewaehlteMarke()).toBe('mini');
    });
  });

  describe('resetBuchung', () => {
    it('should reset all state to initial values', () => {
      store.setzeMarke('audi');
      store.resetBuchung();

      expect(store.gewaehlteMarke()).toBeNull();
      expect(store.marken()).toEqual([]);
      expect(store.istLaden()).toBe(false);
    });
  });
});
