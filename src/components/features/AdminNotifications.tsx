import { Link } from 'react-router-dom';
import { BellRing, ArrowUpRight } from 'lucide-react';
import type { Notification, Course } from '@/types/academy';
import { dateLabel } from '@/lib/utils';
import { useLocale } from '@/hooks/useLocale';
interface Props { notifications: Notification[]; courses: Course[]; }
const FIELDS: Record<string, string> = { title: 'Course title', description: 'Description', price: 'Price', category: 'Category', cover_url: 'Cover image', status: 'Publication status', 'lesson:insert': 'Lesson added', 'lesson:update': 'Lesson updated', 'lesson:delete': 'Lesson removed' };
export default function AdminNotifications({ notifications, courses }: Props) {
  const { t } = useLocale(); return <div className="space-y-4 p-6">{notifications.length ? notifications.map(notification => <article key={notification.id} className="flex items-start gap-4 rounded-xl border p-5"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary"><BellRing size={19}/></span><div className="min-w-0 flex-1"><p className="text-sm font-semibold">{t('Published course updated')}</p><p className="mt-1 text-xs text-muted-foreground">{courses.find(course => course.id === notification.course_id)?.title || t('Course content')} · {dateLabel(notification.created_at)}</p><div className="mt-3 flex flex-wrap gap-2">{notification.changed_fields.map(field => <span key={field} className="badge">{t(FIELDS[field] || 'Course details updated')}</span>)}</div><p className="mt-3 text-xs text-muted-foreground">{t('Changes are live. Enrolled learners keep uninterrupted access.')}</p></div><Link className="icon-btn" to={`/courses/${notification.course_id}`} aria-label="Review updated course"><ArrowUpRight size={18}/></Link></article>) : <p className="py-3 text-sm text-muted-foreground">{t('No course updates to review. Changes to published courses will be recorded here automatically.')}</p>}</div>;
}
