'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from 'react-query';
import { useRouter } from 'next/navigation';
import { clientsApi } from '@/lib/api';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { ArrowRight, UserPlus } from 'lucide-react';

const clientSchema = z.object({
  firstName: z.string().min(2, 'الاسم الأول مطلوب'),
  lastName: z.string().min(2, 'الاسم الأخير مطلوب'),
  email: z.string().email('بريد إلكتروني غير صالح').optional().or(z.literal('')),
  phone: z.string().optional(),
  passportNumber: z.string().optional(),
  nationality: z.string().optional(),
  dateOfBirth: z.string().optional(),
});

type ClientForm = z.infer<typeof clientSchema>;

export default function NewClientPage() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm<ClientForm>({
    resolver: zodResolver(clientSchema),
  });

  const mutation = useMutation(clientsApi.create, {
    onSuccess: () => {
      toast.success('تم إضافة العميل بنجاح');
      router.push('/clients');
    },
    onError: (error: any) => {
      toast.error(error.message || 'فشل إضافة العميل');
    },
  });

  const onSubmit = (data: ClientForm) => {
    mutation.mutate(data);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-2">
        <button onClick={() => router.back()} className="text-slate-500 hover:text-slate-700">
          <ArrowRight className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <UserPlus className="w-6 h-6" />
          عميل جديد
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="card-visa space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">الاسم الأول *</label>
            <input {...register('firstName')} className="input-field" />
            {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">الاسم الأخير *</label>
            <input {...register('lastName')} className="input-field" />
            {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">البريد الإلكتروني</label>
            <input {...register('email')} type="email" className="input-field" dir="ltr" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">الهاتف</label>
            <input {...register('phone')} className="input-field" dir="ltr" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">رقم الجواز</label>
            <input {...register('passportNumber')} className="input-field" dir="ltr" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">الجنسية</label>
            <input {...register('nationality')} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">تاريخ الميلاد</label>
            <input {...register('dateOfBirth')} type="date" className="input-field" />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="secondary" onClick={() => router.back()}>
            إلغاء
          </Button>
          <Button type="submit" isLoading={mutation.isLoading}>
            حفظ العميل
          </Button>
        </div>
      </form>
    </div>
  );
}
