import { useMemo } from 'react';
import { TrendingUp, TrendingDown, ShoppingBag, Wallet } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useStore } from '@/store/useStore';
import { formatINR, CATEGORY_COLORS } from '@/lib/format';

export default function InsightsPage() {
  const { transactions } = useStore();

  const expenses = useMemo(() => transactions.filter(t => t.type === 'Expense'), [transactions]);
  const incomes = useMemo(() => transactions.filter(t => t.type === 'Income'), [transactions]);

  const categoryTotals = useMemo(() => {
    const map = {};
    expenses.forEach(t => { map[t.category] = (map[t.category] || 0) + t.amount; });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [expenses]);

  const incomeCategoryTotals = useMemo(() => {
    const map = {};
    incomes.forEach(t => { map[t.category] = (map[t.category] || 0) + t.amount; });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [incomes]);

  const totalExpense = expenses.reduce((s, t) => s + t.amount, 0);

  const highest = categoryTotals[0];
  const lowest = categoryTotals[categoryTotals.length - 1];
  const topIncome = incomeCategoryTotals[0];

  // Month over month
  const mom = useMemo(() => {
    const getMonthExpenses = (m, y) => expenses
      .filter(t => {
        const d = new Date(t.date);
        return d.getMonth() + 1 === m && d.getFullYear() === y;
      })
      .reduce((s, t) => s + t.amount, 0);

    const current = getMonthExpenses(3, 2026);
    const previous = getMonthExpenses(2, 2026);
    const change = previous > 0 ? ((current - previous) / previous * 100) : 0;
    return { current, previous, change };
  }, [expenses]);

  const monthlyChart = useMemo(() => {
    const months = [
      { label: 'Oct', month: 10, year: 2025 },
      { label: 'Nov', month: 11, year: 2025 },
      { label: 'Dec', month: 12, year: 2025 },
      { label: 'Jan', month: 1, year: 2026 },
      { label: 'Feb', month: 2, year: 2026 },
      { label: 'Mar', month: 3, year: 2026 },
    ];

    return months.map(({ label, month, year }) => {
      const txns = transactions.filter(t => {
        const d = new Date(t.date);
        return d.getMonth() + 1 === month && d.getFullYear() === year;
      });
      return {
        month: label,
        Income: txns.filter(t => t.type === 'Income').reduce((s, t) => s + t.amount, 0),
        Expense: txns.filter(t => t.type === 'Expense').reduce((s, t) => s + t.amount, 0),
      };
    });
  }, [transactions]);

  const topExpenseCategories = categoryTotals.slice(0, 2).map(c => c[0]).join(' and ');
  const momText = mom.change > 0
    ? `Your spending increased by ${Math.abs(mom.change).toFixed(0)}% compared to last month.`
    : mom.change < 0
    ? `Your spending decreased by ${Math.abs(mom.change).toFixed(0)}% compared to last month.`
    : 'Your spending remained the same as last month.';

  const insightCards = [
    {
      title: 'Highest Spending',
      category: highest?.[0] || 'N/A',
      amount: highest?.[1] || 0,
      percent: totalExpense > 0 && highest ? (highest[1] / totalExpense * 100) : 0,
      icon: ShoppingBag,
      barColor: 'bg-destructive',
      textColor: 'text-destructive',
    },
    {
      title: 'Lowest Spending',
      category: lowest?.[0] || 'N/A',
      amount: lowest?.[1] || 0,
      percent: totalExpense > 0 && lowest ? (lowest[1] / totalExpense * 100) : 0,
      icon: TrendingDown,
      barColor: 'bg-success',
      textColor: 'text-success',
    },
    {
      title: 'Month over Month',
      category: `${formatINR(mom.current)} vs ${formatINR(mom.previous)}`,
      amount: mom.change,
      isPercent: true,
      icon: mom.change > 0 ? TrendingUp : TrendingDown,
      textColor: mom.change > 0 ? 'text-destructive' : 'text-success',
    },
    {
      title: 'Top Income Source',
      category: topIncome?.[0] || 'N/A',
      amount: topIncome?.[1] || 0,
      icon: Wallet,
      textColor: 'text-primary',
    },
  ];

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-border ambient-surface p-5 md:p-6">
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Decision support</p>
        <div className="mt-2 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-foreground">Spending and income intelligence</h2>
            <p className="mt-1 text-sm text-muted-foreground">Highlights crafted for monthly review meetings and budget planning.</p>
          </div>
          <p className="text-sm text-muted-foreground">{transactions.length} transactions analyzed</p>
        </div>
      </section>

      {/* Insight Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {insightCards.map((card, i) => (
          <div key={i} className="bg-card rounded-xl border border-border p-5 hover:border-primary/30 transition-colors glow-card ambient-surface">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center bg-muted`}>
                <card.icon size={18} className={card.textColor} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">{card.title}</p>
                <p className="text-sm font-semibold text-foreground">{card.category}</p>
              </div>
            </div>
            {card.isPercent ? (
              <p className={`text-xl font-bold ${card.textColor}`}>
                {card.amount > 0 ? '+' : ''}{card.amount.toFixed(1)}%
              </p>
            ) : (
              <>
                <p className={`text-xl font-bold ${card.textColor}`}>{formatINR(card.amount)}</p>
                {card.percent !== undefined && (
                  <div className="mt-2 h-2 rounded-full bg-muted overflow-hidden">
                    <div className={`h-full rounded-full ${card.barColor}`} style={{ width: `${Math.min(card.percent, 100)}%` }} />
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>

      {/* Bar Chart */}
      <div className="bg-card rounded-xl border border-border p-5 ambient-surface">
        <h3 className="text-sm font-semibold text-foreground mb-4">Monthly inflow vs outflow</h3>
        {transactions.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-muted-foreground text-sm">No data available</div>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={monthlyChart} barGap={4}>
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'hsl(215,20%,55%)', fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(215,20%,55%)', fontSize: 12 }} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
              <Tooltip content={<ChartTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="Income" fill="hsl(217,91%,60%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Expense" fill="hsl(0,84%,60%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Summary */}
      <div className="bg-card rounded-xl border border-border p-5 ambient-surface">
        <p className="text-sm text-muted-foreground leading-relaxed">
          {momText} {topExpenseCategories && `${topExpenseCategories} are your top expense categories.`}
        </p>
      </div>
    </div>
  );
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-popover border border-border rounded-lg px-3 py-2 shadow-lg text-xs">
      <p className="text-muted-foreground mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.fill }} className="font-medium">{p.dataKey}: {formatINR(p.value)}</p>
      ))}
    </div>
  );
}
