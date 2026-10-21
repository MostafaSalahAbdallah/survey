'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  SurveyConfig,
  SurveyAnswers,
  Language,
  SubmitPayload,
  SubmitResult,
} from '@/lib/types';
import {
  getStoredAnswers,
  setStoredAnswers,
  getStoredPageIndex,
  setStoredPageIndex,
  getStoredStartTime,
  clearSurveySession,
} from '@/lib/storage';
import { validatePage, validateAllAnswers } from '@/lib/validate';

interface UseSurveyProps {
  survey: SurveyConfig;
  language: Language | null;
}

export function useSurvey({ survey, language }: UseSurveyProps) {
  const [answers, setAnswersState] = useState<SurveyAnswers>({});
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [submissionId, setSubmissionId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Initialize from sessionStorage on mount
  useEffect(() => {
    const savedAnswers = getStoredAnswers();
    const savedPage = getStoredPageIndex();
    const savedTime = getStoredStartTime();

    setAnswersState(savedAnswers);
    if (savedPage < survey.pages.length) {
      setCurrentPageIndex(savedPage);
    }
    setStartTime(savedTime);
    setSubmissionId(
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `sub_${Date.now()}`
    );
  }, [survey.pages.length]);

  const currentPage = useMemo(
    () => survey.pages[currentPageIndex] || survey.pages[0],
    [survey.pages, currentPageIndex]
  );

  const totalPages = survey.pages.length;
  const isFirstPage = currentPageIndex === 0;
  const isLastPage = currentPageIndex === totalPages - 1;

  // Set answer helper with conditional clearing
  const setAnswer = useCallback(
    (questionId: string, value: any) => {
      setAnswersState((prev) => {
        const next = { ...prev, [questionId]: value };

        // Rule: If occupation switches to non_dental, clear work_experience
        if (questionId === 'occupation' && value === 'non_dental') {
          delete next['work_experience'];
        }

        setStoredAnswers(next);
        return next;
      });

      // Clear validation error for this question once answered
      setValidationErrors((prev) => {
        if (!prev[questionId]) return prev;
        const copy = { ...prev };
        delete copy[questionId];
        return copy;
      });
    },
    []
  );

  // Check if current page is valid (live check for Next button disabled state)
  const isCurrentPageValid = useMemo(() => {
    if (!currentPage) return false;
    const errors = validatePage(currentPage, answers);
    return Object.keys(errors).length === 0;
  }, [currentPage, answers]);

  const scrollToQuestion = (questionId: string) => {
    const el = document.getElementById(`question-${questionId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleNext = useCallback(() => {
    if (!currentPage) return;

    /* REVERT ME:
    const errors = validatePage(currentPage, answers);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      const firstErrorId = Object.keys(errors)[0];
      scrollToQuestion(firstErrorId);
      return;
    }
    */

    setValidationErrors({});
    if (currentPageIndex < totalPages - 1) {
      const nextIndex = currentPageIndex + 1;
      setCurrentPageIndex(nextIndex);
      setStoredPageIndex(nextIndex);
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
        setTimeout(() => {
          window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        }, 10);
      }
    }
  }, [currentPage, answers, currentPageIndex, totalPages]);

  const handleBack = useCallback(() => {
    if (currentPageIndex > 0) {
      const prevIndex = currentPageIndex - 1;
      setValidationErrors({});
      setSubmitError(null);
      setCurrentPageIndex(prevIndex);
      setStoredPageIndex(prevIndex);
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
        setTimeout(() => {
          window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        }, 10);
      }
    }
  }, [currentPageIndex]);

  const handleSubmit = useCallback(async () => {
    if (isSubmitting || !language) return;

    // Validate entire survey
    const { isValid, errors } = validateAllAnswers(survey, answers);
    if (!isValid) {
      setValidationErrors(errors);
      // Find the first page with an error
      for (let i = 0; i < survey.pages.length; i++) {
        const pErrors = validatePage(survey.pages[i], answers);
        if (Object.keys(pErrors).length > 0) {
          setCurrentPageIndex(i);
          setStoredPageIndex(i);
          const firstErr = Object.keys(pErrors)[0];
          setTimeout(() => scrollToQuestion(firstErr), 100);
          break;
        }
      }
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    const durationSeconds = Math.max(1, Math.round((Date.now() - startTime) / 1000));

    const payload: SubmitPayload = {
      submission_id: submissionId,
      timestamp: new Date().toISOString(),
      language,
      duration_seconds: durationSeconds,
      answers,
    };

    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data: SubmitResult = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data.error || 'Submission failed');
      }

      // Success! Clear session storage and show thank-you
      clearSurveySession();
      setIsCompleted(true);
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err: any) {
      console.error('Survey submission error:', err);
      setSubmitError(err?.message || 'submitError');
    } finally {
      setIsSubmitting(false);
    }
  }, [isSubmitting, language, survey, answers, startTime, submissionId]);

  return {
    answers,
    setAnswer,
    currentPage,
    currentPageIndex,
    totalPages,
    isFirstPage,
    isLastPage,
    isCurrentPageValid,
    validationErrors,
    handleNext,
    handleBack,
    handleSubmit,
    isSubmitting,
    submitError,
    isCompleted,
    submissionId,
  };
}
