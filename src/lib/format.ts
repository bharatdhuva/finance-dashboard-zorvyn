export function formatINR(amount: number): string {
  const isNegative = amount < 0;
  const abs = Math.abs(Math.round(amount));
  const str = abs.toString();
  
  if (str.length <= 3) {
    return `${isNegative ? '-' : ''}₹${str}`;
  }
  
  const last3 = str.slice(-3);
  let remaining = str.slice(0, -3);
  const groups: string[] = [];
  
  while (remaining.length > 2) {
    groups.unshift(remaining.slice(-2));
    remaining = remaining.slice(0, -2);
  }
  if (remaining) groups.unshift(remaining);
  
  return `${isNegative ? '-' : ''}₹${groups.join(',')},${last3}`;
}

export const CATEGORY_COLORS: Record<string, string> = {
  Food: '#F59E0B',
  Transport: '#8B5CF6',
  Shopping: '#EC4899',
  Bills: '#F97316',
  Entertainment: '#06B6D4',
  Health: '#10B981',
  Salary: '#3B82F6',
  Freelance: '#6366F1',
  Other: '#94A3B8',
};

export const CATEGORY_BG_CLASSES: Record<string, string> = {
  Food: 'bg-amber-500/20 text-amber-400',
  Transport: 'bg-violet-500/20 text-violet-400',
  Shopping: 'bg-pink-500/20 text-pink-400',
  Bills: 'bg-orange-500/20 text-orange-400',
  Entertainment: 'bg-cyan-500/20 text-cyan-400',
  Health: 'bg-emerald-500/20 text-emerald-400',
  Salary: 'bg-blue-500/20 text-blue-400',
  Freelance: 'bg-indigo-500/20 text-indigo-400',
  Other: 'bg-slate-500/20 text-slate-400',
};
