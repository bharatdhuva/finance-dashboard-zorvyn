import { Sun, Moon, Menu } from 'lucide-react';
import { useStore } from '@/store/useStore';

const pageNames: Record<string, string> = {
  dashboard: 'Dashboard',
  transactions: 'Transactions',
  insights: 'Insights',
};

export function Navbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { activePage, selectedRole, darkMode, setDarkMode } = useStore();

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between h-14 px-4 md:px-6 border-b border-border bg-card/80 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="lg:hidden text-muted-foreground hover:text-foreground transition-colors">
          <Menu size={20} />
        </button>
        <h1 className="text-lg font-semibold text-foreground">{pageNames[activePage] || 'Dashboard'}</h1>
      </div>

      <div className="flex items-center gap-3">
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
          selectedRole === 'admin'
            ? 'bg-primary/15 text-primary'
            : 'bg-muted text-muted-foreground'
        }`}>
          {selectedRole === 'admin' ? 'Admin' : 'Viewer'}
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
