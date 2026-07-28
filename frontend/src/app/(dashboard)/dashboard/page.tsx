'use client';

import { useQuery } from 'react-query';
import { visaApi } from '@/lib/api';
import { Card } from '@/components/ui/card';
import { StatCard } from '@/components/ui/stat-card';
import { FileText, Users, Globe, Clock, TrendingUp, CheckCircle } from 'lucide-react';

export default function DashboardPage() {
  const { data: stats, isLoading } = useQuery('visa-statistics', () => visaApi.statistics(), {
    refetchInterval: 30000,
  });

  const statusColors: Record<string, string> = {
    DRAFT: 'bg-slate-100 text-slate-800',
    PENDING_REVIEW: 'bg-yellow-100 text-yellow-800',
    UNDER_REVIEW: 'bg-blue-100 text-blue-800',
    APPROVED: 'bg-green-100 text-green-800',
    REJECTED: 'bg-red-100 text-red-800',
    COMPLETED: 'bg-emerald-100 text-emerald-800',
    ARCHIVED: 'bg-gray-100 text-gray-800',
  };

  const statusLabels: Record<string, string> = {
    DRAFT: 'مسودة',
    PENDING_REVIEW: 'بانتظار المراجعة',
    UNDER_REVIEW: 'قيد المراجعة',
    APPROVED: 'معتمد',
    REJECTED: 'مرفوض',
    COMPLETED: 'مكتمل',
    ARCHIVED: 'مؤرشف',
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">لوحة التحكم</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">نظرة عامة على النظام</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="إجمالي الطلبات"
          value={stats?.total || 0}
          icon={<FileText className="w-6 h-6" />}
          trend="+12%"
          trendUp={true}
        />
        <StatCard
          title="طلبات هذا الشهر"
          value={stats?.recent?.length || 0}
          icon={<TrendingUp className="w-6 h-6" />}
          trend="+5%"
          trendUp={true}
        />
        <StatCard
          title="قيد المراجعة"
          value={stats?.byStatus?.find((s: any) => s.status === 'UNDER_REVIEW')?._count?.status || 0}
          icon={<Clock className="w-6 h-6" />}
          trend="مباشر"
        />
        <StatCard
          title="مكتملة"
          value={stats?.byStatus?.find((s: any) => s.status === 'COMPLETED')?._count?.status || 0}
          icon={<CheckCircle className="w-6 h-6" />}
          trend="+8%"
          trendUp={true}
        />
      </div>

      {/* Status Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="توزيع حالات الطلبات">
          <div className="space-y-3">
            {stats?.byStatus?.map((item: any) => (
              <div key={item.status} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[item.status] || 'bg-gray-100'}`}>
                    {statusLabels[item.status] || item.status}
                  </span>
                </div>
                <span className="text-lg font-semibold text-slate-900 dark:text-white">
                  {item._count.status}
                </span>
              </div>
            )) || (
              <p className="text-slate-500 text-center py-8">لا توجد بيانات</p>
            )}
          </div>
        </Card>

        <Card title="أحدث الطلبات">
          <div className="space-y-3">
            {stats?.recent?.map((app: any) => (
              <div key={app.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">
                    {app.client?.firstName} {app.client?.lastName}
                  </p>
                  <p className="text-sm text-slate-500">{app.destinationCountry?.name}</p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[app.status]}`}>
                  {statusLabels[app.status] || app.status}
                </span>
              </div>
            )) || (
              <p className="text-slate-500 text-center py-8">لا توجد طلبات حديثة</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
