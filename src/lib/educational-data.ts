
export interface Subject {
  id: string; // Unique identifier for the subject, e.g., 'math_e1'
  name: string; // Display name for the subject, e.g., 'ریاضی اول ابتدایی'
  totalChapters: number;
}

// This is a sample list. You should expand this with actual subjects and chapter counts for all relevant levels.
export const educationalSubjects: Record<string, Subject[]> = {
  'elementary_1': [
    { id: 'math_e1', name: 'ریاضی اول ابتدایی', totalChapters: 7 },
    { id: 'farsi_read_e1', name: 'فارسی خوانداری اول ابتدایی', totalChapters: 10 },
    { id: 'farsi_write_e1', name: 'فارسی نوشتاری اول ابتدایی', totalChapters: 10 },
    { id: 'quran_e1', name: 'قرآن اول ابتدایی', totalChapters: 4 },
    { id: 'science_e1', name: 'علوم تجربی اول ابتدایی', totalChapters: 5 },
  ],
  'elementary_2': [
    { id: 'math_e2', name: 'ریاضی دوم ابتدایی', totalChapters: 8 },
    { id: 'farsi_e2', name: 'فارسی دوم ابتدایی', totalChapters: 7 },
    { id: 'quran_e2', name: 'قرآن دوم ابتدایی', totalChapters: 7 },
    { id: 'science_e2', name: 'علوم تجربی دوم ابتدایی', totalChapters: 10 },
    { id: 'gifts_e2', name: 'هدیه‌های آسمان دوم ابتدایی', totalChapters: 20 },
  ],
  'elementary_6': [
    { id: 'math_e6', name: 'ریاضی ششم ابتدایی', totalChapters: 7 },
    { id: 'farsi_e6', name: 'فارسی ششم ابتدایی', totalChapters: 6 },
    { id: 'science_e6', name: 'علوم تجربی ششم ابتدایی', totalChapters: 14 },
    { id: 'social_e6', name: 'مطالعات اجتماعی ششم ابتدایی', totalChapters: 12 },
  ],
  'middle_7': [
    { id: 'math_m7', name: 'ریاضی هفتم', totalChapters: 9 },
    { id: 'science_m7', name: 'علوم تجربی هفتم', totalChapters: 15 },
    { id: 'farsi_m7', name: 'فارسی هفتم', totalChapters: 6 },
    { id: 'arabic_m7', name: 'عربی هفتم', totalChapters: 10 },
    { id: 'english_m7', name: 'زبان انگلیسی هفتم', totalChapters: 8 },
  ],
  'high_10': [ // Assuming a general list for 10th grade. You might want to branch this by field of study.
    { id: 'math_h10', name: 'ریاضی (۱) - دهم', totalChapters: 7 },
    { id: 'physics_h10', name: 'فیزیک (۱) - دهم', totalChapters: 5 },
    { id: 'chemistry_h10', name: 'شیمی (۱) - دهم', totalChapters: 3 },
    { id: 'farsi_h10', name: 'فارسی (۱) - دهم', totalChapters: 8 },
    { id: 'english_h10', name: 'زبان انگلیسی (۱) - دهم', totalChapters: 4 },
    { id: 'religion_h10', name: 'دین و زندگی (۱) - دهم', totalChapters: 12 },
    { id: 'arabic_h10', name: 'عربی، زبان قرآن (۱) - دهم', totalChapters: 8 },
  ],
  'high_11': [
    { id: 'math_h11', name: 'حسابان (۱) یا ریاضی (۲) - یازدهم', totalChapters: 5 }, // Example, varies by branch
    { id: 'physics_h11', name: 'فیزیک (۲) - یازدهم', totalChapters: 4 },
    { id: 'chemistry_h11', name: 'شیمی (۲) - یازدهم', totalChapters: 3 },
  ],
  'high_12': [
    { id: 'math_h12', name: 'حسابان (۲) یا ریاضی (۳) - دوازدهم', totalChapters: 4 }, // Example, varies by branch
    { id: 'physics_h12', name: 'فیزیک (۳) - دوازدهم', totalChapters: 4 },
    { id: 'chemistry_h12', name: 'شیمی (۳) - دوازدهم', totalChapters: 4 },
  ],
  'other': [] // 'other' level usually has no predefined subjects for this system
};
