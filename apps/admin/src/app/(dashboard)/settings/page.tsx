'use client';

import { useAuth } from '@/hooks/useAuth';
import { 
  Settings, 
  User, 
  Shield, 
  Bell, 
  Globe,
  Database
} from 'lucide-react';

export default function SettingsPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6 max-w-4xl">
      <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
        <Settings size={24} /> Admin Settings
      </h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center gap-4">
           <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-2xl">
              {user?.name?.charAt(0) || 'A'}
           </div>
           <div>
              <h2 className="font-bold text-xl text-gray-900">{user?.name}</h2>
              <p className="text-gray-500 text-sm">System Administrator</p>
           </div>
        </div>

        <div className="divide-y divide-gray-100">
           <div className="p-6 hover:bg-gray-50 transition-colors cursor-pointer group">
              <div className="flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <User size={20} className="text-gray-400 group-hover:text-blue-600" />
                    <div>
                       <div className="font-semibold text-gray-900">Personal Information</div>
                       <p className="text-xs text-gray-500">Update your name, email and avatar</p>
                    </div>
                 </div>
                 <button className="text-xs font-bold text-blue-600 uppercase tracking-wider">Edit</button>
              </div>
           </div>

           <div className="p-6 hover:bg-gray-50 transition-colors cursor-pointer group">
              <div className="flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <Shield size={20} className="text-gray-400 group-hover:text-blue-600" />
                    <div>
                       <div className="font-semibold text-gray-900">Security & Password</div>
                       <p className="text-xs text-gray-500">Change your password and enable 2FA</p>
                    </div>
                 </div>
                 <button className="text-xs font-bold text-blue-600 uppercase tracking-wider">Configure</button>
              </div>
           </div>

           <div className="p-6 hover:bg-gray-50 transition-colors cursor-pointer group">
              <div className="flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <Bell size={20} className="text-gray-400 group-hover:text-blue-600" />
                    <div>
                       <div className="font-semibold text-gray-900">Notification Preferences</div>
                       <p className="text-xs text-gray-500">Manage order alerts and system events</p>
                    </div>
                 </div>
                 <button className="text-xs font-bold text-blue-600 uppercase tracking-wider">Manage</button>
              </div>
           </div>

           <div className="p-6 hover:bg-gray-50 transition-colors cursor-pointer group">
              <div className="flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <Globe size={20} className="text-gray-400 group-hover:text-blue-600" />
                    <div>
                       <div className="font-semibold text-gray-900">Regional Settings</div>
                       <p className="text-xs text-gray-500">Set default currency, timezone and language</p>
                    </div>
                 </div>
                 <button className="text-xs font-bold text-blue-600 uppercase tracking-wider">Set</button>
              </div>
           </div>

           <div className="p-6 hover:bg-gray-50 transition-colors cursor-pointer group">
              <div className="flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <Database size={20} className="text-gray-400 group-hover:text-blue-600" />
                    <div>
                       <div className="font-semibold text-gray-900">System Logs & Data</div>
                       <p className="text-xs text-gray-500">View audit logs and export operational data</p>
                    </div>
                 </div>
                 <button className="text-xs font-bold text-blue-600 uppercase tracking-wider">View</button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
