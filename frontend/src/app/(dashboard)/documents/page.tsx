'use client';

import { useState } from 'react';
import { useQuery } from 'react-query';
import { documentsApi } from '@/lib/api';
import { DataTable } from '@/components/tables/data-table';
import { SearchInput } from '@/components/ui/search-input';
import { Button } from '@/components/ui/button';
import { FolderOpen, Upload } from 'lucide-react';

export default function DocumentsPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery(
    ['documents', page, search],
    () => documentsApi.list({ page, limit: 10, search }),
    { keepPreviousData: true }
  );

  const statusColors: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    VERIFIED: 'bg-green-100 text-green-800',
    REJECTED: 'bg-red-100 text-red-800',
    EXPIRED: 'bg-gray-100 text-gray-800',
  };

  const statusLabels: Record<string, string> = {
    PENDING: 'بانتظار التحقق',
    VERIFIED: 'تم التحقق',
    REJECTED: 'مرفوض',
    EXPIRED: 'منتهي',
  };

  const columns = [
    { key: 'originalName', header: 'اسم الملف' },
    { key: 'type', header: 'النوع' },
    { key: 'client', header: 'العميل', render: (row: any) => `${row.client?.firstName} ${row.client?.lastName}` },
    { key: 'status', header: 'الحالة', render: (row: any) => (
      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[row.status] || 'bg-gray-100'}`}>
        {statusLabels[row.status] || row.status}
      </span>
    )},
    { key: 'size', header: 'الحجم', render: (row: any) => `${(row.size / 1024).toFixed(1)} KB` },
    { key: 'createdAt', header: 'تاريخ الرفع', render: (row: any) => new Date(row.createdAt).toLocaleDateString('ar-SA') },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FolderOpen className="w-6 h-6" />
            المستندات
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">إدارة المستندات والملفات</p>
        </div>
        <Button icon={<Upload className="w-4 h-4" />}>
          رفع مستند
        </Button>
      </div>

      <SearchInput 
        value={search} 
        onChange={setSearch} 
        placeholder="البحث في المستندات..."
      />

      <DataTable
        columns={columns}
        data={data?.data || []}
        isLoading={isLoading}
        meta={data?.meta}
        onPageChange={setPage}
      />
    </div>
  );
}
