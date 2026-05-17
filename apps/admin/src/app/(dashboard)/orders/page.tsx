'use client';

import { useAdminOrders, useAdminCancelOrder } from '@dawwar/api-client';
import { formatDate } from '@/lib/utils';
import { Ban, Eye, MapPin, ShoppingBag, Truck } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { OrderStatus } from '@dawwar/types';

const STATUS_LABELS: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: 'Pending',
  [OrderStatus.ACCEPTED]: 'Merchant Accepted',
  [OrderStatus.DRIVER_ASSIGNED]: 'Driver Assigned',
  [OrderStatus.AT_SHOP]: 'At Shop',
  [OrderStatus.SHOPPING]: 'Shopping',
  [OrderStatus.PURCHASED]: 'Items Bought',
  [OrderStatus.PICKED_UP]: 'Picked Up',
  [OrderStatus.READY]: 'Ready',
  [OrderStatus.IN_TRANSIT]: 'Delivering',
  [OrderStatus.DELIVERED]: 'Arrived',
  [OrderStatus.COMPLETED]: 'Completed',
  [OrderStatus.CANCELLED]: 'Cancelled',
  [OrderStatus.REJECTED]: 'Rejected',
};

const STATUS_COLORS: Partial<Record<OrderStatus, string>> = {
  [OrderStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
  [OrderStatus.ACCEPTED]: 'bg-blue-100 text-blue-800',
  [OrderStatus.IN_TRANSIT]: 'bg-purple-100 text-purple-800',
  [OrderStatus.COMPLETED]: 'bg-green-100 text-green-800',
  [OrderStatus.CANCELLED]: 'bg-red-100 text-red-800',
  [OrderStatus.REJECTED]: 'bg-red-100 text-red-800',
};

export default function OrdersPage() {
  const [filter, setFilter] = useState<'all' | 'active'>('active');
  const { data: res, isLoading } = useAdminOrders(filter);
  const orders = res?.data;

  const cancelMutation = useAdminCancelOrder();

  const handleCancel = async (id: string) => {
    if (confirm('MANUAL OVERRIDE: Are you sure you want to cancel this order?')) {
      await cancelMutation.mutateAsync(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Live Order Monitor</h1>
        <div className="flex bg-gray-100 p-1 rounded-lg">
          {(['active', 'all'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 text-sm font-medium rounded-md capitalize transition-colors ${
                filter === f
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4">
        {orders?.length === 0 ? (
          <div className="bg-white p-12 text-center border rounded-xl text-gray-500">
            No live orders found
          </div>
        ) : (
          orders?.map((order) => (
            <div key={order.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:border-blue-200 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-mono font-bold text-blue-600">#{order.orderNumber}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLORS[order.status as OrderStatus] || 'bg-gray-100 text-gray-700'}`}>
                      {STATUS_LABELS[order.status as OrderStatus]}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">{formatDate(order.createdAt)}</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900">{order.total} EGP</div>
                  <div className="text-xs text-gray-500 capitalize">{order.paymentMethod}</div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6 py-4 border-y border-gray-50">
                <div className="flex gap-3">
                  <ShoppingBag className="text-gray-400 shrink-0" size={20} />
                  <div>
                    <div className="text-xs font-semibold text-gray-400 uppercase">Merchant</div>
                    <div className="text-sm font-medium text-gray-900">{order.merchant?.businessName || order.shopName || 'Custom Shop'}</div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Truck className="text-gray-400 shrink-0" size={20} />
                  <div>
                    <div className="text-xs font-semibold text-gray-400 uppercase">Driver</div>
                    <div className="text-sm font-medium text-gray-900">{order.driver?.user?.name || 'Searching...'}</div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <MapPin className="text-gray-400 shrink-0" size={20} />
                  <div>
                    <div className="text-xs font-semibold text-gray-400 uppercase">Destination</div>
                    <div className="text-sm font-medium text-gray-900 truncate max-w-[200px]">{order.deliveryAddress}</div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center mt-4">
                <div className="text-xs text-gray-400 italic">
                  Last update: {formatDate(order.updatedAt)}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleCancel(order.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Force Cancel"
                  >
                    <Ban size={18} />
                  </button>
                  <Link
                    href={`/orders/${order.id}`}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                  >
                    <Eye size={16} />
                    Details
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
