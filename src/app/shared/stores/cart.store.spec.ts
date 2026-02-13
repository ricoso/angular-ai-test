import { TestBed } from '@angular/core/testing';
import { CartStore } from './cart.store';

describe('CartStore', () => {
  let store: InstanceType<typeof CartStore>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CartStore]
    });

    store = TestBed.inject(CartStore);
  });

  describe('initial state', () => {
    it('should be initialized with empty items list', () => {
      expect(store.items()).toEqual([]);
    });
  });

  describe('itemCount', () => {
    it('should return 0 when no items', () => {
      expect(store.itemCount()).toBe(0);
    });
  });

  describe('badgeText', () => {
    it('should return empty string when no items', () => {
      expect(store.badgeText()).toBe('');
    });
  });

  describe('hasItems', () => {
    it('should return false when no items', () => {
      expect(store.hasItems()).toBe(false);
    });
  });
});
