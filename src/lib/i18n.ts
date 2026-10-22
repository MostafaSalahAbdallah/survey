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
  // --- Guidelines & Instructions Page ---
  instructionsBadge: {
    en: 'Research Protocol & Participant Guidelines',
    ar: 'ميثاق وضوابط المشاركة في البحث العلمي',
  },
  instructionsTitle: {
    en: 'Study Overview & Participant Guidelines',
    ar: 'إرشادات وتعليمات المشاركة في الاستبيان البحثي',
  },
  instructionsSubtitle: {
    en: 'Please carefully read the following instructions before starting the evaluation.',
    ar: 'يرجى قراءة التعليمات والضوابط التالية بعناية قبل البدء في الإجابة.',
  },
  instructionsWelcome: {
    en: 'Welcome to the Frontal Smile Assessment study. This scientific orthodontic research evaluates aesthetic smile perception using standardized visual criteria. To guarantee the highest research validity, please observe the protocol outlined below:',
    ar: 'نرحب بكم في استبيان تقييم الابتسامة من المنظور الأمامي، وهو بحث علمي في طب تقويم الأسنان يهدف إلى قياس المعايير الجمالية وتفضيلات الابتسامة بدقة إحصائية. لضمان صحة وموثوقية نتائج البحث، نرجو الالتزام بالضوابط التالية:',
  },
  ruleStructureTitle: {
    en: '1. Question Types & Study Stages',
    ar: '١. طبيعة الأسئلة ومراحل الاستبيان',
  },
  ruleStructureDesc: {
    en: 'The questionnaire consists of 3 stages: (1) General background information, (2) Individual smile rating sets (evaluating attractiveness on a 10 to 100 scale), and (3) Comparative smile ranking sets (ordering 4 smile variants from 1st most preferred to 4th least preferred).',
    ar: 'يتكون الاستبيان من ٣ مراحل: (١) معلومات عامة تمهيدية، (٢) مجموعات تقييم الابتسامات المنفردة (تحديد درجة الجاذبية على مقياس من 10 إلى 100)، و(٣) مجموعات الترتيب المقارن (ترتيب 4 ابتسامات تنازلياً من الأكثر تفضيلاً رقم 1 إلى الأقل تفضيلاً رقم 4).',
  },
  ruleDataTitle: {
    en: '2. Personal & Professional Data Collection',
    ar: '٢. جمع البيانات الشخصية والمهنية',
  },
  ruleDataDesc: {
    en: 'You will be asked to enter basic demographic information (Full Name, Gender, Age Group, Profession, and Years of Experience). These details are collected exclusively for statistical classification and research analysis, and will be handled with strict confidentiality.',
    ar: 'يطلب الاستبيان إدخال بيانات ديموغرافية أساسية (الاسم بالكامل، الجنس، الفئة العمرية، المهنة، وسنوات الخبرة). تُطلب هذه البيانات حصراً لأغراض التصنيف الإحصائي والمقارنة التحليلية بين الفئات، وتُحفظ بسرية وأمان تام لأغراض البحث الأكاديمي فقط.',
  },
  ruleTimerTitle: {
    en: '3. Mandatory Focus & Attention Timer',
    ar: '٣. مؤقت التركيز الزمني الإلزامي',
  },
  ruleTimerDesc: {
    en: 'To ensure accurate observation and thoughtful assessment, each photo page is equipped with a mandatory timer (21 seconds for rating sets and 30 seconds for ranking sets). The "Next" button remains locked until this timer finishes, preventing hurried or random answers.',
    ar: 'لضمان دقة الملاحظة والتأمل المتأني لتفاصيل كل صورة ومنع التسرع، تم تزويد صفحات الصور بمؤقت زمني إلزامي (21 ثانية لصفحات التقييم و30 ثانية لصفحات الترتيب). يظل زر الانتقال ("التالي") مقفلاً حتى انتهاء مدة المؤقت بالكامل.',
  },
  ruleMandatoryTitle: {
    en: '4. Mandatory Questions & No Skip Policy',
    ar: '٤. إلزامية الأسئلة وعدم التخطي بعد انتهاء المؤقت',
  },
  ruleMandatoryDesc: {
    en: 'The expiration of the timer does NOT automatically skip the page or cancel question requirements. All required questions must be fully and correctly answered before you can proceed to the next page. Take all the time you need to answer accurately.',
    ar: 'انتهاء وقت المؤقت لا يعني أبداً الانتقال التلقائي أو تخطي السؤال، ولا يُلغي إلزامية الإجابة؛ يجب إكمال جميع الأسئلة المطلوبة في كل صفحة لتتمكن من المتابعة. خذ كامل وقتك للإجابة بدقة متناهية بعد انتهاء المؤقت دون أي استعجال.',
  },
  ruleZoomTitle: {
    en: '5. High-Resolution Photo Zooming',
    ar: '٥. ميزة تكبير الصور عالية الدقة (Zoom)',
  },
  ruleZoomDesc: {
    en: 'You can inspect the subtle aesthetic details of any smile in full screen by clicking the maximize icon located in the upper-right corner of each image.',
    ar: 'يمكنك فحص أدق تفاصيل الأسنان والابتسامة بالشاشة الكاملة بالضغط على زر التكبير في الزاوية العلوية لكل صورة.',
  },
  acknowledgmentText: {
    en: 'I acknowledge that I have read and understood the instructions, and I commit to completing the survey with scientific focus and precision.',
    ar: 'أقر بأني قرأت وفهمت التعليمات والضوابط بالكامل، وأتعهد بالإجابة بتركيز وأمانة علمية.',
  },
  startSurveyBtn: {
    en: 'Start Survey',
    ar: 'البدء في الاستبيان',
  },
  // --- Timer UI Strings ---
  timerActive: {
    en: 'Focus timer: {seconds}s remaining before you can proceed',
    ar: 'مؤقت التركيز: متبقي {seconds} ثانية قبل إمكانية المتابعة',
  },
  timerComplete: {
    en: 'Focus time complete. You may proceed once all required questions are answered.',
    ar: 'اكتمل وقت التركيز المحدد. يمكنك المتابعة بعد استيفاء جميع الأسئلة المطلوبة.',
  },
  timerHint: {
    en: 'Please examine the smile aesthetics and details carefully.',
    ar: 'يرجى تأمل وتدقيق تفاصيل الابتسامة بعناية.',
  },
  nextWithTimer: {
    en: 'Next ({seconds}s)',
    ar: 'التالي ({seconds} ث)',
  },
  submitWithTimer: {
    en: 'Submit ({seconds}s)',
    ar: 'إرسال ({seconds} ث)',
  },
  waitTimerMessage: {
    en: 'Please wait until the focus timer completes to proceed.',
    ar: 'يرجى الانتظار حتى انتهاء مؤقت التركيز للمتابعة.',
  },
  completeRequiredMessage: {
    en: 'Please answer all required questions on this page to continue.',
    ar: 'يرجى إكمال جميع الأسئلة المطلوبة في هذه الصفحة للمتابعة.',
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
