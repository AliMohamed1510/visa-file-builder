<button 
  onClick={() => {
    // Logout removed - demo mode
    window.location.href = '/dashboard';
  }} 
  className="sidebar-link w-full text-slate-600 hover:text-slate-900"
>
  <LogOut className="w-5 h-5" />
  {!isCollapsed && <span>الرئيسية</span>}
</button>