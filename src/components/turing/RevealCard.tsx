"use client";

import { useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import type { TuringItem, TuringAnswer } from "@/lib/types";
import { basePath } from "@/lib/basePath";
import { playCorrect, playWrong } from "@/lib/sounds";

interface RevealCardProps {
  item: TuringItem;
  answer: TuringAnswer;
  onNext: () => void;
}

function highlightMarkers(content: string, markers: TuringItem["markers"]) {
  if (!markers.length) return [content];

  type Match = { start: number; end: number; marker: (typeof markers)[number] };
  const matches: Match[] = [];

  for (const marker of markers) {
    const idx = content.indexOf(marker.text);
    if (idx !== -1) {
      matches.push({ start: idx, end: idx + marker.text.length, marker });
    }
  }

  matches.sort((a, b) => a.start - b.start);
  const filtered: Match[] = [];
  let lastEnd = 0;
  for (const m of matches) {
    if (m.start >= lastEnd) {
      filtered.push(m);
      lastEnd = m.end;
    }
  }

  const nodes: React.ReactNode[] = [];
  let cursor = 0;

  for (let i = 0; i < filtered.length; i++) {
    const m = filtered[i];
    if (cursor < m.start) nodes.push(content.slice(cursor, m.start));

    const bgClass =
      m.marker.type === "ai-tell"
        ? "bg-secondary/15 border-b-2 border-secondary"
        : "bg-primary/15 border-b-2 border-primary";

    nodes.push(
      <span key={`marker-${i}`} className="relative inline-block group/marker">
        <span className={`${bgClass} rounded px-0.5`}>{m.marker.text}</span>
        <span className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-1 -translate-x-1/2 max-w-xs whitespace-normal rounded-lg bg-on-surface px-3 py-2 text-xs text-surface opacity-0 shadow-lg transition-opacity group-hover/marker:opacity-100">
          {m.marker.explanation}
        </span>
      </span>
    );
    cursor = m.end;
  }

  if (cursor < content.length) nodes.push(content.slice(cursor));
  return nodes;
}

export default function RevealCard({ item, answer, onNext }: RevealCardProps) {
  const t = useTranslations("turing");
  const isCorrect = answer.isCorrect;

  useEffect(() => {
    if (isCorrect) playCorrect();
    else playWrong();
  }, [isCorrect]);

  const textToHighlight = item.contentType === "image" && item.imageDescription
    ? item.imageDescription
    : item.content;

  const highlightedContent = useMemo(
    () => highlightMarkers(textToHighlight, item.markers),
    [textToHighlight, item.markers]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full max-w-md"
    >
      {/* Result banner */}
      <div className={`rounded-t-xl px-6 py-5 flex items-center justify-between ${
        isCorrect ? "bg-primary-container" : "bg-error-container/20"
      }`}>
        <div className="flex items-center gap-3">
          <span className={`material-symbols-outlined text-3xl ${isCorrect ? "text-primary" : "text-error"}`}
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            {isCorrect ? "emoji_events" : "close"}
          </span>
          <span className={`font-headline text-xl font-bold ${isCorrect ? "text-on-primary-container" : "text-error"}`}>
            {isCorrect ? t("correct") : t("incorrect")}
          </span>
        </div>
        {isCorrect && (
          <div className="text-right">
            <div className="font-headline text-2xl font-black text-primary">+{answer.score}</div>
            {answer.multiplier > 1 && (
              <div className="text-xs text-primary font-label">x{answer.multiplier}</div>
            )}
          </div>
        )}
      </div>

      {/* Card body */}
      <div className="bg-surface-container-lowest border-4 border-t-0 border-outline-variant rounded-b-xl p-4 sm:p-6 space-y-4 sm:space-y-5 shadow-[4px_4px_0_0_#98b67d] sm:shadow-[8px_8px_0_0_#98b67d]">
        {/* Source */}
        <div className="rounded-xl border-2 border-outline-variant bg-surface-container-low/50 px-4 py-3">
          <span className="text-sm text-on-surface-variant font-label">
            {item.isAI
              ? t("generatedBy", { model: item.aiModel || "AI" })
              : t("writtenBy", { source: item.humanSource || "Human" })}
          </span>
        </div>

        {/* Image display */}
        {item.imagePath && (
          <div className="flex justify-center rounded-xl border-2 border-outline-variant bg-surface-container p-4">
            <img src={`${basePath}${item.imagePath}`} alt={item.title} className="max-h-[150px] sm:max-h-[200px] w-auto rounded-lg object-contain" />
          </div>
        )}

        {/* Content with markers */}
        <div className="max-h-[200px] sm:max-h-[280px] overflow-y-auto rounded-xl border-2 border-outline-variant bg-surface-container-low/30 p-3 sm:p-5 scrollbar-thin">
          {item.contentType === "code" ? (
            <pre className="font-mono text-sm leading-7 text-on-surface whitespace-pre-wrap"><code>{highlightedContent}</code></pre>
          ) : (
            <div className="text-sm leading-7 text-on-surface whitespace-pre-wrap">{highlightedContent}</div>
          )}
        </div>

        {/* Marker legend */}
        {item.markers.length > 0 && (
          <div className="flex flex-wrap gap-4 text-xs font-label">
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2 w-4 rounded bg-secondary/30 border-b border-secondary" />
              <span className="text-secondary font-bold">AI tell</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2 w-4 rounded bg-primary/30 border-b border-primary" />
              <span className="text-primary font-bold">Human tell</span>
            </span>
            <span className="text-on-surface-variant">Hover for details</span>
          </div>
        )}

        {/* Explanation */}
        <div className="rounded-xl bg-surface-container p-4">
          <p className="text-sm leading-relaxed text-on-surface">{item.explanation}</p>
        </div>

        {/* Streak */}
        {answer.streak > 0 && (
          <div className="flex items-center justify-center gap-6">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-error" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
              <span className="font-headline font-bold text-on-surface">{answer.streak}</span>
            </div>
            {answer.multiplier > 1 && (
              <div className="flex items-center gap-2 bg-primary-container px-3 py-1 rounded-lg">
                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
                <span className="font-headline font-bold text-on-primary-container">x{answer.multiplier}</span>
              </div>
            )}
          </div>
        )}

        {/* Next */}
        <button
          onClick={onNext}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-primary text-on-primary font-bold font-headline shadow-[0_4px_0_0_#004c1e] hover:translate-y-[2px] hover:shadow-[0_2px_0_0_#004c1e] active:translate-y-[4px] active:shadow-none transition-all"
        >
          {t("next")}
          <span className="material-symbols-outlined">arrow_forward</span>
        </button>
      </div>
    </motion.div>
  );
}
