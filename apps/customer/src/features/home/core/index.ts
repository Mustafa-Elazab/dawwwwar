// ── Home Domain ─────────────────────────────────────────────
// API, hooks, query keys, and mappers for the home feed.

export { homeApi } from './api';
export {
  HOME_KEYS,
  useNearbyMerchants,
  useFeaturedProducts,
  useHomeCategories,
} from './hooks';
export { mapMerchantToCard, mapProductToCard } from './mappers';
