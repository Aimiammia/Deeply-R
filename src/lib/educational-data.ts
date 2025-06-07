
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
  'elementary_3': [ // Added
    { id: 'math_e3', name: 'ریاضی سوم ابتدایی', totalChapters: 8 },
    { id: 'farsi_e3', name: 'فارسی سوم ابتدایی', totalChapters: 7 },
    { id: 'science_e3', name: 'علوم تجربی سوم ابتدایی', totalChapters: 12 },
    { id: 'social_e3', name: 'مطالعات اجتماعی سوم ابتدایی', totalChapters: 9 },
    { id: 'quran_e3', name: 'قرآن سوم ابتدایی', totalChapters: 10 },
    { id: 'gifts_e3', name: 'هدیه‌های آسمان سوم ابتدایی', totalChapters: 20 },
  ],
  'elementary_4': [ // Added
    { id: 'math_e4', name: 'ریاضی چهارم ابتدایی', totalChapters: 7 },
    { id: 'farsi_e4', name: 'فارسی چهارم ابتدایی', totalChapters: 7 },
    { id: 'science_e4', name: 'علوم تجربی چهارم ابتدایی', totalChapters: 13 },
    { id: 'social_e4', name: 'مطالعات اجتماعی چهارم ابتدایی', totalChapters: 11 },
    { id: 'quran_e4', name: 'قرآن چهارم ابتدایی', totalChapters: 10 },
    { id: 'gifts_e4', name: 'هدیه‌های آسمان چهارم ابتدایی', totalChapters: 19 },
  ],
  'elementary_5': [ // Added
    { id: 'math_e5', name: 'ریاضی پنجم ابتدایی', totalChapters: 7 },
    { id: 'farsi_e5', name: 'فارسی پنجم ابتدایی', totalChapters: 6 },
    { id: 'science_e5', name: 'علوم تجربی پنجم ابتدایی', totalChapters: 12 },
    { id: 'social_e5', name: 'مطالعات اجتماعی پنجم ابتدایی', totalChapters: 10 },
    { id: 'quran_e5', name: 'قرآن پنجم ابتدایی', totalChapters: 10 },
    { id: 'gifts_e5', name: 'هدیه‌های آسمان پنجم ابتدایی', totalChapters: 17 },
  ],
  'elementary_6': [
    { id: 'math_e6', name: 'ریاضی ششم ابتدایی', totalChapters: 7 },
    { id: 'farsi_e6', name: 'فارسی ششم ابتدایی', totalChapters: 6 },
    { id: 'science_e6', name: 'علوم تجربی ششم ابتدایی', totalChapters: 14 },
    { id: 'social_e6', name: 'مطالعات اجتماعی ششم ابتدایی', totalChapters: 12 },
    { id: 'think_e6', name: 'تفکر و پژوهش ششم ابتدایی', totalChapters: 6 },
    { id: 'worktech_e6', name: 'کار و فناوری ششم ابتدایی', totalChapters: 5 },
  ],
  'middle_7': [
    { id: 'math_m7', name: 'ریاضی هفتم', totalChapters: 9 },
    { id: 'science_m7', name: 'علوم تجربی هفتم', totalChapters: 15 },
    { id: 'farsi_m7', name: 'فارسی هفتم', totalChapters: 6 },
    { id: 'arabic_m7', name: 'عربی هفتم', totalChapters: 10 },
    { id: 'english_m7', name: 'زبان انگلیسی هفتم', totalChapters: 8 },
    { id: 'social_m7', name: 'مطالعات اجتماعی هفتم', totalChapters: 12 },
    { id: 'quran_m7', name: 'قرآن هفتم', totalChapters: 12 },
    { id: ' پیام_های_آسمان_m7', name: ' پیام‌های آسمان هفتم', totalChapters: 15 },
  ],
  'middle_8': [ // Added
    { id: 'math_m8', name: 'ریاضی هشتم', totalChapters: 9 },
    { id: 'science_m8', name: 'علوم تجربی هشتم', totalChapters: 15 },
    { id: 'farsi_m8', name: 'فارسی هشتم', totalChapters: 6 },
    { id: 'arabic_m8', name: 'عربی هشتم', totalChapters: 10 },
    { id: 'english_m8', name: 'زبان انگلیسی هشتم', totalChapters: 7 },
    { id: 'social_m8', name: 'مطالعات اجتماعی هشتم', totalChapters: 12 },
    { id: ' پیام_های_آسمان_m8', name: ' پیام‌های آسمان هشتم', totalChapters: 15 },
  ],
  'middle_9': [ // Added
    { id: 'math_m9', name: 'ریاضی نهم', totalChapters: 8 },
    { id: 'science_m9', name: 'علوم تجربی نهم', totalChapters: 15 },
    { id: 'farsi_m9', name: 'فارسی نهم', totalChapters: 6 },
    { id: 'arabic_m9', name: 'عربی نهم', totalChapters: 10 },
    { id: 'english_m9', name: 'زبان انگلیسی نهم', totalChapters: 6 },
    { id: 'social_m9', name: 'مطالعات اجتماعی نهم', totalChapters: 12 },
    { id: 'defense_m9', name: 'آمادگی دفاعی نهم', totalChapters: 12 },
    { id: ' پیام_های_آسمان_m9', name: ' پیام‌های آسمان نهم', totalChapters: 12 },
  ],
  'high_10': [ // Assuming a general list for 10th grade. You might want to branch this by field of study.
    { id: 'math_h10', name: 'ریاضی (۱) - دهم', totalChapters: 7 },
    { id: 'physics_h10', name: 'فیزیک (۱) - دهم', totalChapters: 5 },
    { id: 'chemistry_h10', name: 'شیمی (۱) - دهم', totalChapters: 3 },
    { id: 'farsi_h10', name: 'فارسی (۱) - دهم', totalChapters: 8 },
    { id: 'english_h10', name: 'زبان انگلیسی (۱) - دهم', totalChapters: 4 },
    { id: 'religion_h10', name: 'دین و زندگی (۱) - دهم', totalChapters: 12 },
    { id: 'arabic_h10', name: 'عربی، زبان قرآن (۱) - دهم', totalChapters: 8 },
    { id: 'geo_h10', name: 'جغرافیا ایران - دهم', totalChapters: 10 },
    { id: 'defense_h10', name: 'آمادگی دفاعی - دهم', totalChapters: 12 },
  ],
  'high_11': [
    { id: 'math_h11_exp', name: 'حسابان (۱) - یازدهم تجربی/ریاضی', totalChapters: 5 },
    { id: 'math_h11_hum', name: 'ریاضی و آمار (۲) - یازدهم انسانی', totalChapters: 3 },
    { id: 'physics_h11_exp', name: 'فیزیک (۲) - یازدهم تجربی/ریاضی', totalChapters: 4 },
    { id: 'chemistry_h11', name: 'شیمی (۲) - یازدهم', totalChapters: 3 },
    { id: 'farsi_h11', name: 'فارسی (۲) - یازدهم', totalChapters: 8 },
    { id: 'english_h11', name: 'زبان انگلیسی (۲) - یازدهم', totalChapters: 3 },
    { id: 'religion_h11', name: 'دین و زندگی (۲) - یازدهم', totalChapters: 12 },
    { id: 'arabic_h11', name: 'عربی، زبان قرآن (۲) - یازدهم', totalChapters: 7 },
  ],
  'high_12': [
    { id: 'math_h12_exp', name: 'حسابان (۲) - دوازدهم تجربی/ریاضی', totalChapters: 4 },
    { id: 'math_h12_hum', name: 'ریاضی و آمار (۳) - دوازدهم انسانی', totalChapters: 3 },
    { id: 'physics_h12_exp', name: 'فیزیک (۳) - دوازدهم تجربی/ریاضی', totalChapters: 4 },
    { id: 'chemistry_h12', name: 'شیمی (۳) - دوازدهم', totalChapters: 4 },
    { id: 'farsi_h12', name: 'فارسی (۳) - دوازدهم', totalChapters: 8 },
    { id: 'english_h12', name: 'زبان انگلیسی (۳) - دوازدهم', totalChapters: 3 },
    { id: 'religion_h12', name: 'دین و زندگی (۳) - دوازدهم', totalChapters: 10 },
    { id: 'health_h12', name: 'سلامت و بهداشت - دوازدهم', totalChapters: 10 },
  ],
  'other': [] // 'other' level usually has no predefined subjects for this system
};

    