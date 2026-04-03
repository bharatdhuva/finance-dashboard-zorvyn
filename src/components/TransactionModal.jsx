import { useState } from 'react';
import { X } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { useToast } from '@/components/Toast';

const CATEGORIES = ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Salary', 'Freelance', 'Other'];

export default function TransactionModal({ transaction, onClose }) {
  const { addTransaction, updateTransaction } = useStore();
  const { showToast } = useToast();
  const isEdit = !!transaction;

  const [form, setForm] = useState({
    date: transaction?.date || '',
    description: transaction?.description || '',
    category: transaction?.category || 'Food',
    type: transaction?.type || 'Expense',
    amount: transaction?.amount?.toString() || '',
  });
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.date) e.date = 'Date is required';
    if (!form.description || form.description.trim().length < 3) e.description = 'Min 3 characters';
    if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0) e.amount = 'Must be greater than 0';
    return e;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    setSubmitted(true);
    const e = validate();
    if (Object.keys(e).length > 0) return;

    const data = {
      date: form.date,
      description: form.description.trim(),
      category: form.category,
      type: form.type,
      amount: Number(form.amount),
    };

    if (isEdit && transaction) {
      updateTransaction(transaction.id, data);
      showToast('Transaction updated successfully', 'info');
    } else {
      addTransaction(data);
      showToast('Transaction added successfully', 'success');
    }
    onClose();
  };

  // Show validation only after first submit attempt.
  const errs = submitted ? validate() : {};
  const isValid = Object.keys(validate()).length === 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-card border border-border rounded-xl w-full max-w-md p-6 shadow-2xl animate-fade-in">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-foreground">{isEdit ? 'Edit Transaction' : 'Add Transaction'}</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Date */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Date</label>
            <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}
              className={`w-full px-3 py-2 rounded-lg bg-background border text-sm text-foreground focus:ring-2 focus:ring-ring focus:outline-none ${errs.date ? 'border-destructive' : 'border-border'}`} />
            {errs.date && <p className="text-xs text-destructive mt-1">{errs.date}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Description</label>
            <input type="text" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="e.g. Grocery Shopping"
              className={`w-full px-3 py-2 rounded-lg bg-background border text-sm text-foreground focus:ring-2 focus:ring-ring focus:outline-none ${errs.description ? 'border-destructive' : 'border-border'}`} />
            {errs.description && <p className="text-xs text-destructive mt-1">{errs.description}</p>}
          </div>

          {/* Category */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Category</label>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm text-foreground focus:ring-2 focus:ring-ring focus:outline-none">
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Type toggle */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Type</label>
            <div className="flex gap-2">
              {['Income', 'Expense'].map(t => (
                <button key={t} type="button" onClick={() => setForm({ ...form, type: t })}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                    form.type === t
                      ? t === 'Income' ? 'bg-success/20 text-success border border-success/40' : 'bg-destructive/20 text-destructive border border-destructive/40'
                      : 'bg-muted text-muted-foreground border border-border hover:bg-muted/80'
                  }`}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Amount */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Amount (₹)</label>
            <input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })}
              placeholder="0"
              className={`w-full px-3 py-2 rounded-lg bg-background border text-sm text-foreground focus:ring-2 focus:ring-ring focus:outline-none ${errs.amount ? 'border-destructive' : 'border-border'}`} />
            {errs.amount && <p className="text-xs text-destructive mt-1">{errs.amount}</p>}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-lg bg-muted text-foreground text-sm font-medium hover:bg-muted/80 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={submitted && !isValid}
              className="flex-1 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed">
              {isEdit ? 'Update' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
