import { configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import { mmkvReduxStorage } from '../core/storage/mmkvReduxStorage';
import { authSlice } from './slices/auth.slice';
import { cartSlice } from './slices/cart.slice';
import { uiSlice } from './slices/ui.slice';
import { locationSlice } from './slices/location.slice';

const cartPersistConfig = {
  key: 'cart',
  storage: mmkvReduxStorage,
};

const locationPersistConfig = {
  key: 'location',
  storage: mmkvReduxStorage,
  whitelist: ['currentAddress', 'latitude', 'longitude', 'selectedAddressId'],
};

const persistedCartReducer = persistReducer(cartPersistConfig, cartSlice.reducer);
const persistedLocationReducer = persistReducer(locationPersistConfig, locationSlice.reducer);

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    cart: persistedCartReducer,
    ui: uiSlice.reducer,
    location: persistedLocationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // needed for redux-persist and MMKV
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
