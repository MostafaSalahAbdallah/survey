'use client';

import React, { useState } from 'react';
import { Language } from '@/lib/types';
import { getTranslation } from '@/lib/i18n';
import {
  Sparkles,
  Layers,
  ShieldCheck,
  Clock,
  CheckCircle2,
  ZoomIn,
  ArrowRight,
  ArrowLeft,
  FileCheck2,
} from 'lucide-react';

interface SurveyInstructionsProps {
  language: Language;
  onAccept: () => void;
  features?: {
    skipTimer?: boolean;
    skipRequired?: boolean;
  };
}

export const SurveyInstructions: React.FC<SurveyInstructionsProps> = ({
  language,
  onAccept,
  features,
}) => {
  const [hasAcknowledged, setHasAcknowledged] = useState(false);
  const isRTL = language === 'ar';

  const rules = [
    {
      icon: Layers,
      title: getTranslation('ruleStructureTitle', language),
      desc: getTranslation('ruleStructureDesc', language),
      color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
    },
    {
      icon: ShieldCheck,
      title: getTranslation('ruleDataTitle', language),
      desc: getTranslation('ruleDataDesc', language),
      color: 'text-blue-600 bg-blue-50 border-blue-200',
    },
    ...(!features?.skipTimer
      ? [
          {
            icon: Clock,
            title: getTranslation('ruleTimerTitle', language),
            desc: getTranslation('ruleTimerDesc', language),
            color: 'text-amber-600 bg-amber-50 border-amber-200',
          },
        ]
      : []),
    ...(!features?.skipRequired
      ? [
          {
            icon: FileCheck2,
            title: getTranslation('ruleMandatoryTitle', language),
            desc: getTranslation('ruleMandatoryDesc', language),
            color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
          },
        ]
      : []),
    {
      icon: ZoomIn,
      title: getTranslation('ruleZoomTitle', language),
      desc: getTranslation('ruleZoomDesc', language),
      color: 'text-purple-600 bg-purple-50 border-purple-200',
    },
  ];

  return (
    <div className="w-full flex flex-col gap-6 animate-in fade-in duration-300">
      {/* Hero Header */}
      <div className="bg-white/95 rounded-3xl p-6 sm:p-8 border border-[#f4d0c1] shadow-xs">
        <div className="flex flex-col items-start gap-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fff8f5] text-slate-800 text-xs font-semibold tracking-wide border border-slate-300 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-black" />
            <span>{getTranslation('instructionsBadge', language)}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
            {getTranslation('instructionsTitle', language)}
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-3xl">
            {getTranslation('instructionsWelcome', language)}
          </p>
        </div>
      </div>

      {/* Structured Guidelines Cards */}
      <div className="grid grid-cols-1 gap-4">
        {rules.map((rule, idx) => {
          const IconComponent = rule.icon;
          return (
            <div
              key={idx}
              className="bg-white/95 rounded-2xl p-5 sm:p-6 border border-[#f4d0c1] shadow-xs hover:border-slate-400 transition-all duration-200 flex items-start gap-4"
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${rule.color} shadow-xs mt-0.5`}
              >
                <IconComponent className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1.5">
                  {rule.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {rule.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Acknowledgment & Start Action */}
      <div className="bg-[#fff8f5] rounded-3xl p-6 sm:p-8 border border-[#f4d0c1] shadow-xs flex flex-col gap-6">
        <label className="flex items-start gap-3.5 cursor-pointer select-none group">
          <input
            type="checkbox"
            checked={hasAcknowledged}
            onChange={(e) => setHasAcknowledged(e.target.checked)}
            className="mt-1 w-5 h-5 rounded-md border-2 border-slate-400 text-emerald-600 focus:ring-emerald-500 cursor-pointer transition-all"
          />
          <span className="text-sm sm:text-base font-semibold text-slate-900 group-hover:text-slate-950 leading-relaxed">
            {getTranslation('acknowledgmentText', language)}
          </span>
        </label>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-[#f4d0c1]/60">
          <p className="text-xs text-slate-500 text-center sm:text-start">
            {getTranslation('studyNotice', language)}
          </p>

          <button
            type="button"
            onClick={onAccept}
            disabled={!hasAcknowledged}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-300 text-white disabled:text-slate-500 font-bold text-base transition-all duration-200 shadow-md shadow-emerald-700/20 disabled:shadow-none cursor-pointer disabled:cursor-not-allowed active:scale-98"
          >
            <span>{getTranslation('startSurveyBtn', language)}</span>
            {isRTL ? (
              <ArrowLeft className="w-5 h-5" />
            ) : (
              <ArrowRight className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
