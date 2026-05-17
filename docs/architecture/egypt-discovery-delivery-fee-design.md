# Dawwar — Egypt-Wide Discovery · Delivery Fee Model · New Design System

> Covers: removing the location restriction so all of Egypt is served · How Talabat & Mrsool price delivery (and what Dawwar should do) · Full green design system replacing orange.

---

## 1. Egypt-Wide Merchant Discovery

### Two Discovery Modes
- **Near Me (default):** Uses GPS → shows merchants within a configurable radius.
- **All Egypt:** No location filter → shows all active merchants across Egypt, sorted by city.

### Backend Implementation
- `NearbyFilterDto` updated with `allEgypt` boolean and `radiusKm`.
- `MerchantsService` uses PostGIS `ST_DWithin` for nearby and standard city sorting for all Egypt.
- `MerchantEntity` includes `city` and `governorate` fields.

---

## 2. Delivery Fee Model

### Distance-Based Pricing
Formula: `deliveryFee = baseFee + (pricePerKm × distanceKm)`

### Dawwar's Tiers (EGP)
- **0–2 km:** 15 EGP (Base)
- **2–7 km:** Base + 3 EGP/km
- **7–15 km:** Base + 3 EGP/km + 10 EGP Surcharge
- **Max Distance:** 30 km

### Implementation
- `DeliveryFeeService` calculates GPS distance using the Haversine formula.
- Fees are calculated **server-side only** in `OrdersService` to prevent client manipulation.

---

## 3. New Design System — Green Brand

### Palette
- **Primary:** `#1DB954` (Confident Green)
- **Primary Dark:** `#17A348`
- **Primary Light:** `#E8F8EF`

### Rationale
- Unique differentiation in the Egyptian market (v.s. orange/red competitors).
- Conveys freshness (food) and growth.
- Improved readability and calming user experience.
