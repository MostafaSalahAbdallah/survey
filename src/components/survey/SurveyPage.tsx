'use client';

import React, { useEffect } from 'react';
import {
  SurveyConfig,
  PageConfig,
  SurveyAnswers,
  QuestionConfig,
  Language,
} from '@/lib/types';
import { getTranslation } from '@/lib/i18n';
import { QuestionWrapper } from '@/components/questions/QuestionWrapper';
import { ShortText } from '@/components/questions/ShortText';
import { SingleChoice } from '@/components/questions/SingleChoice';
import { NumberInput } from '@/components/questions/NumberInput';
import { PhotoRating } from '@/components/questions/PhotoRating';
import { PhotoRanking } from '@/components/questions/PhotoRanking';
import {
  ChevronLeft,
  ChevronRight,
  Send,
  Loader2,
  AlertTriangle,
  Clock,
} from 'lucide-react';
import { usePageTimer } from '@/hooks/usePageTimer';
import { PageTimerBanner } from '@/components/common/PageTimerBanner';

interface SurveyPageProps {
  survey: SurveyConfig;
  page: PageConfig;
  pageIndex: number;
  answers: SurveyAnswers;
  setAnswer: (questionId: string, value: any) => void;
  language: Language;
  validationErrors: Record<string, string>;
  isFirstPage: boolean;
  isLastPage: boolean;
  isCurrentPageValid: boolean;
  onNext: () => void;
  onBack: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  submitError: string | null;
}

