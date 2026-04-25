'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';

interface Driver {
  id: string;
  userId: string;
  vehicleType: string;
  isVerified: boolean;
  isOnline: boolean;
  rating: number;
  totalRatings: number;
  phone: string;
  name?: string;
  createdAt: string;
}

export default function DriversPage() {
  const { data: drivers, isLoading } = useQuery<Driver[]>({
    queryKey: ['drivers'],
    queryFn: async () => {
      const { data } = await api.get('/drivers');
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Drivers</h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                Driver
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                Vehicle
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                Rating
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                Status
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                Verified
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                Joined
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {drivers?.map((driver) => (
              <tr key={driver.id}>
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{driver.name || 'N/A'}</div>
                  <div className="text-sm text-gray-500">{driver.phone}</div>
                </td>
                <td className="px-6 py-4 text-gray-600">{driver.vehicleType}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500">★</span>
                    <span className="text-gray-900">{driver.rating.toFixed(1)}</span>
                    <span className="text-gray-500 text-sm">({driver.totalRatings})</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      driver.isOnline
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {driver.isOnline ? 'Online' : 'Offline'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      driver.isVerified
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {driver.isVerified ? 'Verified' : 'Pending'}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {formatDate(driver.createdAt)}
                </td>
                <td className="px-6 py-4">
                  <Link
                    href={`/drivers/${driver.id}`}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
