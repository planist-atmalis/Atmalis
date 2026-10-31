import { CircleCheck, Clock3, FileText, CircleX } from 'lucide-react';
import { cn } from '@/lib/utils';
interface Props { status: string; }
export default function StatusBadge({ status }: Props) {
  const approved = status === 'published' || status === 'approved'; const rejected = status === 'rejected'; const Icon = approved ? CircleCheck : rejected ? CircleX : status === 'draft' ? FileText : Clock3;
  return <span className={cn('badge whitespace-nowrap capitalize', rejected && 'bg-destructive/10 text-destructive', status === 'pending' && 'bg-accent/55 text-accent-foreground', status === 'draft' && 'bg-muted text-muted-foreground')}><Icon size={12}/>{status === 'pending' ? 'Awaiting review' : status}</span>;
}
