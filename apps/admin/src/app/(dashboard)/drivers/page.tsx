'use client';

import { useAdminDrivers, useApproveDriver, useForceDriverOffline } from '@dawwar/api-client';
import { formatDate } from '@/lib/utils';
import { 
  Check, 
  X, 
  ShieldAlert, 
  Wifi, 
  WifiOff, 
  MapPin, 
  Truck, 
  Phone, 
  Battery, 
  Zap 
} from 'lucide-react';
import { useState } from 'react';

const VEHICLE_ICONS: Record<string, any> = {
  MOTORCYCLE: <Truck size={16} />,
  BICYCLE: <Truck size={16} />,
  CAR: <Truck size={16} />,
};

export default function DriversPage() {
  const [filter, setFilter] = useState<'all' | 'online' | 'pending'>('all');
  const { data: res, isLoading } = useAdminDrivers(filter);
  const drivers = res?.data;

  const approveMutation = useApproveDriver();
  const forceOfflineMutation = useForceDriverOffline();

  const handleApprove = async (id: string) => {
    if (confirm('Approve this driver?')) {
      await approveMutation.mutateAsync(id);
    }
  };

  const handleForceOffline = async (id: string) => {
    if (confirm('FORCE OFFLINE: This will stop the driver from receiving orders. Continue?')) {
      await forceOfflineMutation.mutateAsync(id);
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
        <h1 className="text-2xl font-bold text-gray-900">Fleet Operations</h1>
        <div className="flex bg-gray-100 p-1 rounded-lg">
          {(['all', 'online', 'pending'] as const).map((f) => (
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

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {drivers?.length === 0 ? (
          <div className="col-span-full bg-white p-12 text-center border rounded-xl text-gray-500">
            No drivers matching filter
          </div>
        ) : (
          drivers?.map((driver) => (
            <div key={driver.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-4">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-lg">
                      {driver.user?.name?.charAt(0) || 'D'}
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${driver.isOnline ? 'bg-green-500' : 'bg-gray-300'}`} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{driver.user?.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Phone size={12} />
                      {driver.user?.phone}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex flex-col items-end gap-1">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${driver.isOnline ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                      {driver.isOnline ? <Wifi size={12} /> : <WifiOff size={12} />}
                      {driver.isOnline ? 'Online' : 'Offline'}
                    </span>
                    {driver.isLocationStale && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-50 text-red-600 rounded-full text-[10px] font-bold">
                        <ShieldAlert size={10} /> STALE GPS
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 py-3 border-y border-gray-50 mb-4">
                <div>
                  <div className="text-[10px] uppercase font-bold text-gray-400 mb-0.5">Rating</div>
                  <div className="text-sm font-semibold">★ {driver.rating?.toFixed(1) || '0.0'}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-gray-400 mb-0.5">Vehicle</div>
                  <div className="text-sm font-semibold flex items-center gap-1">
                    {VEHICLE_ICONS[driver.vehicleType] || <Truck size={14} />}
                    <span className="capitalize text-xs">{driver.vehicleType?.toLowerCase()}</span>
                  </div>
                </div>
                <div>
                   <div className="text-[10px] uppercase font-bold text-gray-400 mb-0.5">Device Health</div>
                   <div className="flex items-center gap-2">
                      <div className={`flex items-center gap-1 text-xs font-semibold ${driver.batteryLevel < 0.2 ? 'text-red-500' : 'text-gray-700'}`}>
                        <Battery size={12} />
                        {driver.batteryLevel ? Math.round(driver.batteryLevel * 100) : '--'}%
                      </div>
                      {driver.lastAppState === 'background' && (
                        <div className="text-gray-400" title="Running in background"><Zap size={10} /></div>
                      )}
                   </div>
                </div>
              </div>

              {driver.isOnline && driver.currentLatitude && (
                <div className="flex flex-col gap-1 mb-4">
                  <div className="flex items-center gap-2 text-xs text-blue-600 bg-blue-50 p-2 rounded-lg">
                    <MapPin size={14} />
                    <span>Last seen: {formatDate(driver.lastLocationUpdate)}</span>
                  </div>
                  {driver.currentAccuracy > 50 && (
                    <div className="text-[10px] text-orange-500 px-2 italic">
                      Low GPS precision: ±{Math.round(driver.currentAccuracy)}m
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-between items-center">
                <div className="text-[10px] text-gray-400">
                  Joined: {formatDate(driver.createdAt)}
                </div>
                <div className="flex gap-2">
                  {!driver.isApproved && (
                    <button
                      onClick={() => handleApprove(driver.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-xs font-bold"
                    >
                      <Check size={14} /> Approve
                    </button>
                  )}
                  {driver.isOnline && (
                    <button
                      onClick={() => handleForceOffline(driver.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors text-xs font-bold"
                    >
                      <ShieldAlert size={14} /> Force Offline
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
