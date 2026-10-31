import { useAuth } from '@/hooks/useAuth';
import { useAdminData } from '@/hooks/useAdminData';
import { DEMO_PENDING, DEMO_ORDERS, DEMO_MEMBERS, DEMO_APPLICATIONS, DEMO_NOTIFICATIONS } from '@/constants/demoAdmin';
import { money } from '@/lib/utils';
import PageHeading from '@/components/features/PageHeading';
import StatsStrip from '@/components/features/StatsStrip';
import RevenueChart from '@/components/features/RevenueChart';
import AdminActionQueue from '@/components/features/AdminActionQueue';
import AdminManagement from '@/components/features/AdminManagement';
import PreviewNotice from '@/components/features/PreviewNotice';
import EmptyState from '@/components/features/EmptyState';
import { useLocale } from '@/hooks/useLocale';
export default function AdminDashboard() {
  const { t } = useLocale(); const { user, role, roleLoading } = useAuth(); const data = useAdminData(); const isDemo = !user;
  if (roleLoading) return <div className="page-wrap"><p>{t('Verifying administrator access…')}</p></div>;
  if (user && role !== 'super_admin') return <div className="page-wrap"><EmptyState error title="Administrator access required" description="Only the academy administrator can review payments, publish courses, and manage account roles."/></div>;
  const courses = isDemo ? DEMO_PENDING : data.courses.data || []; const orders = isDemo ? DEMO_ORDERS : data.orders.data || []; const members = isDemo ? DEMO_MEMBERS : data.members.data || []; const applications = isDemo ? DEMO_APPLICATIONS : data.applications.data || []; const notifications = isDemo ? DEMO_NOTIFICATIONS : data.notifications.data || [];
  const commissions = data.commissions.data || []; const revenue = commissions.reduce((sum, item) => sum + Number(item.total), 0); const share = commissions.reduce((sum, item) => sum + Number(item.platform_share), 0);
  return <div className="page-wrap"><PageHeading eyebrow="Administrator workspace" title="A clear view. A stronger academy." description="Support your instructors, empower your learners, and keep everything connected."/>
    <StatsStrip items={[{ label: 'Total revenue', value: isDemo ? '$12,480' : money(revenue), detail: 'Approved course purchases', icon: 'wallet' }, { label: 'Platform commission', value: isDemo ? '$2,496' : money(share), detail: '20% of approved sales', icon: 'growth' }, { label: 'Published courses', value: courses.filter(course => course.status === 'published').length, detail: 'Learning opportunities', icon: 'book' }, { label: 'Academy learners', value: isDemo ? '124' : members.filter(member => member.role === 'student').length, detail: 'People investing in themselves', icon: 'users' }]}/>
    <div className="grid items-stretch gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]"><RevenueChart commissions={commissions} isDemo={isDemo}/><AdminActionQueue courses={courses.filter(course => course.status === 'pending').length} orders={orders.filter(order => order.status === 'pending').length} applications={applications.filter(application => application.status === 'pending').length} isDemo={isDemo}/></div>
    {data.courses.isLoading && !isDemo ? <p className="panel p-8 text-muted-foreground">{t('Loading your academy…')}</p> : <AdminManagement courses={courses} orders={orders} members={members} applications={applications} notifications={notifications} isDemo={isDemo}/>} {isDemo && <PreviewNotice/>}</div>;
}
