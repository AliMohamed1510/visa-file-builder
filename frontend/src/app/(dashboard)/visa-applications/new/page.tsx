'use client';

import { useSearchParams } from 'next/navigation';
import { FileText } from 'lucide-react';

export default function NewVisaApplicationPage() {
  const searchParams = useSearchParams();
  const clientId = searchParams.get('clientId');

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
        <FileText className="w-6 h-6" />
        طلب تأشيرة جديد
      </h1>
      <div className="card-visa p-12 text-center">
        <p className="text-slate-500">قريباً - نموذج طلب التأشيرة</p>
        {clientId && <p className="text-sm text-slate-400 mt-2">العميل: {clientId}</p>}
      </div>
    </div>
  );
}
