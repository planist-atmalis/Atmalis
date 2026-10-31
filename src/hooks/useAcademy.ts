import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { rows, saveRow, rpc } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import type { Course } from '@/types/academy';
export function useAcademyRows<T>(table: string, filters: Record<string, string> = {}, enabled = true, order = 'created_at') {
  const { user } = useAuth();
  const query = useQuery({ queryKey: ['academy', table, user?.id || 'public', filters], queryFn: () => rows<T>(table, filters, order), enabled, refetchInterval: 30000, staleTime: 15000, retry: 1 });
  useEffect(() => { if (query.error) toast.error(query.error.message); }, [query.error]); return query;
}
export function useCourses() {
  const { user } = useAuth();
  const query = useQuery({ queryKey: ['academy', 'catalog', user?.id || 'public'], queryFn: () => rpc<Course[]>('academy_course_catalog'), refetchInterval: 30000, staleTime: 15000, retry: 1 });
  useEffect(() => { if (query.error) toast.error(query.error.message); }, [query.error]); return query;
}
interface SaveInput { table: string; values: Record<string, unknown>; id?: string; }
export function useSave(message = 'Changes saved.') {
  const cache = useQueryClient();
  return useMutation({ mutationFn: ({ table, values, id }: SaveInput) => saveRow(table, values, id), onSuccess: () => { cache.invalidateQueries({ queryKey: ['academy'] }); toast.success(message); }, onError: (error: Error) => toast.error(error.message) });
}
