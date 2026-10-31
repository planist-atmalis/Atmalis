import { Info, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
export default function PreviewNotice() {
  return <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border bg-card px-4 py-2 text-xs text-muted-foreground"><span className="flex items-center gap-2"><Info size={15} className="shrink-0 text-primary"/>You’re exploring a preview workspace. All displayed activity is sample data.</span><Link to="/auth" className="flex min-h-11 items-center gap-1 font-semibold text-primary">Sign in to your workspace<ArrowUpRight size={14}/></Link></div>;
}
