import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { UserEntity, UserRole } from '../entities/user.entity';
import { MerchantEntity } from '../entities/merchant.entity';
import { CategoryEntity } from '../entities/category.entity';
import { ProductEntity } from '../entities/product.entity';
import { DriverProfileEntity, VehicleType } from '../entities/driver-profile.entity';
import { WalletEntity } from '../entities/wallet.entity';
import { WalletTransactionEntity, TransactionType, TransactionReason } from '../entities/wallet-transaction.entity';
import { AddressEntity } from '../entities/address.entity';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../.env.development') });

// ── Seed script — mirrors @dawwar/mocks exactly ──────────────────────

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: parseInt(process.env.DB_PORT ?? '5432', 10),
  username: process.env.DB_USERNAME ?? 'dawwar',
  password: process.env.DB_PASSWORD ?? 'dawwar_dev_2024',
  database: process.env.DB_DATABASE ?? 'dawwar_db',
  entities: [__dirname + '/../entities/*.entity{.ts,.js}'],
  synchronize: true,
});

async function seed() {
  await AppDataSource.initialize();
  console.log('DB connected — starting seed...');

  const userRepo = AppDataSource.getRepository(UserEntity);
  const merchantRepo = AppDataSource.getRepository(MerchantEntity);
  const categoryRepo = AppDataSource.getRepository(CategoryEntity);
  const productRepo = AppDataSource.getRepository(ProductEntity);
  const driverRepo = AppDataSource.getRepository(DriverProfileEntity);
  const walletRepo = AppDataSource.getRepository(WalletEntity);
  const txRepo = AppDataSource.getRepository(WalletTransactionEntity);
  const addressRepo = AppDataSource.getRepository(AddressEntity);

  // ── Clear existing data (order matters for FK constraints) ─────────
  await txRepo.delete({});
  await walletRepo.delete({});
  await addressRepo.delete({});
  await productRepo.delete({});
  await driverRepo.delete({});
  await merchantRepo.delete({});
  await userRepo.delete({});
  await categoryRepo.delete({});
  console.log('Cleared existing data');

  // ── Categories ─────────────────────────────────────────────────────
  const categories = await categoryRepo.save([
    { name: 'Supermarkets', nameAr: 'سوبر ماركت', icon: '🛒', sortOrder: 1, isActive: true },
    { name: 'Restaurants', nameAr: 'مطاعم', icon: '🍔', sortOrder: 2, isActive: true },
    { name: 'Pharmacies', nameAr: 'صيدليات', icon: '💊', sortOrder: 3, isActive: true },
    { name: 'Bakeries', nameAr: 'مخابز', icon: '🥖', sortOrder: 4, isActive: true },
    { name: 'Butchers', nameAr: 'جزارة', icon: '🥩', sortOrder: 5, isActive: true },
    { name: 'Fruits & Veg', nameAr: 'خضروات وفواكه', icon: '🥦', sortOrder: 6, isActive: true },
    { name: 'Clothing', nameAr: 'ملابس', icon: '👗', sortOrder: 7, isActive: true },
    { name: 'Electronics', nameAr: 'إلكترونيات', icon: '📱', sortOrder: 8, isActive: true },
    { name: 'Home', nameAr: 'منزل', icon: '🛋️', sortOrder: 9, isActive: true },
    { name: 'Other', nameAr: 'أخرى', icon: '📦', sortOrder: 10, isActive: true },
  ]);
  console.log(`Seeded ${categories.length} categories`);

  // ── Users ──────────────────────────────────────────────────────────
  const ph = (t: string, bg = 'FF6B35') =>
    `https://placehold.co/400x400/${bg}/white?text=${encodeURIComponent(t)}`;

  const users = await userRepo.save([
    { phone: '01011111111', name: 'أحمد محمد', role: UserRole.CUSTOMER, isApproved: true },
    { phone: '01022222222', name: 'Sara Ahmed', role: UserRole.CUSTOMER, isApproved: true },
    { phone: '01033333333', name: 'محل النور', role: UserRole.MERCHANT, isApproved: true },
    { phone: '01044444444', name: 'مطعم الشيف', role: UserRole.MERCHANT, isApproved: true },
    { phone: '01055555555', name: 'صيدلية الحياة', role: UserRole.MERCHANT, isApproved: true },
    { phone: '01066666666', name: 'محمود علي', role: UserRole.DRIVER, isApproved: true },
    { phone: '01077777777', name: 'Karim Hassan', role: UserRole.DRIVER, isApproved: true },
    { phone: '01088888888', name: 'محل جديد', role: UserRole.MERCHANT, isApproved: false },
    { phone: '01099999999', name: 'سائق جديد', role: UserRole.DRIVER, isApproved: false },
    { phone: '01000000000', name: 'Admin دوّار', role: UserRole.ADMIN, isApproved: true },
  ]);
  console.log(`Seeded ${users.length} users`);

  const [c1, c2, m1user, m2user, m3user, d1user, d2user] = users;

  // ── Merchants ──────────────────────────────────────────────────────
  const defaultHours = {
    monday: { open: '08:00', close: '22:00' },
    tuesday: { open: '08:00', close: '22:00' },
    wednesday: { open: '08:00', close: '22:00' },
    thursday: { open: '08:00', close: '22:00' },
    friday: { open: '10:00', close: '22:00' },
    saturday: { open: '08:00', close: '22:00' },
    sunday: { open: '08:00', close: '22:00' },
  };

  const merchants = await merchantRepo.save([
    {
      userId: m1user!.id, businessName: 'محل النور للبقالة', category: categories[0]!.id,
      address: 'شارع الجمهورية، سنبلاوين، الدقهلية',
      latitude: 30.8704, longitude: 31.4741,
      isOpen: true, isApproved: true, canReceiveOrders: true,
      rating: 4.5, totalRatings: 234, deliveryTimeMin: 15, deliveryTimeMax: 25,
      logo: ph('نور'), coverImage: ph('Al Nour', '2D3436'),
      commissionRate: 5, openingHours: defaultHours,
    },
    {
      userId: m2user!.id, businessName: 'مطعم الشيف', category: categories[1]!.id,
      address: 'ميدان المحطة، سنبلاوين',
      latitude: 30.8720, longitude: 31.4755,
      isOpen: true, isApproved: true, canReceiveOrders: true,
      rating: 4.8, totalRatings: 512, deliveryTimeMin: 20, deliveryTimeMax: 35,
      logo: ph('شيف', 'E17055'), coverImage: ph('El Chef', '2D3436'),
      commissionRate: 5,
      openingHours: { ...defaultHours, friday: { open: '12:00', close: '23:00' } },
    },
    {
      userId: m3user!.id, businessName: 'صيدلية الحياة', category: categories[2]!.id,
      address: 'شارع النصر، سنبلاوين',
      latitude: 30.8690, longitude: 31.4728,
      isOpen: false, isApproved: true, canReceiveOrders: false,
      rating: 4.2, totalRatings: 89, deliveryTimeMin: 10, deliveryTimeMax: 20,
      logo: ph('صيدلية', '00B894'), coverImage: ph('Pharmacy', '2D3436'),
      commissionRate: 5,
      openingHours: { ...defaultHours, friday: null },
    },
  ]);
  console.log(`Seeded ${merchants.length} merchants`);

  const [grocery, restaurant, pharmacy] = merchants;

  // ── Products ───────────────────────────────────────────────────────
  const emo = (e: string) => `https://placehold.co/400x400/FF6B35/white?text=${encodeURIComponent(e)}`;

  const products = await productRepo.save([
    // Grocery — 8 products
    { merchantId: grocery!.id, name: 'Fresh Tomatoes', nameAr: 'طماطم طازجة', price: 8, images: [emo('🍅')], isAvailable: true, categoryId: categories[0]!.id, isFeatured: true, totalOrders: 145 },
    { merchantId: grocery!.id, name: 'Toast Bread', nameAr: 'خبز توست', price: 15, images: [emo('🍞')], isAvailable: true, categoryId: categories[3]!.id, isFeatured: true, totalOrders: 230 },
    { merchantId: grocery!.id, name: 'Full Fat Milk 1L', nameAr: 'لبن كاملة الدسم ١ لتر', price: 22, images: [emo('🥛')], isAvailable: true, categoryId: categories[0]!.id, isFeatured: true, totalOrders: 178 },
    { merchantId: grocery!.id, name: 'Farm Eggs (12)', nameAr: 'بيض بلدي (١٢ بيضة)', price: 45, images: [emo('🥚')], isAvailable: true, categoryId: categories[0]!.id, isFeatured: false, totalOrders: 89 },
    { merchantId: grocery!.id, name: 'Egyptian Rice 1kg', nameAr: 'أرز مصري ١ كيلو', price: 18, images: [emo('🍚')], isAvailable: true, categoryId: categories[0]!.id, isFeatured: false, totalOrders: 112 },
    { merchantId: grocery!.id, name: 'Corn Oil 1L', nameAr: 'زيت ذرة ١ لتر', price: 55, images: [emo('🫙')], isAvailable: true, categoryId: categories[0]!.id, isFeatured: false, totalOrders: 67 },
    { merchantId: grocery!.id, name: 'Sugar 1kg', nameAr: 'سكر ١ كيلو', price: 25, images: [emo('🍬')], isAvailable: false, categoryId: categories[0]!.id, isFeatured: false, totalOrders: 203 }, // UNAVAILABLE
    { merchantId: grocery!.id, name: 'Water 1.5L', nameAr: 'ماء معدني ١.٥ لتر', price: 10, images: [emo('💧')], isAvailable: true, categoryId: categories[0]!.id, isFeatured: false, totalOrders: 445 },
    // Restaurant — 6 products
    { merchantId: restaurant!.id, name: 'Koshari', nameAr: 'كوشري', price: 25, images: [emo('🍛')], isAvailable: true, categoryId: categories[1]!.id, isFeatured: true, totalOrders: 567 },
    { merchantId: restaurant!.id, name: 'Grilled Chicken', nameAr: 'فراخ مشوية', price: 85, images: [emo('🍗')], isAvailable: true, categoryId: categories[1]!.id, isFeatured: true, totalOrders: 312 },
    { merchantId: restaurant!.id, name: 'Kofta (6 pieces)', nameAr: 'كفتة (٦ قطع)', price: 55, images: [emo('🥙')], isAvailable: true, categoryId: categories[1]!.id, isFeatured: false, totalOrders: 189 },
    { merchantId: restaurant!.id, name: 'Shawarma', nameAr: 'شاورما', price: 45, images: [emo('🌯')], isAvailable: true, categoryId: categories[1]!.id, isFeatured: false, totalOrders: 234 },
    { merchantId: restaurant!.id, name: 'Fresh Orange Juice', nameAr: 'عصير برتقال طازج', price: 20, images: [emo('🍊')], isAvailable: true, categoryId: categories[1]!.id, isFeatured: false, totalOrders: 145 },
    { merchantId: restaurant!.id, name: 'Pepsi Can', nameAr: 'بيبسي علبة', price: 12, images: [emo('🥤')], isAvailable: true, categoryId: categories[1]!.id, isFeatured: false, totalOrders: 389 },
    // Pharmacy — 5 products
    { merchantId: pharmacy!.id, name: 'Paracetamol 500mg', nameAr: 'باراسيتامول ٥٠٠ مج', price: 12, images: [emo('💊')], isAvailable: true, categoryId: categories[2]!.id, isFeatured: false, totalOrders: 78 },
    { merchantId: pharmacy!.id, name: 'Vitamin C 1000mg', nameAr: 'فيتامين سي ١٠٠٠ مج', price: 35, images: [emo('🍋')], isAvailable: true, categoryId: categories[2]!.id, isFeatured: false, totalOrders: 45 },
    { merchantId: pharmacy!.id, name: 'Medical Tissue', nameAr: 'مناديل طبية', price: 8, images: [emo('🧻')], isAvailable: true, categoryId: categories[2]!.id, isFeatured: false, totalOrders: 156 },
    { merchantId: pharmacy!.id, name: 'Nivea Cream 200ml', nameAr: 'كريم نيفيا ٢٠٠ مل', price: 45, images: [emo('🧴')], isAvailable: true, categoryId: categories[2]!.id, isFeatured: false, totalOrders: 34 },
    { merchantId: pharmacy!.id, name: 'H&S Shampoo 400ml', nameAr: 'شامبو هيد اند شولدرز ٤٠٠ مل', price: 65, images: [emo('🚿')], isAvailable: true, categoryId: categories[2]!.id, isFeatured: false, totalOrders: 22 },
  ]);
  console.log(`Seeded ${products.length} products`);

  // ── Driver Profiles ────────────────────────────────────────────────
  await driverRepo.save([
    { userId: d1user!.id, vehicleType: VehicleType.MOTORCYCLE, isOnline: false, isApproved: true, canReceiveOrders: true, rating: 4.8, totalRatings: 128, totalDeliveries: 245, commissionRate: 5 },
    { userId: d2user!.id, vehicleType: VehicleType.BICYCLE, isOnline: false, isApproved: true, canReceiveOrders: true, rating: 4.5, totalRatings: 67, totalDeliveries: 89, commissionRate: 5 },
  ]);
  console.log('Seeded 2 driver profiles');

  // ── Wallets ────────────────────────────────────────────────────────
  const wallets = await walletRepo.save([
    { userId: c1!.id, balance: 200, currency: 'EGP', isActive: true },
    { userId: c2!.id, balance: 50, currency: 'EGP', isActive: true },
    { userId: m1user!.id, balance: 100, currency: 'EGP', isActive: true },
    { userId: m2user!.id, balance: 75, currency: 'EGP', isActive: true },
    { userId: m3user!.id, balance: 30, currency: 'EGP', isActive: true },
    { userId: d1user!.id, balance: 50, currency: 'EGP', isActive: true },
    { userId: d2user!.id, balance: 20, currency: 'EGP', isActive: true },
  ]);
  console.log(`Seeded ${wallets.length} wallets`);

  // ── Sample transactions ────────────────────────────────────────────
  const c1wallet = wallets.find((w) => w.userId === c1!.id)!;
  const m1wallet = wallets.find((w) => w.userId === m1user!.id)!;
  const d1wallet = wallets.find((w) => w.userId === d1user!.id)!;

  await txRepo.save([
    {
      walletId: c1wallet.id, type: TransactionType.DEBIT, amount: 95,
      reason: TransactionReason.ORDER_PAYMENT, description: 'Payment for order ORD-10001',
      balanceBefore: 295, balanceAfter: 200,
    },
    {
      walletId: c1wallet.id, type: TransactionType.CREDIT, amount: 100,
      reason: TransactionReason.WALLET_RECHARGE, description: 'Wallet recharge',
      balanceBefore: 195, balanceAfter: 295,
    },
    {
      walletId: m1wallet.id, type: TransactionType.DEBIT, amount: 5,
      reason: TransactionReason.COMMISSION_DEDUCTION, description: 'Commission for order ORD-10001',
      balanceBefore: 105, balanceAfter: 100,
    },
    {
      walletId: d1wallet.id, type: TransactionType.DEBIT, amount: 5,
      reason: TransactionReason.COMMISSION_DEDUCTION, description: 'Commission for order ORD-10001',
      balanceBefore: 55, balanceAfter: 50,
    },
  ]);
  console.log('Seeded 4 transactions');

  // ── Addresses ─────────────────────────────────────────────────────
  await addressRepo.save([
    {
      userId: c1!.id, label: 'Home', address: 'شارع الجمهورية، سنبلاوين، الدقهلية',
      latitude: 30.872, longitude: 31.476,
      buildingNumber: '14', floor: '2', apartment: '8',
      phone: '01011111111', notes: 'Ring bell twice', isDefault: true,
    },
    {
      userId: c1!.id, label: 'Work', address: 'ميدان المحطة، سنبلاوين',
      latitude: 30.871, longitude: 31.475,
      phone: '01011111111', isDefault: false,
    },
  ]);
  console.log('Seeded 2 addresses');

  console.log('\n✅ Seed complete!');
  await AppDataSource.destroy();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
