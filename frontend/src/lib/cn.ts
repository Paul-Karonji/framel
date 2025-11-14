import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility to merge class names with Tailwind CSS
 * This is a separate file for shadcn/ui compatibility
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
