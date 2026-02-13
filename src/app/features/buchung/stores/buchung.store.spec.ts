import { TestBed } from '@angular/core/testing';

import { VERFUEGBARE_MARKEN } from '../models/marke.model';
import { BuchungApiService } from '../services/buchung-api.service';

import { BuchungStore } from './buchung.store';

describe('BuchungStore', () => {
  let store: InstanceType<typeof BuchungStore>;
  let apiSpy: jest.Mocked<BuchungApiService>;

  beforeEach(() => {
    apiSpy = {
      holeMarken: jest.fn().mockResolvedValue(VERFUEGBARE_MARKEN)
    } as unknown as jest.Mocked<BuchungApiService>;

    TestBed.configureTestingModule({
      providers: [
        BuchungStore,
        { provide: BuchungApiService, useValue: apiSpy }
      ]
    });

    store = TestBed.inject(BuchungStore);
  });

  describe('Initial State', () => {
    it('should have empty marken', () => {
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

  describe('Computed', () => {
    it('should compute hatMarkeGewaehlt as false initially', () => {
      expect(store.hatMarkeGewaehlt()).toBe(false);
    });

    it('should compute anzahlMarken as 0 initially', () => {
      expect(store.anzahlMarken()).toBe(0);
    });
  });

  describe('setzeMarke', () => {
    it('should set gewaehlteMarke', () => {
      store.setzeMarke('bmw');
      expect(store.gewaehlteMarke()).toBe('bmw');
    });

    it('should update hatMarkeGewaehlt to true', () => {
      store.setzeMarke('audi');
      expect(store.hatMarkeGewaehlt()).toBe(true);
    });
  });

  describe('ladeMarken', () => {
    it('should call API service', () => {
      store.ladeMarken();
      expect(apiSpy.holeMarken).toHaveBeenCalled();
    });

    it('should load marken from API', async () => {
      store.ladeMarken();
      await new Promise(resolve => setTimeout(resolve, 0));
      expect(store.marken()).toEqual(VERFUEGBARE_MARKEN);
      expect(store.istLaden()).toBe(false);
    });

    it('should update anzahlMarken after load', async () => {
      store.ladeMarken();
      await new Promise(resolve => setTimeout(resolve, 0));
      expect(store.anzahlMarken()).toBe(5);
    });
  });

  describe('resetBuchung', () => {
    it('should reset to initial state', () => {
      store.setzeMarke('bmw');
      store.resetBuchung();
      expect(store.gewaehlteMarke()).toBeNull();
      expect(store.marken()).toEqual([]);
      expect(store.istLaden()).toBe(false);
      expect(store.fehler()).toBeNull();
    });
  });
});
