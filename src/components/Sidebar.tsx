import { LayoutDashboard, ArrowLeftRight, Lightbulb, Shield, Sun, Moon, ChevronDown, Menu, X } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { useState } from 'react';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight },
  { id: 'insights', label: 'Insights', icon: Lightbulb },
];

export function Sidebar({ mobileOpen, onMobileClose }: { mobileOpen: boolean; onMobileClose: () => void }) {
  const { activePage, setActivePage, selectedRole, setRole, darkMode, setDarkMode } = useStore();
  const [roleOpen, setRoleOpen] = useState(false);

  const content = (
    <div className="flex flex-col h-full bg-card border-r border-border">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-border">
        <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
          <Shield size={20} className="text-primary-foreground" />
        </div>
        <span className="text-lg font-bold text-foreground tracking-tight">Zorvyn Finance</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const active = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => { setActivePage(item.id); onMobileClose(); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                active
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="px-3 pb-4 space-y-3 border-t border-border pt-4">
        {/* Role indicator */}
        <div className="px-3 py-1 text-xs font-medium text-muted-foreground">
          {selectedRole === 'admin' ? '🔐 Admin Mode' : '👁 Viewer Mode'}
        </div>

        {/* Role switcher */}
        <div className="relative">
          <button
            onClick={() => setRoleOpen(!roleOpen)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-muted text-sm font-medium text-foreground hover:bg-muted/80 transition-colors"
          >
            <span>{selectedRole === 'admin' ? 'Admin' : 'Viewer'}</span>
            <ChevronDown size={16} className={`transition-transform ${roleOpen ? 'rotate-180' : ''}`} />
          </button>
          {roleOpen && (
            <div className="absolute bottom-full mb-1 left-0 right-0 bg-popover border border-border rounded-lg shadow-xl overflow-hidden z-50">
              {(['admin', 'viewer'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => { setRole(r); setRoleOpen(false); }}
                  className={`w-full px-3 py-2 text-sm text-left hover:bg-muted transition-colors capitalize ${
                    selectedRole === r ? 'text-primary font-medium' : 'text-foreground'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Dark mode */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          {darkMode ? <Sun size={16} /> : <Moon size={16} />}
          <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-64 flex-shrink-0 h-screen sticky top-0">
        {content}
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={onMobileClose} />
          <aside className="absolute left-0 top-0 w-72 h-full animate-fade-in">
            <button onClick={onMobileClose} className="absolute top-4 right-4 z-10 text-muted-foreground hover:text-foreground">
              <X size={20} />
            </button>
            {content}
          </aside>
        </div>
      )}
    </>
  );
}
