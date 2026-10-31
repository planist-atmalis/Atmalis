import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useCourses } from '@/hooks/useAcademy';
import { useAuth } from '@/hooks/useAuth';
import PageHeading from '@/components/features/PageHeading';
import CourseForm from '@/components/forms/CourseForm';
import LessonManager from '@/components/features/LessonManager';
import EmptyState from '@/components/features/EmptyState';
export default function CourseEditorPage() {
  const { id } = useParams(); const { user, role } = useAuth(); const query = useCourses(); const course = query.data?.find(item => item.id === id);
  if (id && query.isLoading) return <div className="page-wrap"><p className="panel p-8">Loading course studio…</p></div>;
  if (id && (!course || (course.instructor_id !== user?.id && role !== 'super_admin'))) return <div className="page-wrap"><EmptyState error title="Course not available" description="You can only manage courses that belong to your instructor account."/></div>;
  return <div className="page-wrap"><Link className="flex min-h-11 items-center gap-2 text-sm font-semibold text-muted-foreground" to="/instructor"><ArrowLeft size={16}/>Back to your courses</Link><PageHeading eyebrow="Course studio" title={id ? 'Shape your learning experience.' : 'Knowledge worth sharing.'} description={id ? 'Refine your content, build your curriculum, and inspire your learners.' : 'Start with a clear promise. Then turn your expertise into a learning journey.'}/><div className="grid items-start gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(260px,1fr)]"><div className="space-y-6"><CourseForm course={course}/>{course && <LessonManager course={course}/>}</div><aside className="panel space-y-5 p-6"><h2 className="section-heading">From idea to impact</h2>{['Create your course outline', 'Add videos and learning resources', 'Submit for administrator approval', 'Welcome your first learners'].map((step, index) => <div key={step} className="flex gap-3"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-bold text-primary">{index + 1}</span><p className="pt-1 text-sm text-muted-foreground">{step}</p></div>)}<div className="border-t pt-5"><h3 className="text-sm font-bold text-primary">Your work, your ownership</h3><p className="mt-2 text-xs leading-relaxed text-muted-foreground">Only you and the administrator can manage this course. You earn 80% of every approved sale.</p></div></aside></div></div>;
}
