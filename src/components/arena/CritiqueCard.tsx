"use client";

import { useState, useMemo } from "react";
import { Reorder } from "framer-motion";
import { useTranslations } from "next-intl";
import type { CritiqueRound } from "@/lib/types";

interface CritiqueCardProps {
  round: CritiqueRound;
  onSubmit: (ranking: string[]) => void;
  disabled?: boolean;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function CritiqueCard({
  round,
  onSubmit,
  disabled,
}: CritiqueCardProps) {
  const t = useTranslations("arena");

  const initialOrder = useMemo(() => {
    const texts = round.prompts.map((p) => p.text);
    let shuffled = shuffle(texts);
    const correctOrder = [...round.prompts]
      .sort((a, b) => a.rank - b.rank)
      .map((p) => p.text);
    let attempts = 0;
    while (
      shuffled.every((t, i) => t === correctOrder[i]) &&
      attempts < 10
    ) {
      shuffled = shuffle(texts);
      attempts++;
    }
    return shuffled;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round.id]);

  const [ranking, setRanking] = useState<string[]>(initialOrder);

  return (
    <div className="flex w-full max-w-3xl flex-col items-center gap-6">
      {/* Task */}
      <div className="w-full bg-surface-container px-8 py-6 rounded-2xl border-b-4 border-outline-variant">
        <p className="text-xs uppercase tracking-widest text-on-surface-variant mb-2 font-label font-bold">
          {t("task")}
        </p>
        <p className="font-body text-lg font-semibold text-on-surface leading-relaxed">{round.task}</p>
      </div>

      {/* Instruction */}
      <p className="text-sm text-on-surface-variant font-label">{t("dragToRank")}</p>

      {/* Best label */}
      <div className="w-full flex items-center gap-2">
        <span className="text-xs font-label font-bold uppercase tracking-widest text-primary">
          {t("best")}
        </span>
        <span className="h-px flex-1 bg-primary/30" />
      </div>

      {/* Reorderable list */}
      <Reorder.Group
        axis="y"
        values={ranking}
        onReorder={setRanking}
        className="w-full space-y-3"
      >
        {ranking.map((text, idx) => (
          <Reorder.Item
            key={text}
            value={text}
            className="cursor-grab rounded-xl bg-surface-container-lowest p-5 border-b-4 border-outline-variant active:cursor-grabbing transition-shadow group"
            whileDrag={{ scale: 1.03, boxShadow: "0 8px 24px rgba(0,0,0,0.1)" }}
          >
            <div className="flex items-start gap-4">
              <span className="material-symbols-outlined text-outline-variant group-hover:text-primary transition-colors">drag_indicator</span>
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface-container-high text-xs font-headline font-bold text-on-surface-variant">
                {idx + 1}
              </span>
              <p className="text-base leading-7 text-on-surface">{text}</p>
            </div>
          </Reorder.Item>
        ))}
      </Reorder.Group>

      {/* Worst label */}
      <div className="w-full flex items-center gap-2">
        <span className="text-xs font-label font-bold uppercase tracking-widest text-error">
          {t("worst")}
        </span>
        <span className="h-px flex-1 bg-error/30" />
      </div>

      {/* Submit */}
      <button
        onClick={() => onSubmit(ranking)}
        disabled={disabled}
        className="w-full py-4 bg-primary text-on-primary font-headline font-extrabold rounded-xl shadow-[0px_4px_0px_0px_#004c1e] active:translate-y-1 active:shadow-none transition-all border-b-4 border-primary-dim disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {t("submit")}
      </button>
    </div>
  );
}
