'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';

interface Merchant {
  id: string;
  name: string;
  nameAr: string;
  isApproved: boolean;
  isOpen: boolean;
  phone: string;
  createdAt: string;
}

export default function MerchantsPage() {
  const { data: merchants, isLoading } = useQuery<Merchant[]>({
    queryKey: ['merchants'],
    queryFn: async () => {
      const { data } = await api.get('/merchants');
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
        <h1 className="text-2xl font-bold text-gray-900">Merchants</h1>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Add Merchant
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                Phone
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                Status
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                Approved
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
            {merchants?.map((merchant) => (
              <tr key={merchant.id}>
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{merchant.name}</div>
                  <div className="text-sm text-gray-500">{merchant.nameAr}</div>
                </td>
                <td className="px-6 py-4 text-gray-600">{merchant.phone}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      merchant.isOpen
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {merchant.isOpen ? 'Open' : 'Closed'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      merchant.isApproved
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {merchant.isApproved ? 'Approved' : 'Pending'}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {formatDate(merchant.createdAt)}
                </td>
                <td className="px-6 py-4">
                  <Link
                    href={`/merchants/${merchant.id}`}
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
