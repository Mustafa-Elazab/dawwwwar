import React, { createContext, useContext, useMemo } from 'react';
import { AxiosInstance } from 'axios';
import { AuthService } from '../services/auth.service';
import { ProfileService } from '../services/profile.service';
import { OrdersService } from '../services/orders.service';
import { WalletService } from '../services/wallet.service';
import { UploadService } from '../services/upload.service';
import { DriverService } from '../services/driver.service';
import { MerchantService } from '../services/merchant.service';
import { AdminService } from '../services/admin.service';
import { ChatService } from '../services/chat.service';
import { PayoutService } from '../services/payout.service';
import { SupportService } from '../services/support.service';
import { CategoriesService } from '../services/categories.service';

interface ApiClientContextValue {
  client: AxiosInstance;
  publicClient: AxiosInstance;
  auth: AuthService;
  profile: ProfileService;
  orders: OrdersService;
  wallet: WalletService;
  upload: UploadService;
  driver: DriverService;
  merchant: MerchantService;
  admin: AdminService;
  chat: ChatService;
  payout: PayoutService;
  support: SupportService;
  categories: CategoriesService;
}

const ApiClientContext = createContext<ApiClientContextValue | null>(null);

export const ApiClientProvider: React.FC<{
  client: AxiosInstance;
  publicClient?: AxiosInstance;
  children: React.ReactNode;
}> = ({ client, publicClient = client, children }) => {
  const value = useMemo(
    () => ({
      client,
      publicClient,
      auth: new AuthService(publicClient),
      profile: new ProfileService(client),
      orders: new OrdersService(client),
      wallet: new WalletService(client),
      upload: new UploadService(client),
      driver: new DriverService(client),
      merchant: new MerchantService(publicClient, client),
      admin: new AdminService(client),
      chat: new ChatService(client),
      payout: new PayoutService(client),
      support: new SupportService(client),
      categories: new CategoriesService(publicClient),
    }),
    [client, publicClient]
  );

  return <ApiClientContext.Provider value={value}>{children}</ApiClientContext.Provider>;
};

export const useApiClient = () => {
  const context = useContext(ApiClientContext);
  if (!context) {
    throw new Error('useApiClient must be used within an ApiClientProvider');
  }
  return context;
};
