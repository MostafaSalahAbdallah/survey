import {
  QuestionConfig,
  SurveyConfig,
  SurveyAnswers,
  PageConfig,
  PhotoRankingQuestion,
} from './types';
import { getEnvFeatures } from './envConfig';

export interface ValidationOptions {
  skipRequired?: boolean;
}

/**
 * Checks if a question should be displayed based on showIf conditions.
 */
export function isQuestionVisible(
  question: QuestionConfig,
  answers: SurveyAnswers
): boolean {
  if (!question.showIf) {
    return true;
  }

  const parentAnswer = answers[question.showIf.question];
  if (!parentAnswer || typeof parentAnswer !== 'string') {
    return false;
  }

  return question.showIf.in.includes(parentAnswer);
}

/**
 * Validates a single question's answer.
 * Returns error translation key or null if valid.
 */
export function validateQuestion(
  question: QuestionConfig,
  answers: SurveyAnswers,
  options?: ValidationOptions
): string | null {
  const visible = isQuestionVisible(question, answers);
  if (!visible) {
    return null; // Invisible questions are always valid
  }

  const shouldSkipRequired = options?.skipRequired ?? getEnvFeatures().skipRequired;
  const val = answers[question.id];

  // If skipping required fields is enabled, empty/unanswered questions are valid
  if (shouldSkipRequired) {
    if (val === undefined || val === null || val === '') {
      return null;
    }
    if (question.type === 'photo_ranking' && (!Array.isArray(val) || val.length === 0)) {
      return null;
    }
  }

  // Required check
  if (question.required && !shouldSkipRequired) {
    if (val === undefined || val === null || val === '') {
      return 'required';
    }
  } else if (val === undefined || val === null || val === '') {
    return null;
  }

  switch (question.type) {
    case 'short_text': {
      if (typeof val !== 'string') return shouldSkipRequired ? null : 'required';
      const trimmed = val.trim();
      if (trimmed.length === 0) {
        return shouldSkipRequired ? null : 'required';
      }
      if (question.minLength && trimmed.length < question.minLength) {
        return shouldSkipRequired ? null : 'minChars';
      }
      if (question.maxLength && trimmed.length > question.maxLength) {
        return 'required';
      }
      return null;
    }

    case 'single_choice': {
      if (typeof val !== 'string' || val === '') {
        return shouldSkipRequired ? null : 'required';
      }
      const validOption = question.options.some((opt) => opt.value === val);
      if (!validOption) return shouldSkipRequired ? null : 'required';
      return null;
    }

    case 'number': {
      if (val === undefined || val === null || val === '') {
        return null;
      }
      const num = typeof val === 'number' ? val : Number(val);
      if (isNaN(num)) return shouldSkipRequired ? null : 'required';
      if (question.min !== undefined && num < question.min) return 'required';
      if (question.max !== undefined && num > question.max) return 'required';
      return null;
    }

    case 'photo_rating': {
      if (val === undefined || val === null || val === '') {
        return null;
      }
      const num = typeof val === 'number' ? val : Number(val);
      if (isNaN(num)) return shouldSkipRequired ? null : 'required';
      if (num < question.min || num > question.max) return 'required';
      if ((num - question.min) % question.step !== 0) return 'required';
      return null;
    }

    case 'photo_ranking': {
      if (!Array.isArray(val) || val.length === 0) {
        return shouldSkipRequired ? null : 'required';
      }
      const rankingQ = question as PhotoRankingQuestion;
      const expectedCount = rankingQ.photos.length;
      if (val.length !== expectedCount) {
        return shouldSkipRequired ? null : 'required';
      }

      const validPhotoIds = new Set(rankingQ.photos.map((p) => p.id));
      const seen = new Set<string>();

      for (const id of val) {
        if (!validPhotoIds.has(id) || seen.has(id)) {
          return shouldSkipRequired ? null : 'required';
        }
        seen.add(id);
      }

      return null;
    }

    default:
      return null;
  }
}

/**
 * Validates all questions on a single page.
 */
export function validatePage(
  page: PageConfig,
  answers: SurveyAnswers,
  options?: ValidationOptions
): Record<string, string> {
  const errors: Record<string, string> = {};

  for (const q of page.questions) {
    const error = validateQuestion(q, answers, options);
    if (error) {
      errors[q.id] = error;
    }
  }

  return errors;
}

/**
 * Validates the entire survey responses before submission.
 */
export function validateAllAnswers(
  survey: SurveyConfig,
  answers: SurveyAnswers,
  options?: ValidationOptions
): { isValid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  for (const page of survey.pages) {
    const pageErrors = validatePage(page, answers, options);
    Object.assign(errors, pageErrors);
  }

  // Check conditional rule: work experience should not be present if occupation is non_dental
  const occupation = answers['occupation'];
  const workExp = answers['work_experience'];
  if (occupation === 'non_dental' && workExp !== undefined && workExp !== '' && workExp !== null) {
    errors['work_experience'] = 'Work experience not allowed for non-dental occupations';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Validates survey.json structure at startup.
 */
export function validateSurveyStructure(survey: SurveyConfig): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  const seenQuestionIds = new Set<string>();

  if (!survey.pages || !Array.isArray(survey.pages) || survey.pages.length === 0) {
    errors.push('Survey must contain at least one page');
    return { isValid: false, errors };
  }

  for (let pIdx = 0; pIdx < survey.pages.length; pIdx++) {
    const page = survey.pages[pIdx];
    if (!page.questions || !Array.isArray(page.questions)) {
      errors.push(`Page index ${pIdx} (${page.id}) has no questions array`);
      continue;
    }

    for (const q of page.questions) {
      if (!q.id) {
        errors.push(`Question in page ${page.id} is missing an id`);
      } else if (seenQuestionIds.has(q.id)) {
        errors.push(`Duplicate question id: ${q.id}`);
      } else {
        seenQuestionIds.add(q.id);
      }

      if (q.type === 'photo_ranking') {
        const rankQ = q as PhotoRankingQuestion;
        if (!rankQ.photos || rankQ.photos.length !== 4) {
          errors.push(
            `Ranking question ${q.id} must have exactly 4 photos, found ${rankQ.photos?.length}`
          );
        }
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
