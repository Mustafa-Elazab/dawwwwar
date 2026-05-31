import { createSlice, createSelector, type PayloadAction } from '@reduxjs/toolkit';
import { storage } from '../../core/storage/mmkv';

export interface CartItem {
  productId: string;
  name: string;
  nameAr: string;
  price: number;
  quantity: number;
  image: string;
  merchantId: string;
  merchantName: string;
  merchantNameAr?: string;
}

export interface CartState {
  items: CartItem[];
  merchantId: string | null;
  merchantName: string | null;
  merchantNameAr?: string | null;
}

const loadPersistedCart = (): CartState => {
  try {
    const raw = storage.getString('cart-storage');
    if (raw) return JSON.parse(raw);
  } catch {}
  return { items: [], merchantId: null, merchantName: null, merchantNameAr: null };
};

const initialState: CartState = loadPersistedCart();

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<CartItem>) => {
      const { merchantId, merchantName, merchantNameAr } = action.payload;

      // A basket can only belong to one merchant at a time.
      if (state.merchantId && state.merchantId !== merchantId) {
        return;
      }

      state.merchantId = merchantId;
      state.merchantName = merchantName;
      state.merchantNameAr = merchantNameAr;

      const existing = state.items.find(
        (i) => i.productId === action.payload.productId,
      );
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }

      storage.set('cart-storage', JSON.stringify(state));
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((i) => i.productId !== action.payload);
      if (state.items.length === 0) {
        state.merchantId = null;
        state.merchantName = null;
        state.merchantNameAr = null;
      }
      storage.set('cart-storage', JSON.stringify(state));
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ productId: string; quantity: number }>,
    ) => {
      const item = state.items.find(
        (i) => i.productId === action.payload.productId,
      );
      if (item) {
        if (action.payload.quantity <= 0) {
          state.items = state.items.filter(
            (i) => i.productId !== action.payload.productId,
          );
        } else {
          item.quantity = action.payload.quantity;
        }
      }
      if (state.items.length === 0) {
        state.merchantId = null;
        state.merchantName = null;
        state.merchantNameAr = null;
      }
      storage.set('cart-storage', JSON.stringify(state));
    },
    clearCart: (state) => {
      state.items = [];
      state.merchantId = null;
      state.merchantName = null;
      state.merchantNameAr = null;
      storage.delete('cart-storage');
    },
  },
});

export const { addItem, removeItem, updateQuantity, clearCart } = cartSlice.actions;

// Selectors
export const selectCartItems = (state: { cart: CartState }) => state.cart.items;
export const selectCartMerchantId = (state: { cart: CartState }) => state.cart.merchantId;
export const selectCartMerchantName = createSelector(
  (state: { cart: CartState }) => state.cart.merchantName,
  (name) => name
);
export const selectCartItemById = (productId: string) =>
  createSelector(selectCartItems, (items) => items.find((i) => i.productId === productId));
export const selectCartCount = createSelector(
  selectCartItems,
  (items) => items.reduce((sum, item) => sum + item.quantity, 0),
);
export const selectCartTotal = createSelector(
  selectCartItems,
  (items) => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
);
