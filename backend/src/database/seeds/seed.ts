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

  await AppDataSource.query('CREATE EXTENSION IF NOT EXISTS postgis;');
  await AppDataSource.query('CREATE EXTENSION IF NOT EXISTS postgis_topology;');

  const userRepo = AppDataSource.getRepository(UserEntity);
  const merchantRepo = AppDataSource.getRepository(MerchantEntity);
  const categoryRepo = AppDataSource.getRepository(CategoryEntity);
  const productRepo = AppDataSource.getRepository(ProductEntity);
  const driverRepo = AppDataSource.getRepository(DriverProfileEntity);
  const walletRepo = AppDataSource.getRepository(WalletEntity);
  const txRepo = AppDataSource.getRepository(WalletTransactionEntity);
  const addressRepo = AppDataSource.getRepository(AddressEntity);

  await AppDataSource.query('TRUNCATE TABLE wallet_transactions CASCADE');
  await AppDataSource.query('TRUNCATE TABLE wallets CASCADE');
  await AppDataSource.query('TRUNCATE TABLE addresses CASCADE');
  await AppDataSource.query('TRUNCATE TABLE products CASCADE');
  await AppDataSource.query('TRUNCATE TABLE driver_profiles CASCADE');
  await AppDataSource.query('TRUNCATE TABLE merchants CASCADE');
  await AppDataSource.query('TRUNCATE TABLE users CASCADE');
  await AppDataSource.query('TRUNCATE TABLE categories CASCADE');

  const categories = await categoryRepo.save([
    { name: 'Supermarkets', nameAr: 'سوبر ماركت', icon: '🛒', sortOrder: 1, isActive: true },
    { name: 'Restaurants', nameAr: 'مطاعم', icon: '🍔', sortOrder: 2, isActive: true },
    { name: 'Pharmacies', nameAr: 'صيدليات', icon: '💊', sortOrder: 3, isActive: true },
    { name: 'Bakeries', nameAr: 'مخابز', icon: '🥖', sortOrder: 4, isActive: true },
    { name: 'Butchers', nameAr: 'جزارة', icon: '🥩', sortOrder: 5, isActive: true },
    { name: 'Fruits & Veg', nameAr: 'خضروات وفواكه', icon: '🥦', sortOrder: 6, isActive: true },
  ]);

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
    { phone: '01088888888', name: 'كارفور مصر', role: UserRole.MERCHANT, isApproved: true },
    { phone: '01000000000', name: 'Admin دوّار', role: UserRole.ADMIN, isApproved: true },
  ]);

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
      userId: users[2]!.id, businessName: 'محل النور للبقالة', category: categories[0]!.id,
      address: 'شارع الجمهورية، سنبلاوين، الدقهلية',
      latitude: 30.8704, longitude: 31.4741,
      isOpen: true, isApproved: true, canReceiveOrders: true,
      rating: 4.5, totalRatings: 234, deliveryTimeMin: 15, deliveryTimeMax: 25,
      logo: ph('نور'), coverImage: ph('Al Nour', '2D3436'),
      commissionRate: 5, openingHours: defaultHours,
    },
    {
      userId: users[3]!.id, businessName: 'مطعم الشيف - المنصورة', category: categories[1]!.id,
      address: 'حي الجامعة، المنصورة',
      latitude: 31.0450, longitude: 31.3611,
      isOpen: true, isApproved: true, canReceiveOrders: true,
      rating: 4.8, totalRatings: 512, deliveryTimeMin: 20, deliveryTimeMax: 35,
      logo: ph('شيف', 'E17055'), coverImage: ph('Mansoura Chef', '2D3436'),
      commissionRate: 5, openingHours: defaultHours,
    },
    {
      userId: users[4]!.id, businessName: 'صيدلية الحياة - المعادي', category: categories[2]!.id,
      address: 'شارع ٩، المعادي، القاهرة',
      latitude: 29.9602, longitude: 31.2569,
      isOpen: true, isApproved: true, canReceiveOrders: true,
      rating: 4.2, totalRatings: 89, deliveryTimeMin: 10, deliveryTimeMax: 20,
      logo: ph('صيدلية', '00B894'), coverImage: ph('Maadi Pharmacy', '2D3436'),
      commissionRate: 5, openingHours: defaultHours,
    },
    {
      userId: users[7]!.id, businessName: 'كارفور ماركت - مصر الجديدة', category: categories[0]!.id,
      address: 'روكسي، مصر الجديدة، القاهرة',
      latitude: 30.1018, longitude: 31.3366,
      isOpen: true, isApproved: true, canReceiveOrders: true,
      rating: 4.6, totalRatings: 1024, deliveryTimeMin: 15, deliveryTimeMax: 40,
      logo: ph('كارفور', '003399'), coverImage: ph('Carrefour', '2D3436'),
      commissionRate: 10, openingHours: defaultHours,
    },
  ]);

  for (const merchant of merchants) {
    await AppDataSource.query(
      `UPDATE merchants SET location = ST_SetSRID(ST_MakePoint($1, $2), 4326) WHERE id = $3`,
      [merchant.longitude, merchant.latitude, merchant.id],
    );
  }

  const emo = (e: string, bg = 'FF6B35') => `https://placehold.co/400x400/${bg}/white?text=${encodeURIComponent(e)}`;

  await productRepo.save([
    { merchantId: merchants[0]!.id, name: 'Fresh Tomatoes', nameAr: 'طماطم طازجة', price: 8, images: [emo('🍅')], isAvailable: true, categoryId: categories[5]!.id, isFeatured: true, totalOrders: 145 },
    { merchantId: merchants[0]!.id, name: 'Full Fat Milk 1L', nameAr: 'لبن كاملة الدسم ١ لتر', price: 22, images: [emo('🥛')], isAvailable: true, categoryId: categories[0]!.id, isFeatured: true, totalOrders: 178 },
    { merchantId: merchants[1]!.id, name: 'Koshari', nameAr: 'كوشري', price: 25, images: [emo('🍛', 'E17055')], isAvailable: true, categoryId: categories[1]!.id, isFeatured: true, totalOrders: 567 },
    { merchantId: merchants[1]!.id, name: 'Grilled Chicken', nameAr: 'فراخ مشوية', price: 85, images: [emo('🍗', 'E17055')], isAvailable: true, categoryId: categories[1]!.id, isFeatured: true, totalOrders: 312 },
    { merchantId: merchants[2]!.id, name: 'Paracetamol 500mg', nameAr: 'باراسيتامول ٥٠٠ مج', price: 12, images: [emo('💊', '00B894')], isAvailable: true, categoryId: categories[2]!.id, isFeatured: false, totalOrders: 78 },
    { merchantId: merchants[3]!.id, name: 'Pasta 400g', nameAr: 'مكرونة ٤٠٠ جم', price: 12, images: [emo('🍝', '003399')], isAvailable: true, categoryId: categories[0]!.id, isFeatured: true, totalOrders: 1200 },
  ]);

  await driverRepo.save([
    { userId: users[5]!.id, vehicleType: VehicleType.MOTORCYCLE, isOnline: true, isApproved: true, canReceiveOrders: true, rating: 4.8, totalRatings: 128, totalDeliveries: 245, commissionRate: 5 },
    { userId: users[6]!.id, vehicleType: VehicleType.BICYCLE, isOnline: true, isApproved: true, canReceiveOrders: true, rating: 4.5, totalRatings: 67, totalDeliveries: 89, commissionRate: 5 },
  ]);

  const drivers = await driverRepo.find();
  for (const driver of drivers) {
    const defaultLat = 30.8704;
    const defaultLng = 31.4741;
    await driverRepo.update(driver.id, { currentLatitude: defaultLat, currentLongitude: defaultLng });
    await AppDataSource.query(
      `UPDATE driver_profiles SET location = ST_SetSRID(ST_MakePoint($1, $2), 4326) WHERE id = $3`,
      [defaultLng, defaultLat, driver.id],
    );
  }

  await walletRepo.save(users.map(u => ({ userId: u.id, balance: 500, currency: 'EGP', isActive: true })));

  await addressRepo.save([
    {
      userId: users[0]!.id, label: 'Home', address: 'شارع الجمهورية، سنبلاوين، الدقهلية',
      latitude: 30.872, longitude: 31.476, buildingNumber: '14', phone: '01011111111', isDefault: true,
    },
  ]);

  console.log('✅ Seed complete!');
  await AppDataSource.destroy();
}

seed().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
