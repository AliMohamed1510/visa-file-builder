'use client';

import { useQuery } from 'react-query';
import { Building2 } from 'lucide-react';

export default function OfficesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Building2 className="w-6 h-6" />
          المكاتب
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">إدارة المكاتب والفروع</p>
      </div>
      <div className="card-visa p-12 text-center">
        <p className="text-slate-500">قريباً - إدارة المكاتب</p>
      </div>
    </div>
  );
}
