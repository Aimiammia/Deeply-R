import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for environments where crypto.randomUUID is not available
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 10);
  return `${timestamp}-${randomPart}`;
}

export const formatCurrency = (value: number | null | undefined): string => {
  if (value === null || value === undefined || isNaN(Number(value))) {
    return '۰ تومان';
  }
  const numericValue = Number(value);
  // fa-IR locale should use Arabic-Indic digits and Persian/Arabic thousands separator (٬)
  // Explicitly using style: 'decimal' ensures number formatting.
  return new Intl.NumberFormat('fa-IR', { style: 'decimal' }).format(numericValue) + ' تومان';
};
