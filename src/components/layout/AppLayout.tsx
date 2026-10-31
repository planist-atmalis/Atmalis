import { useState } from 'react';
import type { ReactNode } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
export default function AppLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return <div className="min-h-screen"><Sidebar open={open} close={() => setOpen(false)}/><div className="lg:ml-[248px]"><Header openSidebar={() => setOpen(true)}/><main id="main-content">{children}</main><footer className="mx-5 flex flex-wrap items-center justify-between gap-2 border-t py-5 text-xs text-muted-foreground sm:mx-8 xl:mx-10"><p>© {new Date().getFullYear()} Elevate Academy. Built for your next chapter.</p><span>Learn. Create. Grow.</span></footer></div></div>;
}
