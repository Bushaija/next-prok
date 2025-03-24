import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a date to a readable string
 * @param date Date to format
 * @returns Formatted date string
 */
export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return "N/A";
  
  try {
    // Check if we're dealing with a string date
    const dateObj = typeof date === "string" ? new Date(date) : date;
    
    // Check if date is valid
    if (isNaN(dateObj.getTime())) {
      return "Invalid date";
    }
    
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(dateObj);
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid date";
  }
}

/**
 * Format a number as currency
 * @param value Number to format
 * @param currency Currency code (default: USD)
 * @param locale Locale string (default: en-US)
 * @returns Formatted currency string
 */
export function formatCurrency(
  value: number | string | null | undefined,
  currency: string = "USD",
  locale: string = "en-US"
): string {
  if (value === null || value === undefined) return "N/A";
  
  const numValue = typeof value === "string" ? parseFloat(value) : value;
  
  // Check if it's a valid number
  if (isNaN(numValue)) return "N/A";
  
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numValue);
}
