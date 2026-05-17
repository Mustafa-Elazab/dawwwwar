'use client';

import { useAdminCustomers } from '@dawwar/api-client';
import { formatDate } from '@/lib/utils';
import { use, useMemo } from 'react';
import { 
  ArrowLeft, 
  User, 
  Phone, 
  Clock, 
  ShoppingBag,
  CreditCard,
  MapPin,
  ShieldCheck,
  History
} from 'lucide-react';
import Link from 'next/link';

export default function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: res, isLoading } = useAdminCustomers();
  const customer = useMemo(() => res?.data?.find(c => c.id === id), [res, id]);

  if (isLoading) {
    return <div className="p-8 text-center">Loading customer details...</div>;
  }

  if (!customer) {
    return <div className="p-8 text-center text-red-600">Customer not found</div>;
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <Link href="/customers" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors">
        <ArrowLeft size={16} />
        Back to Customers
      </Link>

      <div className="flex justify-between items-start">
        <div className="flex gap-6">
          <div className="w-24 h-24 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 text-3xl font-bold">
            {customer.name?.charAt(0) || 'U'}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{customer.name || 'Incomplete Profile'}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-500">
               <span className="flex items-center gap-1.5"><Phone size={14} /> {customer.phone}</span>
               <span className={`px-2 py-0.5 rounded-full font-semibold uppercase text-[10px] ${customer.isApproved ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                {customer.isApproved ? 'Active' : 'Pending'}
               </span>
            </div>
          </div>
        </div>
        <div className="text-right">
           <div className="text-sm font-bold text-gray-400 uppercase mb-1">Total Spent</div>
           <div className="text-3xl font-bold text-blue-600">2,450 EGP</div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
           <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                 <ShoppingBag size={18} className="text-blue-600" /> Order History
              </h3>
              <div className="space-y-4">
                 {/* This would ideally be a separate query, using placeholder for now */}
                 <div className="p-12 text-center text-gray-400 border-2 border-dashed rounded-xl">
                    Order list will be implemented here
                 </div>
              </div>
           </div>

           <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                 <MapPin size={18} className="text-blue-600" /> Saved Addresses
              </h3>
              <div className="p-12 text-center text-gray-400 border-2 border-dashed rounded-xl">
                 Addresses will be implemented here
              </div>
           </div>
        </div>

        <div className="space-y-6">
           <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                 <CreditCard size={18} className="text-blue-600" /> Wallet Overview
              </h3>
              <div className="space-y-4">
                 <div className="p-4 bg-blue-50 rounded-xl">
                    <div className="text-xs font-bold text-blue-400 uppercase mb-1">Current Balance</div>
                    <div className="text-2xl font-bold text-blue-700">150.00 EGP</div>
                 </div>
                 <button className="w-full py-2 text-sm font-bold text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                    View Transactions
                 </button>
              </div>
           </div>

           <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                 <History size={18} className="text-blue-600" /> Account Details
              </h3>
              <div className="space-y-3 text-sm">
                 <div className="flex justify-between">
                    <span className="text-gray-500">Member Since</span>
                    <span className="font-medium">{formatDate(customer.createdAt)}</span>
                 </div>
                 <div className="flex justify-between">
                    <span className="text-gray-500">Role</span>
                    <span className="font-medium uppercase">{customer.role}</span>
                 </div>
                 <div className="flex justify-between">
                    <span className="text-gray-500">ID</span>
                    <span className="font-mono text-[10px]">{customer.id}</span>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
