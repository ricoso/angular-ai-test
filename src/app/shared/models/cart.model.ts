/**
 * Cart Item Interface
 * Basic structure — will be extended later
 */
export interface CartItem {
  id: string;
  name: string;
  quantity: number;
}

/**
 * Cart State Interface
 */
export interface CartState {
  items: CartItem[];
}

/**
 * Default values for cart
 */
export const CART_DEFAULTS: CartState = {
  items: []
};

/**
 * Maximum badge display count
 * Shows "99+" when exceeding MAX_BADGE_COUNT
 */
export const MAX_BADGE_COUNT = 99;
