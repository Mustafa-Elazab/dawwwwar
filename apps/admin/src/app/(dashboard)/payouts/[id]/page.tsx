'use client';

import { 
  useAdminPayoutDetails, 
  useAdminApprovePayout, 
  useAdminRejectPayout 
} from '@dawwar/api-client';
import { formatDate } from '@/lib/utils';
import { use } from 'react';
import { 
  ArrowLeft, 
  CreditCard, 
  User, 
  Clock, 
  History,
  Check,
  X,
  ShieldAlert,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';
import { PayoutStatus } from '@dawwar/types';

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  APPROVED: 'bg-blue-100 text-blue-800',
  SENT: 'bg-green-100 text-green-800',
  FAILED: 'bg-red-100 text-red-800',
  REJECTED: 'bg-gray-100 text-gray-800',
};

export default function PayoutDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: res, isLoading } = useAdminPayoutDetails(id);
  const payout = res?.data;

  const approveMutation = useAdminApprovePayout();
  const rejectMutation = useAdminRejectPayout();

  if (isLoading) {
    return <div className="p-8 text-center">Loading payout details...</div>;
  }

  if (!payout) {
    return <div className="p-8 text-center text-red-600">Payout not found</div>;
  }

  const handleApprove = async () => {
    if (confirm('Approve and execute Paymob transfer?')) {
      await approveMutation.mutateAsync(id);
    }
  };

  const handleReject = async () => {
    const reason = prompt('Reason for rejection:');
    if (reason) {
      await rejectMutation.mutateAsync({ id, reason });
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Link href="/payouts" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors">
        <ArrowLeft size={16} />
        Back to Payouts
      </Link>

      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payout Details</h1>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1.5"><Clock size={14} /> Requested {formatDate(payout.createdAt)}</span>
            <span className={`px-2 py-0.5 rounded-full font-semibold uppercase text-[10px] ${STATUS_COLORS[payout.status]}`}>
              {payout.status}
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-gray-900">{payout.amount} EGP</div>
          <div className="text-sm text-gray-500 capitalize">{payout.method.replace('PAYMOB_', '')}</div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <div className="flex items-center gap-2 text-gray-400 font-bold text-[10px] uppercase mb-4">
                <User size={14} /> Recipient
              </div>
              <div className="font-bold text-gray-900 text-lg">{payout.user?.name}</div>
              <div className="text-sm text-gray-500">{payout.user?.phone}</div>
              <div className="mt-4 pt-4 border-t border-gray-50">
                 <div className="text-[10px] uppercase font-bold text-gray-400 mb-1">Transfer Details</div>
                 <pre className="text-xs bg-gray-50 p-3 rounded-lg overflow-auto">
                    {JSON.stringify(payout.paymentDetails || {}, null, 2)}
                 </pre>
              </div>
          </div>

          {payout.status === 'PENDING' && (
             <div className="bg-white p-6 rounded-xl border border-blue-100 shadow-sm flex gap-3">
                <button
                   onClick={handleApprove}
                   disabled={approveMutation.isPending}
                   className="flex-1 bg-green-600 text-white py-2.5 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-green-700 transition-colors"
                >
                   <Check size={18} /> Approve & Send
                </button>
                <button
                   onClick={handleReject}
                   disabled={rejectMutation.isPending}
                   className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
                >
                   <X size={18} /> Reject
                </button>
             </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 text-gray-400 font-bold text-[10px] uppercase mb-6">
              <History size={14} /> Payout Timeline
            </div>
            <div className="space-y-6">
              {payout.events?.map((event: any, idx: number) => (
                <div key={event.id} className="relative pl-8 pb-6 border-l-2 border-gray-100 last:pb-0 last:border-l-0">
                  <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-2 ${event.status === 'SENT' ? 'border-green-500' : 'border-blue-500'}`} />
                  <div>
                    <div className="font-bold text-gray-900 text-sm">{event.title}</div>
                    <div className="text-[10px] text-gray-500">{formatDate(event.createdAt)}</div>
                    {event.description && (
                      <div className="mt-1 text-xs text-gray-600">{event.description}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
        </div>
      </div>
      
      {payout.externalTransactionId && (
        <div className="bg-gray-900 p-6 rounded-xl text-white">
           <div className="flex justify-between items-center">
              <div>
                 <div className="text-[10px] uppercase font-bold text-gray-400 mb-1">Provider Reference</div>
                 <div className="font-mono text-lg">{payout.externalTransactionId}</div>
              </div>
              <div className="p-3 bg-white/10 rounded-lg">
                 <CreditCard size={24} />
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
