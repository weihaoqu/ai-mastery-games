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

  // Build segments: split document by error texts, marking which are errors
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
    // Allow up to 1 false positive
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
    <div className="flex flex-col gap-5">
      {/* Instruction */}
      <div className="rounded-lg border border-ed-border bg-ed-parchment p-4">
        <p className="text-sm leading-relaxed text-ed-ink">
          {puzzle.instruction}
        </p>
      </div>

      <p className="text-center text-xs text-ed-ink-muted">
        {t("clickErrors")}
      </p>

      {/* Document with clickable spans */}
      <div className="rounded-lg border border-ed-border bg-ed-card p-5 leading-7 text-sm text-ed-ink">
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
            className={`cursor-pointer rounded px-0.5 transition-colors focus:outline-none focus:ring-2 focus:ring-ed-teal/40 ${
              seg.isError && selectedErrors.has(seg.text)
                ? "bg-ed-error/20 text-ed-error underline decoration-ed-error/50"
                : seg.isError
                  ? "hover:bg-ed-warm"
                  : "hover:bg-ed-warm/50"
            } ${result === "correct" && seg.isError ? "bg-ed-success/20 text-ed-success" : ""}`}
          >
            {seg.text}
          </span>
        ))}
      </div>

      {/* Flash message */}
      <AnimatePresence>
        {flashMessage && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-lg border border-amber-300 bg-amber-50 p-2 text-center text-xs text-amber-700"
          >
            {flashMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error count indicator */}
      <p className="text-center text-xs text-ed-ink-muted">
        {selectedErrors.size} / {puzzle.errors.length} {t("discovered")}
      </p>

      {/* Result feedback */}
      {result === "incorrect" && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg border border-ed-error/30 bg-ed-error/5 p-3"
        >
          <p className="text-sm text-ed-error">
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
          className="rounded-lg border border-ed-success/30 bg-ed-success/5 p-3"
        >
          <p className="text-sm font-medium text-ed-success">{t("correct")}</p>
        </motion.div>
      )}

      {/* Submit */}
      {!result && (
        <button
          onClick={handleSubmit}
          disabled={selectedErrors.size === 0}
          className="w-full rounded-lg border border-ed-teal/40 bg-ed-teal/10 px-6 py-3 font-sans text-sm font-bold text-ed-teal transition-all hover:bg-ed-teal/20 hover:shadow-[0_0_15px_rgba(13,115,119,0.15)] disabled:cursor-not-allowed disabled:opacity-40"
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
    // Find the earliest error occurrence
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
      // No more errors, push remaining as non-error
      segments.push({ text: remaining, isError: false });
      break;
    }

    // Push text before the error
    if (earliest > 0) {
      segments.push({ text: remaining.slice(0, earliest), isError: false });
    }

    // Push the error
    segments.push({ text: earliestError.text, isError: true });
    remaining = remaining.slice(earliest + earliestError.text.length);
  }

  return segments;
}
