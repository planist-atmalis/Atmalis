import { Link } from 'react-router-dom';
import { Plus, Lightbulb, ArrowUpRight, Presentation } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useAcademyRows, useCourses } from '@/hooks/useAcademy';
import { DEMO_COURSES } from '@/constants/demo';
import type { Enrollment, Commission } from '@/types/academy';
import { money } from '@/lib/utils';
import PageHeading from '@/components/features/PageHeading';
import StatsStrip from '@/components/features/StatsStrip';
import RevenueChart from '@/components/features/RevenueChart';
import InstructorCourseTable from '@/components/features/InstructorCourseTable';
import PreviewNotice from '@/components/features/PreviewNotice';
import EmptyState from '@/components/features/EmptyState';
export default function InstructorDashboard() {
  const { user, role, roleLoading } = useAuth(); const isDemo = !user; const allowed = !!user && (role === 'instructor' || role === 'super_admin'); const all = useCourses();
  const enrollments = useAcademyRows<Enrollment>('academy_enrollments', {}, allowed); const commissions = useAcademyRows<Commission>('academy_commissions', { instructor_id: user?.id || '' }, allowed);
  if (roleLoading) return <div className="page-wrap"><p>Connecting to your instructor workspace…</p></div>;
  if (user && !allowed) return <div className="page-wrap"><EmptyState title="Your teaching journey starts with an application" description="Submit your experience for administrator review. Approved instructors can create and manage their own courses."><Link to="/instructor/apply" className="btn-primary">Apply to teach</Link></EmptyState></div>;
  const courses = isDemo ? DEMO_COURSES.map((course, index) => ({ ...course, status: index === 2 ? 'pending' as const : course.status })) : (all.data || []).filter(course => course.instructor_id === user?.id);
  const earnings = commissions.data?.reduce((sum, item) => sum + Number(item.instructor_share), 0) || 0;
  return <div className="page-wrap"><PageHeading eyebrow="Instructor studio" title={`Make an impact, ${user?.username.split(' ')[0] || 'Sarah'}.`} description="Turn your experience into someone else’s opportunity."><Link className="btn-primary" to={isDemo ? '/auth?next=/instructor/courses/new' : '/instructor/courses/new'}><Plus size={17}/>Create a course</Link></PageHeading>
    <StatsStrip items={[{ label: 'Your courses', value: String(courses.length).padStart(2, '0'), detail: 'Knowledge worth sharing', icon: 'book' }, { label: 'Total enrollments', value: isDemo ? '70' : enrollments.data?.length || 0, detail: 'Learners you’ve inspired', icon: 'users' }, { label: 'Your earnings', value: isDemo ? '$1,920' : money(earnings), detail: '80% of approved sales', icon: 'wallet' }, { label: 'Awaiting review', value: courses.filter(course => course.status === 'pending').length, detail: 'Administrator approval', icon: 'shield' }]}/>
    <div className="grid items-stretch gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]"><RevenueChart commissions={commissions.data || []} isDemo={isDemo} instructor/><aside className="panel flex flex-col p-6"><span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-primary"><Lightbulb size={23}/></span><p className="eyebrow text-[10px]">The instructor’s playbook</p><h2 className="mt-3 text-xl font-bold leading-snug">Great learning begins<br/>with a clear next step.</h2><p className="mt-3 text-sm leading-relaxed text-muted-foreground">Structure your course around small wins. Add a video, a useful resource, and one practical takeaway to every lesson.</p><div className="mt-auto border-t pt-5"><p className="text-xs leading-relaxed text-muted-foreground">Published course updates go live immediately. The administrator is notified without interrupting your learners.</p><Link to={isDemo ? '/auth' : '/instructor/courses/new'} className="mt-2 flex min-h-11 items-center justify-between text-xs font-semibold text-primary">Build your next course<ArrowUpRight size={16}/></Link></div></aside></div>
    <InstructorCourseTable courses={courses} enrollments={enrollments.data || []} isDemo={isDemo}/><div className="flex items-start gap-3 rounded-xl bg-secondary p-5"><Presentation size={20} className="shrink-0 text-primary"/><p className="text-xs leading-relaxed text-muted-foreground">Your earnings ledger records your 80% share automatically after an order is approved. Payout transfers are handled by your academy administrator.</p></div>{isDemo && <PreviewNotice/>}</div>;
}
