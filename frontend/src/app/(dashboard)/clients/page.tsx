'use client';

import { useState } from 'react';
import { useQuery } from 'react-query';
import { useRouter } from 'next/navigation';
import { clientsApi } from '@/lib/api';
import { DataTable } from '@/components/tables/data-table';
import { SearchInput } from '@/components/ui/search-input';
import { Button } from '@/components/ui/button';
import { Plus, Users } from 'lucide-react';

export default function ClientsPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery(
    ['clients', page, search],
    () => clientsApi.list({ page, limit: 10, search }),
    { keepPreviousData: true }
  );

  const columns = [
    { key: 'firstName', header: 'الاسم', render: (row: any) => `${row.firstName} ${row.lastName}` },
    { key: 'passportNumber', header: 'رقم الجواز' },
    { key: 'nationality', header: 'الجنسية' },
    { key: 'phone', header: 'الهاتف' },
    { key: 'createdAt', header: 'تاريخ الإضافة', render: (row: any) => new Date(row.createdAt).toLocaleDateString('ar-SA') },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-6 h-6" />
            العملاء
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">إدارة بيانات العملاء</p>
        </div>
        <Button onClick={() => router.push('/clients/new')} icon={<Plus className="w-4 h-4" />}>
          عميل جديد
        </Button>
      </div>

      <SearchInput 
        value={search} 
        onChange={setSearch} 
        placeholder="البحث بالاسم، الجواز، الهاتف..."
      />

      <DataTable
        columns={columns}
        data={data?.data || []}
        isLoading={isLoading}
        meta={data?.meta}
        onPageChange={setPage}
        onRowClick={(row) => router.push(`/clients/${row.id}`)}
      />
    </div>
  );
}
