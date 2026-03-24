"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import type { ExitPuzzle } from "@/lib/types";

interface ExitPuzzleProps {
  puzzle: ExitPuzzle;
  collectedCodes: string[];
  onSolve: (correct: boolean) => void;
}

export default function ExitPuzzleComponent({
  puzzle,
  collectedCodes,
  onSolve,
}: ExitPuzzleProps) {
  const t = useTranslations("escape");
  const [selected, setSelected] = useState<number | null>(null);
  const [result, setResult] = useState<"correct" | "incorrect" | null>(null);

  const codesNeeded = puzzle.requiredCodes - collectedCodes.length;
  const allCollected = codesNeeded <= 0;

  function handleSelect(optionIndex: number) {
    if (selected !== null && result === "correct") return;

    setSelected(optionIndex);
    const isCorrect = optionIndex === puzzle.correctIndex;

    if (isCorrect) {
      setResult("correct");
      setTimeout(() => onSolve(true), 1200);
    } else {
      setResult("incorrect");
      setTimeout(() => {
        setResult(null);
        setSelected(null);
      }, 1200);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Collected codes display */}
      <div className="text-center space-y-3">
        <p className="font-body text-base font-medium text-on-surface-variant">
          {t("codesCollected")}
        </p>
        <div className="flex justify-center gap-3">
          {collectedCodes.map((code, i) => (
            <div
              key={i}
              className="w-14 h-16 bg-surface-container rounded-xl border-b-4 border-outline-variant flex items-center justify-center text-2xl font-headline font-extrabold text-primary"
            >
              {code}
            </div>
          ))}
          {codesNeeded > 0 &&
            Array.from({ length: codesNeeded }).map((_, i) => (
              <div
                key={`empty-${i}`}
                className="w-14 h-16 bg-surface-container-lowest rounded-xl border-2 border-dashed border-outline-variant flex items-center justify-center"
              >
                <div className="w-1.5 h-6 bg-primary animate-pulse rounded-full" />
              </div>
            ))}
        </div>
      </div>

      {/* Not enough codes */}
      {!allCollected && (
        <div className="rounded-xl border-2 border-secondary-container bg-secondary-container/30 p-5 text-center">
          <p className="text-sm text-on-secondary-container font-label font-bold">
            {t("needMoreCodes", { count: codesNeeded })}
          </p>
        </div>
      )}

      {/* Final challenge */}
      {allCollected && (
        <>
          <div className="rounded-xl border-2 border-tertiary/30 bg-tertiary-container/20 p-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-tertiary-container/30 text-tertiary rounded-full mb-3">
              <span className="material-symbols-outlined text-sm">info</span>
              <span className="font-label text-xs uppercase tracking-widest font-bold">{t("finalChallenge")}</span>
            </div>
            <p className="text-sm leading-relaxed text-on-surface font-medium">
              {puzzle.finalQuestion}
            </p>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {puzzle.finalOptions.map((option, idx) => {
              const isSelected = selected === idx;
              const isCorrectOption = idx === puzzle.correctIndex;
              const showCorrect = result === "correct" && isCorrectOption;
              const showError =
                result === "incorrect" && isSelected && !isCorrectOption;

              return (
                <motion.button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  disabled={result === "correct"}
                  whileHover={
                    result !== "correct" ? { scale: 1.01 } : undefined
                  }
                  className={`w-full rounded-xl border-b-4 p-4 text-left text-sm font-medium transition-all ${
                    showCorrect
                      ? "border-primary/40 bg-primary-container/30 text-primary"
                      : showError
                        ? "border-error/40 bg-error/10 text-error"
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

          {/* Result feedback */}
          <AnimatePresence>
            {result === "correct" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-xl border-2 border-primary/30 bg-primary-container/30 p-5 text-center"
              >
                <p className="text-xl font-headline font-extrabold text-primary">
                  {t("correct")}
                </p>
                <p className="mt-2 text-sm text-on-surface">{puzzle.explanation}</p>
              </motion.div>
            )}
            {result === "incorrect" && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="rounded-xl border-2 border-error/30 bg-error/5 p-4 text-center"
              >
                <p className="text-sm font-bold text-error">{t("incorrect")}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}
