import { type ClassValue, clsx } from "clsx";

/**
 * Utility function to merge Tailwind CSS classes
 * Combines clsx and tailwind-merge for handling conditional classes and conflicts
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}
