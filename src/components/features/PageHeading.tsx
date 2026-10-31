import type { ReactNode } from 'react';
import { useLocale } from '@/hooks/useLocale';
interface Props { eyebrow?: string; title: string; description: string; children?: ReactNode; }
export default function PageHeading({ eyebrow, title, description, children }: Props) {
  const { t } = useLocale(); return <div className="flex flex-wrap items-center justify-between gap-4"><div>{eyebrow && <p className="eyebrow mb-2">{t(eyebrow)}</p>}<h1 className="text-2xl font-extrabold tracking-[-.04em] sm:text-[28px]">{t(title)}</h1><p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">{t(description)}</p></div>{children}</div>;
}
