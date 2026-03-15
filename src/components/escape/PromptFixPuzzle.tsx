"use client";

import { useState, useMemo } from "react";
import { Reorder, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import type { PromptFixPuzzle } from "@/lib/types";

interface PromptFixPuzzleProps {
  puzzle: PromptFixPuzzle;
  onSolve: (correct: boolean) => void;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function PromptFixPuzzleComponent({
  puzzle,
  onSolve,
}: PromptFixPuzzleProps) {
  const t = useTranslations("escape");

  const initialOrder = useMemo(() => {
    const indices = puzzle.fragments.map((_, i) => i);
    let shuffled = shuffle(indices);
    let attempts = 0;
    while (
      shuffled.every((v, i) => v === puzzle.correctOrder[i]) &&
      attempts < 10
    ) {
      shuffled = shuffle(indices);
      attempts++;
    }
    return shuffled;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [puzzle.instruction]);

  const [order, setOrder] = useState<number[]>(initialOrder);
  const [result, setResult] = useState<"correct" | "incorrect" | null>(null);
  const [focusedIdx, setFocusedIdx] = useState<number | null>(null);

  function handleKeyReorder(pos: number, e: React.KeyboardEvent) {
    if (result) return;
    if (e.key === "ArrowUp" && pos > 0) {
      e.preventDefault();
      setOrder((prev) => {
        const next = [...prev];
        [next[pos - 1], next[pos]] = [next[pos], next[pos - 1]];
        return next;
      });
      setFocusedIdx(pos - 1);
    } else if (e.key === "ArrowDown" && pos < order.length - 1) {
      e.preventDefault();
      setOrder((prev) => {
        const next = [...prev];
        [next[pos], next[pos + 1]] = [next[pos + 1], next[pos]];
        return next;
      });
      setFocusedIdx(pos + 1);
    }
  }

  function handleSubmit() {
    const isCorrect = order.every((v, i) => v === puzzle.correctOrder[i]);
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

      {/* Drag instruction */}
      <p className="text-center text-xs text-ed-ink-muted">
        {t("dragToReorder")}
        <span className="sr-only"> or use arrow keys to reorder</span>
      </p>

      {/* Reorderable fragments */}
      <Reorder.Group
        axis="y"
        values={order}
        onReorder={setOrder}
        className="space-y-2"
      >
        {order.map((idx, pos) => (
          <Reorder.Item
            key={idx}
            value={idx}
            tabIndex={0}
            role="listitem"
            aria-label={`Position ${pos + 1}: ${puzzle.fragments[idx]}`}
            onKeyDown={(e) => handleKeyReorder(pos, e)}
            ref={(el: HTMLLIElement | null) => {
              if (focusedIdx === pos && el) el.focus();
            }}
            className={`cursor-grab rounded-lg border p-3 shadow-sm transition-shadow active:cursor-grabbing active:shadow-md focus:outline-none focus:ring-2 focus:ring-ed-teal/40 ${
              result === "correct"
                ? "border-ed-success/40 bg-ed-success/5"
                : result === "incorrect"
                  ? "border-ed-error/40 bg-ed-error/5"
                  : "border-ed-border bg-ed-card"
            }`}
            whileDrag={{
              scale: 1.03,
              boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
            }}
          >
            <div className="flex items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ed-warm text-xs font-bold text-ed-ink-muted">
                {pos + 1}
              </span>
              <p className="text-sm leading-relaxed text-ed-ink">
                {puzzle.fragments[idx]}
              </p>
            </div>
          </Reorder.Item>
        ))}
      </Reorder.Group>

      {/* Result feedback */}
      {result === "incorrect" && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg border border-ed-error/30 bg-ed-error/5 p-3"
        >
          <p className="text-sm text-ed-error">{puzzle.explanation}</p>
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
          className="w-full rounded-lg border border-ed-teal/40 bg-ed-teal/10 px-6 py-3 font-sans text-sm font-bold text-ed-teal transition-all hover:bg-ed-teal/20 hover:shadow-[0_0_15px_rgba(13,115,119,0.15)]"
        >
          {t("submit")}
        </button>
      )}
    </div>
  );
}
