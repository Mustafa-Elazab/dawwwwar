'use client';

import { useAdminPayouts, useAdminApprovePayout, useAdminRejectPayout } from '@dawwar/api-client';
import { formatDate } from '@/lib/utils';
import { Check, X, CreditCard, User, Clock, AlertCircle, Eye } from 'lucide-react';
import { PayoutStatus } from '@dawwar/types';
import Link from 'next/link';

const STATUS_COLORS: Record<PayoutStatus, string> = {
  [PayoutStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
  [PayoutStatus.APPROVED]: 'bg-blue-100 text-blue-800',
  [PayoutStatus.SENT]: 'bg-green-100 text-green-800',
  [PayoutStatus.FAILED]: 'bg-red-100 text-red-800',
  [PayoutStatus.REJECTED]: 'bg-gray-100 text-gray-800',
};

export default function PayoutsPage() {
  const { data: res, isLoading } = useAdminPayouts();
  const payouts = res?.data;

  const approveMutation = useAdminApprovePayout();
  const rejectMutation = useAdminRejectPayout();

  const handleApprove = async (id: string) => {
    if (confirm('Approve and send money via Paymob?')) {
      await approveMutation.mutateAsync(id);
    }
  };

  const handleReject = async (id: string) => {
    const reason = prompt('Reason for rejection:');
    if (reason) {
      await rejectMutation.mutateAsync({ id, reason });
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center">Loading payouts...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Payout Management</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Method
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {payouts?.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                  No payout requests found
                </td>
              </tr>
            ) : (
              payouts?.map((payout) => (
                <tr key={payout.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-100 rounded-full text-gray-500">
                        <User size={16} />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{payout.user?.name}</div>
                        <div className="text-xs text-gray-500">{payout.user?.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900">{payout.amount} EGP</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-xs text-gray-600">
                      <CreditCard size={14} />
                      {payout.method.replace('PAYMOB_', '')}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${STATUS_COLORS[payout.status as PayoutStatus]}`}>
                      {payout.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1.5">
                      <Clock size={14} />
                      {formatDate(payout.createdAt)}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                       <Link 
                          href={`/payouts/${payout.id}`}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                       >
                          <Eye size={18} />
                       </Link>
                       {payout.status === PayoutStatus.PENDING && (
                         <>
                           <button
                             onClick={() => handleApprove(payout.id)}
                             className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                             title="Approve"
                           >
                             <Check size={18} />
                           </button>
                           <button
                             onClick={() => handleReject(payout.id)}
                             className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                             title="Reject"
                           >
                             <X size={18} />
                           </button>
                         </>
                       )}
                    </div>
                    {payout.status === PayoutStatus.FAILED && (
                       <div className="text-red-500 flex items-center justify-end gap-1 text-[10px] mt-1">
                          <AlertCircle size={10} /> Failed
                       </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
