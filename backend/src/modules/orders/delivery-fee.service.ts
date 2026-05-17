import { Injectable, BadRequestException } from '@nestjs/common';

export interface DeliveryFeeConfig {
  baseFee: number;
  ratePerKm: number;
  longDistanceSurcharge: number;
  longDistanceThresholdKm: number;
  maxDistanceKm: number;
  freeDeliveryThreshold?: number; // order total above this = free delivery
}

// Default config — override from DB or env for easy adjustment
const DEFAULT_CONFIG: DeliveryFeeConfig = {
  baseFee: 15,
  ratePerKm: 3,
  longDistanceSurcharge: 10,
  longDistanceThresholdKm: 7,
  maxDistanceKm: 30,
  freeDeliveryThreshold: undefined, // set to e.g. 300 EGP for free delivery promo
};

@Injectable()
export class DeliveryFeeService {
  // ── Haversine formula — distance between two GPS points in km ─────────────
  calculateDistanceKm(
    lat1: number, lng1: number,
    lat2: number, lng2: number,
  ): number {
    const R = 6371; // Earth radius in km
    const dLat = this.toRad(lat2 - lat1);
    const dLng = this.toRad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
      Math.cos(this.toRad(lat2)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  // ── Calculate delivery fee ────────────────────────────────────────────────
  calculateFee(
    merchantLat: number, merchantLng: number,
    customerLat: number, customerLng: number,
    orderTotal: number,
    config: DeliveryFeeConfig = DEFAULT_CONFIG,
  ): { fee: number; distanceKm: number; isFree: boolean } {
    const distanceKm = this.calculateDistanceKm(
      merchantLat, merchantLng,
      customerLat, customerLng,
    );

    // Reject order if too far
    if (distanceKm > config.maxDistanceKm) {
      throw new BadRequestException(
        `Delivery distance ${distanceKm.toFixed(1)}km exceeds maximum ${config.maxDistanceKm}km`
      );
    }

    // Check free delivery threshold
    if (config.freeDeliveryThreshold && orderTotal >= config.freeDeliveryThreshold) {
      return { fee: 0, distanceKm, isFree: true };
    }

    // Calculate fee
    let fee = config.baseFee + distanceKm * config.ratePerKm;

    if (distanceKm > config.longDistanceThresholdKm) {
      fee += config.longDistanceSurcharge;
    }

    // Round to nearest 0.5 EGP for clean display
    fee = Math.round(fee * 2) / 2;

    return { fee, distanceKm, isFree: false };
  }
}
