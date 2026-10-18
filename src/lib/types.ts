export type Language = 'en' | 'ar';

export type QuestionType =
  | 'short_text'
  | 'single_choice'
  | 'number'
  | 'photo_rating'
  | 'photo_ranking';

export interface OptionConfig {
  value: string;
  label: Record<Language, string>;
}

export interface ShowIfConfig {
  question: string;
  in: string[];
}

export interface PhotoConfig {
  id: string;
  src: string;
  alt?: Record<Language, string>;
}

export interface QuestionBase {
  id: string;
  type: QuestionType;
  required: boolean;
  label?: Record<Language, string>;
  instruction?: Record<Language, string>;
  showIf?: ShowIfConfig;
}

export interface ShortTextQuestion extends QuestionBase {
  type: 'short_text';
  minLength?: number;
  maxLength?: number;
  placeholder?: Record<Language, string>;
}

export interface SingleChoiceQuestion extends QuestionBase {
  type: 'single_choice';
  options: OptionConfig[];
}

export interface NumberQuestion extends QuestionBase {
  type: 'number';
  min?: number;
  max?: number;
  placeholder?: Record<Language, string>;
}

export interface PhotoRatingQuestion extends QuestionBase {
  type: 'photo_rating';
  photo: PhotoConfig;
  min: number;
  max: number;
  step: number;
}

export interface PhotoRankingQuestion extends QuestionBase {
  type: 'photo_ranking';
  photos: PhotoConfig[];
  shuffle?: boolean;
}

export type QuestionConfig =
  | ShortTextQuestion
  | SingleChoiceQuestion
  | NumberQuestion
  | PhotoRatingQuestion
  | PhotoRankingQuestion;

export interface PageConfig {
  id: string;
  title?: Record<Language, string>;
  description?: Record<Language, string>;
  questions: QuestionConfig[];
}

export interface SurveyMeta {
  title: Record<Language, string>;
  subtitle?: Record<Language, string>;
  photoRatingInstruction: Record<Language, string>;
  photoRankingInstruction: Record<Language, string>;
}

export interface SurveyConfig {
  meta: SurveyMeta;
  pages: PageConfig[];
}

/**
 * SurveyAnswers mapping:
 * - short_text: string
 * - single_choice: string (e.g. 'male', 'orthodontist')
 * - number: number
 * - photo_rating: number (10, 20, ..., 100)
 * - photo_ranking: string[] (ordered array of photo IDs: index 0 is rank 1, index 1 is rank 2, etc.)
 */
export type SurveyAnswers = Record<string, string | number | string[] | undefined>;

export interface SubmitPayload {
  submission_id: string;
  timestamp: string;
  language: Language;
  duration_seconds: number;
  answers: SurveyAnswers;
}

export interface SubmitResult {
  ok: boolean;
  submission_id?: string;
  error?: string;
}
