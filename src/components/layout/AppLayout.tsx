import { useState } from 'react';
import type { ReactNode } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { useLocale } from '@/hooks/useLocale';
export default function AppLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false); const { t, rtl } = useLocale();
  return <div className="min-h-screen"><Sidebar open={open} close={() => setOpen(false)}/><div className={rtl ? 'workspace-content lg:mr-[248px]' : 'workspace-content lg:ml-[248px]'}><Header openSidebar={() => setOpen(true)}/><main id="main-content">{children}</main><footer className="mx-5 flex flex-wrap items-center justify-between gap-2 border-t py-5 text-xs text-muted-foreground sm:mx-8 xl:mx-10"><p>© {new Date().getFullYear()} Atmalis. {t('All rights reserved.')}</p><span>{t('Learn. Practice. Achieve.')}</span></footer></div></div>;
}
