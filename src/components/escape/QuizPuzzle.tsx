"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import type { QuizPuzzle } from "@/lib/types";

interface QuizPuzzleProps {
  puzzle: QuizPuzzle;
  onSolve: (correct: boolean) => void;
}

export default function QuizPuzzleComponent({
  puzzle,
  onSolve,
}: QuizPuzzleProps) {
  const t = useTranslations("escape");
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [allFirstTry, setAllFirstTry] = useState(true);
  const [finished, setFinished] = useState(false);
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const question = puzzle.questions[currentQ];
  const total = puzzle.questions.length;

  const handleSelect = useCallback(
    (optionIndex: number) => {
      if (selected !== null || finished) return;

      setSelected(optionIndex);
      const isCorrect = optionIndex === question.correctIndex;

      if (isCorrect) {
        setCorrectCount((c) => c + 1);
      } else {
        setAllFirstTry(false);
      }

      // Auto-advance after 1.5s
      advanceTimer.current = setTimeout(() => {
        if (currentQ < total - 1) {
          setCurrentQ((q) => q + 1);
          setSelected(null);
        } else {
          setFinished(true);
        }
      }, 1500);
    },
    [selected, finished, question.correctIndex, currentQ, total],
  );

  // Stable ref for onSolve to avoid infinite re-render loop
  const onSolveRef = useRef(onSolve);
  onSolveRef.current = onSolve;

  // Call onSolve when finished
  useEffect(() => {
    if (finished) {
      onSolveRef.current(allFirstTry);
    }
  }, [finished, allFirstTry]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
    };
  }, []);

  if (finished) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-4 py-6"
      >
        <div
          className={`rounded-full p-4 ${allFirstTry ? "bg-ed-success/10" : "bg-amber-50"}`}
        >
          <span className="text-3xl">
            {allFirstTry ? "\u2705" : "\u26A0\uFE0F"}
          </span>
        </div>
        <p
          className={`text-lg font-bold ${allFirstTry ? "text-ed-success" : "text-amber-700"}`}
        >
          {allFirstTry ? t("allCorrect") : t("someWrong")}
        </p>
        <p className="text-sm text-ed-ink-muted">
          {correctCount} / {total}
        </p>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Instruction */}
      <div className="rounded-lg border border-ed-border bg-ed-parchment p-4">
        <p className="text-sm leading-relaxed text-ed-ink">
          {puzzle.instruction}
        </p>
      </div>

      {/* Progress */}
      <p className="text-center text-xs text-ed-ink-muted">
        {t("questionOf", { current: currentQ + 1, total })}
      </p>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQ}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
          className="flex flex-col gap-4"
        >
          <p className="text-sm font-medium leading-relaxed text-ed-ink">
            {question.question}
          </p>

          {/* Options */}
          <div className="space-y-2">
            {question.options.map((option, idx) => {
              const isSelected = selected === idx;
              const isCorrectOption = idx === question.correctIndex;
              const showResult = selected !== null;

              return (
                <motion.button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  disabled={selected !== null}
                  whileHover={selected === null ? { scale: 1.01 } : undefined}
                  className={`w-full rounded-lg border p-3 text-left text-sm transition-all ${
                    showResult && isCorrectOption
                      ? "border-ed-success/40 bg-ed-success/10 text-ed-success"
                      : showResult && isSelected && !isCorrectOption
                        ? "border-ed-error/40 bg-ed-error/10 text-ed-error"
                        : showResult
                          ? "border-ed-border bg-ed-card opacity-50"
                          : "border-ed-border bg-ed-card hover:border-ed-teal/30 hover:bg-ed-teal/5"
                  } disabled:cursor-default`}
                >
                  <span className="mr-2 font-mono text-xs text-ed-ink-muted">
                    {String.fromCharCode(65 + idx)}.
                  </span>
                  {option}
                </motion.button>
              );
            })}
          </div>

          {/* Explanation */}
          <AnimatePresence>
            {selected !== null && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="rounded-lg border border-ed-border bg-ed-parchment p-3"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-ed-ink-muted mb-1">
                  {t("explanation")}
                </p>
                <p className="text-sm text-ed-ink">{question.explanation}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
