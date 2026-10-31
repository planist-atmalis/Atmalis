import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useAcademyRows, useCourses } from '@/hooks/useAcademy';
import { DEMO_COURSES } from '@/constants/demo';
import type { Enrollment, Lesson, Progress } from '@/types/academy';
import PageHeading from '@/components/features/PageHeading';
import CourseCard from '@/components/features/CourseCard';
import EmptyState from '@/components/features/EmptyState';
import PreviewNotice from '@/components/features/PreviewNotice';
import { useLocale } from '@/hooks/useLocale';
export default function MyLearningPage() {
  const { t } = useLocale(); const { user } = useAuth(); const [params, setParams] = useSearchParams(); const tab = params.get('tab') || 'all'; const courses = useCourses();
  const enrollments = useAcademyRows<Enrollment>('academy_enrollments', { user_id: user?.id || '' }, !!user); const lessons = useAcademyRows<Lesson>('academy_lessons', {}, !!user, 'position'); const progress = useAcademyRows<Progress>('academy_progress', { user_id: user?.id || '' }, !!user);
  const percent = (id: string) => { const list = lessons.data?.filter(lesson => lesson.course_id === id) || []; return list.length ? Math.round(100 * list.filter(lesson => progress.data?.some(p => p.lesson_id === lesson.id)).length / list.length) : 0; };
  const learning = !user ? DEMO_COURSES.slice(0, 2) : (courses.data || []).filter(course => enrollments.data?.some(item => item.course_id === course.id));
  const filtered = learning.filter(course => tab === 'all' || (tab === 'completed' ? (user ? percent(course.id) : course.progress) === 100 : (user ? percent(course.id) : course.progress) < 100));
  return <div className="page-wrap"><PageHeading eyebrow="Your learning journey" title="Keep moving forward." description="Every lesson is another step toward the person you want to become."/><div className="flex gap-2 border-b pb-4">{['all', 'in-progress', 'completed'].map(item => <button key={item} className={`btn ${tab === item ? 'bg-secondary text-primary' : 'text-muted-foreground'}`} onClick={() => setParams({ tab: item })}>{t(item === 'all' ? 'All courses' : item === 'in-progress' ? 'In progress' : 'Completed')}</button>)}</div>
    {enrollments.isLoading && user ? <p className="panel p-8">{t('Loading your courses…')}</p> : filtered.length ? <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">{filtered.map((course, index) => <CourseCard key={course.id} course={course} index={index} learning progress={user ? percent(course.id) : course.progress}/>)}</div> : <EmptyState title={tab === 'completed' ? 'Great things take practice' : 'Your journey is waiting'} description={tab === 'completed' ? 'Finish all lessons in a course to see it here.' : 'Explore the catalog and find a skill that speaks to you.'}><Link className="btn-primary" to="/courses">{t('Explore courses')}</Link></EmptyState>}{!user && <PreviewNotice/>}</div>;
}
