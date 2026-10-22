import { Language, SurveyAnswers } from './types';

const STORAGE_KEYS = {
  LANGUAGE: 'frontal_smile_lang',
  ANSWERS: 'frontal_smile_answers',
  CURRENT_PAGE: 'frontal_smile_page',
  START_TIME: 'frontal_smile_start_time',
  SUBMISSION_ID: 'frontal_smile_sub_id',
  INSTRUCTIONS_ACCEPTED: 'frontal_smile_accepted_intro',
  COMPLETED_TIMERS: 'frontal_smile_completed_timers',
};

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.sessionStorage !== 'undefined';
}

export function getStoredLanguage(): Language | null {
  if (!isBrowser()) return null;
  const lang = window.sessionStorage.getItem(STORAGE_KEYS.LANGUAGE);
  if (lang === 'en' || lang === 'ar') return lang;
  return null;
}

export function setStoredLanguage(lang: Language): void {
  if (!isBrowser()) return;
  window.sessionStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
}

export function getStoredInstructionsAccepted(): boolean {
  if (!isBrowser()) return false;
  return window.sessionStorage.getItem(STORAGE_KEYS.INSTRUCTIONS_ACCEPTED) === 'true';
}

export function setStoredInstructionsAccepted(accepted: boolean): void {
  if (!isBrowser()) return;
  window.sessionStorage.setItem(STORAGE_KEYS.INSTRUCTIONS_ACCEPTED, String(accepted));
}

export function getStoredCompletedTimers(): number[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEYS.COMPLETED_TIMERS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function setStoredCompletedTimer(pageIndex: number): void {
  if (!isBrowser()) return;
  try {
    const current = getStoredCompletedTimers();
    if (!current.includes(pageIndex)) {
      current.push(pageIndex);
      window.sessionStorage.setItem(STORAGE_KEYS.COMPLETED_TIMERS, JSON.stringify(current));
    }
  } catch (e) {
    console.error('Failed to save completed timer', e);
  }
}

export function getStoredAnswers(): SurveyAnswers {
  if (!isBrowser()) return {};
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEYS.ANSWERS);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function setStoredAnswers(answers: SurveyAnswers): void {
  if (!isBrowser()) return;
  try {
    window.sessionStorage.setItem(STORAGE_KEYS.ANSWERS, JSON.stringify(answers));
  } catch (e) {
    console.error('Failed to save answers to sessionStorage', e);
  }
}

export function getStoredPageIndex(): number {
  if (!isBrowser()) return 0;
  const page = window.sessionStorage.getItem(STORAGE_KEYS.CURRENT_PAGE);
  const parsed = page ? parseInt(page, 10) : 0;
  return isNaN(parsed) ? 0 : parsed;
}

export function setStoredPageIndex(index: number): void {
  if (!isBrowser()) return;
  window.sessionStorage.setItem(STORAGE_KEYS.CURRENT_PAGE, String(index));
}

export function getStoredStartTime(): number {
  if (!isBrowser()) return 0;
  const raw = window.sessionStorage.getItem(STORAGE_KEYS.START_TIME);
  if (raw) {
    const parsed = parseInt(raw, 10);
    if (!isNaN(parsed)) return parsed;
  }
  const now = Date.now();
  if (isBrowser()) {
    window.sessionStorage.setItem(STORAGE_KEYS.START_TIME, String(now));
  }
  return now;
}

export function clearSurveySession(): void {
  if (!isBrowser()) return;
  try {
    window.sessionStorage.removeItem(STORAGE_KEYS.ANSWERS);
    window.sessionStorage.removeItem(STORAGE_KEYS.CURRENT_PAGE);
    window.sessionStorage.removeItem(STORAGE_KEYS.START_TIME);
    window.sessionStorage.removeItem(STORAGE_KEYS.INSTRUCTIONS_ACCEPTED);
    window.sessionStorage.removeItem(STORAGE_KEYS.COMPLETED_TIMERS);
    // Clear question shuffle cache
    for (let i = 1; i <= 6; i++) {
      window.sessionStorage.removeItem(`frontal_smile_shuffle_Q${i}`);
    }
    // Keep LANGUAGE so thank you page stays in same language
  } catch (e) {
    console.error('Failed to clear survey session', e);
  }
}
