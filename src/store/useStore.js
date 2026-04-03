import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const generateId = () => Math.random().toString(36).slice(2, 10);

// Legacy datasets used 2024 placeholder dates. Remap them once during hydration.
const remapLegacyDate = (date) => {
  if (date.startsWith('2024-10-')) return date.replace('2024-10-', '2026-01-');
  if (date.startsWith('2024-11-')) return date.replace('2024-11-', '2026-02-');
  if (date.startsWith('2024-12-')) return date.replace('2024-12-', '2026-03-');
  return date;
};

const remapTransactionDates = (transactions) =>
  transactions.map((tx) => ({ ...tx, date: remapLegacyDate(tx.date) }));

const MOCK = [
  {
    id: 'tx-20260403-01',
    date: '2026-04-03',
    description: 'Movie',
    category: 'Entertainment',
    type: 'Expense',
    amount: 899,
  },
  {
    id: 'tx-20260403-02',
    date: '2026-04-03',
    description: 'Zudio Shopping',
    category: 'Shopping',
    type: 'Expense',
    amount: 2500,
  },
  {
    id: 'tx-20260402-01',
    date: '2026-04-02',
    description: 'SIPs',
    category: 'Other',
    type: 'Expense',
    amount: 5000,
  },
  {
    id: 'tx-20260402-02',
    date: '2026-04-02',
    description: 'Skill Improvement Courses',
    category: 'Other',
    type: 'Expense',
    amount: 4999,
  },
  {
    id: 'tx-20260401-01',
    date: '2026-04-01',
    description: 'Salary Credited',
    category: 'Salary',
    type: 'Income',
    amount: 35000,
  },
  {
    id: 'tx-20260331-01',
    date: '2026-03-31',
    description: 'rapido bike',
    category: 'Transport',
    type: 'Expense',
    amount: 110,
  },
  {
    id: 'tx-20260324-01',
    date: '2026-03-24',
    description: 'Freelance payout',
    category: 'Freelance',
    type: 'Income',
    amount: 12000,
  },
  {
    id: 'tx-20260320-01',
    date: '2026-03-20',
    description: 'Weekend groceries',
    category: 'Food',
    type: 'Expense',
    amount: 1890,
  },
  {
    id: 'tx-20260330-01',
    date: '2026-03-30',
    description: 'Mobile recharge',
    category: 'Bills',
    type: 'Expense',
    amount: 349,
  },
  {
    id: 'tx-20260226-01',
    date: '2026-02-26',
    description: 'Electricity bill',
    category: 'Bills',
    type: 'Expense',
    amount: 2450,
  },
  {
    id: 'tx-20260218-01',
    date: '2026-02-18',
    description: 'Fuel refill',
    category: 'Transport',
    type: 'Expense',
    amount: 1700,
  },
  {
    id: 'tx-20260201-01',
    date: '2026-02-01',
    description: 'Salary Credited',
    category: 'Salary',
    type: 'Income',
    amount: 34000,
  },
];

export const useStore = create(
  persist(
    (set) => ({
      transactions: remapTransactionDates(MOCK),
      selectedRole: 'viewer',
      darkMode: false,
      activePage: 'dashboard',
      filters: { search: '', type: 'all', sortBy: 'date', sortDir: 'desc' },
      setRole: (role) => set({ selectedRole: role }),
      setDarkMode: (v) => set({ darkMode: v }),
      setActivePage: (p) => set({ activePage: p }),
      setFilter: (f) => set((s) => ({ filters: { ...s.filters, ...f } })),
      addTransaction: (t) => set((s) => ({
        transactions: [...s.transactions, { ...t, id: generateId() }],
      })),
      updateTransaction: (id, t) => set((s) => ({
        transactions: s.transactions.map((tx) => tx.id === id ? { ...t, id } : tx),
      })),
      deleteTransaction: (id) => set((s) => ({
        transactions: s.transactions.filter((tx) => tx.id !== id),
      })),
    }),
    {
      name: 'zorvyn-finance-store',
      version: 2,
      // Persist only user-controlled state; derived UI state should reset per session.
      partialize: (state) => ({
        transactions: state.transactions,
        selectedRole: state.selectedRole,
        darkMode: state.darkMode,
      }),
      migrate: (persistedState) => {
        if (!persistedState || typeof persistedState !== 'object') return persistedState;
        return {
          ...persistedState,
          transactions: Array.isArray(persistedState.transactions)
            ? remapTransactionDates(persistedState.transactions)
            : persistedState.transactions,
        };
      },
    }
  )
);
