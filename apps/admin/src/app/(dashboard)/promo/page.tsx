'use client';

import { useAdminPromos } from '@dawwar/api-client';
import { formatDate } from '@/lib/utils';
import { 
  Ticket, 
  Clock, 
  Tag,
  Plus,
  AlertCircle
} from 'lucide-react';

export default function PromoCodesPage() {
  const { data: res, isLoading } = useAdminPromos();
  const promos = res?.data;

  if (isLoading) {
    return <div className="p-8 text-center">Loading promo codes...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Promo Codes</h1>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors">
          <Plus size={18} /> Create Code
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {promos?.length === 0 ? (
          <div className="col-span-full bg-white p-12 text-center border rounded-xl text-gray-500">
            No active promo codes
          </div>
        ) : (
          promos?.map((promo) => (
            <div key={promo.id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
               <div className="flex justify-between items-start mb-3">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                     <Ticket size={20} />
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${promo.isActive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {promo.isActive ? 'Active' : 'Disabled'}
                  </span>
               </div>
               <h3 className="font-bold text-lg text-gray-900 uppercase tracking-wider">{promo.code}</h3>
               <p className="text-sm text-gray-500 mb-4">{promo.description}</p>
               
               <div className="flex items-center gap-4 text-xs text-gray-400">
                  <div className="flex items-center gap-1">
                     <Tag size={12} /> {promo.discountType === 'PERCENTAGE' ? `${promo.discountValue}%` : `${promo.discountValue} EGP`}
                  </div>
                  <div className="flex items-center gap-1">
                     <Clock size={12} /> Exp: {formatDate(promo.expiresAt)}
                  </div>
               </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
