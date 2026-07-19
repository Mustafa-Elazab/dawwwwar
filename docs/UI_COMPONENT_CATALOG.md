# UI Component Catalog

This catalog documents the shared UI API for the Customer rebuild. Components are exported from `@dawwar/ui`.

## Atoms

### `AppText`

Props: same as `Text`.

Usage:

```tsx
<AppText variant="h4">Special Offers</AppText>
```

Used for: all labels, headings, prices, metadata.

### `AppIcon`

Props: same as `Icon`.

Usage:

```tsx
<AppIcon name="heart-outline" size={22} />
```

Used for: tabs, rows, actions, status visuals.

### `AppPressable`

Props: `children`, `style`, `pressedStyle`, `animatedFeedback`, plus React Native `PressableProps`.

Usage:

```tsx
<AppPressable onPress={onPress}>
  <AppText>Open</AppText>
</AppPressable>
```

Used for: all tappable UI surfaces.

### `AppImage`

Props: `uri`, `source`, `fallbackIcon`, `containerStyle`, image props.

Usage:

```tsx
<AppImage uri={merchant.logo} fallbackIcon="storefront-outline" />
```

Used for: merchants, products, order thumbnails, banners.

### `AppButton`

Props: same as `Button`: `label`, `variant`, `size`, `loading`, `disabled`, `fullWidth`.

Usage:

```tsx
<AppButton label={t('checkout.place_order')} onPress={onPlaceOrder} fullWidth />
```

Used for: primary CTAs, checkout, auth, modal actions.

### `AppInput`

Props: same as `Input`.

Usage:

```tsx
<AppInput label={t('auth.phone_label')} value={phone} onChangeText={setPhone} />
```

Used for: forms, checkout notes, search forms where a raw input is required.

### Other App Atoms

- `AppDivider`
- `AppBadge`
- `AppChip`
- `AppAvatar`
- `AppSpinner`
- `AppCard`

Used for: shared surfaces, pills, avatars, loading, and row/card composition.

## Molecules

### `AppHeader`

Props: `title`, `subtitle`, `showBack`, `actions`, `searchSlot`, `onBackPress`.

Usage:

```tsx
<AppHeader title={t('orders.title')} showBack />
```

Used for: screen headers when not using template `headerProps`.

### `SearchBar`

Props: existing `SearchBarProps`.

Usage:

```tsx
<SearchBar value={query} onChangeText={setQuery} placeholder={t('common.search')} />
```

Used for: home search, orders search, liked search if reintroduced.

### `SectionHeader`

Props: `title`, `actionLabel`, `onActionPress`.

Usage:

```tsx
<SectionHeader title={t('home.special_offers')} actionLabel={t('home.see_all')} />
```

Used for: home sections, product sections, merchant sections.

### `ListRow`

Props: `icon`, `label`, `subtitle`, `rightElement`, `showChevron`, `onPress`.

Used for: profile menus, settings, payment and address rows.

### `EmptyState` and `ErrorState`

Props: existing state props.

Used by: templates and explicit content states.

### `QuantityStepper`

Props: `value`, `onIncrement`, `onDecrement`, `min`.

Used for: product details and cart quantities.

### `PriceRow`

Props: `label`, `value`, `strong`.

Used for: cart and checkout totals.

### `RadioRow`

Props: `label`, `subtitle`, `selected`, `icon`, `onPress`.

Used for: payment, cancel reasons, language alternatives.

### `OTPInputRow`

Props: `value`, `length`, `onChangeText`, `error`.

Used for: OTP verification.

### `BannerCarousel`

Props: `items`, `onPressItem`.

Used for: home promo/banner slider.

### `LocationPill`

Props: `label`, `address`, `onPress`.

Used for: home delivery location header.

## Organisms

### `MerchantCard`

Props: `title`, `subtitle`, `imageUri`, `rating`, `deliveryTime`, `isOpen`, labels, `onPress`.

Used for: merchant lists and nearby sections.

### `ProductCard`

Props: `title`, `subtitle`, `imageUri`, `price`, `oldPrice`, `liked`, `onPress`, `onToggleLike`.

Used for: home products, liked products, merchant product previews.

### `CategoryTile`

Props: `label`, `icon`, `emoji`, `selected`, `onPress`.

Used for: category grids and horizontal merchant category filters.

### `OrderCard`

Props: `orderNumber`, `title`, `subtitle`, `imageUri`, `total`, `status`, `statusTone`, `onPress`.

Used for: orders list.

### `AddressCard`

Props: `label`, `address`, `selected`, `onPress`.

Used for: saved locations and checkout address selection.

### `PaymentMethodCard`

Props: `label`, `subtitle`, `icon`, `selected`, `onPress`.

Used for: payment methods and checkout payment selection.

### `LocationSelectorSheet`

Props: `visible`, `title`, saved location labels, `addresses`, selection handlers.

Used for: Talabat-style delivery location selector.

### `FloatingCartCTA`

Props: `label`, `total`, `count`, `onPress`.

Used for: global cart access and merchant detail cart CTA.

### `Tabs` and `SegmentedControl`

Props: `items`, `activeKey`, `onChange`.

Used for: merchant menu tabs, orders filters, payment filters.

### `PromoBanner`

Props: `title`, `subtitle`, `imageUri`.

Used for: home and offer surfaces.

### `ProfileHeader`

Props: user profile fields, edit/login labels and handlers.

Used for: profile screen top card.

## Templates

- `AppScreenTemplate`
- `ScrollScreenTemplate`
- `ListScreenTemplate`
- `ModalSheetTemplate`
- `HeaderTemplate`

All Customer screen entries must render through one of these templates.
