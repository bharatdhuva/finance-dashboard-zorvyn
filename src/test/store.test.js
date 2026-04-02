import { describe, it, expect, beforeEach } from 'vitest';
import { useStore } from '@/store/useStore';

const { getState, setState } = useStore;

const seed = () => [
  { id: 'a1', date: '2026-03-01', description: 'Salary', category: 'Salary', type: 'Income', amount: 35000 },
  { id: 'a2', date: '2026-03-05', description: 'Groceries', category: 'Food', type: 'Expense', amount: 1200 },
  { id: 'a3', date: '2026-03-10', description: 'Bus pass', category: 'Transport', type: 'Expense', amount: 500 },
];

beforeEach(() => {
  setState({
    transactions: seed(),
    selectedRole: 'viewer',
    darkMode: false,
    filters: { search: '', type: 'all', sortBy: 'date', sortDir: 'desc' },
  });
});

describe('Transaction CRUD', () => {
  it('adds a new transaction', () => {
    getState().addTransaction({
      date: '2026-03-15',
      description: 'Coffee',
      category: 'Food',
      type: 'Expense',
      amount: 150,
    });

    const txns = getState().transactions;
    expect(txns).toHaveLength(4);
    expect(txns[3].description).toBe('Coffee');
    expect(txns[3].amount).toBe(150);
    expect(txns[3].id).toBeDefined();
  });

  it('updates an existing transaction', () => {
    getState().updateTransaction('a2', {
      date: '2026-03-05',
      description: 'Weekly groceries',
      category: 'Food',
      type: 'Expense',
      amount: 1800,
    });

    const updated = getState().transactions.find((t) => t.id === 'a2');
    expect(updated.description).toBe('Weekly groceries');
    expect(updated.amount).toBe(1800);
  });

  it('deletes a transaction', () => {
    getState().deleteTransaction('a3');
    const txns = getState().transactions;
    expect(txns).toHaveLength(2);
    expect(txns.find((t) => t.id === 'a3')).toBeUndefined();
  });

  it('delete of non-existent id is safe', () => {
    getState().deleteTransaction('does-not-exist');
    expect(getState().transactions).toHaveLength(3);
  });
});

describe('Role management', () => {
  it('defaults to viewer', () => {
    expect(getState().selectedRole).toBe('viewer');
  });

  it('switches to admin', () => {
    getState().setRole('admin');
    expect(getState().selectedRole).toBe('admin');
  });
});

describe('Dark mode', () => {
  it('toggles dark mode', () => {
    expect(getState().darkMode).toBe(false);
    getState().setDarkMode(true);
    expect(getState().darkMode).toBe(true);
  });
});

describe('Filters', () => {
  it('sets search filter', () => {
    getState().setFilter({ search: 'salary' });
    expect(getState().filters.search).toBe('salary');
  });

  it('sets type filter while preserving other filters', () => {
    getState().setFilter({ search: 'test' });
    getState().setFilter({ type: 'Income' });
    const f = getState().filters;
    expect(f.type).toBe('Income');
    expect(f.search).toBe('test');
  });

  it('sets sort fields', () => {
    getState().setFilter({ sortBy: 'amount', sortDir: 'asc' });
    const f = getState().filters;
    expect(f.sortBy).toBe('amount');
    expect(f.sortDir).toBe('asc');
  });
});
