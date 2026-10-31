import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, BookOpen, LockKeyhole, PlayCircle, CheckCircle2, Award } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useLocale } from '@/hooks/useLocale';
import { useAcademyRows, useCourses } from '@/hooks/useAcademy';
import { DEMO_COURSES } from '@/constants/demo';
import type { Lesson, Enrollment, Progress } from '@/types/academy';
import PurchasePanel from '@/components/features/PurchasePanel';
import LessonPlayer from '@/components/features/LessonPlayer';
import EmptyState from '@/components/features/EmptyState';
import PreviewNotice from '@/components/features/PreviewNotice';
import { cn } from '@/lib/utils';
export default function CourseDetailPage() {
  const { t } = useLocale(); const { id = '' } = useParams(); const { user, role } = useAuth(); const courses = useCourses(); const sample = DEMO_COURSES.find(course => course.id === id); const isDemo = !!sample; const course = isDemo ? sample : courses.data?.find(item => item.id === id);
  const enrollment = useAcademyRows<Enrollment>('academy_enrollments', { course_id: id, user_id: user?.id || '' }, !!user && !isDemo);
  const access = !!course && (!!enrollment.data?.length || role === 'super_admin' || (role === 'instructor' && course.instructor_id === user?.id));
  const lessons = useAcademyRows<Lesson>('academy_lessons', { course_id: id }, !!user && !isDemo && access, 'position');
  const progress = useAcademyRows<Progress>('academy_progress', { user_id: user?.id || '' }, !!user && !isDemo);
  const list: Lesson[] = isDemo ? ['A fresh perspective', 'The foundations of great work', 'Putting your skills into practice', 'Your next steps'].map((title, index) => ({ id: `sample-${index}`, title, course_id: id, video_url: null, material_path: null, position: index + 1 })) : lessons.data || [];
  const [selected, setSelected] = useState<string>(''); useEffect(() => { setSelected(''); }, [id]);
  const current = list.find(lesson => lesson.id === selected) || list[0] || null;
  const finished = !isDemo && !!enrollment.data?.length && list.length > 0 && list.every(lesson => progress.data?.some(item => item.lesson_id === lesson.id));
  if (!course) return <div className="page-wrap">{courses.isLoading ? <p className="panel p-8">{t('Loading course…')}</p> : <EmptyState error={!!courses.error} title={courses.error ? 'Unable to load this course' : 'Course not available'} description="This course may be private or not yet published."><Link className="btn-primary" to="/courses">{t('Back to courses')}</Link></EmptyState>}</div>;
  return <div className="page-wrap"><Link className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary" to="/courses"><ArrowLeft size={16} className="directional-icon"/>{t('Back to courses')}</Link><div className="grid items-start gap-8 xl:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)]"><div className="space-y-6"><div><span className="badge">{t(course.category)}</span><h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight">{t(course.title)}</h1><p className="mt-4 text-base leading-relaxed text-muted-foreground">{t(course.description)}</p></div>{access || isDemo ? <LessonPlayer lesson={current} isDemo={isDemo} completed={!!progress.data?.some(p => p.lesson_id === current?.id)}/> : <div className="panel overflow-hidden"><img src={course.cover_url || DEMO_COURSES[0].cover_url!} alt="Atmalis course cover" className="aspect-video w-full object-cover"/><div className="flex items-center gap-3 p-5"><LockKeyhole className="shrink-0 text-primary" size={21}/><p className="text-base text-muted-foreground">{t('Enroll to unlock videos and learning materials.')}</p></div></div>}
    <section className="panel p-6"><div className="mb-5 flex flex-wrap items-center justify-between gap-3"><h2 className="section-heading">{t('Course curriculum')}</h2><span className="text-sm text-muted-foreground">{access || isDemo ? `${list.length} ${t('lessons')}` : t('Protected content')}</span></div>{list.length ? <div className="space-y-2">{list.map((lesson, index) => <button key={lesson.id} onClick={() => setSelected(lesson.id)} className={cn('flex min-h-14 w-full items-center gap-3 rounded-xl border px-4 py-3 text-start text-base hover:bg-secondary', current?.id === lesson.id && 'border-primary/25 bg-secondary text-primary')}><span className="text-sm text-muted-foreground">{String(index + 1).padStart(2, '0')}</span><span className="flex-1 font-medium">{t(lesson.title)}</span>{progress.data?.some(p => p.lesson_id === lesson.id) ? <CheckCircle2 size={17}/> : <PlayCircle size={17}/>}</button>)}</div> : <p className="flex items-center gap-2 text-base leading-relaxed text-muted-foreground"><BookOpen size={18} className="shrink-0"/>{t(access ? 'Your instructor is preparing the lessons.' : 'The complete curriculum is available after enrollment.')}</p>}</section>{finished && <Link to="/certificates" className="btn-secondary"><Award size={18}/>{t('Certificates')}</Link>}</div><aside className="xl:sticky xl:top-28"><PurchasePanel course={course} enrolled={access} isDemo={isDemo}/></aside></div>{isDemo && <PreviewNotice/>}</div>;
}
