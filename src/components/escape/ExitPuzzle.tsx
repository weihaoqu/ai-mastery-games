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
      // Allow retry after brief flash
      setTimeout(() => {
        setResult(null);
        setSelected(null);
      }, 1200);
    }
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Collected codes */}
      <div className="rounded-lg border border-ed-border bg-ed-parchment p-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ed-ink-muted">
          {t("codesCollected")}
        </p>
        <div className="flex flex-wrap gap-2">
          {collectedCodes.map((code, i) => (
            <span
              key={i}
              className="rounded-full bg-ed-teal/10 px-3 py-1 font-mono text-xs font-bold text-ed-teal"
            >
              {code}
            </span>
          ))}
          {codesNeeded > 0 &&
            Array.from({ length: codesNeeded }).map((_, i) => (
              <span
                key={`empty-${i}`}
                className="rounded-full border border-dashed border-ed-border px-3 py-1 font-mono text-xs text-ed-ink-muted"
              >
                ???
              </span>
            ))}
        </div>
      </div>

      {/* Not enough codes */}
      {!allCollected && (
        <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-center">
          <p className="text-sm text-amber-700">
            {t("needMoreCodes", { count: codesNeeded })}
          </p>
        </div>
      )}

      {/* Final challenge */}
      {allCollected && (
        <>
          <div className="rounded-lg border border-ed-teal/30 bg-ed-teal/5 p-4">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-ed-teal">
              {t("finalChallenge")}
            </p>
            <p className="text-sm leading-relaxed text-ed-ink">
              {puzzle.finalQuestion}
            </p>
          </div>

          {/* Options */}
          <div className="space-y-2">
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
                  className={`w-full rounded-lg border p-3 text-left text-sm transition-all ${
                    showCorrect
                      ? "border-ed-success/40 bg-ed-success/10 text-ed-success"
                      : showError
                        ? "border-ed-error/40 bg-ed-error/10 text-ed-error"
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

          {/* Result feedback */}
          <AnimatePresence>
            {result === "correct" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-lg border border-ed-success/30 bg-ed-success/5 p-4 text-center"
              >
                <p className="text-lg font-bold text-ed-success">
                  {t("correct")}
                </p>
                <p className="mt-1 text-sm text-ed-ink">{puzzle.explanation}</p>
              </motion.div>
            )}
            {result === "incorrect" && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="rounded-lg border border-ed-error/30 bg-ed-error/5 p-3 text-center"
              >
                <p className="text-sm text-ed-error">{t("incorrect")}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}
