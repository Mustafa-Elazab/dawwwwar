import React, { useEffect, useRef } from 'react';
import { StyleSheet } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import type { DeliveryMapProps } from './types';

export function DeliveryMap({
  driverLatitude,
  driverLongitude,
  pickupLatitude,
  pickupLongitude,
  deliveryLatitude,
  deliveryLongitude,
  showPickup = true,
}: DeliveryMapProps) {
  const mapRef = useRef<MapView>(null);

  // Animate map camera to driver position on each update
  useEffect(() => {
    mapRef.current?.animateCamera(
      {
        center: { latitude: driverLatitude, longitude: driverLongitude },
        zoom: 15,
      },
      { duration: 500 },
    );
  }, [driverLatitude, driverLongitude]);

  return (
    <MapView
      ref={mapRef}
      style={styles.map}
      provider={PROVIDER_GOOGLE}
      initialRegion={{
        latitude: driverLatitude,
        longitude: driverLongitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      }}
    >
      {/* Driver marker — pulsing blue dot */}
      <Marker
        coordinate={{ latitude: driverLatitude, longitude: driverLongitude }}
        title="You"
        pinColor="blue"
      />

      {/* Pickup marker */}
      {showPickup && pickupLatitude != null && pickupLongitude != null && (
        <Marker
          coordinate={{ latitude: pickupLatitude, longitude: pickupLongitude }}
          title="Pickup"
          pinColor="orange"
        />
      )}

      {/* Delivery marker */}
      <Marker
        coordinate={{ latitude: deliveryLatitude, longitude: deliveryLongitude }}
        title="Customer"
        pinColor="green"
      />
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: { width: '100%', height: 220 },
});
