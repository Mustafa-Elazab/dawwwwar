'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/utils';
import { OrderStatus } from '@dawwar/types';
import Link from 'next/link';

interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  total: number;
  customerId: string;
  merchantId?: string;
  driverId?: string;
  createdAt: string;
  deliveryAddress: string;
}

const statusColors: Partial<Record<OrderStatus, string>> = {
  [OrderStatus.PENDING]: 'bg-yellow-100 text-yellow-700',
  [OrderStatus.ACCEPTED]: 'bg-blue-100 text-blue-700',
  [OrderStatus.DRIVER_ASSIGNED]: 'bg-purple-100 text-purple-700',
  [OrderStatus.PICKED_UP]: 'bg-indigo-100 text-indigo-700',
  [OrderStatus.IN_TRANSIT]: 'bg-blue-100 text-blue-700',
  [OrderStatus.DELIVERED]: 'bg-green-100 text-green-700',
  [OrderStatus.COMPLETED]: 'bg-green-100 text-green-700',
  [OrderStatus.CANCELLED]: 'bg-red-100 text-red-700',
  [OrderStatus.REJECTED]: 'bg-red-100 text-red-700',
};

export default function OrdersPage() {
  const { data: orders, isLoading } = useQuery<Order[]>({
    queryKey: ['orders'],
    queryFn: async () => {
      const { data } = await api.get('/orders');
      return data;
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
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                Order #
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                Status
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                Total
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                Delivery Address
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                Date
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders?.map((order) => (
              <tr key={order.id}>
                <td className="px-6 py-4 font-medium text-gray-900">
                  #{order.orderNumber}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${statusColors[order.status] || 'bg-gray-100 text-gray-700'}`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-900 font-medium">
                  {formatCurrency(order.total)}
                </td>
                <td className="px-6 py-4 text-gray-600 max-w-xs truncate">
                  {order.deliveryAddress}
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {formatDate(order.createdAt)}
                </td>
                <td className="px-6 py-4">
                  <Link
                    href={`/orders/${order.id}`}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
