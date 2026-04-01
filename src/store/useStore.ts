import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  type: 'Income' | 'Expense';
  amount: number;
}

interface Filters {
  search: string;
  type: 'all' | 'Income' | 'Expense';
  sortBy: 'date' | 'amount';
  sortDir: 'asc' | 'desc';
}

interface Store {
  transactions: Transaction[];
  selectedRole: 'admin' | 'viewer';
  darkMode: boolean;
  activePage: string;
  filters: Filters;
  setRole: (role: 'admin' | 'viewer') => void;
  setDarkMode: (v: boolean) => void;
  setActivePage: (p: string) => void;
  setFilter: (f: Partial<Filters>) => void;
  addTransaction: (t: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string, t: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
}

const generateId = () => Math.random().toString(36).slice(2, 10);

const MOCK: Transaction[] = [
  { id: generateId(), date: '2024-10-02', description: 'Monthly Salary', category: 'Salary', type: 'Income', amount: 55000 },
  { id: generateId(), date: '2024-10-05', description: 'Freelance Web Project', category: 'Freelance', type: 'Income', amount: 18000 },
  { id: generateId(), date: '2024-10-03', description: 'Grocery Shopping', category: 'Food', type: 'Expense', amount: 1800 },
  { id: generateId(), date: '2024-10-06', description: 'Uber Rides', category: 'Transport', type: 'Expense', amount: 450 },
  { id: generateId(), date: '2024-10-08', description: 'Amazon Purchase', category: 'Shopping', type: 'Expense', amount: 3200 },
  { id: generateId(), date: '2024-10-10', description: 'Electricity Bill', category: 'Bills', type: 'Expense', amount: 1800 },
  { id: generateId(), date: '2024-10-12', description: 'Movie Night', category: 'Entertainment', type: 'Expense', amount: 850 },
  { id: generateId(), date: '2024-10-14', description: 'Gym Membership', category: 'Health', type: 'Expense', amount: 2500 },
  { id: generateId(), date: '2024-10-16', description: 'Restaurant Dinner', category: 'Food', type: 'Expense', amount: 1200 },
  { id: generateId(), date: '2024-10-19', description: 'Metro Card Recharge', category: 'Transport', type: 'Expense', amount: 500 },
  { id: generateId(), date: '2024-10-22', description: 'Online Shopping', category: 'Shopping', type: 'Expense', amount: 4500 },
  { id: generateId(), date: '2024-10-25', description: 'Internet Bill', category: 'Bills', type: 'Expense', amount: 999 },
  { id: generateId(), date: '2024-11-01', description: 'Monthly Salary', category: 'Salary', type: 'Income', amount: 55000 },
  { id: generateId(), date: '2024-11-03', description: 'Freelance Design Work', category: 'Freelance', type: 'Income', amount: 18000 },
  { id: generateId(), date: '2024-11-04', description: 'Swiggy Orders', category: 'Food', type: 'Expense', amount: 1450 },
  { id: generateId(), date: '2024-11-06', description: 'Ola Cab', category: 'Transport', type: 'Expense', amount: 320 },
  { id: generateId(), date: '2024-11-08', description: 'Flipkart Sale', category: 'Shopping', type: 'Expense', amount: 2800 },
  { id: generateId(), date: '2024-11-10', description: 'Gas Bill', category: 'Bills', type: 'Expense', amount: 800 },
  { id: generateId(), date: '2024-11-12', description: 'Concert Tickets', category: 'Entertainment', type: 'Expense', amount: 1500 },
  { id: generateId(), date: '2024-11-14', description: 'Doctor Visit', category: 'Health', type: 'Expense', amount: 1200 },
  { id: generateId(), date: '2024-11-17', description: 'Street Food', category: 'Food', type: 'Expense', amount: 650 },
  { id: generateId(), date: '2024-11-20', description: 'Auto Rickshaw', category: 'Transport', type: 'Expense', amount: 200 },
  { id: generateId(), date: '2024-11-22', description: 'Myntra Purchase', category: 'Shopping', type: 'Expense', amount: 1200 },
  { id: generateId(), date: '2024-11-25', description: 'Water Bill', category: 'Bills', type: 'Expense', amount: 450 },
  { id: generateId(), date: '2024-11-27', description: 'Netflix Subscription', category: 'Entertainment', type: 'Expense', amount: 649 },
  { id: generateId(), date: '2024-12-01', description: 'Monthly Salary', category: 'Salary', type: 'Income', amount: 55000 },
  { id: generateId(), date: '2024-12-03', description: 'Freelance App Dev', category: 'Freelance', type: 'Income', amount: 18000 },
  { id: generateId(), date: '2024-12-04', description: 'Zomato Orders', category: 'Food', type: 'Expense', amount: 1600 },
  { id: generateId(), date: '2024-12-06', description: 'Rapido Bike', category: 'Transport', type: 'Expense', amount: 900 },
  { id: generateId(), date: '2024-12-09', description: 'Electronics Purchase', category: 'Shopping', type: 'Expense', amount: 3800 },
  { id: generateId(), date: '2024-12-11', description: 'Mobile Recharge', category: 'Bills', type: 'Expense', amount: 599 },
  { id: generateId(), date: '2024-12-14', description: 'Gaming Subscription', category: 'Entertainment', type: 'Expense', amount: 500 },
  { id: generateId(), date: '2024-12-16', description: 'Pharmacy', category: 'Health', type: 'Expense', amount: 400 },
  { id: generateId(), date: '2024-12-20', description: 'Cafe Visit', category: 'Food', type: 'Expense', amount: 750 },
  { id: generateId(), date: '2024-12-24', description: 'Holiday Shopping', category: 'Shopping', type: 'Expense', amount: 2500 },
];

export const useStore = create<Store>()(
  persist(
    (set) => ({
      transactions: MOCK,
      selectedRole: 'viewer',
      darkMode: true,
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
      partialize: (state) => ({
        transactions: state.transactions,
        selectedRole: state.selectedRole,
        darkMode: state.darkMode,
      }),
    }
  )
);
