import { type ClassValue, clsx } from 'clsx';

/**
 * Merge Tailwind classes safely. Install clsx if not present.
 * We skip tailwind-merge for now — add only if class conflicts appear.
 */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}

/** Generate a URL-safe slug from a title */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/** Format ISO date string to human-readable */
export function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/** Days until a deadline. Returns null if no deadline. */
export function daysUntilDeadline(deadline: string | null): number | null {
  if (!deadline) return null;
  const now = new Date();
  const target = new Date(deadline);
  const diffMs = target.getTime() - now.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}
