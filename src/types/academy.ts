export type Role = 'student' | 'instructor' | 'super_admin' | 'employee';
export interface AuthUser { id: string; email: string; username: string; }
export interface Course { id: string; instructor_id: string; title: string; description: string; category: string; price: number; cover_url: string | null; status: 'draft' | 'pending' | 'published' | 'rejected'; created_at: string; instructor_name?: string; duration?: string; level?: string; progress?: number; }
export interface Lesson { id: string; course_id: string; title: string; video_url: string | null; material_path: string | null; position: number; }
export interface Enrollment { id: string; user_id: string; course_id: string; created_at: string; }
export interface Progress { id: string; lesson_id: string; user_id: string; }
export interface Order { id: string; user_id: string; course_id: string; amount: number; method: string; receipt_path: string | null; status: 'pending' | 'approved' | 'rejected'; created_at: string; }
export interface Commission { id: string; instructor_id: string; total: number; platform_share: number; instructor_share: number; created_at: string; }
export interface Application { id: string; user_id: string; bio: string; status: string; created_at: string; }
export interface Notification { id: string; course_id: string; message: string; changed_fields: string[]; created_at: string; }
export interface Member { user_id: string; username: string; email: string; role: Role; created_at: string; }
