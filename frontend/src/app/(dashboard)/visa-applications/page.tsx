'use client';

import { useState } from 'react';
import { useQuery } from 'react-query';
import { useRouter } from 'next/navigation';
import { visaApi } from '@/lib/api';
import { DataTable } from '@/components/tables/data-table';
import { SearchInput } from '@/components/ui/search-input';
import { Button } from '@/components/ui/button';
import { Plus, FileText } from 'lucide-react';

export default function VisaApplicationsPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery(
    ['visa-applications', page, search],
    () => visaApi.list({ page, limit: 10, search }),
    { keepPreviousData: true }
  );

  const statusColors: Record<string, string> = {
    DRAFT: 'bg-slate-100 text-slate-800',
    PENDING_REVIEW: 'bg-yellow-100 text-yellow-800',
    UNDER_REVIEW: 'bg-blue-100 text-blue-800',
    APPROVED: 'bg-green-100 text-green-800',
    REJECTED: 'bg-red-100 text-red-800',
    COMPLETED: 'bg-emerald-100 text-emerald-800',
  };

  const statusLabels: Record<string, string> = {
    DRAFT: 'مسودة',
    PENDING_REVIEW: 'بانتظار المراجعة',
    UNDER_REVIEW: 'قيد المراجعة',
    APPROVED: 'معتمد',
    REJECTED: 'مرفوض',
    COMPLETED: 'مكتمل',
  };

  const columns = [
    { key: 'applicationNumber', header: 'رقم الطلب' },
    { key: 'client', header: 'العميل', render: (row: any) => `${row.client?.firstName} ${row.client?.lastName}` },
    { key: 'destinationCountry', header: 'الدولة', render: (row: any) => row.destinationCountry?.nameAr || row.destinationCountry?.name },
    { key: 'applicationType', header: 'نوع الطلب' },
    { key: 'status', header: 'الحالة', render: (row: any) => (
      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[row.status] || 'bg-gray-100'}`}>
        {statusLabels[row.status] || row.status}
      </span>
    )},
    { key: 'createdAt', header: 'تاريخ الإنشاء', render: (row: any) => new Date(row.createdAt).toLocaleDateString('ar-SA') },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-6 h-6" />
            طلبات التأشيرة
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">إدارة طلبات التأشيرات</p>
        </div>
        <Button onClick={() => router.push('/visa-applications/new')} icon={<Plus className="w-4 h-4" />}>
          طلب جديد
        </Button>
      </div>

      <SearchInput 
        value={search} 
        onChange={setSearch} 
        placeholder="البحث برقم الطلب أو اسم العميل..."
      />

      <DataTable
        columns={columns}
        data={data?.data || []}
        isLoading={isLoading}
        meta={data?.meta}
        onPageChange={setPage}
        onRowClick={(row) => router.push(`/visa-applications/${row.id}`)}
      />
    </div>
  );
}
