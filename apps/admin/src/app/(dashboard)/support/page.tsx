'use client';

import { useAdminTickets } from '@dawwar/api-client';
import { formatDate } from '@/lib/utils';
import { 
  MessageSquare, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  User, 
  Tag,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { TicketStatus, TicketType } from '@dawwar/api-client';

const STATUS_COLORS: Record<string, string> = {
  OPEN: 'bg-blue-100 text-blue-800',
  INVESTIGATING: 'bg-purple-100 text-purple-800',
  WAITING_RESPONSE: 'bg-yellow-100 text-yellow-800',
  ESCALATED: 'bg-red-100 text-red-800',
  RESOLVED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-gray-100 text-gray-800',
};

const PRIORITY_COLORS: Record<string, string> = {
  LOW: 'text-gray-400',
  MEDIUM: 'text-blue-400',
  HIGH: 'text-orange-400',
  CRITICAL: 'text-red-600',
};

export default function SupportInboxPage() {
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const { data: res, isLoading } = useAdminTickets(statusFilter);
  const tickets = res?.data;

  if (isLoading) {
    return <div className="p-12 text-center">Loading support inbox...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Support Inbox</h1>
        <div className="flex gap-2">
           <select 
             className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
             onChange={(e) => setStatusFilter(e.target.value || undefined)}
           >
              <option value="">All Statuses</option>
              {Object.values(TicketStatus).map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
           </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="divide-y divide-gray-100">
          {tickets?.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
               Your inbox is empty. All clear!
            </div>
          ) : (
            tickets?.map((ticket) => (
              <Link 
                key={ticket.id} 
                href={`/support/${ticket.id}`}
                className="flex items-center gap-6 p-4 hover:bg-gray-50 transition-colors group"
              >
                <div className="flex-shrink-0">
                   <AlertTriangle size={20} className={PRIORITY_COLORS[ticket.priority]} />
                </div>

                <div className="flex-1 min-w-0">
                   <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${STATUS_COLORS[ticket.status]}`}>
                        {ticket.status}
                      </span>
                      <span className="text-xs text-gray-400 font-medium">#{ticket.id.slice(0, 8)}</span>
                   </div>
                   <h3 className="font-bold text-gray-900 truncate">{ticket.type.replace('_', ' ')}</h3>
                   <div className="flex items-center gap-4 mt-1">
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                         <User size={12} />
                         {ticket.customer?.name}
                      </div>
                      {ticket.order && (
                        <div className="flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-1.5 rounded">
                           <Tag size={12} />
                           Order #{ticket.order.orderNumber}
                        </div>
                      )}
                   </div>
                </div>

                <div className="text-right flex-shrink-0">
                   <div className="flex items-center gap-1 text-xs text-gray-400 mb-1">
                      <Clock size={12} />
                      {formatDate(ticket.createdAt)}
                   </div>
                   <ChevronRight size={18} className="text-gray-300 group-hover:text-gray-900 ml-auto" />
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
