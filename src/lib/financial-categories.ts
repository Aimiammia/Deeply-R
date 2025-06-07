
export const predefinedCategories = [
  { value: 'خوراک', label: 'خوراک' },
  { value: 'حمل و نقل', label: 'حمل و نقل' },
  { value: 'مسکن', label: 'مسکن' },
  { value: 'قبوض', label: 'قبوض' },
  { value: 'سرگرمی', label: 'سرگرمی' },
  { value: 'سلامت', label: 'سلامت' },
  { value: 'پوشاک', label: 'پوشاک' },
  { value: 'خرید', label: 'خرید عمومی' },
  { value: 'حقوق', label: 'حقوق (درآمد)' }, // Typically an income category
  { value: 'هدایا', label: 'هدایا' },
  { value: 'تحصیلات', label: 'تحصیلات' },
  { value: 'پس‌انداز', label: 'پس‌انداز' },
  { value: 'بیمه', label: 'بیمه' },
  { value: 'سایر', label: 'سایر' },
];

export const expenseCategories = predefinedCategories.filter(cat => cat.value !== 'حقوق (درآمد)');
export const incomeCategories = predefinedCategories.filter(cat => cat.value === 'حقوق (درآمد)');
