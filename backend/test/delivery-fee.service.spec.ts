import { describe, expect, it } from '@jest/globals';
import { BadRequestException } from '@nestjs/common';
import { DeliveryFeeService } from '../src/modules/orders/delivery-fee.service';

describe('DeliveryFeeService', () => {
  const service = new DeliveryFeeService();

  it('calculates a deterministic base plus per-km fee', () => {
    const result = service.calculateFee(
      30,
      31,
      30,
      31.01,
      100,
      {
        baseFee: 10,
        ratePerKm: 2,
        longDistanceSurcharge: 0,
        longDistanceThresholdKm: 100,
        maxDistanceKm: 30,
        minFee: 0,
        maxFee: 100,
      },
    );

    expect(result.fee).toBeGreaterThan(10);
    expect(result.distanceKm).toBeGreaterThan(0);
    expect(result.isFree).toBe(false);
  });

  it('applies min and max clamps', () => {
    const low = service.calculateFee(30, 31, 30, 31, 100, {
      baseFee: 1,
      ratePerKm: 1,
      longDistanceSurcharge: 0,
      longDistanceThresholdKm: 100,
      maxDistanceKm: 30,
      minFee: 12,
      maxFee: 20,
    });
    const high = service.calculateFee(30, 31, 30, 31.2, 100, {
      baseFee: 50,
      ratePerKm: 10,
      longDistanceSurcharge: 0,
      longDistanceThresholdKm: 100,
      maxDistanceKm: 30,
      minFee: 12,
      maxFee: 20,
    });

    expect(low.fee).toBe(12);
    expect(high.fee).toBe(20);
  });

  it('supports free delivery thresholds', () => {
    const result = service.calculateFee(30, 31, 30, 31.01, 500, {
      baseFee: 10,
      ratePerKm: 2,
      longDistanceSurcharge: 0,
      longDistanceThresholdKm: 100,
      maxDistanceKm: 30,
      freeDeliveryThreshold: 300,
    });

    expect(result.fee).toBe(0);
    expect(result.isFree).toBe(true);
  });

  it('rejects distances above the configured delivery radius', () => {
    expect(() =>
      service.calculateFee(30, 31, 31, 32, 100, {
        baseFee: 10,
        ratePerKm: 2,
        longDistanceSurcharge: 0,
        longDistanceThresholdKm: 100,
        maxDistanceKm: 5,
      }),
    ).toThrow(BadRequestException);
  });
});
