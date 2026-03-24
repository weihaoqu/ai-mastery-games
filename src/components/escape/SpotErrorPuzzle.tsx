"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import type { SpotErrorPuzzle } from "@/lib/types";

interface SpotErrorPuzzleProps {
  puzzle: SpotErrorPuzzle;
  onSolve: (correct: boolean) => void;
}

export default function SpotErrorPuzzleComponent({
  puzzle,
  onSolve,
}: SpotErrorPuzzleProps) {
  const t = useTranslations("escape");
  const [selectedErrors, setSelectedErrors] = useState<Set<string>>(new Set());
  const [flashMessage, setFlashMessage] = useState<string | null>(null);
  const [result, setResult] = useState<"correct" | "incorrect" | null>(null);

  const segments = buildSegments(puzzle.document, puzzle.errors);
  const errorTexts = new Set(puzzle.errors.map((e) => e.text));

  const handleSpanClick = useCallback(
    (text: string) => {
      if (result) return;

      if (errorTexts.has(text)) {
        setSelectedErrors((prev) => {
          const next = new Set(prev);
          if (next.has(text)) {
            next.delete(text);
          } else {
            next.add(text);
          }
          return next;
        });
      } else {
        setFlashMessage(t("notAnError"));
        setTimeout(() => setFlashMessage(null), 1200);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [result, errorTexts],
  );

  function handleSubmit() {
    const allFound = puzzle.errors.every((e) => selectedErrors.has(e.text));
    const falsePositives = [...selectedErrors].filter(
      (s) => !errorTexts.has(s),
    ).length;
    const isCorrect = allFound && falsePositives === 0;
    setResult(isCorrect ? "correct" : "incorrect");
    setTimeout(() => {
      onSolve(isCorrect);
    }, 1200);
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Instruction */}
      <div className="space-y-3">
        <p className="text-on-surface-variant font-medium text-base leading-relaxed">
          {puzzle.instruction}
        </p>
        <div className="flex items-center gap-4 py-2">
          <span className="flex items-center gap-1 px-3 py-1 bg-tertiary-container text-on-tertiary-container rounded-full font-label text-xs font-bold uppercase tracking-wider">
            <span className="material-symbols-outlined text-sm">psychology</span> {t("clickErrors")}
          </span>
          <span className="text-on-surface-variant font-label text-sm">
            {selectedErrors.size}/{puzzle.errors.length} {t("discovered")}
          </span>
        </div>
      </div>

      {/* AI Generated Text Block */}
      <div className="bg-surface-container-low rounded-2xl p-6 font-mono text-on-surface leading-loose text-sm border-2 border-outline-variant/30 relative">
        <div className="absolute -top-3 left-6 bg-surface-container-lowest px-3 py-1 border-2 border-outline-variant rounded-full text-[10px] font-bold uppercase tracking-widest text-outline">
          System_Output_Log
        </div>
        <div className="pt-2">
          {segments.map((seg, i) => (
            <span
              key={i}
              role="button"
              tabIndex={0}
              onClick={() => handleSpanClick(seg.text)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleSpanClick(seg.text);
                }
              }}
              className={`px-1 rounded transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/40 ${
                seg.isError && selectedErrors.has(seg.text)
                  ? "bg-primary-container text-on-primary-container underline decoration-primary decoration-2"
                  : seg.isError
                    ? "hover:bg-surface-container"
                    : "hover:bg-surface-container/50"
              } ${result === "correct" && seg.isError ? "bg-primary-container text-primary" : ""}`}
            >
              {seg.text}
            </span>
          ))}
        </div>
      </div>

      {/* Flash message */}
      <AnimatePresence>
        {flashMessage && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-xl border-2 border-secondary-container bg-secondary-container/30 p-3 text-center text-xs text-on-secondary-container font-label font-bold"
          >
            {flashMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Result feedback */}
      {result === "incorrect" && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border-2 border-error/30 bg-error/5 p-4"
        >
          <p className="text-sm text-error">
            {puzzle.errors
              .filter((e) => !selectedErrors.has(e.text))
              .map((e) => e.explanation)
              .join(" ")}
          </p>
        </motion.div>
      )}

      {result === "correct" && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border-2 border-primary/30 bg-primary-container/30 p-4"
        >
          <p className="text-sm font-bold text-primary">{t("correct")}</p>
        </motion.div>
      )}

      {/* Submit */}
      {!result && (
        <button
          onClick={handleSubmit}
          disabled={selectedErrors.size === 0}
          className="w-full py-4 bg-primary text-on-primary font-headline font-extrabold rounded-xl shadow-[0px_4px_0px_0px_#004c1e] active:translate-y-1 active:shadow-none transition-all border-b-4 border-primary-dim disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {t("submit")}
        </button>
      )}
    </div>
  );
}

interface Segment {
  text: string;
  isError: boolean;
}

function buildSegments(
  document: string,
  errors: { text: string; explanation: string }[],
): Segment[] {
  const segments: Segment[] = [];
  let remaining = document;

  while (remaining.length > 0) {
    let earliest = -1;
    let earliestError: (typeof errors)[0] | null = null;

    for (const error of errors) {
      const idx = remaining.indexOf(error.text);
      if (idx !== -1 && (earliest === -1 || idx < earliest)) {
        earliest = idx;
        earliestError = error;
      }
    }

    if (earliest === -1 || !earliestError) {
      segments.push({ text: remaining, isError: false });
      break;
    }

    if (earliest > 0) {
      segments.push({ text: remaining.slice(0, earliest), isError: false });
    }

    segments.push({ text: earliestError.text, isError: true });
    remaining = remaining.slice(earliest + earliestError.text.length);
  }

  return segments;
}
