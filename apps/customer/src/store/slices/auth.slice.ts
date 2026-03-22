import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { storage, StorageKeys } from '../../core/storage/mmkv';
import type { User } from '@dawwar/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;   // true while restoring session on app launch
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (
      state,
      action: PayloadAction<{
        user: User;
        accessToken: string;
        refreshToken: string;
      }>,
    ) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.isLoading = false;
      storage.set(StorageKeys.ACCESS_TOKEN, action.payload.accessToken);
      storage.set(StorageKeys.REFRESH_TOKEN, action.payload.refreshToken);
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      storage.delete(StorageKeys.ACCESS_TOKEN);
      storage.delete(StorageKeys.REFRESH_TOKEN);
    },
    finishLoading: (state) => {
      state.isLoading = false;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
});

export const { setAuth, logout, finishLoading, updateUser } = authSlice.actions;

// Selectors
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectIsLoading = (state: { auth: AuthState }) => state.auth.isLoading;
export const selectRole = (state: { auth: AuthState }) => state.auth.user?.role;
export const selectIsApproved = (state: { auth: AuthState }) => state.auth.user?.isApproved ?? false;
