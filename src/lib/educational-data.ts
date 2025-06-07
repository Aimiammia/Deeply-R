
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
  'elementary_3': [
    { id: 'math_e3', name: 'ریاضی سوم ابتدایی', totalChapters: 8 },
    { id: 'farsi_e3', name: 'فارسی سوم ابتدایی', totalChapters: 7 },
    { id: 'science_e3', name: 'علوم تجربی سوم ابتدایی', totalChapters: 12 },
    { id: 'social_e3', name: 'مطالعات اجتماعی سوم ابتدایی', totalChapters: 9 },
    { id: 'quran_e3', name: 'قرآن سوم ابتدایی', totalChapters: 10 },
    { id: 'gifts_e3', name: 'هدیه‌های آسمان سوم ابتدایی', totalChapters: 20 },
  ],
  'elementary_4': [
    { id: 'math_e4', name: 'ریاضی چهارم ابتدایی', totalChapters: 7 },
    { id: 'farsi_e4', name: 'فارسی چهارم ابتدایی', totalChapters: 7 },
    { id: 'science_e4', name: 'علوم تجربی چهارم ابتدایی', totalChapters: 13 },
    { id: 'social_e4', name: 'مطالعات اجتماعی چهارم ابتدایی', totalChapters: 11 },
    { id: 'quran_e4', name: 'قرآن چهارم ابتدایی', totalChapters: 10 },
    { id: 'gifts_e4', name: 'هدیه‌های آسمان چهارم ابتدایی', totalChapters: 19 },
  ],
  'elementary_5': [
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
    { id: 'quran_e6', name: 'قرآن ششم ابتدایی', totalChapters: 10 },
    { id: 'gifts_e6', name: 'هدیه‌های آسمان ششم ابتدایی', totalChapters: 17 },
  ],
  'middle_7': [
    { id: 'math_m7', name: 'ریاضی هفتم', totalChapters: 9 },
    { id: 'science_m7', name: 'علوم تجربی هفتم', totalChapters: 15 },
    { id: 'farsi_m7', name: 'فارسی هفتم', totalChapters: 6 },
    { id: 'arabic_m7', name: 'عربی هفتم', totalChapters: 10 },
    { id: 'english_m7', name: 'زبان انگلیسی هفتم', totalChapters: 8 },
    { id: 'social_m7', name: 'مطالعات اجتماعی هفتم', totalChapters: 12 },
    { id: 'quran_m7', name: 'قرآن هفتم', totalChapters: 12 },
    { id: 'payam_aseman_m7', name: 'پیام‌های آسمان هفتم', totalChapters: 15 },
    { id: 'think_life_m7', name: 'تفکر و سبک زندگی هفتم', totalChapters: 6 },
    { id: 'worktech_m7', name: 'کار و فناوری هفتم', totalChapters: 5 },
  ],
  'middle_8': [ 
    { id: 'math_m8', name: 'ریاضی هشتم', totalChapters: 9 },
    { id: 'science_m8', name: 'علوم تجربی هشتم', totalChapters: 15 },
    { id: 'farsi_m8', name: 'فارسی هشتم', totalChapters: 6 },
    { id: 'arabic_m8', name: 'عربی هشتم', totalChapters: 10 },
    { id: 'english_m8', name: 'زبان انگلیسی هشتم', totalChapters: 7 },
    { id: 'social_m8', name: 'مطالعات اجتماعی هشتم', totalChapters: 12 },
    { id: 'payam_aseman_m8', name: 'پیام‌های آسمان هشتم', totalChapters: 15 },
    { id: 'quran_m8', name: 'قرآن هشتم', totalChapters: 12 },
    { id: 'think_life_m8', name: 'تفکر و سبک زندگی هشتم', totalChapters: 6 },
    { id: 'worktech_m8', name: 'کار و فناوری هشتم', totalChapters: 5 },
  ],
  'middle_9': [
    { id: 'math_m9', name: 'ریاضی نهم', totalChapters: 8 },
    { id: 'science_m9', name: 'علوم تجربی نهم', totalChapters: 15 },
    { id: 'farsi_m9', name: 'فارسی نهم', totalChapters: 6 },
    { id: 'arabic_m9', name: 'عربی نهم', totalChapters: 10 },
    { id: 'english_m9', name: 'زبان انگلیسی نهم', totalChapters: 6 },
    { id: 'social_m9', name: 'مطالعات اجتماعی نهم', totalChapters: 12 },
    { id: 'defense_m9', name: 'آمادگی دفاعی نهم', totalChapters: 12 },
    { id: 'payam_aseman_m9', name: 'پیام‌های آسمان نهم', totalChapters: 12 },
    { id: 'quran_m9', name: 'قرآن نهم', totalChapters: 12 },
    { id: 'think_life_m9', name: 'تفکر و سبک زندگی نهم', totalChapters: 6 },
    { id: 'worktech_m9', name: 'کار و فناوری نهم', totalChapters: 5 },
  ],
  'high_10': [ 
    // Common Subjects for 10th Grade
    { id: 'farsi1_h10', name: 'فارسی (۱) - دهم', totalChapters: 8 },
    { id: 'english1_h10', name: 'زبان انگلیسی (۱) - دهم', totalChapters: 4 },
    { id: 'religion1_h10', name: 'دین و زندگی (۱) - دهم', totalChapters: 12 },
    { id: 'arabic1_h10', name: 'عربی، زبان قرآن (۱) - دهم', totalChapters: 8 },
    { id: 'geo_iran_h10', name: 'جغرافیا ایران - دهم', totalChapters: 10 },
    { id: 'defense_h10', name: 'آمادگی دفاعی - دهم', totalChapters: 12 },
    { id: 'media_lit_h10', name: 'تفکر و سواد رسانه‌ای - دهم', totalChapters: 5 },
    // Math/Physics Branch - 10th Grade
    { id: 'math1_h10_mathphys', name: 'ریاضی (۱) - رشته ریاضی و فیزیک', totalChapters: 7 },
    { id: 'geometry1_h10_mathphys', name: 'هندسه (۱) - رشته ریاضی و فیزیک', totalChapters: 4 },
    { id: 'physics1_h10_mathphys', name: 'فیزیک (۱) - رشته ریاضی و فیزیک', totalChapters: 5 },
    { id: 'chemistry1_h10_mathphys', name: 'شیمی (۱) - رشته ریاضی و فیزیک', totalChapters: 3 },
    // Experimental Sciences Branch - 10th Grade
    { id: 'math1_h10_sci', name: 'ریاضی (۱) - رشته علوم تجربی', totalChapters: 7 },
    { id: 'physics1_h10_sci', name: 'فیزیک (۱) - رشته علوم تجربی', totalChapters: 5 },
    { id: 'chemistry1_h10_sci', name: 'شیمی (۱) - رشته علوم تجربی', totalChapters: 3 },
    { id: 'biology1_h10_sci', name: 'زیست‌شناسی (۱) - رشته علوم تجربی', totalChapters: 7 },
    { id: 'geology_h10_sci', name: 'زمین‌شناسی - رشته علوم تجربی', totalChapters: 5 },
    // Humanities Branch - 10th Grade
    { id: 'math_stats1_h10_hum', name: 'ریاضی و آمار (۱) - رشته علوم انسانی', totalChapters: 4 },
    { id: 'lit_arts1_h10_hum', name: 'علوم و فنون ادبی (۱) - رشته علوم انسانی', totalChapters: 8 },
    { id: 'sociology1_h10_hum', name: 'جامعه‌شناسی (۱) - رشته علوم انسانی', totalChapters: 6 },
    { id: 'history1_h10_hum', name: 'تاریخ (۱) - رشته علوم انسانی', totalChapters: 7 },
    { id: 'logic_h10_hum', name: 'منطق - رشته علوم انسانی', totalChapters: 10 },
    { id: 'economics_h10_hum', name: 'اقتصاد - رشته علوم انسانی', totalChapters: 6 },
  ],
  'high_11': [
    // Common Subjects for 11th Grade
    { id: 'farsi2_h11', name: 'فارسی (۲) - یازدهم', totalChapters: 8 },
    { id: 'english2_h11', name: 'زبان انگلیسی (۲) - یازدهم', totalChapters: 3 },
    { id: 'religion2_h11', name: 'دین و زندگی (۲) - یازدهم', totalChapters: 12 },
    { id: 'arabic2_h11', name: 'عربی، زبان قرآن (۲) - یازدهم', totalChapters: 7 },
    { id: 'human_env_h11', name: 'انسان و محیط زیست - یازدهم', totalChapters: 5 },
    { id: 'contemporary_history_h11', name: 'تاریخ معاصر ایران - یازدهم', totalChapters: 6 },
    // Math/Physics Branch - 11th Grade
    { id: 'calculus1_h11_mathphys', name: 'حسابان (۱) - رشته ریاضی و فیزیک', totalChapters: 5 },
    { id: 'geometry2_h11_mathphys', name: 'هندسه (۲) - رشته ریاضی و فیزیک', totalChapters: 4 },
    { id: 'stats_prob_h11_mathphys', name: 'آمار و احتمال - رشته ریاضی و فیزیک', totalChapters: 4 },
    { id: 'physics2_h11_mathphys', name: 'فیزیک (۲) - رشته ریاضی و فیزیک', totalChapters: 4 },
    { id: 'chemistry2_h11_mathphys', name: 'شیمی (۲) - رشته ریاضی و فیزیک', totalChapters: 3 },
    // Experimental Sciences Branch - 11th Grade
    { id: 'math2_h11_sci', name: 'ریاضی (۲) - رشته علوم تجربی', totalChapters: 4 },
    { id: 'physics2_h11_sci', name: 'فیزیک (۲) - رشته علوم تجربی', totalChapters: 4 },
    { id: 'chemistry2_h11_sci', name: 'شیمی (۲) - رشته علوم تجربی', totalChapters: 3 },
    { id: 'biology2_h11_sci', name: 'زیست‌شناسی (۲) - رشته علوم تجربی', totalChapters: 9 },
    // Humanities Branch - 11th Grade
    { id: 'math_stats2_h11_hum', name: 'ریاضی و آمار (۲) - رشته علوم انسانی', totalChapters: 3 },
    { id: 'lit_arts2_h11_hum', name: 'علوم و فنون ادبی (۲) - رشته علوم انسانی', totalChapters: 12 },
    { id: 'sociology2_h11_hum', name: 'جامعه‌شناسی (۲) - رشته علوم انسانی', totalChapters: 10 },
    { id: 'history2_h11_hum', name: 'تاریخ (۲) - رشته علوم انسانی', totalChapters: 10 },
    { id: 'philosophy1_h11_hum', name: 'فلسفه (۱) - رشته علوم انسانی', totalChapters: 10 },
    { id: 'psychology_h11_hum', name: 'روانشناسی - رشته علوم انسانی', totalChapters: 8 },
  ],
  'high_12': [
    // Common Subjects for 12th Grade
    { id: 'farsi3_h12', name: 'فارسی (۳) - دوازدهم', totalChapters: 8 },
    { id: 'english3_h12', name: 'زبان انگلیسی (۳) - دوازدهم', totalChapters: 3 },
    { id: 'religion3_h12', name: 'دین و زندگی (۳) - دوازدهم', totalChapters: 10 },
    { id: 'health_hygiene_h12', name: 'سلامت و بهداشت - دوازدهم', totalChapters: 12 },
    { id: 'social_id_h12', name: 'هویت اجتماعی - دوازدهم', totalChapters: 6 },
    { id: 'family_life_h12', name: 'مدیریت خانواده و سبک زندگی - دوازدهم', totalChapters: 6 }, // Content might differ for boys/girls
    // Math/Physics Branch - 12th Grade
    { id: 'calculus2_h12_mathphys', name: 'حسابان (۲) - رشته ریاضی و فیزیک', totalChapters: 4 },
    { id: 'geometry3_h12_mathphys', name: 'هندسه (۳) - رشته ریاضی و فیزیک', totalChapters: 3 },
    { id: 'discrete_math_h12_mathphys', name: 'ریاضیات گسسته - رشته ریاضی و فیزیک', totalChapters: 3 },
    { id: 'physics3_h12_mathphys', name: 'فیزیک (۳) - رشته ریاضی و فیزیک', totalChapters: 4 },
    { id: 'chemistry3_h12_mathphys', name: 'شیمی (۳) - رشته ریاضی و فیزیک', totalChapters: 4 },
    // Experimental Sciences Branch - 12th Grade
    { id: 'math3_h12_sci', name: 'ریاضی (۳) - رشته علوم تجربی', totalChapters: 3 },
    { id: 'physics3_h12_sci', name: 'فیزیک (۳) - رشته علوم تجربی', totalChapters: 4 },
    { id: 'chemistry3_h12_sci', name: 'شیمی (۳) - رشته علوم تجربی', totalChapters: 4 },
    { id: 'biology3_h12_sci', name: 'زیست‌شناسی (۳) - رشته علوم تجربی', totalChapters: 8 },
    // Humanities Branch - 12th Grade
    { id: 'math_stats3_h12_hum', name: 'ریاضی و آمار (۳) - رشته علوم انسانی', totalChapters: 3 },
    { id: 'lit_arts3_h12_hum', name: 'علوم و فنون ادبی (۳) - رشته علوم انسانی', totalChapters: 12 },
    { id: 'sociology3_h12_hum', name: 'جامعه‌شناسی (۳) - رشته علوم انسانی', totalChapters: 10 },
    { id: 'history3_h12_hum', name: 'تاریخ (۳) - رشته علوم انسانی', totalChapters: 10 },
    { id: 'philosophy2_h12_hum', name: 'فلسفه (۲) - رشته علوم انسانی', totalChapters: 10 },
    { id: 'arabic_spec3_h12_hum', name: 'عربی تخصصی (۳) - رشته علوم انسانی', totalChapters: 5 },
  ],
  'other': [] // 'other' level usually has no predefined subjects for this system
};

    