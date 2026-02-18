import { TestBed } from '@angular/core/testing';

import { BookingApiService } from '@app/features/booking/services/booking-api.service';
import { BookingStore } from '@app/features/booking/stores/booking.store';

import { CartStore } from './cart.store';

describe('CartStore', () => {
  let store: InstanceType<typeof CartStore>;
  let bookingStore: InstanceType<typeof BookingStore>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CartStore,
        BookingStore,
        {
          provide: BookingApiService,
          useValue: {
            getBrands: jest.fn().mockResolvedValue([]),
            getLocations: jest.fn().mockResolvedValue([]),
            getServices: jest.fn().mockResolvedValue([])
          }
        }
      ]
    });

    store = TestBed.inject(CartStore);
    bookingStore = TestBed.inject(BookingStore);
  });

  describe('initial state', () => {
    it('should be initialized with empty items list', () => {
      expect(store.items()).toEqual([]);
    });
  });

  describe('itemCount', () => {
    it('should return 0 when no services selected', () => {
      expect(store.itemCount()).toBe(0);
    });

    it('should return service count from BookingStore', () => {
      bookingStore.toggleService('huau');
      expect(store.itemCount()).toBe(1);

      bookingStore.toggleService('inspection');
      expect(store.itemCount()).toBe(2);
    });
  });

  describe('badgeText', () => {
    it('should return empty string when no services selected', () => {
      expect(store.badgeText()).toBe('');
    });

    it('should return count as string when services selected', () => {
      bookingStore.toggleService('huau');
      expect(store.badgeText()).toBe('1');

      bookingStore.toggleService('inspection');
      expect(store.badgeText()).toBe('2');
    });
  });

  describe('hasItems', () => {
    it('should return false when no services selected', () => {
      expect(store.hasItems()).toBe(false);
    });

    it('should return true when services are selected', () => {
      bookingStore.toggleService('huau');
      expect(store.hasItems()).toBe(true);
    });
  });
});
