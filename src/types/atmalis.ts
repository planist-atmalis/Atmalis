export interface PaymentSettings { id: string; sham_account: string; sham_instructions: string; }
export type MockStatus = 'succeeded' | 'failed' | 'pending';
export interface SandboxPayment { id: string; provider: string; amount: number; status: MockStatus; course_title: string; platform_share: number; instructor_share: number; created_at: string; }
export interface MockPaymentResult extends SandboxPayment { mode: 'mock'; qr_value: string; grants_access: false; }
export interface Certificate { id: string; serial: string; user_id: string; course_id: string; learner_name: string; course_title: string; status: 'valid' | 'revoked'; issued_at: string; }
export interface VerifiedCertificate { serial: string; learner_name: string; course_title: string; status: 'valid' | 'revoked'; issued_at: string; }
export interface Simulation { id: string; track: 'project' | 'business' | 'digital'; weeks: number; current_week: number; language: 'en' | 'ar' | 'tr'; status: 'active' | 'completed'; }
export interface SimulationTask { id: string; simulation_id: string; week: number; title: string; scenario: string; rubric: string[]; submission: string | null; feedback: string | null; score: number | null; }
