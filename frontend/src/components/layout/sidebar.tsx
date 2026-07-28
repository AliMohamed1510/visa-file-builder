'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { 
  LayoutDashboard, 
  Users, 
  Globe, 
  FileText, 
  FolderOpen, 
  Building2, 
  UserCog, 
  Settings,
  LogOut,
  Moon,
  Sun,
  ChevronRight
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { useState } from 'react';

const navigation = [
  { name: 'لوحة التحكم', href: '/dashboard', icon: LayoutDashboard },
  { name: 'العملاء', href: '/clients', icon: Users },
  { name: 'الدول', href: '/countries', icon: Globe },
  { name: 'طلبات التأشيرة', href: '/visa-applications', icon: FileText },
  { name: 'المستندات', href: '/documents', icon: FolderOpen },
  { name: 'المكاتب', href: '/offices', icon: Building2 },
  { name: 'الموظفين', href: '/employees', icon: UserCog },
  { name: 'الإعدادات', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const { theme, setTheme } = useTheme();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside className={`fixed right-0 top-0 h-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 z-40 transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
      <div className="h-full flex flex-col">
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200 dark:border-slate-800">
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary-800 rounded-lg flex items-center justify-center">
                <span className="text-sm font-bold text-white">V</span>
              </div>
              <span className="font-bold text-slate-900 dark:text-white text-sm">Visa File</span>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ChevronRight className={`w-5 h-5 text-slate-500 transition-transform ${isCollapsed ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`sidebar-link ${isActive ? 'sidebar-link-active' : ''} ${isCollapsed ? 'justify-center' : ''}`}
                title={isCollapsed ? item.name : undefined}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="sidebar-link w-full"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            {!isCollapsed && <span>{theme === 'dark' ? 'الوضع النهاري' : 'الوضع الليلي'}</span>}
          </button>

          <button onClick={logout} className="sidebar-link w-full text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20">
            <LogOut className="w-5 h-5" />
            {!isCollapsed && <span>تسجيل الخروج</span>}
          </button>

          {!isCollapsed && user && (
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
              <p className="text-xs text-slate-400 dark:text-slate-500">{user.role}</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
