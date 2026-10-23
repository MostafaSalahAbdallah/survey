'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { SurveyConfig } from '@/lib/types';
import { useLanguage } from '@/hooks/useLanguage';
import { useSurvey } from '@/hooks/useSurvey';
import {
  getStoredInstructionsAccepted,
  setStoredInstructionsAccepted,
  getStoredPageIndex,
} from '@/lib/storage';
import { LanguageModal } from '@/components/common/LanguageModal';
import { Header } from '@/components/common/Header';
import { ProgressBar } from '@/components/common/ProgressBar';
import { SurveyPage } from '@/components/survey/SurveyPage';
import { SurveyInstructions } from '@/components/survey/SurveyInstructions';
import { ThankYou } from '@/components/survey/ThankYou';
import { getClientFeatures, AppFeatures } from '@/lib/envConfig';

interface SurveyShellProps {
  survey: SurveyConfig;
  initialFeatures?: Partial<AppFeatures>;
}

export const SurveyShell: React.FC<SurveyShellProps> = ({ survey, initialFeatures }) => {
  const { language, setLanguage, isInitialized } = useLanguage();
  const [hasAcceptedInstructions, setHasAcceptedInstructions] = useState<boolean>(false);
  const [features, setFeatures] = useState<AppFeatures>(() => getClientFeatures(initialFeatures));

  useEffect(() => {
    setFeatures(getClientFeatures(initialFeatures));
  }, [initialFeatures]);

  const {
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
  } = useSurvey({ survey, language, features });

  // Initialize instructions acceptance from storage
  useEffect(() => {
    if (isInitialized) {
      const accepted = getStoredInstructionsAccepted();
      const savedPage = getStoredPageIndex();
      if (accepted || savedPage > 0) {
        setHasAcceptedInstructions(true);
      }
    }
  }, [isInitialized]);

  const handleAcceptInstructions = useCallback(() => {
    setHasAcceptedInstructions(true);
    setStoredInstructionsAccepted(true);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }
  }, []);

  // Automatically scroll to top of window whenever the active page changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }
  }, [currentPageIndex]);

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-[#ffe5d9] flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-slate-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const showLanguageModal = !language;

  return (
    <div className="min-h-screen bg-[#ffe5d9] text-slate-800 flex flex-col font-sans antialiased selection:bg-slate-200 selection:text-slate-900">
      {/* 1. Language Modal (Mandatory first step) */}
      <LanguageModal
        isOpen={showLanguageModal}
        onSelectLanguage={setLanguage}
      />

      {/* 2. Survey Header */}
      {language && <Header meta={survey.meta} language={language} />}

      {/* 3. Main Content Container */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-6 sm:py-8 pb-32">
        {isCompleted && language ? (
          <ThankYou language={language} submissionId={submissionId} />
        ) : language && !hasAcceptedInstructions ? (
          <SurveyInstructions
            language={language}
            onAccept={handleAcceptInstructions}
            features={features}
          />
        ) : (
          language && (
            <SurveyPage
              survey={survey}
              page={currentPage}
              pageIndex={currentPageIndex}
              answers={answers}
              setAnswer={setAnswer}
              language={language}
              validationErrors={validationErrors}
              isFirstPage={isFirstPage}
              isLastPage={isLastPage}
              isCurrentPageValid={isCurrentPageValid}
              onNext={handleNext}
              onBack={handleBack}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              submitError={submitError}
              features={features}
            />
          )
        )}
      </main>

      {/* 4. Fixed Progress Bar (Bottom) */}
      {language && (
        <ProgressBar
          currentPageIndex={currentPageIndex}
          totalPages={totalPages}
          language={language}
          hidden={isCompleted || showLanguageModal || !hasAcceptedInstructions}
        />
      )}
    </div>
  );
};
