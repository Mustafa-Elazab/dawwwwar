'use client';

import { useOrderDetails } from '@dawwar/api-client';
import { formatDate } from '@/lib/utils';
import { use } from 'react';
import { 
  ArrowLeft, 
  MapPin, 
  ShoppingBag, 
  User, 
  Clock, 
  History,
  FileText,
  CreditCard,
  Truck
} from 'lucide-react';
import Link from 'next/link';

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: res, isLoading } = useOrderDetails(id);
  const order = res?.data;

  if (isLoading) {
    return <div className="p-8 text-center">Loading order details...</div>;
  }

  if (!order) {
    return <div className="p-8 text-center text-red-600">Order not found</div>;
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <Link href="/orders" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors">
        <ArrowLeft size={16} />
        Back to Orders
      </Link>

      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order #{order.orderNumber}</h1>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1.5"><Clock size={14} /> {formatDate(order.createdAt)}</span>
            <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full font-semibold uppercase text-[10px]">
              {order.status}
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-gray-900">{order.total} EGP</div>
          <div className="text-sm text-gray-500 capitalize">{order.paymentMethod} Payment</div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Participants */}
        <div className="space-y-6 md:col-span-2">
          <div className="grid grid-cols-2 gap-4">
             <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-2 text-gray-400 font-bold text-[10px] uppercase mb-4">
                  <User size={14} /> Customer
                </div>
                <div className="font-bold text-gray-900">{order.customer?.name}</div>
                <div className="text-sm text-gray-500">{order.customer?.phone}</div>
             </div>
             <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-2 text-gray-400 font-bold text-[10px] uppercase mb-4">
                  <ShoppingBag size={14} /> Merchant
                </div>
                <div className="font-bold text-gray-900">{order.merchant?.businessName || order.shopName || 'Custom Shop'}</div>
                <div className="text-sm text-gray-500">{order.merchant?.address || order.shopAddress}</div>
             </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <div className="flex items-center gap-2 text-gray-400 font-bold text-[10px] uppercase mb-4">
                <MapPin size={14} /> Delivery Destination
              </div>
              <div className="font-medium text-gray-900">{order.deliveryAddress}</div>
              {order.deliveryNotes && (
                <div className="mt-2 p-3 bg-gray-50 rounded-lg text-sm text-gray-600 italic">
                  "{order.deliveryNotes}"
                </div>
              )}
          </div>

          {/* Timeline */}
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <div className="flex items-center gap-2 text-gray-400 font-bold text-[10px] uppercase mb-6">
                <History size={14} /> Delivery Timeline
              </div>
              <div className="space-y-6">
                {order.events?.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((event: any, idx: number) => (
                  <div key={event.id} className="relative pl-8 pb-6 border-l-2 border-gray-100 last:pb-0 last:border-l-0">
                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-2 border-blue-500" />
                    <div>
                      <div className="font-bold text-gray-900">{event.title}</div>
                      <div className="text-xs text-gray-500">{formatDate(event.createdAt)}</div>
                      {event.metadata && (
                        <pre className="mt-2 text-[10px] bg-gray-50 p-2 rounded overflow-auto">
                          {JSON.stringify(event.metadata, null, 2)}
                        </pre>
                      )}
                    </div>
                  </div>
                ))}
              </div>
          </div>
        </div>

        {/* Sidebar info */}
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
               <div className="flex items-center gap-2 text-gray-400 font-bold text-[10px] uppercase mb-4">
                  <CreditCard size={14} /> Financials
                </div>
                <div className="space-y-3">
                   <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Subtotal</span>
                      <span className="font-medium">{order.subtotal} EGP</span>
                   </div>
                   <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Delivery Fee</span>
                      <span className="font-medium">{order.deliveryFee} EGP</span>
                   </div>
                   <div className="flex justify-between text-sm border-t pt-3">
                      <span className="font-bold text-gray-900">Total</span>
                      <span className="font-bold text-blue-600">{order.total} EGP</span>
                   </div>
                </div>
            </div>

            {order.driver && (
               <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-2 text-gray-400 font-bold text-[10px] uppercase mb-4">
                    <Truck size={14} /> Assigned Driver
                  </div>
                  <div className="font-bold text-gray-900">{order.driver.user?.name}</div>
                  <div className="text-sm text-gray-500">{order.driver.user?.phone}</div>
                  <div className="mt-4 flex items-center gap-2 text-xs text-blue-600 bg-blue-50 p-2 rounded-lg">
                    <Clock size={12} /> Assigned: {order.assignedAt ? formatDate(order.assignedAt) : '---'}
                  </div>
               </div>
            )}
        </div>
      </div>
    </div>
  );
}
