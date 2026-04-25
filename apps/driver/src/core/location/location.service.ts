import Geolocation, {
  type GeoPosition,
  type GeoError,
} from 'react-native-geolocation-service';
import { PermissionsAndroid, Platform } from 'react-native';

export interface DriverLocation {
  latitude: number;
  longitude: number;
  heading: number | null;
  speed: number | null;
  accuracy: number;
  timestamp: number;
}

export class LocationService {
  private watchId: number | null = null;

  /** Request location permission on Android */
  async requestPermission(): Promise<boolean> {
    if (Platform.OS !== 'android') return true;

    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Location Permission',
        message: 'Dawwar needs your location to show you to customers.',
        buttonPositive: 'Allow',
        buttonNegative: 'Deny',
      },
    );

    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }

  /** Get current location once */
  getCurrentPosition(): Promise<DriverLocation> {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        (pos: GeoPosition) => resolve(this.mapPosition(pos)),
        (err: GeoError) => reject(new Error(err.message)),
        {
          enableHighAccuracy: true,
          timeout: 10_000,
          maximumAge: 5_000,
        },
      );
    });
  }

  /**
   * Start watching position — calls onUpdate every time the device moves.
   * Uses HIGH accuracy when actively delivering, BALANCED otherwise.
   */
  startWatching(
    onUpdate: (location: DriverLocation) => void,
    onError: (error: Error) => void,
    highAccuracy = true,
  ): void {
    if (this.watchId !== null) this.stopWatching();

    this.watchId = Geolocation.watchPosition(
      (pos: GeoPosition) => onUpdate(this.mapPosition(pos)),
      (err: GeoError) => onError(new Error(err.message)),
      {
        enableHighAccuracy: highAccuracy,
        distanceFilter: 10,        // emit only when moved 10+ metres
        interval: 4000,            // Android: check every 4 seconds
        fastestInterval: 2000,     // Android: fastest possible update
        forceRequestLocation: true,
        showLocationDialog: true,
      },
    );
  }

  stopWatching(): void {
    if (this.watchId !== null) {
      Geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
  }

  private mapPosition(pos: GeoPosition): DriverLocation {
    return {
      latitude: pos.coords.latitude,
      longitude: pos.coords.longitude,
      heading: pos.coords.heading ?? null,
      speed: pos.coords.speed ?? null,
      accuracy: pos.coords.accuracy,
      timestamp: pos.timestamp,
    };
  }
}

export const locationService = new LocationService();
