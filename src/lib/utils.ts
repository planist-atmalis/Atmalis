import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }
export const money = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(Number(value));
export const dateLabel = (date: string) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
export const initials = (name: string) => name.split(/\s+/).map(part => part[0]).slice(0, 2).join('').toUpperCase();
