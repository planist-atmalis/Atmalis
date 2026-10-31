import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { useAcademyRows } from '@/hooks/useAcademy';
import { rpc } from '@/lib/api';
import type { Course, Order, Commission, Application, Notification, Member } from '@/types/academy';
export function useAdminData() {
  const { user, role } = useAuth(); const enabled = !!user && role === 'super_admin';
  const courses = useAcademyRows<Course>('academy_courses', {}, enabled);
  const orders = useAcademyRows<Order>('academy_orders', {}, enabled);
  const commissions = useAcademyRows<Commission>('academy_commissions', {}, enabled);
  const applications = useAcademyRows<Application>('instructor_applications', {}, enabled);
  const notifications = useAcademyRows<Notification>('academy_notifications', {}, enabled);
  const members = useQuery({ queryKey: ['academy', 'directory', user?.id], queryFn: () => rpc<Member[]>('academy_member_directory'), enabled, refetchInterval: 30000 });
  useEffect(() => { if (members.error) toast.error(members.error.message); }, [members.error]);
  return { courses, orders, commissions, applications, notifications, members };
}
