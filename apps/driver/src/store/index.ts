import { configureStore } from '@reduxjs/toolkit';
import { authSlice } from './slices/auth.slice';
import { driverSlice } from './slices/driver.slice';
import { uiSlice } from './slices/ui.slice';

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    driver: driverSlice.reducer,
    ui: uiSlice.reducer,
  },
  middleware: (getDefault) => getDefault({ serializableCheck: false }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
