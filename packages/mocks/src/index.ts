// Database
export * from './db';

// Mock handlers (these are what feature core/api.ts files call)
export { authMock } from './handlers/auth.mock';
export { categoriesMock } from './handlers/categories.mock';
export { merchantsMock } from './handlers/merchants.mock';
export { productsMock } from './handlers/products.mock';
export { ordersMock } from './handlers/orders.mock';
export { walletMock } from './handlers/wallet.mock';
export { addressesMock } from './handlers/addresses.mock';

// Utilities
export { delay } from './utils/delay';
export { generateOrderNumber } from './utils/id';
