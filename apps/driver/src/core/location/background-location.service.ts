import { socketManager } from '../socket';
import { SOCKET_EVENTS } from '@dawwar/api-client';
import {
  type DriverLocation,
  locationService,
} from './location.service';

/**
 * Tracking Modes for Different Operational States
 */
export enum TrackingMode {
  IDLE = 'IDLE',
  ONLINE = 'ONLINE',
  ACTIVE_DELIVERY = 'ACTIVE',
}

class BackgroundLocationService {
  private activeOrderId: string | null = null;
  private currentMode: TrackingMode = TrackingMode.IDLE;
  private isWatching = false;

  async setup() {
    await locationService.requestPermission();
  }

  async setMode(mode: TrackingMode, orderId: string | null = null) {
    const shouldRestart =
      this.isWatching &&
      (this.currentMode !== mode || this.activeOrderId !== orderId);

    this.currentMode = mode;
    this.activeOrderId = orderId;

    if (mode === TrackingMode.IDLE) {
      this.stopWatching();
      return;
    }

    if (!this.isWatching || shouldRestart) {
      this.stopWatching();
      locationService.startWatching(
        this.onLocation,
        this.onLocationError,
        mode === TrackingMode.ACTIVE_DELIVERY,
      );
      this.isWatching = true;
    }
  }

  private stopWatching() {
    if (!this.isWatching) return;

    locationService.stopWatching();
    this.isWatching = false;
  }

  private onLocation = (location: DriverLocation) => {
    if (!this.activeOrderId) return;

    socketManager.emit(SOCKET_EVENTS.DRIVER_LOCATION, {
      orderId: this.activeOrderId,
      latitude: location.latitude,
      longitude: location.longitude,
      heading: location.heading,
      speed: location.speed,
      accuracy: location.accuracy,
      timestamp: location.timestamp,
      sequence: location.timestamp,
    });
  };

  private onLocationError = (error: Error) => {
    console.warn('[BackgroundLocationService] Location error:', error.message);
  };
}

export const backgroundLocationService = new BackgroundLocationService();
