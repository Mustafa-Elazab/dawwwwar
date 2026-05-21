import type { Merchant, Product } from '@dawwar/types';

// ── Merchant Card View Model ────────────────────────────────
export interface MerchantCardVM {
  id: string;
  name: string;
  coverUri: string;
  isOpen: boolean;
  deliveryTime: string;
  rating: string;
  distanceLabel?: string;
  minOrder?: number;
}

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=1000';

export function mapMerchantToCard(m: Merchant): MerchantCardVM {
  return {
    id: m.id,
    name: m.businessName,
    coverUri: m.coverImage ?? m.logo ?? FALLBACK_IMAGE,
    isOpen: !!m.isOpen,
    deliveryTime: `${m.deliveryTimeMin ?? 20}–${m.deliveryTimeMax ?? 40}`,
    rating: Number(m.rating || 0).toFixed(1),
  };
}

// ── Product Card View Model ─────────────────────────────────
export interface ProductCardVM {
  id: string;
  name: string;
  imageUri: string;
  price: number;
  comparePrice?: number;
  discountPercent: number;
  isAvailable: boolean;
  isFeatured: boolean;
  merchantId: string;
}

export function mapProductToCard(p: Product): ProductCardVM {
  const comparePrice = (p as any).comparePrice;
  const hasDiscount = comparePrice && comparePrice > p.price;

  return {
    id: p.id,
    name: p.nameAr || p.name,
    imageUri: p.images?.[0] ?? FALLBACK_IMAGE,
    price: p.price,
    comparePrice: hasDiscount ? comparePrice : undefined,
    discountPercent: hasDiscount
      ? Math.round(((comparePrice - p.price) / comparePrice) * 100)
      : 0,
    isAvailable: p.isAvailable !== false,
    isFeatured: !!(p as any).isFeatured,
    merchantId: p.merchantId,
  };
}
