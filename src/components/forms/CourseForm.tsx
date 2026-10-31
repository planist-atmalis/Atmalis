import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import { Save, AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useSave } from '@/hooks/useAcademy';
import { courseSchema } from '@/lib/validations';
import type { Course } from '@/types/academy';
import { useLocale } from '@/hooks/useLocale';
interface Props { course?: Course; }
export default function CourseForm({ course }: Props) {
  const { t } = useLocale(); const { user } = useAuth(); const navigate = useNavigate(); const save = useSave(t(course ? 'Course updated. Published changes are live immediately.' : 'Your draft is ready. Add your first lesson.'));
  const form = useForm<z.infer<typeof courseSchema>>({ resolver: zodResolver(courseSchema), defaultValues: { title: '', description: '', category: 'Leadership', price: 0, cover_url: '' } });
  useEffect(() => { if (course) form.reset({ title: course.title, description: course.description, category: course.category, price: Number(course.price), cover_url: course.cover_url || '' }); }, [course, form]);
  const submit = form.handleSubmit(values => save.mutate({ table: 'academy_courses', id: course?.id, values: { ...values, cover_url: values.cover_url || null, ...(!course ? { instructor_id: user!.id, status: 'draft' } : {}) } }, { onSuccess: data => { if (!course) navigate(`/instructor/courses/${data.id}/edit`, { replace: true }); } }));
  const errors = form.formState.errors;
  return <form onSubmit={submit} className="panel space-y-6 p-6"><div><h2 className="section-heading">{t('The foundations of your course')}</h2><p className="mt-1 text-xs text-muted-foreground">{t('Help learners understand what they will achieve.')}</p></div><div className="field"><label htmlFor="course-title">{t('Course title')}</label><input id="course-title" placeholder={t('Give your course a clear, inspiring name')} {...form.register('title')}/>{errors.title && <p className="field-error"><AlertCircle size={14}/>{t(errors.title.message || '')}</p>}</div><div className="field"><label htmlFor="description">{t('What will learners discover?')}</label><textarea id="description" rows={5} placeholder={t('Describe the skills, outcomes, and who this course is for…')} {...form.register('description')}/>{errors.description && <p className="field-error"><AlertCircle size={14}/>{t(errors.description.message || '')}</p>}</div>
    <div className="grid gap-5 sm:grid-cols-2"><div className="field"><label htmlFor="category">{t('Category')}</label><select id="category" {...form.register('category')}>{['Leadership', 'Business', 'Digital skills', 'Design', 'Technology', 'تطوير الأعمال', ...(course && !['Leadership', 'Business', 'Digital skills', 'Design', 'Technology', 'تطوير الأعمال'].includes(course.category) ? [course.category] : [])].map(item => <option key={item} value={item}>{t(item)}</option>)}</select></div><div className="field"><label htmlFor="price">{t('Course price (USD)')}</label><input id="price" type="number" min="0" step="0.01" {...form.register('price')}/>{errors.price && <p className="field-error"><AlertCircle size={14}/>{t(errors.price.message || '')}</p>}</div></div><div className="field"><label htmlFor="cover">{t('Cover image URL')} <span className="font-normal text-muted-foreground">{t('(optional)')}</span></label><input id="cover" type="url" placeholder="https://…" {...form.register('cover_url')}/>{errors.cover_url && <p className="field-error"><AlertCircle size={14}/>{t(errors.cover_url.message || '')}</p>}<p className="text-xs text-muted-foreground">{t('Use a landscape image. A curated illustration is shown by default.')}</p></div><div className="flex items-center justify-between gap-4 border-t pt-5"><p className="text-xs text-muted-foreground">{t(course?.status === 'published' ? 'Updates remain available to enrolled students.' : 'Save a draft before adding lessons.')}</p><button className="btn-primary" disabled={save.isPending}><Save size={16}/>{t(save.isPending ? 'Saving…' : course ? 'Save changes' : 'Create draft')}</button></div></form>;
}
