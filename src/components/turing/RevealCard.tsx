"use client";

import { useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import type { TuringItem, TuringAnswer } from "@/lib/types";
import { playCorrect, playWrong } from "@/lib/sounds";

interface RevealCardProps {
  item: TuringItem;
  answer: TuringAnswer;
  onNext: () => void;
}

/**
 * Highlights marker texts within the content string.
 * Returns an array of React nodes with colored spans for markers.
 */
function highlightMarkers(content: string, markers: TuringItem["markers"]) {
  if (!markers.length) return [content];

  // Build a list of marker matches with their positions
  type Match = { start: number; end: number; marker: (typeof markers)[number] };
  const matches: Match[] = [];

  for (const marker of markers) {
    // Find first occurrence of marker text
    const idx = content.indexOf(marker.text);
    if (idx !== -1) {
      matches.push({ start: idx, end: idx + marker.text.length, marker });
    }
  }

  // Sort by start position and remove overlaps
  matches.sort((a, b) => a.start - b.start);
  const filtered: Match[] = [];
  let lastEnd = 0;
  for (const m of matches) {
    if (m.start >= lastEnd) {
      filtered.push(m);
      lastEnd = m.end;
    }
  }

  // Build React nodes
  const nodes: React.ReactNode[] = [];
  let cursor = 0;

  for (let i = 0; i < filtered.length; i++) {
    const m = filtered[i];
    // Text before this marker
    if (cursor < m.start) {
      nodes.push(content.slice(cursor, m.start));
    }

    const bgClass =
      m.marker.type === "ai-tell"
        ? "bg-ed-teal/15 border-b-2 border-ed-teal"
        : "bg-ed-burnt/15 border-b-2 border-ed-burnt";

    nodes.push(
      <span key={`marker-${i}`} className="relative inline-block group/marker">
        <span className={`${bgClass} rounded px-0.5`}>
          {m.marker.text}
        </span>
        <span className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-1 -translate-x-1/2 max-w-xs whitespace-normal rounded bg-ed-ink px-2 py-1 text-xs text-gray-200 opacity-0 shadow-lg transition-opacity group-hover/marker:opacity-100">
          {m.marker.explanation}
        </span>
      </span>
    );
    cursor = m.end;
  }

  // Remaining text
  if (cursor < content.length) {
    nodes.push(content.slice(cursor));
  }

  return nodes;
}

export default function RevealCard({ item, answer, onNext }: RevealCardProps) {
  const t = useTranslations("turing");

  const isCorrect = answer.isCorrect;

  useEffect(() => {
    if (isCorrect) playCorrect();
    else playWrong();
  }, [isCorrect]);

  // For image items, highlight markers in imageDescription instead of content
  const textToHighlight = item.contentType === "image" && item.imageDescription
    ? item.imageDescription
    : item.content;

  const highlightedContent = useMemo(
    () => highlightMarkers(textToHighlight, item.markers),
    [textToHighlight, item.markers]
  );

  const borderClass = isCorrect
    ? "border-ed-success/50"
    : "border-ed-error/50";
  const glowClass = isCorrect
    ? "shadow-[0_0_20px_rgba(26,122,76,0.12)]"
    : "shadow-[0_0_20px_rgba(181,52,42,0.12)]";

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`w-full max-w-2xl rounded-xl border-2 bg-ed-card ${borderClass} ${glowClass}`}
    >
      {/* Result banner */}
      <div
        className={`flex items-center justify-between rounded-t-xl px-6 py-4 ${
          isCorrect ? "bg-ed-success/10" : "bg-ed-error/10"
        }`}
      >
        <div className="flex items-center gap-3">
          <span className={`text-2xl font-bold ${isCorrect ? "text-ed-success" : "text-ed-error"}`}>
            {isCorrect ? "\u2713" : "\u2717"}
          </span>
          <span className={`font-display text-lg font-bold ${isCorrect ? "text-ed-success" : "text-ed-error"}`}>
            {isCorrect ? t("correct") : t("incorrect")}
          </span>
        </div>

        {isCorrect && (
          <div className="text-right">
            <div className="font-sans text-xl font-bold text-ed-success">
              +{answer.score}
            </div>
            {answer.multiplier > 1 && (
              <div className="text-xs text-ed-success/70">
                {t("multiplier")}: x{answer.multiplier}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="space-y-6 p-6 sm:p-8">
        {/* Source line */}
        <div className="rounded-lg border border-ed-border bg-ed-parchment px-5 py-3">
          <span className="text-base text-ed-ink-muted">
            {item.isAI
              ? t("generatedBy", { model: item.aiModel || "AI" })
              : t("writtenBy", { source: item.humanSource || "Human" })}
          </span>
        </div>

        {/* Image display for items with images */}
        {item.imagePath && (
          <div className="flex justify-center rounded-lg border border-ed-border bg-ed-warm p-4">
            <img
              src={item.imagePath}
              alt={item.title}
              className="max-h-[250px] w-auto rounded-lg object-contain"
            />
          </div>
        )}

        {/* Content with highlighted markers */}
        <div className="max-h-[350px] overflow-y-auto rounded-lg border border-ed-border bg-ed-warm p-5 pr-3 scrollbar-thin">
          {item.contentType === "code" ? (
            <pre className="font-mono text-[15px] leading-7 text-ed-teal whitespace-pre-wrap">
              <code>{highlightedContent}</code>
            </pre>
          ) : item.contentType === "image" ? (
            <div className="text-[15px] leading-7 text-ed-ink whitespace-pre-wrap">
              {highlightedContent}
            </div>
          ) : (
            <div className="text-[15px] leading-7 text-ed-ink whitespace-pre-wrap">
              {highlightedContent}
            </div>
          )}
        </div>

        {/* Marker legend */}
        {item.markers.length > 0 && (
          <div className="flex flex-wrap gap-4 text-base text-ed-ink-light">
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2.5 w-5 rounded bg-ed-teal/30 border-b border-ed-teal" />
              <span className="text-ed-teal font-medium">AI tell</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2.5 w-5 rounded bg-ed-burnt/30 border-b border-ed-burnt" />
              <span className="text-ed-burnt font-medium">Human tell</span>
            </span>
            <span className="text-ed-ink-muted">Hover highlighted text for details</span>
          </div>
        )}

        {/* Overall explanation */}
        <div className="rounded-lg border border-ed-border bg-ed-parchment p-5">
          <p className="text-[15px] leading-7 text-ed-ink">
            {item.explanation}
          </p>
        </div>

        {/* Streak info */}
        {answer.streak > 0 && (
          <div className="flex items-center justify-center gap-4 text-sm">
            <span className="text-ed-ink-muted">
              {t("streak")}:{" "}
              <span className="font-sans font-bold text-ed-teal">
                {answer.streak}
              </span>
            </span>
            {answer.multiplier > 1 && (
              <span className="text-ed-ink-muted">
                {t("multiplier")}:{" "}
                <span className="font-sans font-bold text-ed-success">
                  x{answer.multiplier}
                </span>
              </span>
            )}
          </div>
        )}

        {/* Next button */}
        <button
          onClick={onNext}
          className="w-full rounded-lg border border-ed-teal/40 bg-ed-teal/10 px-6 py-3 font-sans text-sm font-bold text-ed-teal transition-all hover:bg-ed-teal/20 hover:shadow-[0_0_15px_rgba(13,115,119,0.15)]"
        >
          {t("next")} &rarr;
        </button>
      </div>
    </motion.div>
  );
}
