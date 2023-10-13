// Import the required functions and types from external libraries.
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function for combining CSS class values.
 *
 * @param {...ClassValue} inputs - CSS class values to combine.
 * @returns {string} - Merged CSS classes.
 */
export function cn(...inputs: ClassValue[]) {
  // Merge the provided CSS classes using clsx and twMerge.
  return twMerge(clsx(inputs));
}
