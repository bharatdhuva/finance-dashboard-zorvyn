import { useState, useMemo, useEffect } from 'react';
import { TrendingUp, TrendingDown, Wallet, PiggyBank } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Area, AreaChart, Sector } from 'recharts';
import { useStore } from '@/store/useStore';
import { formatINR, CATEGORY_COLORS } from '@/lib/format';
import { SkeletonBox } from '@/components/Skeleton';

export default function DashboardPage() {
  const { transactions } = useStore();
  const [loading, setLoading] = useState(true);
  const [hoveredCategoryIndex, setHoveredCategoryIndex] = useState<number | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  const stats = useMemo(() => {
    const income = transactions.filter(t => t.type === 'Income').reduce((s, t) => s + t.amount, 0);
    const expense = transactions.filter(t => t.type === 'Expense').reduce((s, t) => s + t.amount, 0);
    const balance = income - expense;
    const savingsRate = income > 0 ? ((income - expense) / income * 100) : 0;
    return { income, expense, balance, savingsRate };
  }, [transactions]);

  const monthlyData = useMemo(() => {
    const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const seededBalances: Record<string, number> = {
      Jul: 35000,
      Aug: 52000,
      Sep: 68000,
    };

    let runningBalance = 0;

    return months.map((m, i) => {
      const monthNum = i + 7;
      const monthTxns = transactions.filter(t => {
        const d = new Date(t.date);
        return d.getMonth() + 1 === monthNum && d.getFullYear() === 2024;
      });
      const income = monthTxns.filter(t => t.type === 'Income').reduce((s, t) => s + t.amount, 0);
      const expense = monthTxns.filter(t => t.type === 'Expense').reduce((s, t) => s + t.amount, 0);
      const monthlyNet = income - expense;

      if (m in seededBalances) {
        runningBalance = seededBalances[m];
      } else {
        runningBalance += monthlyNet;
      }

      return { month: m, balance: runningBalance, income, expense };
    });
  }, [transactions]);

  const categoryData = useMemo(() => {
    const cats: Record<string, number> = {};
    transactions.filter(t => t.type === 'Expense').forEach(t => {
      cats[t.category] = (cats[t.category] || 0) + t.amount;
    });
    const total = Object.values(cats).reduce((s, v) => s + v, 0);
    return Object.entries(cats).map(([name, value]) => ({
      name, value, percent: total > 0 ? (value / total * 100).toFixed(1) : '0',
    }));
  }, [transactions]);

  const handleCategorySliceHover = (_: unknown, index: number) => {
    setHoveredCategoryIndex(index);
  };

  const noData = transactions.length === 0;
  const neutral = noData;

  const cards = [
    { label: 'Total Balance', value: formatINR(stats.balance), icon: Wallet, trend: !neutral && stats.balance >= 0, color: neutral ? 'text-muted-foreground' : 'text-primary' },
    { label: 'Total Income', value: formatINR(stats.income), icon: TrendingUp, trend: true, color: neutral ? 'text-muted-foreground' : 'text-success' },
    { label: 'Total Expenses', value: formatINR(stats.expense), icon: TrendingDown, trend: false, color: neutral ? 'text-muted-foreground' : 'text-destructive' },
    { label: 'Savings Rate', value: `${stats.savingsRate.toFixed(1)}%`, icon: PiggyBank, trend: !neutral && stats.savingsRate > 0, color: neutral ? 'text-muted-foreground' : 'text-accent' },
  ];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <SkeletonBox key={i} className="h-28" />)
          : cards.map((card, i) => (
            <div key={i} className="bg-card rounded-xl border border-border p-5 glow-card hover:border-primary/30 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-muted-foreground font-medium">{card.label}</span>
                <card.icon size={18} className={card.color} />
              </div>
              <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
            </div>
          ))
        }
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {loading ? (
          <>
            <SkeletonBox className="h-80" />
            <SkeletonBox className="h-80" />
          </>
        ) : (
          <>
            {/* Balance Trend */}
            <div className="bg-card rounded-xl border border-border p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4">Balance Trend</h3>
              {noData ? (
                <div className="h-56 flex items-center justify-center text-muted-foreground text-sm">No data available</div>
              ) : (
                <ResponsiveContainer width="100%" height={240}>
                  <AreaChart data={monthlyData}>
                    <defs>
                      <linearGradient id="balGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(217,91%,60%)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(217,91%,60%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'hsl(215,20%,55%)', fontSize: 12 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(215,20%,55%)', fontSize: 12 }} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="balance" stroke="hsl(217,91%,60%)" fill="url(#balGrad)" strokeWidth={2.5} dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Spending Breakdown */}
            <div className="bg-card rounded-xl border border-border p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4">Spending Breakdown</h3>
              {categoryData.length === 0 ? (
                <div className="h-56 flex items-center justify-center text-muted-foreground text-sm">No data available</div>
              ) : (
                <div className="flex flex-col items-center">
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={75}
                        paddingAngle={3}
                        dataKey="value"
                        activeIndex={hoveredCategoryIndex ?? undefined}
                        activeShape={renderActiveCategoryShape}
                        onMouseEnter={handleCategorySliceHover}
                        onMouseLeave={() => setHoveredCategoryIndex(null)}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell
                            key={entry.name}
                            fill={CATEGORY_COLORS[entry.name] || '#94A3B8'}
                            opacity={hoveredCategoryIndex !== null && hoveredCategoryIndex !== index ? 0.6 : 1}
                          />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-2 mt-2 w-full">
                    {categoryData.map((cat) => (
                      <div key={cat.name} className="flex items-center gap-2 text-xs">
                        <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: CATEGORY_COLORS[cat.name] }} />
                        <span className="text-muted-foreground truncate">{cat.name}</span>
                        <span className="text-foreground font-medium ml-auto">{cat.percent}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function renderActiveCategoryShape(props: any) {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload } = props;

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 12}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <text x={cx} y={cy - 8} textAnchor="middle" className="fill-foreground text-[12px] font-bold">
        {payload?.name}
      </text>
      <text x={cx} y={cy + 10} textAnchor="middle" className="fill-foreground text-[11px] font-semibold">
        {formatINR(payload?.value ?? 0)}
      </text>
      <text x={cx} y={cy + 26} textAnchor="middle" className="fill-muted-foreground text-[10px] font-medium">
        {payload?.percent}% of total
      </text>
    </g>
  );
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-popover border border-border rounded-lg px-3 py-2 shadow-lg text-xs">
      {label && <p className="text-muted-foreground mb-1">{label}</p>}
      {payload.map((p: any, i: number) => (
        <p key={i} className="text-foreground font-medium">
          {p.name}: {formatINR(p.value)}
        </p>
      ))}
    </div>
  );
}
