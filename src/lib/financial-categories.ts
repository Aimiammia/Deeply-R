
export const predefinedCategories = [
  // Primarily Expense
  { value: 'خوراک', label: 'خوراک', type: 'expense' },
  { value: 'حمل و نقل', label: 'حمل و نقل', type: 'expense' },
  { value: 'مسکن', label: 'مسکن', type: 'expense' },
  { value: 'قبوض', label: 'قبوض (آب، برق، گاز، ...)', type: 'expense' },
  { value: 'سرگرمی', label: 'سرگرمی و تفریح', type: 'expense' },
  { value: 'سلامت', label: 'سلامت و درمان', type: 'expense' },
  { value: 'پوشاک', label: 'پوشاک', type: 'expense' },
  { value: 'خرید', label: 'خرید عمومی', type: 'expense' },
  { value: 'تحصیلات', label: 'تحصیلات و آموزش', type: 'expense' },
  { value: 'بیمه', label: 'بیمه', type: 'expense' },

  // Universal (can be income or expense)
  { value: 'هدایا', label: 'هدایا (دریافتی/پرداختی)', type: 'universal' },
  { value: 'پس‌انداز', label: 'پس‌انداز و سرمایه‌گذاری', type: 'universal' },
  { value: 'سایر', label: 'سایر', type: 'universal' },
  
  // Primarily Income
  { value: 'حقوق', label: 'حقوق', type: 'income' },
  { value: 'پاداش', label: 'پاداش و کارانه', type: 'income' },
  { value: 'فروش', label: 'فروش کالا/خدمات', type: 'income' },
  { value: 'سود سرمایه', label: 'سود سرمایه‌گذاری', type: 'income' },
  { value: 'درآمد متفرقه', label: 'درآمد متفرقه', type: 'income' },
];

// Filter categories based on their type
export const expenseCategories = predefinedCategories.filter(
  cat => cat.type === 'expense' || cat.type === 'universal'
);

export const incomeCategories = predefinedCategories.filter(
  cat => cat.type === 'income' || cat.type === 'universal'
);
