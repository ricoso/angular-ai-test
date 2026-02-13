import { computed } from '@angular/core';
import { signalStore, withState, withComputed } from '@ngrx/signals';
import { CartState, CART_DEFAULTS, MAX_BADGE_COUNT } from '../models/cart.model';

/**
 * Global store for cart
 * Basic structure — methods will be added later
 */
export const CartStore = signalStore(
  { providedIn: 'root' },

  withState<CartState>(CART_DEFAULTS),

  withComputed(({ items }) => ({
    itemCount: computed(() =>
      items().reduce((sum, item) => sum + item.quantity, 0)
    ),

    badgeText: computed(() => {
      const count = items().reduce((sum, item) => sum + item.quantity, 0);
      if (count === 0) return '';
      if (count > MAX_BADGE_COUNT) return `${MAX_BADGE_COUNT}+`;
      return `${count}`;
    }),

    hasItems: computed(() => items().length > 0)
  }))
);
