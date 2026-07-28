'use client';

import { useQuery } from 'react-query';
import { useParams, useRouter } from 'next/navigation';
import { clientsApi } from '@/lib/api';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, User, FileText, Phone, Mail, MapPin, Calendar } from 'lucide-react';

export default function ClientDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: client, isLoading } = useQuery(['client', id], () => clientsApi.get(id));

  if (isLoading) {
    return <div className="p-12 text-center">جاري التحميل...</div>;
  }

  if (!client) {
    return <div className="p-12 text-center text-red-600">العميل غير موجود</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={() => router.back()} className="text-slate-500 hover:text-slate-700">
            <ArrowRight className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            {client.firstName} {client.lastName}
          </h1>
        </div>
        <Button onClick={() => router.push(`/visa-applications/new?clientId=${id}`)}>
          طلب تأشيرة جديد
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card title="المعلومات الشخصية">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoItem icon={<User className="w-4 h-4" />} label="الاسم" value={`${client.firstName} ${client.lastName}`} />
              <InfoItem icon={<Mail className="w-4 h-4" />} label="البريد الإلكتروني" value={client.email || '—'} />
              <InfoItem icon={<Phone className="w-4 h-4" />} label="الهاتف" value={client.phone || '—'} />
              <InfoItem icon={<FileText className="w-4 h-4" />} label="رقم الجواز" value={client.passportNumber || '—'} />
              <InfoItem icon={<MapPin className="w-4 h-4" />} label="الجنسية" value={client.nationality || '—'} />
              <InfoItem icon={<Calendar className="w-4 h-4" />} label="تاريخ الميلاد" value={client.dateOfBirth ? new Date(client.dateOfBirth).toLocaleDateString('ar-SA') : '—'} />
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="طلبات التأشيرة">
            {client.visaApplications?.length > 0 ? (
              <div className="space-y-2">
                {client.visaApplications.map((app: any) => (
                  <div key={app.id} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 cursor-pointer hover:bg-slate-100" onClick={() => router.push(`/visa-applications/${app.id}`)}>
                    <p className="font-medium text-sm">{app.applicationNumber}</p>
                    <p className="text-xs text-slate-500">{app.status}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 text-center py-4">لا توجد طلبات</p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
        {icon}
      </div>
      <div>
        <p className="text-xs text-slate-500">{label}</p>
        <p className="text-sm font-medium text-slate-900 dark:text-white">{value}</p>
      </div>
    </div>
  );
}
