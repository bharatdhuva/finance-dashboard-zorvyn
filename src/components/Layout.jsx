import { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { Sidebar } from '@/components/Sidebar';
import { Navbar } from '@/components/Navbar';
import { ToastProvider } from '@/components/Toast';
import DashboardPage from '@/pages/DashboardPage';
import TransactionsPage from '@/pages/TransactionsPage';
import AnalysisPage from '@/pages/AnalysisPage';

export default function Layout() {
  const { darkMode, activePage } = useStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  useEffect(() => {
    const titles = {
      dashboard: 'Finance Dashboard',
      transactions: 'Transactions Ledger',
      analysis: 'Spending Analysis',
    };
    document.title = titles[activePage] || 'Zorvyn Finance Dashboard';
  }, [activePage]);

  const renderPage = () => {
    switch (activePage) {
      case 'transactions': return <TransactionsPage />;
      case 'analysis': return <AnalysisPage />;
      default: return <DashboardPage />;
    }
  };

  return (
    <ToastProvider>
      <div className="relative flex min-h-screen bg-background">
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -left-20 top-16 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute right-0 top-1/3 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
        </div>
        <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
        <div className="flex-1 flex flex-col min-w-0">
          <Navbar onMenuClick={() => setMobileOpen(true)} />
          <main className="flex-1 p-4 md:p-6 animate-float-in" key={activePage}>
            {renderPage()}
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}
