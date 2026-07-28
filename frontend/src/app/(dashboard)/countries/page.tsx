'use client';

import { useQuery } from 'react-query';
import { countriesApi } from '@/lib/api';
import { Card } from '@/components/ui/card';
import { Globe, CheckCircle2 } from 'lucide-react';

export default function CountriesPage() {
  const { data: countries, isLoading } = useQuery('countries', () => countriesApi.list({ schengen: 'true' }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Globe className="w-6 h-6" />
          دول الشنغن
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">الدول المدعومة للتأشيرات</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {countries?.map((country: any) => (
          <Card key={country.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">{country.nameAr || country.name}</h3>
                <p className="text-sm text-slate-500 mt-1">{country.name}</p>
                <p className="text-xs text-slate-400 mt-1 font-mono" dir="ltr">{country.code}</p>
              </div>
              {country.isSchengen && (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium">
                  <CheckCircle2 className="w-3 h-3" />
                  شنغن
                </span>
              )}
            </div>
          </Card>
        )) || (
          <div className="col-span-full text-center py-12">
            <p className="text-slate-500">جاري التحميل...</p>
          </div>
        )}
      </div>
    </div>
  );
}
