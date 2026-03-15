"use client";

import { useState, useMemo } from "react";
import { Reorder, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import type { CritiqueRound } from "@/lib/types";

interface CritiqueCardProps {
  round: CritiqueRound;
  onSubmit: (ranking: string[]) => void;
  disabled?: boolean;
}

/** Fisher-Yates shuffle (returns new array). */
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

  // Shuffle once on mount (per round) so default order != correct order
  const initialOrder = useMemo(() => {
    const texts = round.prompts.map((p) => p.text);
    // Shuffle until it differs from the correct ranking
    let shuffled = shuffle(texts);
    const correctOrder = [...round.prompts]
      .sort((a, b) => a.rank - b.rank)
      .map((p) => p.text);
    // Try a few times to avoid matching correct order
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
    <div className="flex w-full max-w-2xl flex-col items-center gap-6">
      {/* Task box */}
      <div className="w-full rounded-lg border border-ed-border bg-ed-parchment p-5">
        <p className="text-xs uppercase tracking-widest text-ed-ink-muted mb-1">
          {t("task")}
        </p>
        <p className="text-[15px] leading-7 text-ed-ink">{round.task}</p>
      </div>

      {/* Instruction */}
      <p className="text-sm text-ed-ink-muted">{t("dragToRank")}</p>

      {/* Best label */}
      <div className="w-full flex items-center gap-2">
        <span className="text-xs font-bold uppercase tracking-widest text-ed-success">
          {t("best")}
        </span>
        <span className="h-px flex-1 bg-ed-success/30" />
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
            className="cursor-grab rounded-lg border border-ed-border bg-ed-card p-4 shadow-sm active:cursor-grabbing active:shadow-md transition-shadow"
            whileDrag={{ scale: 1.03, boxShadow: "0 8px 24px rgba(0,0,0,0.1)" }}
          >
            <div className="flex items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ed-warm text-xs font-bold text-ed-ink-muted">
                {idx + 1}
              </span>
              <p className="text-[15px] leading-7 text-ed-ink">{text}</p>
            </div>
          </Reorder.Item>
        ))}
      </Reorder.Group>

      {/* Worst label */}
      <div className="w-full flex items-center gap-2">
        <span className="text-xs font-bold uppercase tracking-widest text-ed-error">
          {t("worst")}
        </span>
        <span className="h-px flex-1 bg-ed-error/30" />
      </div>

      {/* Submit */}
      <button
        onClick={() => onSubmit(ranking)}
        disabled={disabled}
        className="w-full rounded-lg border border-ed-teal/40 bg-ed-teal/10 px-6 py-3 font-sans text-sm font-bold text-ed-teal transition-all hover:bg-ed-teal/20 hover:shadow-[0_0_15px_rgba(13,115,119,0.15)] disabled:cursor-not-allowed disabled:opacity-40"
      >
        {t("submit")}
      </button>
    </div>
  );
}
