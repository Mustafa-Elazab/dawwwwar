# Phase 4: Logistics Battle Plan (Real-World Testing)

This document serves as your operational manual for stress-testing the Dawwar marketplace before launch.

## 🎯 Primary Goal
Validate that the **Logistics Engine** (Customer ↔ Driver ↔ Merchant ↔ Admin) handles real-world connectivity, movement, and failure scenarios correctly.

---

## 📱 Test Environment Setup
- **Devices**: At least 3 Android physical devices.
- **Roles**: 
  - Device A: Customer App
  - Device B: Driver App
  - Device C: Merchant App
- **Admin**: Laptop running the Admin Dashboard.
- **Internet**: Mix of strong Wi-Fi and weak 4G/LTE mobile data.

---

## 🧪 Test Case 01: The "Custom Order" Stress Test
*This is the core differentiator. We must ensure media and money stay in sync.*

1. **Place Order (Customer)**: Use voice notes and 2-3 photos.
2. **Verify Admin Monitor**: Does the order appear instantly? Are the images visible?
3. **Acceptance (Driver)**: Driver accepts the order. 
4. **The Shopping Flow**: 
   - Driver arrives at shop (**Arrived** status).
   - Driver uploads a photo of the receipt.
   - Driver enters an "Actual Amount" different from the estimate.
5. **Validation**: Does the Customer's tracking screen reflect the new amount and receipt?

---

## 🧪 Test Case 02: Connectivity & Recovery
*Delivery happens in the real world where internet is unstable.*

1. **Start Delivery (Driver)**: Driver starts moving toward customer.
2. **Kill Internet (Driver)**: Turn off 4G while moving for 2 minutes.
3. **Turn On Internet**: Does the driver app reconnect to the socket automatically?
4. **Validation**: Does the Customer app "snap" to the driver's new location? Is the order status consistent?

---

## 🧪 Test Case 03: The "Debt" & Wallet Safety
*Ensure the platform fees and COD debt tracking work correctly.*

1. **Complete COD Order**: Driver delivers a cash order of 100 EGP.
2. **Ledger Check (Admin)**: 
   - Verify Driver Wallet is deducted the platform fee (e.g., -5 EGP).
   - Verify Merchant Wallet is deducted (if applicable).
3. **Negative Balance Test**: Repeat until Driver has a negative balance beyond the threshold.
4. **Validation**: Is the driver automatically prevented from receiving new orders?

---

## 🧪 Test Case 04: Admin Manual Intervention
*Simulate a driver getting stuck or disappearing.*

1. **Active Order**: Order is "In Transit."
2. **Admin Action**: From Dashboard, **Force Cancel** the order.
3. **Validation**: 
   - Does the Customer see the cancellation instantly?
   - Is the Customer's wallet refunded if they paid online?
   - Does the Driver app return to the home/online screen?

---

## 🧪 Test Case 05: Background Location
1. **Driver App Backgrounded**: Start a delivery and put the app in the background.
2. **Customer View**: Keep the tracking map open.
3. **Movement**: Move the Driver device 100+ meters.
4. **Validation**: Does the marker move on the Customer's map while the Driver app is not visible?

---

## 📋 The "Launch-Blocker" Bug List
As you test, record issues in these categories:
- **[CRITICAL]** Financial inconsistency (Money/Debt wrong).
- **[CRITICAL]** Logic drift (App stuck in a status that doesn't exist).
- **[UI/UX]** Map markers jumping or missing.
- **[PERF]** Significant battery drain on Driver device.
- **[PERF]** Slow image/voice note uploads.
