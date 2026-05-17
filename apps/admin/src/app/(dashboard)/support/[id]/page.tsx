'use client';

import { 
  useTicketDetails, 
  useAddTicketMessage, 
  useAdminResolveTicket,
  useOrderDetails 
} from '@dawwar/api-client';
import { formatDate } from '@/lib/utils';
import { use, useState } from 'react';
import { 
  ArrowLeft, 
  User, 
  Clock, 
  History,
  Send,
  ShieldCheck,
  Package,
  AlertCircle,
  CreditCard,
  MapPin,
  MessageSquare
} from 'lucide-react';
import Link from 'next/link';

export default function TicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: res, isLoading } = useTicketDetails(id);
  const ticket = res?.data;
  
  const [message, setMessage] = useState('');
  const [isInternal, setIsInternal] = useState(false);
  const [showResolve, setShowResolve] = useState(false);

  // Resolve form
  const [finalDecision, setFinalDecision] = useState('');
  const [refundAmount, setRefundAmount] = useState(0);

  const addMessageMutation = useAddTicketMessage();
  const resolveMutation = useAdminResolveTicket();

  // 1. Fetch Order Context (The "Operations Brain")
  const { data: orderRes } = useOrderDetails(ticket?.orderId || '');
  const order = orderRes?.data;

  if (isLoading) return <div className="p-12 text-center">Loading ticket...</div>;
  if (!ticket) return <div className="p-12 text-center">Ticket not found</div>;

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    await addMessageMutation.mutateAsync({
      id,
      payload: { content: message, isInternal }
    });
    setMessage('');
  };

  const handleResolve = async () => {
    await resolveMutation.mutateAsync({
      id,
      payload: { finalDecision, refundAmount }
    });
    setShowResolve(false);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <Link href="/support" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors">
        <ArrowLeft size={16} />
        Back to Inbox
      </Link>

      <div className="grid grid-cols-3 gap-6">
        {/* Left: Chat & Resolution */}
        <div className="col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-[600px]">
             <div className="p-4 border-b flex justify-between items-center">
                <h2 className="font-bold text-gray-900 flex items-center gap-2">
                   <MessageSquare size={18} /> Support Log
                </h2>
                <div className="flex items-center gap-2">
                   <span className="text-[10px] text-gray-400 font-bold uppercase">INTERNAL NOTES</span>
                   <button 
                      onClick={() => setIsInternal(!isInternal)}
                      className={`w-8 h-4 rounded-full transition-colors relative ${isInternal ? 'bg-orange-500' : 'bg-gray-200'}`}
                   >
                      <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${isInternal ? 'left-4.5' : 'left-0.5'}`} />
                   </button>
                </div>
             </div>

             <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
                {ticket.messages?.map((msg: any) => (
                  <div key={msg.id} className={`flex flex-col ${msg.senderRole === 'ADMIN' ? 'items-end' : 'items-start'}`}>
                     <div className={`max-w-[80%] p-3 rounded-xl text-sm ${
                        msg.isInternal 
                          ? 'bg-orange-50 border border-orange-100 text-orange-900' 
                          : msg.senderRole === 'ADMIN' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-white border border-gray-200 text-gray-900'
                     }`}>
                        {msg.content}
                        <div className={`text-[10px] mt-1 ${msg.senderRole === 'ADMIN' && !msg.isInternal ? 'text-blue-100' : 'text-gray-400'}`}>
                           {msg.senderRole} • {formatDate(msg.createdAt)}
                        </div>
                     </div>
                  </div>
                ))}
             </div>

             <div className="p-4 border-t bg-white">
                <div className="flex gap-2">
                   <textarea 
                     value={message}
                     onChange={(e) => setMessage(e.target.value)}
                     className="flex-1 border rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none h-20"
                     placeholder={isInternal ? "Add internal note..." : "Reply to customer..."}
                   />
                   <button 
                      onClick={handleSendMessage}
                      disabled={addMessageMutation.isPending}
                      className={`px-4 rounded-lg flex items-center justify-center ${isInternal ? 'bg-orange-500' : 'bg-blue-600'} text-white`}
                   >
                      <Send size={18} />
                   </button>
                </div>
             </div>
          </div>

          {ticket.status !== 'RESOLVED' && (
             <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                   <ShieldCheck size={18} /> Resolution Panel
                </h3>
                <div className="space-y-4">
                   <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Final Decision</label>
                      <textarea 
                         value={finalDecision}
                         onChange={(e) => setFinalDecision(e.target.value)}
                         className="w-full border rounded-lg p-3 text-sm"
                         placeholder="Explain the outcome..."
                      />
                   </div>
                   <div className="flex gap-4">
                      <div className="flex-1">
                         <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Refund Amount (EGP)</label>
                         <input 
                            type="number"
                            value={refundAmount}
                            onChange={(e) => setRefundAmount(Number(e.target.value))}
                            className="w-full border rounded-lg p-2 text-sm"
                         />
                      </div>
                      <div className="flex-1 flex items-end">
                         <button 
                            onClick={handleResolve}
                            className="w-full bg-green-600 text-white py-2.5 rounded-lg font-bold hover:bg-green-700"
                         >
                            Resolve & Close Ticket
                         </button>
                      </div>
                   </div>
                </div>
             </div>
          )}
        </div>

        {/* Right: Order Context Brain */}
        <div className="space-y-6">
           <div className="bg-gray-900 rounded-xl p-5 text-white shadow-xl">
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Operations Context</h2>
              
              <div className="space-y-6">
                 <div>
                    <div className="flex items-center gap-2 text-blue-400 mb-2">
                       <Package size={16} /> <span className="text-sm font-bold">Order Details</span>
                    </div>
                    {order ? (
                       <div className="text-xs space-y-1.5 opacity-90">
                          <div className="flex justify-between"><span>Number:</span><span className="font-mono">{order.orderNumber}</span></div>
                          <div className="flex justify-between"><span>Status:</span><span className="font-bold">{order.status}</span></div>
                          <div className="flex justify-between"><span>Total:</span><span>{order.total} EGP</span></div>
                          <div className="flex justify-between"><span>Payment:</span><span className="capitalize">{order.paymentMethod}</span></div>
                       </div>
                    ) : <div className="text-xs text-gray-500">No order linked</div>}
                 </div>

                 <div>
                    <div className="flex items-center gap-2 text-orange-400 mb-2">
                       <CreditCard size={16} /> <span className="text-sm font-bold">Financial Audit</span>
                    </div>
                    <div className="text-xs space-y-1.5 opacity-90">
                       <div className="flex justify-between"><span>Subtotal:</span><span>{order?.subtotal} EGP</span></div>
                       <div className="flex justify-between"><span>Delivery:</span><span>{order?.deliveryFee} EGP</span></div>
                       <div className="flex justify-between"><span>Commission:</span><span>{order?.driverCommission} EGP</span></div>
                    </div>
                 </div>

                 <div>
                    <div className="flex items-center gap-2 text-green-400 mb-2">
                       <History size={16} /> <span className="text-sm font-bold">GPS Timeline</span>
                    </div>
                    {order?.events?.slice(0, 3).map((ev: any) => (
                       <div key={ev.id} className="text-[10px] border-l border-white/20 pl-3 pb-3 last:pb-0">
                          <div className="font-bold">{ev.title}</div>
                          <div className="opacity-50">{formatDate(ev.createdAt)}</div>
                       </div>
                    ))}
                 </div>

                 <div className="pt-4 border-t border-white/10">
                    <div className="flex items-center gap-2 text-purple-400 mb-2">
                       <AlertCircle size={16} /> <span className="text-sm font-bold">Diagnostic Data</span>
                    </div>
                    <div className="text-[10px] font-mono opacity-50 space-y-1">
                       <div>TRACE_ID: {ticket.id.slice(0, 8)}</div>
                       <div>DEVICE: Android 13</div>
                       <div>SIGNAL: 4G (Strong)</div>
                    </div>
                 </div>
              </div>
           </div>

           <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="text-xs font-bold text-gray-400 uppercase mb-4">Customer Info</h3>
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold">
                    {ticket.customer?.name[0]}
                 </div>
                 <div>
                    <div className="font-bold text-gray-900 text-sm">{ticket.customer?.name}</div>
                    <div className="text-xs text-gray-500">{ticket.customer?.phone}</div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
