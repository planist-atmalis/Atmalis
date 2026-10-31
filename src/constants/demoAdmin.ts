import { DEMO_COURSES } from '@/constants/demo';
import type { Order, Member, Application, Notification } from '@/types/academy';
export const DEMO_PENDING = DEMO_COURSES.map((course, index) => ({ ...course, status: index === 2 ? 'pending' as const : 'published' as const }));
export const DEMO_ORDERS: Order[] = [
  { id: 'sample-order-1', user_id: 'sample-member-1', course_id: 'preview-leadership', amount: 89, method: 'manual', receipt_path: null, status: 'pending', created_at: '2026-10-30' },
  { id: 'sample-order-2', user_id: 'sample-member-2', course_id: 'preview-projects', amount: 79, method: 'manual', receipt_path: null, status: 'approved', created_at: '2026-10-29' },
];
export const DEMO_MEMBERS: Member[] = [
  { user_id: 'sample-member-1', username: 'Alex Morgan', email: 'alex@example.com', role: 'student', created_at: '2026-10-24' },
  { user_id: 'sample-member-2', username: 'Jamie Rivers', email: 'jamie@example.com', role: 'student', created_at: '2026-10-22' },
  { user_id: 'preview', username: 'Sarah Mitchell', email: 'sarah@example.com', role: 'instructor', created_at: '2026-10-15' },
  { user_id: 'sample-member-4', username: 'Taylor Brooks', email: 'taylor@example.com', role: 'employee', created_at: '2026-10-12' },
];
export const DEMO_APPLICATIONS: Application[] = [{ id: 'sample-application', user_id: 'sample-member-2', bio: 'I’m a business strategist with 8 years of experience helping teams turn their ideas into focused, achievable plans. I’d love to share practical leadership frameworks.', status: 'pending', created_at: '2026-10-29' }];
export const DEMO_NOTIFICATIONS: Notification[] = [{ id: 'sample-notification', course_id: 'preview-leadership', message: 'Published course content updated', changed_fields: ['title', 'lesson:update'], created_at: '2026-10-30' }];
