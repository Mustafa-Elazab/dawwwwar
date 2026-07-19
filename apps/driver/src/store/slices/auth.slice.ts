import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { User, Role } from '@dawwar/types';
import { storage, StorageKeys } from '../../core/storage/mmkv';

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isApproved: boolean;
  role: Role | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  isApproved: false,
  role: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (
      state,
      action: PayloadAction<{ user: User; accessToken: string; refreshToken: string }>,
    ) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.isApproved = action.payload.user.isApproved ?? false;
      state.role = action.payload.user.role;
      storage.set(StorageKeys.ACCESS_TOKEN, action.payload.accessToken);
      storage.set(StorageKeys.REFRESH_TOKEN, action.payload.refreshToken);
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.isApproved = false;
      state.role = null;
      storage.delete(StorageKeys.ACCESS_TOKEN);
      storage.delete(StorageKeys.REFRESH_TOKEN);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.isApproved = action.payload.isApproved ?? false;
      state.role = action.payload.role;
    },
  },
});

export const { setAuth, logout, setLoading, updateUser, setUser } = authSlice.actions;

export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectIsLoading = (state: { auth: AuthState }) => state.auth.isLoading;
export const selectIsApproved = (state: { auth: AuthState }) => state.auth.isApproved;
export const selectRole = (state: { auth: AuthState }) => state.auth.role;
