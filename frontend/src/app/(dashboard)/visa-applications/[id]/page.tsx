'use client';

import { useParams } from 'next/navigation';
import { FileText } from 'lucide-react';

export default function VisaApplicationDetailPage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
        <FileText className="w-6 h-6" />
        تفاصيل الطلب
      </h1>
      <div className="card-visa p-12 text-center">
        <p className="text-slate-500">قريباً - تفاصيل الطلب {id}</p>
      </div>
    </div>
  );
}
