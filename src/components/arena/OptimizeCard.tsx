"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import type { OptimizeChallenge } from "@/lib/types";

interface OptimizeCardProps {
  challenge: OptimizeChallenge;
  onComplete: (correctSteps: boolean[]) => void;
  disabled?: boolean;
}

export default function OptimizeCard({
  challenge,
  onComplete,
  disabled,
}: OptimizeCardProps) {
  const t = useTranslations("arena");

  const [stepIndex, setStepIndex] = useState(0);
  const [correctSteps, setCorrectSteps] = useState<boolean[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const failedCurrentStep = useRef(false);

  const step = challenge.steps[stepIndex];
  const totalSteps = challenge.steps.length;

  useEffect(() => {
    failedCurrentStep.current = false;
  }, [stepIndex]);

  const handleSelect = useCallback(
    (optIdx: number) => {
      if (disabled || showFeedback) return;

      const option = step.options[optIdx];
      setSelectedOption(optIdx);
      setShowFeedback(true);

      if (option.isCorrect) {
        const isFirstAttempt = !failedCurrentStep.current;
        const newCorrectSteps = [...correctSteps, isFirstAttempt];

        if (stepIndex + 1 < totalSteps) {
          setTimeout(() => {
            setCorrectSteps(newCorrectSteps);
            setStepIndex((i) => i + 1);
            setSelectedOption(null);
            setShowFeedback(false);
          }, 1000);
        } else {
          setTimeout(() => {
            onComplete(newCorrectSteps);
          }, 1000);
        }
      } else {
        failedCurrentStep.current = true;
        setTimeout(() => {
          setSelectedOption(null);
          setShowFeedback(false);
        }, 1500);
      }
    },
    [disabled, showFeedback, step, stepIndex, totalSteps, correctSteps, onComplete]
  );

  return (
    <div className="flex w-full max-w-3xl flex-col items-center gap-6">
      {/* Task */}
      <div className="w-full bg-surface-container px-8 py-6 rounded-2xl border-b-4 border-outline-variant">
        <p className="text-xs uppercase tracking-widest text-on-surface-variant mb-2 font-label font-bold">
          {t("task")}
        </p>
        <p className="font-body text-lg font-semibold text-on-surface leading-relaxed">{challenge.task}</p>
      </div>

      {/* Step indicator */}
      <p className="text-xs uppercase tracking-widest text-on-surface-variant font-label font-bold">
        {t("stepOf", { current: stepIndex + 1, total: totalSteps })}
      </p>

      {/* Progress dots */}
      <div className="flex gap-2">
        {challenge.steps.map((_, i) => (
          <div
            key={i}
            className={`h-2.5 w-10 rounded-full transition-colors ${
              i < stepIndex
                ? "bg-primary"
                : i === stepIndex
                  ? "bg-primary/40"
                  : "bg-outline-variant/40"
            }`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={stepIndex}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.3 }}
          className="w-full space-y-4"
        >
          {/* Current prompt */}
          <div className="rounded-xl border-b-4 border-outline-variant bg-surface-container-low p-6">
            <p className="mb-2 text-xs uppercase tracking-widest text-on-surface-variant font-label font-bold">
              {t("currentPrompt")}
            </p>
            <p className="text-base leading-7 text-on-surface">{step.prompt}</p>
          </div>

          {/* Current output */}
          <div className="rounded-xl border-b-4 border-outline-variant bg-surface-container-low p-6">
            <p className="mb-2 text-xs uppercase tracking-widest text-on-surface-variant font-label font-bold">
              {t("currentOutput")}
            </p>
            <p className="text-base leading-7 text-on-surface whitespace-pre-wrap font-mono text-sm">
              {step.output}
            </p>
          </div>

          {/* Question */}
          <p className="text-sm font-medium text-on-surface-variant font-label">
            {t("howToImprove")}
          </p>

          {/* Options */}
          <div className="space-y-3">
            {step.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrectOption = opt.isCorrect;

              let cardClass = "border-outline-variant bg-surface-container-lowest hover:border-primary/30";
              if (showFeedback && isSelected) {
                cardClass = isCorrectOption
                  ? "border-primary bg-primary-container/20"
                  : "border-error bg-error/5";
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  disabled={disabled || showFeedback}
                  className={`w-full rounded-xl border-b-4 p-5 text-left transition-all disabled:cursor-not-allowed ${cardClass}`}
                >
                  <p className="text-base leading-7 text-on-surface">
                    {opt.text}
                  </p>

                  {showFeedback && isSelected && !isCorrectOption && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-2 text-sm text-error"
                    >
                      {opt.explanation}
                    </motion.p>
                  )}

                  {showFeedback && isSelected && isCorrectOption && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-2 text-sm text-primary"
                    >
                      <p className="font-bold">{t("optimized")}</p>
                      <p className="mt-1 font-normal">{opt.explanation}</p>
                    </motion.div>
                  )}
                </button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
