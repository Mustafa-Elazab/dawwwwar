import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { storage, StorageKeys } from '../../core/storage/mmkv';
import type { User } from '@dawwar/types';

export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'guest';

export interface AuthState {
  status: AuthStatus;
  user: User | null;
  guestCartId: string | null;
  isAuthenticated: boolean; // deprecated, use status === 'authenticated' instead where possible
  isLoading: boolean;       // deprecated, use status === 'loading' instead
}

const initialState: AuthState = {
  status: 'loading',
  user: null,
  guestCartId: null,
  isAuthenticated: false,
  isLoading: true,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setGuestMode: (state) => {
      state.status = 'guest';
      state.isAuthenticated = false;
      state.isLoading = false;
      if (!state.guestCartId) {
        state.guestCartId = `guest_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
      }
    },
    setAuth: (
      state,
      action: PayloadAction<{
        user: User;
        accessToken: string;
        refreshToken: string;
      }>,
    ) => {
      state.status = 'authenticated';
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.isLoading = false;
      // Intentionally DO NOT clear guestCartId here to allow cart to survive login
      storage.set(StorageKeys.ACCESS_TOKEN, action.payload.accessToken);
      storage.set(StorageKeys.REFRESH_TOKEN, action.payload.refreshToken);
    },
    logout: (state) => {
      state.status = 'guest';
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      // Generating a new anonymous cart id upon logout
      state.guestCartId = `guest_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
      storage.delete(StorageKeys.ACCESS_TOKEN);
      storage.delete(StorageKeys.REFRESH_TOKEN);
    },
    finishLoading: (state) => {
      state.isLoading = false;
      if (state.status === 'loading') {
        state.status = 'idle';
      }
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.status = 'authenticated';
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isLoading = false;
    },
    clearGuestCartId: (state) => {
      state.guestCartId = null;
    },
  },
});

export const { setAuth, logout, finishLoading, updateUser, setUser, setGuestMode, clearGuestCartId } = authSlice.actions;

// Selectors
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectAuthStatus = (state: { auth: AuthState }) => state.auth.status;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.status === 'authenticated' || state.auth.isAuthenticated;
export const selectIsLoading = (state: { auth: AuthState }) => state.auth.status === 'loading' || state.auth.isLoading;
export const selectRole = (state: { auth: AuthState }) => state.auth.user?.role;
export const selectIsApproved = (state: { auth: AuthState }) => state.auth.user?.isApproved ?? false;
export const selectGuestCartId = (state: { auth: AuthState }) => state.auth.guestCartId;
