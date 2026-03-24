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
    <div className="flex flex-col gap-6">
      {/* Instruction */}
      <div className="space-y-2">
        <p className="font-body text-base font-medium text-on-surface leading-relaxed">
          {puzzle.instruction}
        </p>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-tertiary-container text-on-tertiary-container rounded-full text-xs font-label uppercase tracking-widest font-bold">
            {t("dragToReorder")}
          </span>
        </div>
      </div>

      {/* Reorderable fragments */}
      <Reorder.Group
        axis="y"
        values={order}
        onReorder={setOrder}
        className="space-y-3"
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
            className={`flex items-center gap-4 p-4 rounded-xl border-b-4 cursor-grab active:cursor-grabbing transition-all focus:outline-none focus:ring-2 focus:ring-primary/40 group ${
              result === "correct"
                ? "bg-primary-container/30 border-primary/30"
                : result === "incorrect"
                  ? "bg-error/5 border-error/30"
                  : "bg-surface-container-lowest border-outline-variant hover:translate-x-1"
            }`}
            whileDrag={{
              scale: 1.03,
              boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
            }}
          >
            <span className="material-symbols-outlined text-outline-variant group-hover:text-primary transition-colors">drag_indicator</span>
            <code className="font-mono text-sm bg-surface-container-low px-2 py-1 rounded flex-1">
              {puzzle.fragments[idx]}
            </code>
          </Reorder.Item>
        ))}
      </Reorder.Group>

      {/* Result feedback */}
      {result === "incorrect" && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border-2 border-error/30 bg-error/5 p-4"
        >
          <p className="text-sm text-error">{puzzle.explanation}</p>
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
          className="w-full py-4 bg-primary text-on-primary font-headline font-extrabold rounded-xl shadow-[0px_4px_0px_0px_#004c1e] active:translate-y-1 active:shadow-none transition-all border-b-4 border-primary-dim"
        >
          {t("submit")}
        </button>
      )}
    </div>
  );
}
