'use client';

import { useState, useEffect, useRef } from 'react';
import {
  getStoredCompletedTimers,
  setStoredCompletedTimer,
} from '@/lib/storage';

export function getPageTimerDuration(pageIndex: number, totalPages: number): number {
  if (pageIndex === 0) return 0; // Page 1 (Demographics): No timer
  if (pageIndex >= totalPages - 3) return 30; // Last 3 pages: 30 seconds
  return 21; // Page 2 and so on: 21 seconds
}

interface UsePageTimerOptions {
  pageIndex: number;
  totalPages: number;
}

export function usePageTimer({ pageIndex, totalPages }: UsePageTimerOptions) {
  const totalDuration = getPageTimerDuration(pageIndex, totalPages);

  // Check if this page was already completed in the session
  const isAlreadyCompleted = () => {
    if (totalDuration === 0) return true;
    const completed = getStoredCompletedTimers();
    return completed.includes(pageIndex);
  };

  const [timeLeft, setTimeLeft] = useState<number>(() => {
    return isAlreadyCompleted() ? 0 : totalDuration;
  });

  const [isTimerComplete, setIsTimerComplete] = useState<boolean>(() => {
    return isAlreadyCompleted();
  });

  // Reset or initialize on page index change
  useEffect(() => {
    const alreadyDone = isAlreadyCompleted();
    if (alreadyDone || totalDuration === 0) {
      setTimeLeft(0);
      setIsTimerComplete(true);
      return;
    }

    setTimeLeft(totalDuration);
    setIsTimerComplete(false);

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setStoredCompletedTimer(pageIndex);
          setIsTimerComplete(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [pageIndex, totalDuration]);

  const isTimerActive = totalDuration > 0 && timeLeft > 0;
  const progressPercent =
    totalDuration > 0 ? Math.round(((totalDuration - timeLeft) / totalDuration) * 100) : 100;

  return {
    timeLeft,
    totalDuration,
    isTimerActive,
    isTimerComplete,
    progressPercent,
  };
}
