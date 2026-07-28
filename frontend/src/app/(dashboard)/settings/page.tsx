'use client';

import { Settings } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Settings className="w-6 h-6" />
          الإعدادات
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">إعدادات النظام العامة</p>
      </div>
      <div className="card-visa p-12 text-center">
        <p className="text-slate-500">قريباً - الإعدادات</p>
      </div>
    </div>
  );
}
