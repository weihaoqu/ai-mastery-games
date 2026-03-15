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
  // Track whether the player already got this step wrong (for first-attempt scoring)
  const failedCurrentStep = useRef(false);

  const step = challenge.steps[stepIndex];
  const totalSteps = challenge.steps.length;

  // Reset failed flag when step changes
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
          // Advance after a brief pause
          setTimeout(() => {
            setCorrectSteps(newCorrectSteps);
            setStepIndex((i) => i + 1);
            setSelectedOption(null);
            setShowFeedback(false);
          }, 1000);
        } else {
          // All steps complete
          setTimeout(() => {
            onComplete(newCorrectSteps);
          }, 1000);
        }
      } else {
        failedCurrentStep.current = true;
        // Let player try again after seeing feedback
        setTimeout(() => {
          setSelectedOption(null);
          setShowFeedback(false);
        }, 1500);
      }
    },
    [disabled, showFeedback, step, stepIndex, totalSteps, correctSteps, onComplete]
  );

  return (
    <div className="flex w-full max-w-2xl flex-col items-center gap-6">
      {/* Task box */}
      <div className="w-full rounded-lg border border-ed-border bg-ed-parchment p-5">
        <p className="text-xs uppercase tracking-widest text-ed-ink-muted mb-1">
          {t("task")}
        </p>
        <p className="text-[15px] leading-7 text-ed-ink">{challenge.task}</p>
      </div>

      {/* Step indicator */}
      <p className="text-xs uppercase tracking-widest text-ed-ink-muted">
        {t("stepOf", { current: stepIndex + 1, total: totalSteps })}
      </p>

      {/* Progress dots */}
      <div className="flex gap-2">
        {challenge.steps.map((_, i) => (
          <div
            key={i}
            className={`h-2 w-8 rounded-full transition-colors ${
              i < stepIndex
                ? "bg-ed-teal"
                : i === stepIndex
                  ? "bg-ed-teal/40"
                  : "bg-ed-border"
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
          <div className="rounded-lg border border-ed-border bg-ed-warm p-5">
            <p className="mb-2 text-xs uppercase tracking-widest text-ed-ink-muted">
              {t("currentPrompt")}
            </p>
            <p className="text-[15px] leading-7 text-ed-ink">{step.prompt}</p>
          </div>

          {/* Current output */}
          <div className="rounded-lg border border-ed-border bg-ed-warm p-5">
            <p className="mb-2 text-xs uppercase tracking-widest text-ed-ink-muted">
              {t("currentOutput")}
            </p>
            <p className="text-[15px] leading-7 text-ed-ink whitespace-pre-wrap">
              {step.output}
            </p>
          </div>

          {/* Question */}
          <p className="text-sm font-medium text-ed-ink-muted">
            {t("howToImprove")}
          </p>

          {/* Options */}
          <div className="space-y-3">
            {step.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrectOption = opt.isCorrect;
              let borderClass = "border-ed-border";
              if (showFeedback && isSelected) {
                borderClass = isCorrectOption
                  ? "border-ed-success bg-ed-success/5"
                  : "border-ed-error bg-ed-error/5";
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  disabled={disabled || showFeedback}
                  className={`w-full rounded-lg border bg-ed-card p-4 text-left transition-all hover:border-ed-teal/40 disabled:cursor-not-allowed ${borderClass}`}
                >
                  <p className="text-[15px] leading-7 text-ed-ink">
                    {opt.text}
                  </p>

                  {/* Feedback for incorrect selection */}
                  {showFeedback && isSelected && !isCorrectOption && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-2 text-sm text-ed-error"
                    >
                      {opt.explanation}
                    </motion.p>
                  )}

                  {/* Feedback for correct selection */}
                  {showFeedback && isSelected && isCorrectOption && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-2 text-sm text-ed-success"
                    >
                      {t("optimized")}
                    </motion.p>
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
