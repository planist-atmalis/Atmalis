import type { User } from '@supabase/supabase-js';
import { getClient } from '@/lib/api';
import type { AuthUser } from '@/types/academy';
export function mapUser(user: User): AuthUser { return { id: user.id, email: user.email || '', username: user.user_metadata?.username || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Learner' }; }
export async function signIn(email: string, password: string) {
  const client = await getClient(); const { data, error } = await client.auth.signInWithPassword({ email, password });
  if (error) throw new Error(error.message); return mapUser(data.user);
}
export async function sendOtp(email: string) {
  const client = await getClient(); const { error } = await client.auth.signInWithOtp({ email, options: { shouldCreateUser: true } });
  if (error) throw new Error(error.message);
}
export async function finishRegistration(email: string, token: string, password: string, username: string) {
  const client = await getClient(); const { error } = await client.auth.verifyOtp({ email, token, type: 'email' });
  if (error) throw new Error(error.message);
  const { data, error: updateError } = await client.auth.updateUser({ password, data: { username } });
  if (updateError) throw new Error(updateError.message); return mapUser(data.user!);
}
export async function signOut() { const client = await getClient(); const { error } = await client.auth.signOut(); if (error) throw new Error(error.message); }
export async function updateProfile(username: string) {
  const client = await getClient(); const { data, error } = await client.auth.updateUser({ data: { username } });
  if (error) throw new Error(error.message); return mapUser(data.user!);
}
export async function updatePassword(password: string) {
  const client = await getClient(); const { error } = await client.auth.updateUser({ password });
  if (error) throw new Error(error.message);
}
