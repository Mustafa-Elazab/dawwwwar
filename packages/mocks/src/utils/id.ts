/**
 * Generates a predictable mock ID for testing.
 * NOT for production. Do not use crypto.
 */
export const mockId = (prefix: string, index: number): string =>
  `${prefix}-${String(index).padStart(3, '0')}`;

export const generateOrderNumber = (): string =>
  `ORD-${String(Math.floor(10000 + Math.random() * 90000))}`;
