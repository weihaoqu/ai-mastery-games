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

  const onSolveRef = useRef(onSolve);
  onSolveRef.current = onSolve;

  useEffect(() => {
    if (finished) {
      onSolveRef.current(allFirstTry);
    }
  }, [finished, allFirstTry]);

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
        className="flex flex-col items-center gap-4 py-8"
      >
        <div
          className={`rounded-full p-5 ${allFirstTry ? "bg-primary-container/30" : "bg-secondary-container/30"}`}
        >
          <span className="text-4xl">
            {allFirstTry ? "\u2705" : "\u26A0\uFE0F"}
          </span>
        </div>
        <p
          className={`text-xl font-headline font-extrabold ${allFirstTry ? "text-primary" : "text-secondary"}`}
        >
          {allFirstTry ? t("allCorrect") : t("someWrong")}
        </p>
        <p className="text-sm text-on-surface-variant font-label">
          {correctCount} / {total}
        </p>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Instruction */}
      <div className="space-y-2">
        <p className="text-base font-medium leading-relaxed text-on-surface">
          {puzzle.instruction}
        </p>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-surface-container-high text-on-surface-variant rounded-full text-xs font-label uppercase tracking-widest font-bold">
            {t("questionOf", { current: currentQ + 1, total })}
          </span>
        </div>
      </div>

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
          <p className="text-sm font-medium leading-relaxed text-on-surface">
            {question.question}
          </p>

          {/* Options */}
          <div className="space-y-3">
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
                  className={`w-full rounded-xl border-b-4 p-4 text-left text-sm font-medium transition-all ${
                    showResult && isCorrectOption
                      ? "border-primary/40 bg-primary-container/30 text-primary"
                      : showResult && isSelected && !isCorrectOption
                        ? "border-error/40 bg-error/10 text-error"
                        : showResult
                          ? "border-outline-variant bg-surface-container-lowest opacity-50"
                          : "border-outline-variant bg-surface-container-lowest hover:border-primary/30 hover:bg-surface-container-low"
                  } disabled:cursor-default`}
                >
                  <span className="mr-2 font-mono text-xs text-on-surface-variant">
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
                className="rounded-xl border-2 border-outline-variant/30 bg-surface-container-low p-4"
              >
                <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1 font-label">
                  {t("explanation")}
                </p>
                <p className="text-sm text-on-surface">{question.explanation}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
