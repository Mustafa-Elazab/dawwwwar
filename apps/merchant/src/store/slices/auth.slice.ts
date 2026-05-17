import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { User, Role } from '@dawwar/types';

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isApproved: boolean;
  isRejected: boolean;
  role: Role | null;
  hasStore: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  isApproved: false,
  isRejected: false,
  role: null,
  hasStore: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<{ user: User; token: string; hasStore?: boolean }>) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.isApproved = action.payload.user.isApproved ?? false;
      // @ts-ignore - assuming backend might provide isRejected in future
      state.isRejected = action.payload.user.isRejected ?? false;
      state.role = action.payload.user.role;
      state.hasStore = action.payload.hasStore ?? false;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.isApproved = false;
      state.isRejected = false;
      state.role = null;
      state.hasStore = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    setUser: (state, action: PayloadAction<{ user: User; hasStore: boolean }>) => {
      state.user = action.payload.user;
      state.isApproved = action.payload.user.isApproved ?? false;
      // @ts-ignore
      state.isRejected = action.payload.user.isRejected ?? false;
      state.role = action.payload.user.role;
      state.hasStore = action.payload.hasStore;
    },
    setHasStore: (state, action: PayloadAction<boolean>) => {
      state.hasStore = action.payload;
    },
  },
});

export const { setAuth, logout, setLoading, updateUser, setUser, setHasStore } = authSlice.actions;

export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectIsLoading = (state: { auth: AuthState }) => state.auth.isLoading;
export const selectIsApproved = (state: { auth: AuthState }) => state.auth.isApproved;
export const selectIsRejected = (state: { auth: AuthState }) => state.auth.isRejected;
export const selectRole = (state: { auth: AuthState }) => state.auth.role;
export const selectHasStore = (state: { auth: AuthState }) => state.auth.hasStore;
