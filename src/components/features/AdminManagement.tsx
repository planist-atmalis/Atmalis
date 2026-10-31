import { useSearchParams } from 'react-router-dom';
import { BookOpen, CreditCard, GraduationCap, Users, Bell, type LucideIcon } from 'lucide-react';
import type { Course, Order, Member, Application, Notification } from '@/types/academy';
import AdminCourseReview from '@/components/features/AdminCourseReview';
import AdminOrders from '@/components/features/AdminOrders';
import AdminApplications from '@/components/features/AdminApplications';
import AdminMembers from '@/components/features/AdminMembers';
import AdminNotifications from '@/components/features/AdminNotifications';
import { useLocale } from '@/hooks/useLocale';
interface Props { courses: Course[]; orders: Order[]; members: Member[]; applications: Application[]; notifications: Notification[]; isDemo: boolean; }
const TABS: { value: string; label: string; Icon: LucideIcon }[] = [{ value: 'courses', label: 'Courses', Icon: BookOpen }, { value: 'orders', label: 'Orders', Icon: CreditCard }, { value: 'applications', label: 'Instructors', Icon: GraduationCap }, { value: 'members', label: 'Members', Icon: Users }, { value: 'notifications', label: 'Course updates', Icon: Bell }];
export default function AdminManagement(props: Props) {
  const { t } = useLocale(); const [params, setParams] = useSearchParams(); const tab = params.get('tab') || 'courses';
  return <section className="panel overflow-hidden" id="management"><div className="flex flex-wrap items-center justify-between gap-3 p-6"><div><h2 className="section-heading">{t('Academy management')}</h2><p className="mt-1 text-xs text-muted-foreground">{t('The right oversight. A better learning experience.')}</p></div>{props.isDemo && <span className="badge bg-accent/50 text-accent-foreground">{t('Read-only preview')}</span>}</div><div className="flex overflow-x-auto border-t px-4" role="tablist" aria-label="Management sections">{TABS.map(({ value, label, Icon }) => <button role="tab" aria-selected={value === tab} key={value} className={`flex min-h-14 shrink-0 items-center gap-2 border-b-2 px-4 py-4 text-xs font-semibold ${value === tab ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-primary'}`} onClick={() => setParams(previous => { const next = new URLSearchParams(previous); next.set('tab', value); return next; })}><Icon size={15}/>{t(label)}</button>)}</div><div role="tabpanel">{tab === 'orders' ? <AdminOrders {...props}/> : tab === 'applications' ? <AdminApplications {...props}/> : tab === 'members' ? <AdminMembers {...props}/> : tab === 'notifications' ? <AdminNotifications {...props}/> : <AdminCourseReview {...props}/>}</div></section>;
}
