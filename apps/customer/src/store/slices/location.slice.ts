import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../index';
import { geocodingApi } from '../../features/location/core/api/geocoding';

export interface LocationState {
  currentAddress: string | null;
  latitude: number | null;
  longitude: number | null;
  selectedAddressId: string | null;
  isLoading: boolean;
  reverseGeocodeCache: Record<string, string>; // "lat,lng" -> address
}

const initialState: LocationState = {
  currentAddress: null,
  latitude: null,
  longitude: null,
  selectedAddressId: null,
  isLoading: false,
  reverseGeocodeCache: {},
};

export const fetchReverseGeocode = createAsyncThunk(
  'location/fetchReverseGeocode',
  async (
    { lat, lng, locale }: { lat: number; lng: number; locale?: string },
    { getState, rejectWithValue },
  ) => {
    try {
      const state = getState() as RootState;
      const lang = locale?.toLowerCase().startsWith('ar') ? 'ar' : 'en';
      const cacheKey = `${lat.toFixed(4)},${lng.toFixed(4)},${lang}`;

      if (state.location.reverseGeocodeCache[cacheKey]) {
        return { lat, lng, address: state.location.reverseGeocodeCache[cacheKey], cacheKey };
      }

      const address = await geocodingApi.reverse(lat, lng, locale);
      return { lat, lng, address, cacheKey };
    } catch (error) {
      return rejectWithValue('Failed to reverse geocode');
    }
  },
);

export const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    setLocation: (
      state,
      action: PayloadAction<{ lat: number; lng: number; address: string | null }>,
    ) => {
      state.latitude = action.payload.lat;
      state.longitude = action.payload.lng;
      state.currentAddress = action.payload.address?.trim() ? action.payload.address.trim() : null;
      state.isLoading = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setSelectedAddressId: (state, action: PayloadAction<string | null>) => {
      state.selectedAddressId = action.payload;
    },
    resetLocationState: () => ({ ...initialState }),
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReverseGeocode.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchReverseGeocode.fulfilled, (state, action) => {
        state.isLoading = false;
        state.latitude = action.payload.lat;
        state.longitude = action.payload.lng;
        const addr = (action.payload.address ?? '').trim();
        state.currentAddress = addr.length > 0 ? addr : null;

        const cacheKey =
          action.payload.cacheKey ??
          `${action.payload.lat.toFixed(4)},${action.payload.lng.toFixed(4)},en`;
        if (addr) {
          state.reverseGeocodeCache[cacheKey] = addr;
        }
      })
      .addCase(fetchReverseGeocode.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { setLocation, setLoading, setSelectedAddressId, resetLocationState } = locationSlice.actions;

export const selectLocation = (state: RootState) => state.location;

export default locationSlice.reducer;
