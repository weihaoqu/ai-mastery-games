"use client";

import { useState, useCallback } from "react";
import { motion, Reorder } from "framer-motion";
import { useTranslations } from "next-intl";
import type { TokenPuzzle } from "@/lib/types";

interface TokenBoardProps {
  puzzle: TokenPuzzle;
  onSubmit: (playerOrder: number[]) => void;
  timeLeft: number;
  maxTime: number;
}

interface DraggableToken {
  originalIndex: number;
  text: string;
}

export default function TokenBoard({ puzzle, onSubmit, timeLeft, maxTime }: TokenBoardProps) {
  const t = useTranslations("tumble");
  const [tokens, setTokens] = useState<DraggableToken[]>(
    puzzle.scrambledTokens.map((text, i) => ({ originalIndex: i, text }))
  );

  const handleSubmit = useCallback(() => {
    const playerOrder = tokens.map(t => t.originalIndex);
    onSubmit(playerOrder);
  }, [tokens, onSubmit]);

  const timerPercent = maxTime > 0 ? (timeLeft / maxTime) * 100 : 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-2xl"
    >
      {/* Puzzle Header */}
      <div className="bg-surface-container-lowest border-2 border-outline-variant rounded-2xl p-5 sm:p-6 mb-4 shadow-[0_4px_0_0_rgba(152,182,125,1)]">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-label uppercase tracking-widest text-primary font-bold px-2 py-0.5 bg-primary/10 rounded-full">
            {puzzle.category}
          </span>
        </div>
        <h3 className="font-headline font-bold text-on-surface text-lg mb-2">{puzzle.title}</h3>
        <p className="text-sm text-on-surface-variant leading-relaxed">{puzzle.instruction}</p>
      </div>

      {/* Timer Bar */}
      <div className="mb-4" role="timer" aria-label={`${timeLeft}s`}>
        <div className="h-1.5 bg-outline-variant/30 rounded-full overflow-hidden" role="progressbar" aria-valuenow={timeLeft} aria-valuemin={0} aria-valuemax={maxTime}>
          <motion.div
            className={`h-full rounded-full ${
              timerPercent > 50 ? "bg-primary" : timerPercent > 25 ? "bg-secondary" : "bg-error"
            }`}
            style={{ width: `${timerPercent}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Draggable Tokens */}
      <div className="mb-4">
        <p className="text-xs font-label uppercase tracking-widest text-on-surface-variant mb-3 font-bold">
          {t("dragToReorder")}
        </p>
        <Reorder.Group
          axis="y"
          values={tokens}
          onReorder={setTokens}
          className="space-y-2"
          role="list"
          aria-label={t("dragToReorder")}
        >
          {tokens.map((token, i) => (
            <Reorder.Item
              key={token.originalIndex}
              value={token}
              className="cursor-grab active:cursor-grabbing"
              role="listitem"
              aria-label={`${i + 1}. ${token.text}`}
            >
              <div className="flex items-center gap-3 px-4 py-3 bg-surface-container-lowest border-2 border-outline-variant rounded-xl hover:border-primary/50 transition-colors select-none">
                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0">
                  {i + 1}
                </span>
                <span className="material-symbols-outlined text-on-surface-variant text-sm flex-shrink-0">drag_indicator</span>
                <span className="text-sm font-body text-on-surface">{token.text}</span>
              </div>
            </Reorder.Item>
          ))}
        </Reorder.Group>
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        aria-label={t("submitOrder")}
        className="w-full px-6 py-3 rounded-xl bg-primary text-on-primary font-bold font-label text-sm shadow-[0_3px_0_0_rgba(0,80,25,1)] hover:shadow-[0_1px_0_0_rgba(0,80,25,1)] hover:translate-y-[2px] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      >
        {t("submitOrder")}
      </button>
    </motion.div>
  );
}
