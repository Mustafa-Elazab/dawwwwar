# Screen Inventory - Customer App

| Screen Name | Route | Purpose | Key API Dependencies |
| :--- | :--- | :--- | :--- |
| **SplashScreen** | `SplashScreen` | App boot & session restoration | `/auth/me` |
| **PhoneScreen** | `PhoneScreen` | Initial entry for phone login | `/auth/send-otp` |
| **OtpScreen** | `OtpScreen` | Verification of phone via OTP | `/auth/verify-otp` |
| **CompleteProfile** | `CompleteProfileScreen` | Onboarding for new users | `/auth/complete-profile` |
| **HomeScreen** | `HomeScreen` | Main dashboard & discovery | `/merchants/nearby`, `/products/featured`, `/banners` |
| **SearchScreen** | `SearchScreen` | Global search for stores/items | `/search` |
| **NearbyMerchants** | `NearbyMerchantsScreen` | Filtered list of nearby merchants | `/merchants/nearby` |
| **PopularProducts** | `PopularProductsScreen` | Filtered list of popular products | `/products/featured` |
| **Categories** | `CategoriesScreen` | Browsing items by category | `/categories` |
| **CategoryMerchants** | `CategoryMerchantsScreen` | Filtered list of merchants | `/merchants?categoryId=...` |
| **MerchantDetail** | `MerchantDetailScreen` | Full menu and store info | `/merchants/:id`, `/merchants/:id/products` |
| **CartModal** | `CartModal` | Review items and adjust quantity | (Local state: Redux) |
| **CheckoutModal** | `CheckoutModal` | Address & payment selection | `/orders` (POST) |
| **OrdersList** | `OrdersListScreen` | History of active and past orders | `/orders/my` |
| **TrackingScreen** | `TrackingScreen` | Real-time map tracking of driver | `/orders/:id`, WebSockets |
| **OrderDetail** | `OrderDetailScreen` | Static view of order summary | `/orders/:id` |
| **ProfileScreen** | `ProfileScreen` | Account settings & logout | `/auth/me` |
| **Addresses** | `AddressesScreen` | Management of saved locations | `/addresses` |
| **WalletScreen** | `WalletScreen` | Balance and recharge actions | `/wallet` |
| **Transactions** | `TransactionsScreen` | Detailed financial history | `/wallet/transactions` |
| **LocationPicker** | `LocationPickerScreen` | Interactive map for new address | OSM Geocoding API |

## Navigation Flow
1. **Discovery:** Home -> Merchant Detail -> Cart.
2. **Checkout:** Cart -> Checkout -> Tracking.
3. **Account:** Profile -> Wallet/Addresses/Notifications.
