import type { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
export default function SiteShell({ children }: { children: ReactNode }) { const { pathname } = useLocation(); return pathname.startsWith('/auth') || pathname.startsWith('/verify') ? <>{children}</> : <AppLayout>{children}</AppLayout>; }
