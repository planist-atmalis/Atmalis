import { BookOpen, CircleCheck, Clock3, TrendingUp, Wallet, Users, ShieldCheck, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
export interface StatItem { label: string; value: string | number; detail: string; icon: 'book' | 'check' | 'clock' | 'growth' | 'wallet' | 'users' | 'shield'; }
interface Props { items: StatItem[]; }
const icons: Record<StatItem['icon'], LucideIcon> = { book: BookOpen, check: CircleCheck, clock: Clock3, growth: TrendingUp, wallet: Wallet, users: Users, shield: ShieldCheck };
export default function StatsStrip({ items }: Props) {
  return <div className="panel grid grid-cols-2 overflow-hidden xl:grid-cols-4">{items.map((item, index) => { const Icon = icons[item.icon]; return <div key={item.label} className={cn('flex items-center gap-4 px-5 py-6 sm:px-6', index !== 0 && 'xl:border-l', index % 2 === 1 && 'border-l', index > 1 && 'border-t xl:border-t-0')}><span className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-xl', index === 1 ? 'bg-accent/60 text-accent-foreground' : 'bg-secondary text-primary')}><Icon size={21} strokeWidth={1.6}/></span><div><p className="text-xs text-muted-foreground">{item.label}</p><p className="mt-1 font-heading text-2xl font-extrabold tracking-tight">{item.value}</p><p className="mt-1 text-[11px] text-muted-foreground">{item.detail}</p></div></div>; })}</div>;
}