export const SurveyPage: React.FC<SurveyPageProps> = ({
  survey,
  page,
  pageIndex,
  answers,
  setAnswer,
  language,
  validationErrors,
  isFirstPage,
  isLastPage,
  isCurrentPageValid,
  onNext,
  onBack,
  onSubmit,
  isSubmitting,
  submitError,
}) => {
  const isRTL = language === 'ar';

  // Helper to check conditional display (e.g. work_experience)
  const isQuestionVisible = (q: QuestionConfig, currentAnswers: SurveyAnswers) => {
    if (!q.showIf) return true;
    const targetVal = currentAnswers[q.showIf.question];
    if (q.showIf.in && Array.isArray(q.showIf.in)) {
      return typeof targetVal === 'string' && q.showIf.in.includes(targetVal);
    }
    return true;
  };

  // Calculate question sequential numbering offset across pages
  let questionNumberOffset = 0;
  for (let i = 0; i < pageIndex; i++) {
    questionNumberOffset += survey.pages[i].questions.length;
  }

  // Preload photos for next page to ensure smooth UX
  useEffect(() => {
    const nextPageIndex = pageIndex + 1;
    if (nextPageIndex < survey.pages.length) {
      const nextPage = survey.pages[nextPageIndex];
      nextPage.questions.forEach((q: any) => {
        if (q.type === 'photo_rating' && q.photo?.src) {
          const img = new window.Image();
          img.src = q.photo.src;
        } else if (q.type === 'photo_ranking' && Array.isArray(q.photos)) {
          q.photos.forEach((p: any) => {
            if (p.src) {
              const img = new window.Image();
              img.src = p.src;
            }
          });
        }
      });
    }
  }, [pageIndex, survey.pages]);

  // Ensure view resets to the very top on every page change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }
  }, [pageIndex]);

  const pageTitle = page.title?.[language] || page.title?.en;
  const pageDesc = page.description?.[language] || page.description?.en;
  const pageInstruction =
    page.questions.some((q) => q.type === 'photo_rating')
      ? survey.meta.photoRatingInstruction[language] || survey.meta.photoRatingInstruction.en
      : page.questions.some((q) => q.type === 'photo_ranking')
      ? survey.meta.photoRankingInstruction[language] || survey.meta.photoRankingInstruction.en
      : null;

  const totalPages = survey.pages.length;
  const {
    timeLeft,
    totalDuration,
    isTimerActive,
    isTimerComplete,
  } = usePageTimer({ pageIndex, totalPages });

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Page Header */}
      <div className="bg-white/95 rounded-2xl p-5 sm:p-6 border border-[#f4d0c1] shadow-xs">
        {pageTitle && (
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-1">
            {pageTitle}
          </h2>
        )}
        {pageDesc && (
          <p className="text-sm text-slate-500 leading-relaxed">{pageDesc}</p>
        )}
        {pageInstruction && (
          <div className="mt-3 p-3.5 rounded-xl bg-[#fff8f5] border border-slate-300 text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
            {pageInstruction}
          </div>
        )}
      </div>

      {/* Focus & Accuracy Timer Banner */}
      <PageTimerBanner
        timeLeft={timeLeft}
        totalDuration={totalDuration}
        isTimerActive={isTimerActive}
        isTimerComplete={isTimerComplete}
        language={language}
      />

      {/* Questions List */}
      <div className="flex flex-col gap-6">
        {page.questions.map((q: QuestionConfig, idx: number) => {
          if (!isQuestionVisible(q, answers)) {
            return null;
          }

          const qNumber = questionNumberOffset + idx + 1;
          const label = q.label?.[language] || q.label?.en;
          const error = validationErrors[q.id] || null;

          const isPhotoRating = q.type === 'photo_rating';
          const isPhotoRanking = q.type === 'photo_ranking';

          // Short reminder description on each question
          const qDescription = isPhotoRating
            ? getTranslation('photoRatingReminder', language)
            : isPhotoRanking
            ? getTranslation('photoRankingReminder', language)
            : undefined;

          // First question in each photo page shows maximize button illustration & banner
          const isFirstQuestionInPage = idx === 0;
          const showMaximizeHelp = isFirstQuestionInPage && (isPhotoRating || isPhotoRanking);

          const qInstruction = showMaximizeHelp
            ? ('instruction' in q && (q as any).instruction?.[language]
                ? (q as any).instruction[language] || (q as any).instruction?.en
                : getTranslation('maximizeInstruction', language))
            : ('instruction' in q
                ? (q as any).instruction?.[language] || (q as any).instruction?.en
                : undefined);

          return (
            <QuestionWrapper
              key={q.id}
              id={q.id}
              questionNumber={qNumber}
              label={label}
              description={qDescription}
              instruction={qInstruction}
              compactMobile={isPhotoRanking}
              required={q.required}
              error={error}
              language={language}
            >
              {q.type === 'short_text' && (
                <ShortText
                  question={q as any}
                  value={(answers[q.id] as string) || ''}
                  onChange={(val) => setAnswer(q.id, val)}
                  language={language}
                />
              )}

              {q.type === 'single_choice' && (
                <SingleChoice
                  question={q as any}
                  value={(answers[q.id] as string) || ''}
                  onChange={(val) => setAnswer(q.id, val)}
                  language={language}
                />
              )}

              {q.type === 'number' && (
                <NumberInput
                  question={q as any}
                  value={answers[q.id] as number | string | undefined}
                  onChange={(val) => setAnswer(q.id, val)}
                  language={language}
                />
              )}

              {q.type === 'photo_rating' && (
                <PhotoRating
                  question={q as any}
                  value={answers[q.id] as number | undefined}
                  onChange={(val) => setAnswer(q.id, val)}
                  language={language}
                  showMaximizeHelp={showMaximizeHelp}
                />
              )}

              {q.type === 'photo_ranking' && (
                <PhotoRanking
                  question={q as any}
                  value={answers[q.id] as string[] | undefined}
                  onChange={(val) => setAnswer(q.id, val)}
                  language={language}
                  showMaximizeHelp={showMaximizeHelp}
                />
              )}
            </QuestionWrapper>
          );
        })}
      </div>

      {/* Submission Server Error Message */}
      {submitError && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-red-600" />
          <div className="text-sm">
            <p className="font-bold">{getTranslation('submitError', language)}</p>
            <p className="text-xs text-red-600 mt-0.5">{submitError}</p>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-4 pb-12 gap-4">
        {!isFirstPage ? (
          <button
            type="button"
            onClick={onBack}
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-900 font-semibold text-sm transition-all duration-200 shadow-xs cursor-pointer active:scale-98 disabled:opacity-50"
          >
            {isRTL ? <ChevronRight className="w-4 h-4 text-black" /> : <ChevronLeft className="w-4 h-4 text-black" />}
            <span>{getTranslation('back', language)}</span>
          </button>
        ) : (
          <div /> // Spacer
        )}

        {isLastPage ? (
          <button
            type="button"
            onClick={onSubmit}
            disabled={!isCurrentPageValid || isSubmitting || isTimerActive}
            className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-200 text-white disabled:text-slate-400 font-bold text-sm sm:text-base transition-all duration-200 shadow-md shadow-emerald-700/20 disabled:shadow-none cursor-pointer disabled:cursor-not-allowed active:scale-98"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>{getTranslation('submitting', language)}</span>
              </>
            ) : isTimerActive ? (
              <>
                <Clock className="w-4 h-4 animate-pulse" />
                <span>{getTranslation('submitWithTimer', language, { seconds: timeLeft })}</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>{getTranslation('submit', language)}</span>
              </>
            )}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              onNext();
              if (typeof window !== 'undefined') {
                window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                document.documentElement.scrollTop = 0;
                document.body.scrollTop = 0;
              }
            }}
            disabled={!isCurrentPageValid || isTimerActive}
            className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 text-white disabled:text-slate-400 font-bold text-sm sm:text-base transition-all duration-200 shadow-md shadow-emerald-600/20 disabled:shadow-none cursor-pointer disabled:cursor-not-allowed active:scale-98"
          >
            {isTimerActive ? (
              <>
                <Clock className="w-4 h-4 animate-pulse" />
                <span>{getTranslation('nextWithTimer', language, { seconds: timeLeft })}</span>
              </>
            ) : (
              <>
                <span>{getTranslation('next', language)}</span>
                {isRTL ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </>
            )}
          </button>
        )}
      </div>

      {/* Helper hint if navigation is currently locked */}
      {(isTimerActive || !isCurrentPageValid) && (
        <div className="flex justify-end -mt-8 pb-8">
          <p className="text-xs text-slate-500 font-medium">
            {isTimerActive
              ? getTranslation('waitTimerMessage', language)
              : getTranslation('completeRequiredMessage', language)}
          </p>
        </div>
      )}
    </div>
  );
};
