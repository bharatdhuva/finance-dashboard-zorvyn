import { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { Sidebar } from '@/components/Sidebar';
import { Navbar } from '@/components/Navbar';
import { ToastProvider } from '@/components/Toast';
import DashboardPage from '@/pages/DashboardPage';
import TransactionsPage from '@/pages/TransactionsPage';
import InsightsPage from '@/pages/InsightsPage';

export default function Layout() {
  const { darkMode, activePage } = useStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const renderPage = () => {
    switch (activePage) {
      case 'transactions': return <TransactionsPage />;
      case 'insights': return <InsightsPage />;
      default: return <DashboardPage />;
    }
  };

  return (
    <ToastProvider>
      <div className="flex min-h-screen bg-background">
        <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
        <div className="flex-1 flex flex-col min-w-0">
          <Navbar onMenuClick={() => setMobileOpen(true)} />
          <main className="flex-1 p-4 md:p-6 animate-fade-in" key={activePage}>
            {renderPage()}
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}
