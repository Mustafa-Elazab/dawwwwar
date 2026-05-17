import { configureStore } from '@reduxjs/toolkit';
import { authSlice } from './slices/auth.slice';
import { merchantSlice } from './slices/merchant.slice';
import { uiSlice } from './slices/ui.slice';
import Reactotron from '../core/config/reactotron.config';

const enhancers = __DEV__ && (Reactotron as any).createEnhancer
  ? [(Reactotron as any).createEnhancer()]
  : [];

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    merchant: merchantSlice.reducer,
    ui: uiSlice.reducer,
  },
  middleware: (getDefault) => getDefault({ serializableCheck: false }),
  enhancers: (getDefaultEnhancers) =>
    getDefaultEnhancers().concat(...enhancers),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
