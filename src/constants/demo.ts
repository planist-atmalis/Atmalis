import leadership from '@/assets/course-leadership.webp';
import projects from '@/assets/course-projects.webp';
import design from '@/assets/course-design.webp';
import type { Course } from '@/types/academy';
export const COURSE_COVERS = [leadership, projects, design];
export const DEMO_COURSES: Course[] = [
  { id: 'preview-leadership', instructor_id: 'preview', title: 'The art of leading better', description: 'Build the confidence to lead a team, communicate with purpose, and create a culture where everyone can do their best work.', category: 'Leadership', price: 89, cover_url: leadership, status: 'published', created_at: '2026-10-26', instructor_name: 'Sarah Mitchell', duration: '6h 20m', level: 'All levels', progress: 64 },
  { id: 'preview-projects', instructor_id: 'preview', title: 'Project management, simplified', description: 'Take an idea from a first conversation to a successful delivery. Learn practical frameworks for planning, prioritizing, and working together.', category: 'Business', price: 79, cover_url: projects, status: 'published', created_at: '2026-10-24', instructor_name: 'Omar Hassan', duration: '4h 45m', level: 'Beginner', progress: 32 },
  { id: 'preview-design', instructor_id: 'preview', title: 'Build your digital strategy', description: 'Connect your business goals to a clear digital roadmap. Understand your audience, choose the right channels, and measure what matters.', category: 'Digital skills', price: 99, cover_url: design, status: 'published', created_at: '2026-10-20', instructor_name: 'Emily Carter', duration: '5h 10m', level: 'Intermediate', progress: 0 },
];
export const ROLE_LABELS = { student: 'Student', instructor: 'Instructor', super_admin: 'Administrator', employee: 'Employee' };
export const CATEGORIES = ['All courses', 'Leadership', 'Business', 'Digital skills', 'تطوير الأعمال'];
