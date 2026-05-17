export const QUERY_KEYS = {
  auth: {
    me: ['auth', 'me'] as const,
  },
  profile: {
    me: ['profile', 'me'] as const,
    addresses: (userId: string) => ['profile', 'addresses', userId] as const,
  },
  orders: {
    list: (filter: string) => ['orders', 'list', { filter }] as const,
    detail: (id: string) => ['orders', 'detail', id] as const,
    active: ['orders', 'active'] as const,
  },
  wallet: {
    balance: ['wallet', 'balance'] as const,
    transactions: ['wallet', 'transactions'] as const,
  },
  merchants: {
    nearby: (lat: number, lng: number) => ['merchants', 'nearby', { lat, lng }] as const,
    detail: (id: string) => ['merchants', 'detail', id] as const,
    products: (merchantId: string) => ['merchants', 'products', merchantId] as const,
  },
  categories: {
    all: ['categories', 'all'] as const,
  },
  driver: {
    profile: ['driver', 'profile'] as const,
    earnings: ['driver', 'earnings'] as const,
    wallet: ['driver', 'wallet'] as const,
  },
  admin: {
    merchants: (status?: string) => ['admin', 'merchants', { status }] as const,
    orders: (status?: string) => ['admin', 'orders', { status }] as const,
    payouts: () => ['admin', 'payouts'] as const,
    tickets: (status?: string) => ['admin', 'tickets', { status }] as const,
  },
  chat: {
    messages: (orderId: string) => ['chat', 'messages', orderId] as const,
  },
  payouts: {
    my: ['payouts', 'my'] as const,
  },
  support: {
    my: ['support', 'my'] as const,
    detail: (id: string) => ['support', 'detail', id] as const,
  },
} as const;
