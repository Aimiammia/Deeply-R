
import type { FinancialInvestment } from '@/types';

export const investmentTypes: { value: FinancialInvestment['type']; label: string }[] = [
  { value: 'stocks', label: 'سهام شرکت‌ها' },
  { value: 'crypto', label: 'ارزهای دیجیتال' },
  { value: 'bonds', label: 'اوراق قرضه / مشارکت' },
  { value: 'gold', label: 'طلا و سکه' },
  { value: 'fund', label: 'صندوق‌های سرمایه‌گذاری' },
  { value: 'other', label: 'سایر سرمایه‌گذاری‌ها' },
];
