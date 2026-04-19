export interface DeliveryMapProps {
  driverLatitude: number;
  driverLongitude: number;
  pickupLatitude?: number;
  pickupLongitude?: number;
  deliveryLatitude: number;
  deliveryLongitude: number;
  showPickup?: boolean;
}
