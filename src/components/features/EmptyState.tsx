import { BookOpen, AlertCircle } from 'lucide-react';
import type { ReactNode } from 'react';
import { useLocale } from '@/hooks/useLocale';
interface Props { title: string; description: string; children?: ReactNode; error?: boolean; }
export default function EmptyState({ title, description, children, error }: Props) {
  const { t } = useLocale(); const Icon = error ? AlertCircle : BookOpen;
  return <div className="panel flex flex-col items-center px-6 py-12 text-center"><span className="mb-4 rounded-2xl bg-secondary p-4 text-primary"><Icon size={27}/></span><h3 className="text-lg font-bold">{t(title)}</h3><p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">{t(description)}</p>{children && <div className="mt-5">{children}</div>}</div>;
}
