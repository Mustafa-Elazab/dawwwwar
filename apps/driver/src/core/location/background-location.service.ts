import BackgroundGeolocation, {
  State,
  Location,
  MotionChangeEvent,
  ProviderChangeEvent,
// @ts-ignore
} from 'react-native-background-geolocation';
import { Platform } from 'react-native';
import { socketManager } from '../socket';
import { SOCKET_EVENTS } from '@dawwar/api-client';
import api from '../api/client';

/**
 * Tracking Modes for Different Operational States
 */
export enum TrackingMode {
  IDLE = 'IDLE',               // Offline or App Closed (Lowest frequency)
  ONLINE = 'ONLINE',           // Online, no active order (Moderate frequency)
  ACTIVE_DELIVERY = 'ACTIVE',  // Online, delivering (High frequency)
}

class BackgroundLocationService {
  private activeOrderId: string | null = null;
  private currentMode: TrackingMode = TrackingMode.IDLE;

  async setup() {
    // 1. Listen to location events
    BackgroundGeolocation.onLocation(this.onLocation.bind(this), (error: any) => {
      console.warn('[SDK] Location Error:', error);
    });

    // 2. Listen to motion changes (Still vs Moving)
    BackgroundGeolocation.onMotionChange((event: MotionChangeEvent) => {
      console.log('[SDK] MotionChange:', event.isMoving);
    });

    // 3. Listen to provider changes (GPS on/off)
    BackgroundGeolocation.onProviderChange((event: ProviderChangeEvent) => {
      console.log('[SDK] ProviderChange:', event.status);
    });

    // 4. Initial Configuration
    await BackgroundGeolocation.ready({
      // Debug & Logging
      debug: __DEV__,
      logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
      
      // Basic Config
      desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
      distanceFilter: 10, // 10 meters
      stopTimeout: 5,     // Stop tracking after 5 mins of no movement
      
      // Android Specific
      foregroundService: true,
      notification: {
        title: 'Dawwar Driver Tracking',
        text: 'Tracking active for delivery',
        color: '#1DB954',
        smallIcon: 'ic_notification', // Ensure this exists in android/app/src/main/res/drawable
      },
      
      // Persistence & Battery
      heartbeatInterval: 60,
      stopOnTerminate: false, // Critical for background tracking
      startOnBoot: true,      // Auto-start after phone reboot
      
      // Auto-Sync to Backend (Native level)
      url: `${api.defaults.baseURL}/driver/location`,
      autoSync: true,
      maxBatchSize: 1,
      params: {
        // These are attached to every POST request sent natively
        appState: 'background',
      },
    });
  }

  async setMode(mode: TrackingMode, orderId: string | null = null) {
    this.currentMode = mode;
    this.activeOrderId = orderId;

    let config = {};

    switch (mode) {
      case TrackingMode.ACTIVE_DELIVERY:
        config = {
          desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
          distanceFilter: 5,
          locationUpdateInterval: 5000,
          fastestLocationUpdateInterval: 2000,
        };
        break;
      case TrackingMode.ONLINE:
        config = {
          desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_MEDIUM,
          distanceFilter: 20,
          locationUpdateInterval: 15000,
        };
        break;
      default:
        config = {
          desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_LOW,
          distanceFilter: 100,
        };
    }

    await BackgroundGeolocation.setConfig(config);
    
    if (mode !== TrackingMode.IDLE) {
      await BackgroundGeolocation.start();
    } else {
      await BackgroundGeolocation.stop();
    }
  }

  private onLocation(location: Location) {
    console.log('[SDK] Location Received:', location.coords.accuracy);

    // Emit via socket for real-time customer map
    if (this.activeOrderId) {
      socketManager.emit(SOCKET_EVENTS.DRIVER_LOCATION, {
        orderId: this.activeOrderId,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        heading: location.coords.heading,
        speed: location.coords.speed,
        accuracy: location.coords.accuracy,
        batteryLevel: location.battery.level,
        timestamp: location.timestamp,
        sequence: location.odometer, // Use odometer as a sequence proxy or timestamp
      });
    }
  }
}

export const backgroundLocationService = new BackgroundLocationService();
