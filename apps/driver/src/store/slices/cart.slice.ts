import { createSlice, createSelector, type PayloadAction } from '@reduxjs/toolkit';

export interface CartItem {
  productId: string;
  name: string;
  nameAr: string;
  price: number;
  quantity: number;
  image: string;
  merchantId: string;
  merchantName: string;
}

interface CartState {
  items: CartItem[];
  merchantId: string | null;
  merchantName: string | null;
}

const initialState: CartState = {
  items: [],
  merchantId: null,
  merchantName: null,
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<CartItem>) => {
      const { merchantId, merchantName } = action.payload;

      // If cart belongs to a different merchant, clear it first
      if (state.merchantId && state.merchantId !== merchantId) {
        state.items = [];
      }

      state.merchantId = merchantId;
      state.merchantName = merchantName;

      const existing = state.items.find(
        (i) => i.productId === action.payload.productId,
      );
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((i) => i.productId !== action.payload);
      if (state.items.length === 0) {
        state.merchantId = null;
        state.merchantName = null;
      }
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
    },
    clearCart: (state) => {
      state.items = [];
      state.merchantId = null;
      state.merchantName = null;
    },
  },
});

export const { addItem, removeItem, updateQuantity, clearCart } = cartSlice.actions;

// Selectors
export const selectCartItems = (state: { cart: CartState }) => state.cart.items;
export const selectCartMerchantId = (state: { cart: CartState }) => state.cart.merchantId;
export const selectCartCount = createSelector(
  selectCartItems,
  (items) => items.reduce((sum, item) => sum + item.quantity, 0),
);
export const selectCartTotal = createSelector(
  selectCartItems,
  (items) => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
);
