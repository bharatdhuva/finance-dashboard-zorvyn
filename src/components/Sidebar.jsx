import { LayoutDashboard, ArrowRightLeft, BarChart3, Sun, Moon, ChevronDown, X } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { useState } from 'react';
import zorvynLogo from '../../assets/zorvynfulllogolight.png';

const navItems = [
  { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
  { id: 'transactions', label: 'Transactions', icon: ArrowRightLeft },
  { id: 'analysis', label: 'Analysis', icon: BarChart3 },
];

export function Sidebar({ mobileOpen, onMobileClose }) {
  const { activePage, setActivePage, selectedRole, setRole, darkMode, setDarkMode } = useStore();
  const [roleOpen, setRoleOpen] = useState(false);
  const [iconAnimationTick, setIconAnimationTick] = useState({});

  const handleNavClick = (id) => {
    setIconAnimationTick((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }));
    setActivePage(id);
    onMobileClose();
  };

  const content = (
    <div className="flex flex-col h-full bg-card border-r border-border ambient-surface">
      {/* Logo */}
      <button
        onClick={() => { setActivePage('dashboard'); onMobileClose(); }}
        className="flex items-center px-5 py-5 border-b border-border transition-colors hover:bg-muted/40"
      >
        <div className="w-full flex items-center justify-start pl-1">
          <img src={zorvynLogo} alt="Zorvyn Fintech" className="h-10 w-auto" />
        </div>
      </button>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const active = activePage === item.id;
          const hasAnimated = (iconAnimationTick[item.id] ?? 0) > 0;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`group w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                active
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <span
                key={`${item.id}-${iconAnimationTick[item.id] ?? 0}`}
                className={hasAnimated ? 'inline-flex animate-nav-icon-pop' : 'inline-flex'}
              >
                <item.icon size={18} />
              </span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="px-3 pb-4 space-y-3 border-t border-border pt-4">
        {/* Role indicator */}
        <div className="px-3 py-1 text-xs font-medium text-muted-foreground">
          {selectedRole === 'admin' ? 'Mode: admin' : 'Mode: viewer'}
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
              {['admin', 'viewer'].map((r) => (
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
          <span>{darkMode ? 'Switch to Light' : 'Switch to Dark'}</span>
        </button>

        <p className="px-3 text-[11px] leading-relaxed text-muted-foreground">
          Built for handoff-ready reporting with clear, role-based controls.
        </p>
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
