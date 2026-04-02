import { Sun, Moon, Menu } from 'lucide-react';
import { useStore } from '@/store/useStore';

const pageNames = {
  dashboard: 'Financial Overview',
  transactions: 'Transactions Ledger',
  insights: 'Spending Insights',
};

export function Navbar({ onMenuClick }) {
  const { activePage, selectedRole, darkMode, setDarkMode } = useStore();
  const todayLabel = new Date().toLocaleDateString('en-IN', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
  });

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between h-16 px-4 md:px-6 border-b border-border bg-card/75 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="lg:hidden text-muted-foreground hover:text-foreground transition-colors">
          <Menu size={20} />
        </button>
        <div>
          <h1 className="text-lg font-semibold text-foreground">{pageNames[activePage] || 'Financial Overview'}</h1>
          <p className="text-xs text-muted-foreground">{todayLabel} • Prepared for weekly review</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
          selectedRole === 'admin'
            ? 'bg-primary/15 text-primary border-primary/20'
            : 'bg-muted text-muted-foreground border-border'
        }`}>
          {selectedRole === 'admin' ? 'Admin Access' : 'Viewer Access'}
        </span>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </header>
  );
}
