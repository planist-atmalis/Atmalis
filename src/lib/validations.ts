import { z } from 'zod';
export const authSchema = z.object({ email: z.string().email('Enter a valid email address.'), password: z.string().min(6, 'Use at least 6 characters.'), username: z.string().optional(), token: z.string().optional() });
export const courseSchema = z.object({ title: z.string().min(5, 'Use at least 5 characters.').max(150), description: z.string().min(20, 'Describe the course in at least 20 characters.').max(10000), category: z.string().min(1), price: z.coerce.number().min(0).max(100000), cover_url: z.union([z.literal(''), z.string().url('Enter a valid image URL.')]) });
export const lessonSchema = z.object({ title: z.string().min(3, 'Enter a lesson title.').max(150), video_url: z.union([z.literal(''), z.string().url('Enter an HTTPS video URL.').refine(url => url.startsWith('https://'), 'Use a secure HTTPS URL.')]), position: z.coerce.number().int().min(1) });
export const applicationSchema = z.object({ bio: z.string().min(40, 'Tell us about your experience in at least 40 characters.').max(5000) });
export const inviteSchema = z.object({ email: z.string().email('Enter a valid email.'), role: z.enum(['employee', 'student']) });
