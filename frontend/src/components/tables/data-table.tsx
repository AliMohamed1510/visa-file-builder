import { ReactNode } from 'react';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

interface Column {
  key: string;
  header: string;
  render?: (row: any) => ReactNode;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  isLoading?: boolean;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  onPageChange?: (page: number) => void;
  onRowClick?: (row: any) => void;
}

export function DataTable({ columns, data, isLoading, meta, onPageChange, onRowClick }: DataTableProps) {
  if (isLoading) {
    return (
      <div className="card-visa p-12 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="card-visa overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                {columns.map((col) => (
                  <th key={col.key} className="px-4 py-3 text-right text-sm font-semibold text-slate-700 dark:text-slate-300">
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-4 py-12 text-center text-slate-500">
                    لا توجد بيانات
                  </td>
                </tr>
              ) : (
                data.map((row, idx) => (
                  <tr
                    key={row.id || idx}
                    onClick={() => onRowClick?.(row)}
                    className={`border-b border-slate-100 dark:border-slate-800 transition-colors ${onRowClick ? 'cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/30' : ''}`}
                  >
                    {columns.map((col) => (
                      <td key={col.key} className="px-4 py-3 text-sm text-slate-900 dark:text-slate-100">
                        {col.render ? col.render(row) : row[col.key]}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500">
            عرض {((meta.page - 1) * meta.limit) + 1} إلى {Math.min(meta.page * meta.limit, meta.total)} من {meta.total}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange?.(meta.page - 1)}
              disabled={!meta.hasPreviousPage}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <span className="text-sm text-slate-600 dark:text-slate-400">
              صفحة {meta.page} من {meta.totalPages}
            </span>
            <button
              onClick={() => onPageChange?.(meta.page + 1)}
              disabled={!meta.hasNextPage}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
