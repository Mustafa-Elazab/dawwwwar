import { useEffect, useRef } from 'react';
import Geolocation from '@react-native-community/geolocation';
import { socketManager } from '../core/socket';

export const useLocationEmitter = (orderId: string | null) => {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // clear any existing interval first
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // only start emitting if we have an active order
    if (!orderId) return;

    const socket = socketManager.instance;
    if (!socket) {
      socketManager.connect();
      return;
    }

    intervalRef.current = setInterval(() => {
      Geolocation.getCurrentPosition(
        (position) => {
          socket.emit('DRIVER_LOCATION_UPDATE', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            heading: position.coords.heading ?? undefined,
            orderId,
          });
        },
        (error) => console.warn('[LocationEmitter] GPS error:', error),
        { enableHighAccuracy: true, timeout: 4000, maximumAge: 1000 }
      );
    }, 2000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [orderId]); 
};
