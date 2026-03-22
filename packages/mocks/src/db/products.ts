import type { Product } from '@dawwar/types';

const ph = (emoji: string) =>
  `https://placehold.co/400x400/FF6B35/white?text=${encodeURIComponent(emoji)}`;

export const mockProducts: Product[] = [
  // ── Merchant 001 — Grocery (8 products) ──────────────────────────────────
  { id: 'prod-001', merchantId: 'merchant-001', name: 'Fresh Tomatoes', nameAr: 'طماطم طازجة', price: 8, images: [ph('🍅')], isAvailable: true, categoryId: 'cat-01', isFeatured: true, totalOrders: 145, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 'prod-002', merchantId: 'merchant-001', name: 'Toast Bread', nameAr: 'خبز توست', price: 15, images: [ph('🍞')], isAvailable: true, categoryId: 'cat-04', isFeatured: true, totalOrders: 230, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 'prod-003', merchantId: 'merchant-001', name: 'Full Fat Milk 1L', nameAr: 'لبن كاملة الدسم ١ لتر', price: 22, images: [ph('🥛')], isAvailable: true, categoryId: 'cat-01', isFeatured: true, totalOrders: 178, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 'prod-004', merchantId: 'merchant-001', name: 'Farm Eggs (12)', nameAr: 'بيض بلدي (١٢ بيضة)', price: 45, images: [ph('🥚')], isAvailable: true, categoryId: 'cat-01', isFeatured: false, totalOrders: 89, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 'prod-005', merchantId: 'merchant-001', name: 'Egyptian Rice 1kg', nameAr: 'أرز مصري ١ كيلو', price: 18, images: [ph('🍚')], isAvailable: true, categoryId: 'cat-01', isFeatured: false, totalOrders: 112, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 'prod-006', merchantId: 'merchant-001', name: 'Corn Oil 1L', nameAr: 'زيت ذرة ١ لتر', price: 55, images: [ph('🫙')], isAvailable: true, categoryId: 'cat-01', isFeatured: false, totalOrders: 67, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 'prod-007', merchantId: 'merchant-001', name: 'Sugar 1kg', nameAr: 'سكر ١ كيلو', price: 25, images: [ph('🍬')], isAvailable: false, categoryId: 'cat-01', isFeatured: false, totalOrders: 203, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  // ↑ prod-007 is UNAVAILABLE — tests the "Unavailable" greyed-out UI state
  { id: 'prod-008', merchantId: 'merchant-001', name: 'Water 1.5L', nameAr: 'ماء معدني ١.٥ لتر', price: 10, images: [ph('💧')], isAvailable: true, categoryId: 'cat-01', isFeatured: false, totalOrders: 445, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },

  // ── Merchant 002 — Restaurant (6 products) ────────────────────────────────
  { id: 'prod-009', merchantId: 'merchant-002', name: 'Koshari', nameAr: 'كوشري', price: 25, images: [ph('🍛')], isAvailable: true, categoryId: 'cat-02', isFeatured: true, totalOrders: 567, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 'prod-010', merchantId: 'merchant-002', name: 'Grilled Chicken', nameAr: 'فراخ مشوية', price: 85, images: [ph('🍗')], isAvailable: true, categoryId: 'cat-02', isFeatured: true, totalOrders: 312, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 'prod-011', merchantId: 'merchant-002', name: 'Kofta (6 pieces)', nameAr: 'كفتة (٦ قطع)', price: 55, images: [ph('🥙')], isAvailable: true, categoryId: 'cat-02', isFeatured: false, totalOrders: 189, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 'prod-012', merchantId: 'merchant-002', name: 'Shawarma', nameAr: 'شاورما', price: 45, images: [ph('🌯')], isAvailable: true, categoryId: 'cat-02', isFeatured: false, totalOrders: 234, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 'prod-013', merchantId: 'merchant-002', name: 'Fresh Orange Juice', nameAr: 'عصير برتقال طازج', price: 20, images: [ph('🍊')], isAvailable: true, categoryId: 'cat-02', isFeatured: false, totalOrders: 145, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 'prod-014', merchantId: 'merchant-002', name: 'Pepsi Can', nameAr: 'بيبسي علبة', price: 12, images: [ph('🥤')], isAvailable: true, categoryId: 'cat-02', isFeatured: false, totalOrders: 389, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },

  // ── Merchant 003 — Pharmacy (5 products, shop is CLOSED) ──────────────────
  { id: 'prod-015', merchantId: 'merchant-003', name: 'Paracetamol 500mg', nameAr: 'باراسيتامول ٥٠٠ مج', price: 12, images: [ph('💊')], isAvailable: true, categoryId: 'cat-03', isFeatured: false, totalOrders: 78, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 'prod-016', merchantId: 'merchant-003', name: 'Vitamin C 1000mg', nameAr: 'فيتامين سي ١٠٠٠ مج', price: 35, images: [ph('🍋')], isAvailable: true, categoryId: 'cat-03', isFeatured: false, totalOrders: 45, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 'prod-017', merchantId: 'merchant-003', name: 'Medical Tissue', nameAr: 'مناديل طبية', price: 8, images: [ph('🧻')], isAvailable: true, categoryId: 'cat-03', isFeatured: false, totalOrders: 156, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 'prod-018', merchantId: 'merchant-003', name: 'Nivea Cream 200ml', nameAr: 'كريم نيفيا ٢٠٠ مل', price: 45, images: [ph('🧴')], isAvailable: true, categoryId: 'cat-03', isFeatured: false, totalOrders: 34, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 'prod-019', merchantId: 'merchant-003', name: 'H&S Shampoo 400ml', nameAr: 'شامبو هيد اند شولدرز ٤٠٠ مل', price: 65, images: [ph('🚿')], isAvailable: true, categoryId: 'cat-03', isFeatured: false, totalOrders: 22, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
];

export const getProductsByMerchant = (merchantId: string): Product[] =>
  mockProducts.filter((p) => p.merchantId === merchantId);

export const getFeaturedProducts = (): Product[] =>
  mockProducts.filter((p) => p.isFeatured && p.isAvailable);

export const getProductById = (id: string): Product | undefined =>
  mockProducts.find((p) => p.id === id);
