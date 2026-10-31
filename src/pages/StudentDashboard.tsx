import { Link } from 'react-router-dom';
import { ArrowRight, CalendarDays } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useAcademyRows, useCourses } from '@/hooks/useAcademy';
import { DEMO_COURSES } from '@/constants/demo';
import type { Enrollment, Progress, Lesson } from '@/types/academy';
import PageHeading from '@/components/features/PageHeading';
import AcademyHero from '@/components/features/AcademyHero';
import StatsStrip from '@/components/features/StatsStrip';
import CourseCard from '@/components/features/CourseCard';
import LearningGoal from '@/components/features/LearningGoal';
import ActivityFeed from '@/components/features/ActivityFeed';
import PreviewNotice from '@/components/features/PreviewNotice';
import EmptyState from '@/components/features/EmptyState';
export default function StudentDashboard() {
  const { user } = useAuth(); const isDemo = !user; const courses = useCourses();
  const enrollment = useAcademyRows<Enrollment>('academy_enrollments', { user_id: user?.id || '' }, !!user);
  const progress = useAcademyRows<Progress>('academy_progress', { user_id: user?.id || '' }, !!user);
  const lessons = useAcademyRows<Lesson>('academy_lessons', {}, !!user, 'position');
  const learning = isDemo ? DEMO_COURSES.slice(0, 2) : (courses.data || []).filter(course => enrollment.data?.some(item => item.course_id === course.id));
  const recommended = isDemo ? DEMO_COURSES : (courses.data || []).filter(course => course.status === 'published' && !learning.some(item => item.id === course.id));
  const percent = (id: string) => { const total = lessons.data?.filter(item => item.course_id === id) || []; return total.length ? Math.round(100 * total.filter(item => progress.data?.some(p => p.lesson_id === item.id)).length / total.length) : 0; };
  const completed = learning.filter(course => percent(course.id) === 100).length;
  return <div className="page-wrap"><PageHeading title={`Welcome back, ${user?.username.split(' ')[0] || 'Alex'}`} description="A little progress, every day. Keep your momentum going."><span className="hidden items-center gap-2 rounded-xl border bg-card px-4 py-3 text-xs text-muted-foreground sm:flex"><CalendarDays size={15}/>{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span></PageHeading>
    <AcademyHero/><StatsStrip items={[{ label: 'Enrolled courses', value: isDemo ? '04' : String(learning.length).padStart(2, '0'), detail: 'New possibilities ahead', icon: 'book' }, { label: 'Completed lessons', value: isDemo ? '12' : String(progress.data?.length || 0).padStart(2, '0'), detail: 'Every step is progress', icon: 'check' }, { label: 'Courses completed', value: isDemo ? '01' : String(completed).padStart(2, '0'), detail: 'Skills worth celebrating', icon: 'growth' }, { label: 'Learning streak', value: isDemo ? '3 days' : progress.data?.length ? 'Started' : 'Ready to start', detail: isDemo ? 'Keep your momentum' : 'Your journey starts today', icon: 'clock' }]}/>
    <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]"><div className="space-y-6"><div className="flex items-center justify-between"><div><h2 className="section-heading">Pick up where you left off</h2><p className="mt-1 text-xs text-muted-foreground">Your next breakthrough is one lesson away.</p></div><Link to="/my-learning" className="flex min-h-11 items-center gap-2 text-xs font-semibold text-primary">View all<ArrowRight size={15}/></Link></div>
    {enrollment.isLoading && user ? <div className="panel p-8 text-muted-foreground">Loading your learning…</div> : learning.length ? <div className="grid gap-5 md:grid-cols-2">{learning.slice(0, 2).map((course, index) => <CourseCard key={course.id} course={course} index={index} learning progress={isDemo ? course.progress : percent(course.id)}/>)}</div> : <EmptyState title="Start your next chapter" description="Enroll in your first course and your learning progress will appear here."><Link to="/courses" className="btn-secondary">Discover courses</Link></EmptyState>}
    <div className="flex items-center justify-between pt-2"><div><h2 className="section-heading">Discover something new</h2><p className="mt-1 text-xs text-muted-foreground">Practical skills. Fresh perspectives.</p></div><Link to="/courses" className="flex min-h-11 items-center gap-2 text-xs font-semibold text-primary">Explore all<ArrowRight size={15}/></Link></div><div className="grid gap-5 md:grid-cols-2">{recommended.slice(0, 2).map((course, index) => <CourseCard key={course.id} course={course} index={index}/>)}</div>{!recommended.length && <p className="panel p-6 text-sm text-muted-foreground">New courses will appear here when instructors publish them.</p>}</div>
    <aside className="space-y-6"><LearningGoal completed={progress.data?.length || 0} isDemo={isDemo}/><ActivityFeed isDemo={isDemo} progress={progress.data || []}/><div className="rounded-2xl bg-secondary px-6 py-5"><p className="font-heading text-lg font-semibold leading-relaxed text-primary">“The beautiful thing about learning is that nobody can take it away from you.”</p><p className="mt-3 text-xs text-muted-foreground">— B. B. King</p></div></aside></div>{isDemo && <PreviewNotice/>}</div>;
}
