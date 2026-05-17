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
  private buffer: DriverLocation[] = [];
  private readonly MAX_BUFFER_SIZE = 50;

  /**
   * Adds a location to the local buffer if the app is offline.
   * Keeps only the last MAX_BUFFER_SIZE locations to prevent memory bloat.
   */
  bufferLocation(location: DriverLocation) {
    this.buffer.push(location);
    if (this.buffer.length > this.MAX_BUFFER_SIZE) {
      this.buffer.shift();
    }
  }

  /**
   * Returns all buffered locations and clears the buffer.
   */
  flushBuffer(): DriverLocation[] {
    const locations = [...this.buffer];
    this.buffer = [];
    return locations;
  }

  get bufferSize() {
    return this.buffer.length;
  }

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

    console.log(`[LocationService] Starting GPS watch (accuracy: ${highAccuracy ? 'HIGH' : 'BALANCED'})`);

    this.watchId = Geolocation.watchPosition(
      (pos: GeoPosition) => {
        const mapped = this.mapPosition(pos);
        if (__DEV__) {
          console.log(`[GPS Update] Lat: ${mapped.latitude.toFixed(5)}, Lng: ${mapped.longitude.toFixed(5)}, Accuracy: ${mapped.accuracy}m`);
        }
        onUpdate(mapped);
      },
      (err: GeoError) => {
        console.warn(`[GPS ERROR] ${err.code}: ${err.message}`);
        onError(new Error(err.message));
      },
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
