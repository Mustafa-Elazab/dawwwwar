import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface DriverLocation {
  latitude: number;
  longitude: number;
  heading?: number;
}

interface DriverState {
  isOnline: boolean;
  activeOrderId: string | null;
  currentLocation: DriverLocation | null;
  locationPermissionGranted: boolean;
}

const initialState: DriverState = {
  isOnline: false,
  activeOrderId: null,
  currentLocation: null,
  locationPermissionGranted: false,
};

export const driverSlice = createSlice({
  name: 'driver',
  initialState,
  reducers: {
    setOnline: (state, action: PayloadAction<boolean>) => {
      state.isOnline = action.payload;
    },
    setActiveOrder: (state, action: PayloadAction<string | null>) => {
      state.activeOrderId = action.payload;
    },
    updateLocation: (state, action: PayloadAction<DriverLocation>) => {
      state.currentLocation = action.payload;
    },
    setLocationPermission: (state, action: PayloadAction<boolean>) => {
      state.locationPermissionGranted = action.payload;
    },
  },
});

export const { setOnline, setActiveOrder, updateLocation, setLocationPermission } = driverSlice.actions;

export const selectIsOnline = (state: { driver: DriverState }) => state.driver.isOnline;
export const selectActiveOrderId = (state: { driver: DriverState }) => state.driver.activeOrderId;
export const selectCurrentLocation = (state: { driver: DriverState }) => state.driver.currentLocation;
export const selectLocationPermissionGranted = (state: { driver: DriverState }) => state.driver.locationPermissionGranted;
