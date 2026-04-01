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
    const map: Record<string, number> = {};
    expenses.forEach(t => { map[t.category] = (map[t.category] || 0) + t.amount; });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [expenses]);

  const incomeCategoryTotals = useMemo(() => {
    const map: Record<string, number> = {};
    incomes.forEach(t => { map[t.category] = (map[t.category] || 0) + t.amount; });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [incomes]);

  const totalExpense = expenses.reduce((s, t) => s + t.amount, 0);

  const highest = categoryTotals[0];
  const lowest = categoryTotals[categoryTotals.length - 1];
  const topIncome = incomeCategoryTotals[0];

  // Month over month
  const mom = useMemo(() => {
    const getMonthExpenses = (m: number) => expenses.filter(t => new Date(t.date).getMonth() + 1 === m).reduce((s, t) => s + t.amount, 0);
    const current = getMonthExpenses(12);
    const previous = getMonthExpenses(11);
    const change = previous > 0 ? ((current - previous) / previous * 100) : 0;
    return { current, previous, change };
  }, [expenses]);

  const monthlyChart = useMemo(() => {
    const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months.map((m, i) => {
      const mn = i + 7;
      const txns = transactions.filter(t => new Date(t.date).getMonth() + 1 === mn && new Date(t.date).getFullYear() === 2024);
      return {
        month: m,
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
      {/* Insight Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {insightCards.map((card, i) => (
          <div key={i} className="bg-card rounded-xl border border-border p-5 hover:border-primary/30 transition-colors glow-card">
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
      <div className="bg-card rounded-xl border border-border p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4">Monthly Income vs Expenses</h3>
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
      <div className="bg-card rounded-xl border border-border p-5">
        <p className="text-sm text-muted-foreground leading-relaxed">
          {momText} {topExpenseCategories && `${topExpenseCategories} are your top expense categories.`}
        </p>
      </div>
    </div>
  );
}

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-popover border border-border rounded-lg px-3 py-2 shadow-lg text-xs">
      <p className="text-muted-foreground mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.fill }} className="font-medium">{p.dataKey}: {formatINR(p.value)}</p>
      ))}
    </div>
  );
}
