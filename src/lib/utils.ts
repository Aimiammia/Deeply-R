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
  if (value === null || value === undefined) {
    return '۰ تومان';
  }
  const numericValue = Number(value);
  if (isNaN(numericValue)) {
      return '۰ تومان';
  }
  // fa-IR locale uses Arabic-Indic digits and Persian/Arabic thousands separator (٬)
  return new Intl.NumberFormat('fa-IR', { style: 'decimal' }).format(numericValue) + ' تومان';
};