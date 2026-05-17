'use client';

import { useMerchantDetails } from '@dawwar/api-client';
import { formatDate } from '@/lib/utils';
import { use } from 'react';
import { 
  ArrowLeft, 
  Store, 
  MapPin, 
  Phone, 
  Clock, 
  ShoppingBag,
  Star,
  ShieldCheck,
  ShieldAlert,
  Eye
} from 'lucide-react';
import Link from 'next/link';

export default function MerchantDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: res, isLoading } = useMerchantDetails(id);
  const merchant = res?.data;

  if (isLoading) {
    return <div className="p-8 text-center">Loading merchant details...</div>;
  }

  if (!merchant) {
    return <div className="p-8 text-center text-red-600">Merchant not found</div>;
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <Link href="/merchants" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors">
        <ArrowLeft size={16} />
        Back to Merchants
      </Link>

      <div className="flex justify-between items-start">
        <div className="flex gap-6">
          <div className="w-24 h-24 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 text-3xl font-bold">
            {merchant.businessName.charAt(0)}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{merchant.businessName}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-500">
               <span className="flex items-center gap-1.5"><Store size={14} /> {merchant.category || 'General'}</span>
               <span className={`px-2 py-0.5 rounded-full font-semibold uppercase text-[10px] ${merchant.isApproved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                {merchant.isApproved ? 'Approved' : 'Pending Approval'}
               </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
           <div className="flex items-center gap-1 text-orange-500 font-bold">
              <Star size={20} fill="currentColor" />
              <span className="text-xl">4.8</span>
              <span className="text-gray-400 text-sm font-normal">(128 reviews)</span>
           </div>
           <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${merchant.isOpen ? 'bg-blue-50 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
              {merchant.isOpen ? 'Open Now' : 'Closed'}
           </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
           <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                 <MapPin size={18} className="text-blue-600" /> Location & Contact
              </h3>
              <div className="space-y-4">
                 <div>
                    <div className="text-xs font-bold text-gray-400 uppercase">Address</div>
                    <div className="text-gray-700">{merchant.address}</div>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                       <div className="text-xs font-bold text-gray-400 uppercase">Owner Phone</div>
                       <div className="text-gray-700">{merchant.user?.phone}</div>
                    </div>
                    <div>
                       <div className="text-xs font-bold text-gray-400 uppercase">Owner Name</div>
                       <div className="text-gray-700">{merchant.user?.name}</div>
                    </div>
                 </div>
              </div>
           </div>

           <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                 <ShoppingBag size={18} className="text-blue-600" /> Business Performance
              </h3>
              <div className="grid grid-cols-3 gap-4">
                 <div className="p-4 bg-gray-50 rounded-xl text-center">
                    <div className="text-2xl font-bold text-gray-900">1,240</div>
                    <div className="text-[10px] text-gray-500 uppercase font-bold">Total Orders</div>
                 </div>
                 <div className="p-4 bg-gray-50 rounded-xl text-center">
                    <div className="text-2xl font-bold text-gray-900">45k</div>
                    <div className="text-[10px] text-gray-500 uppercase font-bold">Revenue (EGP)</div>
                 </div>
                 <div className="p-4 bg-gray-50 rounded-xl text-center">
                    <div className="text-2xl font-bold text-gray-900">98%</div>
                    <div className="text-[10px] text-gray-500 uppercase font-bold">Success Rate</div>
                 </div>
              </div>
           </div>
        </div>

        <div className="space-y-6">
           <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                 <Clock size={18} className="text-blue-600" /> History
              </h3>
              <div className="space-y-3 text-sm">
                 <div className="flex justify-between">
                    <span className="text-gray-500">Joined</span>
                    <span className="font-medium">{formatDate(merchant.createdAt)}</span>
                 </div>
                 <div className="flex justify-between">
                    <span className="text-gray-500">Last Active</span>
                    <span className="font-medium">{formatDate(merchant.updatedAt)}</span>
                 </div>
              </div>
           </div>

           <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                 <ShieldCheck size={18} className="text-blue-600" /> Documents
              </h3>
              <div className="space-y-2">
                 <div className="p-3 border rounded-lg flex items-center justify-between group hover:border-blue-500 cursor-pointer">
                    <span className="text-sm">Commercial Register</span>
                    <Eye size={14} className="text-gray-300 group-hover:text-blue-500" />
                 </div>
                 <div className="p-3 border rounded-lg flex items-center justify-between group hover:border-blue-500 cursor-pointer">
                    <span className="text-sm">Tax Card</span>
                    <Eye size={14} className="text-gray-300 group-hover:text-blue-500" />
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
