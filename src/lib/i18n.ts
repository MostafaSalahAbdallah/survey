import { Language } from './types';

export const UI_STRINGS: Record<string, Record<Language, string>> = {
  chooseLanguage: {
    en: 'Choose your language',
    ar: 'اختر لغتك',
  },
  chooseLanguageDesc: {
    en: 'Please select your preferred language to start the frontal smile evaluation study.',
    ar: 'يرجى اختيار لغتك المفضلة لبدء دراسة تقييم الابتسامة من المنظور الأمامي.',
  },
  english: {
    en: 'English',
    ar: 'English',
  },
  arabic: {
    en: 'عربي',
    ar: 'عربي',
  },
  next: {
    en: 'Next',
    ar: 'التالي',
  },
  back: {
    en: 'Back',
    ar: 'السابق',
  },
  submit: {
    en: 'Submit',
    ar: 'إرسال',
  },
  submitting: {
    en: 'Submitting...',
    ar: 'جارٍ الإرسال...',
  },
  pageOf: {
    en: 'Page {current} of {total}',
    ar: 'صفحة {current} من {total}',
  },
  required: {
    en: 'This question is required.',
    ar: 'هذا السؤال مطلوب.',
  },
  minChars: {
    en: 'Please enter at least 3 characters.',
    ar: 'يرجى إدخال 3 أحرف على الأقل.',
  },
  answerAll: {
    en: 'Please answer all required questions to continue.',
    ar: 'يرجى الإجابة عن جميع الأسئلة المطلوبة للمتابعة.',
  },
  submitError: {
    en: 'Something went wrong. Your answers are saved, please try again.',
    ar: 'حدث خطأ ما. إجاباتك محفوظة، يرجى المحاولة مرة أخرى.',
  },
  thanksTitle: {
    en: 'Thank you for participating!',
    ar: 'شكراً لمشاركتك!',
  },
  thanksBody: {
    en: 'Your responses have been successfully recorded. Your contribution is valuable to this scientific orthodontic research.',
    ar: 'تم تسجيل إجاباتك بنجاح. مشاركتك قيّمة ومهمة لهذا البحث العلمي في طب تقويم الأسنان.',
  },
  question: {
    en: 'Question',
    ar: 'السؤال',
  },
  rankedOfCount: {
    en: '{count} of {total} ranked',
    ar: 'تم ترتيب {count} من {total}',
  },
  zoom: {
    en: 'Zoom photo',
    ar: 'تكبير الصورة',
  },
  close: {
    en: 'Close',
    ar: 'إغلاق',
  },
  leastAttractive: {
    en: '10 = Least attractive',
    ar: '10 = الأقل جاذبية',
  },
  mostAttractive: {
    en: '100 = Most attractive',
    ar: '100 = الأكثر جاذبية',
  },
  rank1Badge: {
    en: '1st (Most preferred)',
    ar: 'الأول (الأكثر تفضيلاً)',
  },
  rank4Badge: {
    en: '4th (Least preferred)',
    ar: 'الرابع (الأقل تفضيلاً)',
  },
  charsRemaining: {
    en: '{count} / {max} chars',
    ar: '{count} / {max} حرف',
  },
  submissionId: {
    en: 'Submission ID',
    ar: 'رقم المشاركة',
  },
  retry: {
    en: 'Try Again',
    ar: 'إعادة المحاولة',
  },
  studyNotice: {
    en: 'Scientific Research Survey • Confidential & Anonymous',
    ar: 'استبيان بحث علمي • سرية تامة وموثقة',
  },
  photoRatingReminder: {
    en: 'Rate the smile attractiveness from 10 (least attractive) to 100 (most attractive).',
    ar: 'قيّم مدى جاذبية الابتسامة من 10 (الأقل جاذبية) إلى 100 (الأكثر جاذبية).',
  },
  photoRankingReminder: {
    en: 'Arrange by clicking the photos: choose your most preferred first, down to least preferred (1 to 4).',
    ar: 'رتّب بالضغط على الصور: اختر الأكثر تفضيلاً أولاً حتى الأقل تفضيلاً (من 1 إلى 4).',
  },
  maximizeInstruction: {
    en: 'You can click the button in the top-right corner of the photo to maximize its size.',
    ar: 'يمكنك الضغط على الزر في الزاوية العلوية للصورة لتكبير حجمها وعرضها بالشاشة الكاملة.',
  },
  clickToEnlarge: {
    en: 'Click to enlarge photo',
    ar: 'اضغط لتكبير الصورة',
  },
  enlargeShort: {
    en: 'Enlarge',
    ar: 'تكبير',
  },
};

export function getTranslation(
  key: string,
  lang: Language = 'en',
  replacements?: Record<string, string | number>
): string {
  let text = UI_STRINGS[key]?.[lang] ?? UI_STRINGS[key]?.en ?? key;

  if (replacements) {
    for (const [k, val] of Object.entries(replacements)) {
      text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), String(val));
    }
  }

  return text;
}
