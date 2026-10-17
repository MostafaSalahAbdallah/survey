'use client';

import { useState, useEffect, useCallback } from 'react';
import { Language } from '@/lib/types';
import { getStoredLanguage, setStoredLanguage } from '@/lib/storage';
import { getTranslation } from '@/lib/i18n';

export function useLanguage() {
  const [language, setLanguageState] = useState<Language | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const saved = getStoredLanguage();
    if (saved) {
      setLanguageState(saved);
      document.documentElement.dir = saved === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = saved;
    }
    setIsInitialized(true);
  }, []);

  const selectLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    setStoredLanguage(lang);
    if (typeof document !== 'undefined') {
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = lang;
    }
  }, []);

  const t = useCallback(
    (key: string, replacements?: Record<string, string | number>): string => {
      return getTranslation(key, language || 'en', replacements);
    },
    [language]
  );

  const isRTL = language === 'ar';

  return {
    language,
    setLanguage: selectLanguage,
    isRTL,
    isInitialized,
    t,
  };
}
