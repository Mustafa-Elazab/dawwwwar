import { configureStore } from '@reduxjs/toolkit';
import { authSlice } from './slices/auth.slice';
import { cartSlice } from './slices/cart.slice';
import { uiSlice } from './slices/ui.slice';

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    cart: cartSlice.reducer,
    ui: uiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // needed because we store MMKV refs
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
