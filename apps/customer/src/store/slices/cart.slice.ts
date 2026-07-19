import { createSlice, createSelector, type PayloadAction } from '@reduxjs/toolkit';
import type { ProductVariant, SelectedModifierGroup, User } from '@dawwar/types';
import { logout, setAuth, setUser, startAuthFlow } from './auth.slice';

export interface CartItem {
  lineKey?: string;
  productId: string;
  name: string;
  nameAr: string;
  price: number;
  quantity: number;
  image: string;
  merchantId: string;
  merchantName: string;
  merchantNameAr?: string;
  selectedModifiers?: SelectedModifierGroup[];
  variant?: ProductVariant;
}

export interface CartState {
  ownerUserId: string | null;
  items: CartItem[];
  merchantId: string | null;
  merchantName: string | null;
  merchantNameAr?: string | null;
}

const createEmptyCartState = (ownerUserId: string | null = null): CartState => ({
  ownerUserId,
  items: [],
  merchantId: null,
  merchantName: null,
  merchantNameAr: null,
});

const resetCartState = (state: CartState, ownerUserId: string | null = null) => {
  state.ownerUserId = ownerUserId;
  state.items = [];
  state.merchantId = null;
  state.merchantName = null;
  state.merchantNameAr = null;
};

const bindCartToUser = (state: CartState, userId: string | null | undefined) => {
  if (!userId) {
    resetCartState(state);
    return;
  }

  if (state.ownerUserId !== userId) {
    resetCartState(state, userId);
    return;
  }

  state.ownerUserId = userId;
};

const initialState: CartState = createEmptyCartState();

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

      const lineKey = action.payload.lineKey ?? action.payload.productId;
      const quantity = Math.max(1, action.payload.quantity ?? 1);
      const existing = state.items.find(
        (i) => (i.lineKey ?? i.productId) === lineKey,
      );
      if (existing) {
        existing.quantity += quantity;
      } else {
        state.items.push({ ...action.payload, lineKey, quantity });
      }
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((i) => i.productId !== action.payload && i.lineKey !== action.payload);
      if (state.items.length === 0) {
        state.merchantId = null;
        state.merchantName = null;
        state.merchantNameAr = null;
      }
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ productId: string; quantity: number }>,
    ) => {
      const item = state.items.find(
        (i) => i.productId === action.payload.productId || i.lineKey === action.payload.productId,
      );
      if (item) {
        if (action.payload.quantity <= 0) {
          state.items = state.items.filter(
            (i) => i.productId !== action.payload.productId && i.lineKey !== action.payload.productId,
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
    },
    clearCart: (state) => {
      resetCartState(state, state.ownerUserId);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(logout, (state) => {
        resetCartState(state);
      })
      .addCase(startAuthFlow, (state) => {
        resetCartState(state);
      })
      .addCase(setAuth, (state, action) => {
        bindCartToUser(state, action.payload.user.id);
      })
      .addCase(setUser, (state, action: PayloadAction<User>) => {
        bindCartToUser(state, action.payload.id);
      });
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
