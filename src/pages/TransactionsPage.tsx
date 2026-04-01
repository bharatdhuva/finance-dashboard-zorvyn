import { useState, useMemo } from 'react';
import { Search, Plus, Pencil, Trash2, Download, ArrowUpDown, PackageOpen } from 'lucide-react';
import { useStore, Transaction } from '@/store/useStore';
import { formatINR, CATEGORY_BG_CLASSES } from '@/lib/format';
import { useToast } from '@/components/Toast';
import TransactionModal from '@/components/TransactionModal';

export default function TransactionsPage() {
  const { transactions, selectedRole, filters, setFilter, deleteTransaction } = useStore();
  const { showToast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [editTx, setEditTx] = useState<Transaction | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const isAdmin = selectedRole === 'admin';

  const filtered = useMemo(() => {
    let result = [...transactions];
    if (filters.search) {
      const s = filters.search.toLowerCase();
      result = result.filter(t => t.description.toLowerCase().includes(s) || t.category.toLowerCase().includes(s));
    }
    if (filters.type !== 'all') {
      result = result.filter(t => t.type === filters.type);
    }
    result.sort((a, b) => {
      const dir = filters.sortDir === 'asc' ? 1 : -1;
      if (filters.sortBy === 'date') return dir * (new Date(a.date).getTime() - new Date(b.date).getTime());
      return dir * (a.amount - b.amount);
    });
    return result;
  }, [transactions, filters]);

  const handleExportCSV = () => {
    const header = 'Date,Description,Category,Type,Amount\n';
    const rows = filtered.map(t => `${t.date},"${t.description}",${t.category},${t.type},${t.amount}`).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transactions.csv';
    a.click();
    URL.revokeObjectURL(url);
    showToast('CSV exported', 'teal');
  };

  const handleDelete = (id: string) => {
    deleteTransaction(id);
    setConfirmDeleteId(null);
    showToast('Transaction deleted', 'error');
  };

  const toggleSort = (field: 'date' | 'amount') => {
    if (filters.sortBy === field) {
      setFilter({ sortDir: filters.sortDir === 'asc' ? 'desc' : 'asc' });
    } else {
      setFilter({ sortBy: field, sortDir: 'desc' });
    }
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-2 flex-1 w-full sm:w-auto">
          <div className="relative flex-1 sm:max-w-xs">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={filters.search}
              onChange={(e) => setFilter({ search: e.target.value })}
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:outline-none transition-colors"
            />
          </div>
          <select
            value={filters.type}
            onChange={(e) => setFilter({ type: e.target.value as any })}
            className="px-3 py-2 rounded-lg bg-card border border-border text-sm text-foreground focus:ring-2 focus:ring-ring focus:outline-none"
          >
            <option value="all">All</option>
            <option value="Income">Income</option>
            <option value="Expense">Expense</option>
          </select>
        </div>
        <div className="flex gap-2">
          <button onClick={() => toggleSort('date')} className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-card border border-border text-sm text-foreground hover:bg-muted transition-colors">
            <ArrowUpDown size={14} /> Date
          </button>
          <button onClick={() => toggleSort('amount')} className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-card border border-border text-sm text-foreground hover:bg-muted transition-colors">
            <ArrowUpDown size={14} /> Amount
          </button>
          <button onClick={handleExportCSV} className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-accent text-accent-foreground text-sm font-medium hover:opacity-90 transition-opacity">
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl border border-border overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="px-4 py-3 font-medium text-muted-foreground">Date</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">Description</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">Category</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">Type</th>
              <th className="px-4 py-3 font-medium text-muted-foreground text-right">Amount</th>
              {isAdmin && <th className="px-4 py-3 font-medium text-muted-foreground text-right">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={isAdmin ? 6 : 5} className="py-16 text-center">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <PackageOpen size={40} strokeWidth={1.5} />
                    <p className="text-sm font-medium">No transactions found</p>
                    <p className="text-xs">Try adjusting your search or filters</p>
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((tx) => (
                <tr key={tx.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 text-foreground whitespace-nowrap">{new Date(tx.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                  <td className="px-4 py-3 text-foreground">{tx.description}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${CATEGORY_BG_CLASSES[tx.category] || 'bg-muted text-muted-foreground'}`}>
                      {tx.category}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold ${tx.type === 'Income' ? 'text-success' : 'text-destructive'}`}>
                      {tx.type}
                    </span>
                  </td>
                  <td className={`px-4 py-3 text-right font-semibold whitespace-nowrap ${tx.type === 'Income' ? 'text-success' : 'text-destructive'}`}>
                    {tx.type === 'Income' ? '+' : '-'}{formatINR(tx.amount)}
                  </td>
                  {isAdmin && (
                    <td className="px-4 py-3 text-right">
                      {confirmDeleteId === tx.id ? (
                        <div className="flex items-center justify-end gap-2">
                          <span className="text-xs text-muted-foreground">Delete?</span>
                          <button onClick={() => handleDelete(tx.id)} className="text-xs px-2 py-1 rounded bg-destructive text-destructive-foreground hover:opacity-90">Yes</button>
                          <button onClick={() => setConfirmDeleteId(null)} className="text-xs px-2 py-1 rounded bg-muted text-foreground hover:opacity-90">No</button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => { setEditTx(tx); setModalOpen(true); }} className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
                            <Pencil size={14} />
                          </button>
                          <button onClick={() => setConfirmDeleteId(tx.id)} className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      )}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* FAB */}
      {isAdmin && (
        <button
          onClick={() => { setEditTx(null); setModalOpen(true); }}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg glow-primary hover:scale-105 transition-transform z-40"
        >
          <Plus size={24} />
        </button>
      )}

      {/* Modal */}
      {modalOpen && (
        <TransactionModal
          transaction={editTx}
          onClose={() => { setModalOpen(false); setEditTx(null); }}
        />
      )}
    </div>
  );
}
