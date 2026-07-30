<div className="p-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
  <button
    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    className="sidebar-link w-full"
  >
    {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    {!isCollapsed && <span>{theme === 'dark' ? 'الوضع النهاري' : 'الوضع الليلي'}</span>}
  </button>

  <Link href="/dashboard" className="sidebar-link w-full">
    <LayoutDashboard className="w-5 h-5" />
    {!isCollapsed && <span>الرئيسية</span>}
  </Link>
</div>