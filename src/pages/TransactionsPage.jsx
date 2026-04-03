import { useEffect, useMemo, useRef, useState } from 'react';
import { Search, Plus, Pencil, Trash2, Download, ArrowUpDown, PackageOpen } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { formatINR, CATEGORY_BG_CLASSES } from '@/lib/format';
import { useToast } from '@/components/Toast';
import TransactionModal from '@/components/TransactionModal';

export default function TransactionsPage() {
  const { transactions, selectedRole, filters, setFilter, deleteTransaction } = useStore();
  const { showToast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [editTx, setEditTx] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const selectAllRef = useRef(null);
  const isAdmin = selectedRole === 'admin';

  const toIsoDate = (value) => {
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return '';
    return d.toISOString().slice(0, 10);
  };

  const formatDisplayDate = (value) =>
    new Date(value).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  const csvCell = (value) => `"${String(value ?? '').replace(/"/g, '""')}"`;

  const filtered = useMemo(() => {
    let result = [...transactions];
    if (filters.search) {
      const s = filters.search.toLowerCase();
      result = result.filter(t => t.description.toLowerCase().includes(s) || t.category.toLowerCase().includes(s));
    }
    if (filters.type !== 'all') {
      result = result.filter(t => t.type === filters.type);
    }
    // Keep sorting deterministic so table rows do not jump unexpectedly between renders.
    result.sort((a, b) => {
      const dir = filters.sortDir === 'asc' ? 1 : -1;
      if (filters.sortBy === 'date') return dir * (new Date(a.date).getTime() - new Date(b.date).getTime());
      return dir * (a.amount - b.amount);
    });
    return result;
  }, [transactions, filters]);

  const filteredIds = useMemo(() => filtered.map((tx) => tx.id), [filtered]);
  const selectedCount = selectedIds.length;
  const allFilteredSelected = filteredIds.length > 0 && filteredIds.every((id) => selectedIds.includes(id));
  const someFilteredSelected = filteredIds.some((id) => selectedIds.includes(id));

  useEffect(() => {
    setSelectedIds((current) => current.filter((id) => filteredIds.includes(id)));
  }, [filteredIds]);

  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = someFilteredSelected && !allFilteredSelected;
    }
  }, [someFilteredSelected, allFilteredSelected]);

  const handleExportCSV = () => {
    const header = 'Date,Description,Category,Type,Amount\n';
    const rows = filtered
      .map((t) => {
        // Excel keeps leading zeros and avoids date auto-conversion with this syntax.
        const excelDateText = `="${toIsoDate(t.date)}"`;
        return [
          excelDateText,
          csvCell(t.description),
          csvCell(t.category),
          csvCell(t.type),
          csvCell(t.amount),
        ].join(',');
      })
      .join('\n');
    const blob = new Blob(['\uFEFF' + header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transactions.csv';
    a.click();
    URL.revokeObjectURL(url);
    showToast('CSV exported', 'teal');
  };

  const handleDelete = (id) => {
    deleteTransaction(id);
    setConfirmDeleteId(null);
    setSelectedIds((current) => current.filter((selectedId) => selectedId !== id));
    showToast('Transaction deleted', 'error');
  };

  const toggleSelectAll = () => {
    setSelectedIds((current) => {
      if (allFilteredSelected) {
        return current.filter((id) => !filteredIds.includes(id));
      }
      return [...new Set([...current, ...filteredIds])];
    });
  };

  const toggleSelectTransaction = (id) => {
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((selectedId) => selectedId !== id) : [...current, id]
    );
  };

  const handleDeleteSelected = () => {
    selectedIds.forEach((id) => deleteTransaction(id));
    setSelectedIds([]);
    setConfirmDeleteId(null);
    showToast(`${selectedCount} transactions deleted`, 'error');
  };

  const toggleSort = (field) => {
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
              placeholder="Search by category or description"
              value={filters.search}
              onChange={(e) => setFilter({ search: e.target.value })}
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:outline-none transition-colors"
            />
          </div>
          <select
            value={filters.type}
            onChange={(e) => setFilter({ type: e.target.value })}
            className="px-3 py-2 rounded-lg bg-card border border-border text-sm text-foreground focus:ring-2 focus:ring-ring focus:outline-none"
          >
            <option value="all">All types</option>
            <option value="Income">Income</option>
            <option value="Expense">Expense</option>
          </select>
        </div>
        <div className="flex gap-2">
          {isAdmin && selectedCount > 0 && (
            <button onClick={handleDeleteSelected} className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-destructive text-destructive-foreground text-sm font-medium hover:opacity-90 transition-opacity">
              <Trash2 size={14} /> Delete Selected ({selectedCount})
            </button>
          )}
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
      <div className="bg-card rounded-xl border border-border overflow-x-auto ambient-surface">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              {isAdmin && (
                <th className="px-4 py-3 font-medium text-muted-foreground">
                  <input
                    ref={selectAllRef}
                    type="checkbox"
                    checked={allFilteredSelected}
                    onChange={toggleSelectAll}
                    className="h-4 w-4 cursor-pointer rounded border-border text-primary focus:ring-ring"
                    aria-label="Select all transactions"
                  />
                </th>
              )}
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
                <td colSpan={isAdmin ? 7 : 5} className="py-16 text-center">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <PackageOpen size={40} strokeWidth={1.5} />
                    <p className="text-sm font-medium">No matching transactions</p>
                    <p className="text-xs">Adjust filters or clear search to see full ledger</p>
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((tx) => (
                <tr key={tx.id} className={`border-b border-border last:border-0 transition-colors ${selectedIds.includes(tx.id) ? 'bg-primary/5' : 'hover:bg-muted/30'}`}>
                  {isAdmin && (
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(tx.id)}
                        onChange={() => toggleSelectTransaction(tx.id)}
                        className="h-4 w-4 cursor-pointer rounded border-border text-primary focus:ring-ring"
                        aria-label={`Select transaction ${tx.description}`}
                      />
                    </td>
                  )}
                  <td className="px-4 py-3 text-foreground whitespace-nowrap">{formatDisplayDate(tx.date)}</td>
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

      {isAdmin && (
        <button
          onClick={() => {
            setEditTx(null);
            setModalOpen(true);
          }}
          className="fixed bottom-8 right-8 z-50 flex h-[62px] w-[62px] items-center justify-center rounded-full bg-[#3B7EF6] text-white shadow-2xl transition-all duration-200 hover:bg-blue-700 hover:scale-110"
          style={{ bottom: 'max(2rem, env(safe-area-inset-bottom))', right: 'max(2rem, env(safe-area-inset-right))' }}
          aria-label="Add Transaction"
        >
          <Plus size={28} strokeWidth={3} />
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
