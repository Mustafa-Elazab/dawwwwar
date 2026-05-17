# Dawwar — Categories System · Guest Customer Mode · Anonymous Cart

> Three interconnected systems explained fully: how to build a parent/child category tree for merchants, how to make the customer app browsable without login, and how to handle cart state for non-logged-in users.

---

## Table of Contents

1. [Categories System — Parent & Child Hierarchy](#1-categories-system--parent--child-hierarchy)
2. [Backend — Public Endpoints (No Auth Required)](#2-backend--public-endpoints-no-auth-required)
3. [Guest Customer Mode — Browse Without Login](#3-guest-customer-mode--browse-without-login)
4. [Anonymous Cart — Cart Without a Login](#4-anonymous-cart--cart-without-a-login)
5. [The Login Gate — When to Prompt for Auth](#5-the-login-gate--when-to-prompt-for-auth)
6. [Implementation Checklist](#6-implementation-checklist)

---

# 1. Categories System — Parent & Child Hierarchy

## The Category Tree Design

Think of it like this:

```
Level 0 — Super Category (what TYPE of store is this?)
  🍔 Food & Restaurants
  🛒 Grocery & Supermarkets
  💊 Pharmacy & Health
  ☕ Cafes & Beverages
  🧴 Beauty & Personal Care
  📦 Other / General

Level 1 — Store Specialization (what does this store FOCUS on?)
  Under 🍔 Food & Restaurants:
    🍕 Pizza
    🍔 Burgers
    ...
```

The merchant selects ONE parent category (what kind of store) and OPTIONALLY one or more child categories (their specialization).

## Database Schema (Self-referencing table)

```sql
CREATE TABLE categories (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        VARCHAR(100) NOT NULL,
  name_ar     VARCHAR(100) NOT NULL,
  icon        VARCHAR(20),
  slug        VARCHAR(100) UNIQUE,
  parent_id   UUID REFERENCES categories(id) ON DELETE SET NULL,
  sort_order  INT DEFAULT 0,
  is_active   BOOLEAN DEFAULT true,
  created_at  TIMESTAMP DEFAULT NOW()
);
```

## Backend — Public Endpoints

The categories must be available to guests. The `@Public()` decorator is required on:
- `GET /categories`
- `GET /categories/parents`
- `GET /categories/:id/children`

# 2. Backend — Public Endpoints (No Auth Required)

Endpoints the customer app hits while browsing must be public:
- `GET /merchants/nearby`
- `GET /merchants/:id`
- `GET /merchants/:id/products`
- `GET /products/featured`
- `GET /search`
- `GET /banners`

# 3. Guest Customer Mode — Browse Without Login

```
GUEST STATE:
  canBrowse:       ✅ yes
  canSearch:       ✅ yes
  canAddToCart:    ✅ yes
  canViewCart:     ✅ yes
  canCheckout:     ❌ no — triggers login gate
  canPlaceOrder:   ❌ no — requires auth
```

Redux `authSlice` adds `guest` to `AuthStatus` and tracks `guestCartId`. 

# 4. Anonymous Cart — Cart Without a Login

The cart is entirely client-side (Redux + MMKV). A `guestCartId` is assigned, and items persist locally.
When the user proceeds to checkout and logs in, **no merge logic is required**. The local cart state survives the login process and is inherently preserved for the authenticated session.

# 5. The Login Gate — When to Prompt for Auth

Never interrupt browsing. A `LoginGateModal` bottom sheet should trigger only for protected actions (Checkout, Place Order, View Orders, View Wallet).