import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface MerchantState {
  isOpen: boolean;         // optimistic UI for shop open/closed toggle
  newOrderCount: number;   // badge counter on Orders tab
}

const initialState: MerchantState = {
  isOpen: true,
  newOrderCount: 0,
};

export const merchantSlice = createSlice({
  name: 'merchant',
  initialState,
  reducers: {
    setShopOpen: (state, action: PayloadAction<boolean>) => {
      state.isOpen = action.payload;
    },
    incrementNewOrders: (state) => {
      state.newOrderCount += 1;
    },
    clearNewOrders: (state) => {
      state.newOrderCount = 0;
    },
  },
});

export const { setShopOpen, incrementNewOrders, clearNewOrders } = merchantSlice.actions;
export const selectIsShopOpen = (s: { merchant: MerchantState }) => s.merchant.isOpen;
export const selectNewOrderCount = (s: { merchant: MerchantState }) => s.merchant.newOrderCount;
