'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import {
  TrendingUp,
  Users,
  Store,
  ShoppingCart,
} from 'lucide-react';

interface PlatformAnalytics {
  totalOrders: number;
  totalRevenue: number;
  totalCommission: number;
  activeMerchants: number;
  activeDrivers: number;
  newCustomers: number;
}

function KpiCard({
  title,
  value,
  icon: Icon,
  trend,
}: {
  title: string;
  value: string;
  icon: React.ElementType;
  trend?: string;
}) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
          {trend && (
            <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              {trend}
            </p>
          )}
        </div>
        <div className="p-3 bg-blue-50 rounded-lg">
          <Icon className="w-6 h-6 text-blue-600" />
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const end = new Date().toISOString();
  const start = new Date();
  start.setDate(start.getDate() - 30);

  const { data, isLoading } = useQuery<PlatformAnalytics>({
    queryKey: ['platform-analytics', start, end],
    queryFn: async () => {
      const { data } = await api.get('/analytics/platform', {
        params: {
          startDate: start.toISOString(),
          endDate: end,
        },
      });
      return data.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <KpiCard
          title="Total Revenue (30d)"
          value={formatCurrency(data?.totalRevenue || 0)}
          icon={ShoppingCart}
        />
        <KpiCard
          title="Total Orders"
          value={String(data?.totalOrders || 0)}
          icon={Store}
        />
        <KpiCard
          title="Commission Earned"
          value={formatCurrency(data?.totalCommission || 0)}
          icon={TrendingUp}
        />
        <KpiCard
          title="Active Merchants"
          value={String(data?.activeMerchants || 0)}
          icon={Store}
        />
        <KpiCard
          title="Active Drivers"
          value={String(data?.activeDrivers || 0)}
          icon={Users}
        />
        <KpiCard
          title="New Customers"
          value={String(data?.newCustomers || 0)}
          icon={Users}
        />
      </div>

      {/* Placeholder for charts */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Revenue Overview
        </h2>
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400">
          Charts will be implemented here
        </div>
      </div>
    </div>
  );
}
