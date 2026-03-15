"use client";

import { useCallback, useEffect, useState } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  type PanInfo,
} from "framer-motion";
import { useTranslations } from "next-intl";
import type { TuringItem, ContentType } from "@/lib/types";

const SWIPE_THRESHOLD = 100;

const contentTypeEmoji: Record<ContentType, string> = {
  email: "\u{1F4E7}",
  essay: "\u{1F4DD}",
  code: "\u{1F4BB}",
  "social-media": "\u{1F4F1}",
  "creative-writing": "\u270D\uFE0F",
  image: "\u{1F5BC}\uFE0F",
};

const contentTypeKey: Record<ContentType, string> = {
  email: "email",
  essay: "essay",
  code: "code",
  "social-media": "socialMedia",
  "creative-writing": "creativeWriting",
  image: "image",
};

interface SwipeCardProps {
  item: TuringItem;
  onSwipe: (guessedAI: boolean) => void;
  disabled?: boolean;
}

const CHAR_LIMIT = 600;

export default function SwipeCard({ item, onSwipe, disabled }: SwipeCardProps) {
  const t = useTranslations("turing");
  const tCt = useTranslations("contentType");
  const [expanded, setExpanded] = useState(false);

  // Reset expanded state when item changes
  useEffect(() => { setExpanded(false); }, [item.id]);

  const isLong = item.content.length > CHAR_LIMIT;
  const displayContent = (!expanded && isLong)
    ? item.content.slice(0, CHAR_LIMIT).replace(/\s+\S*$/, "") + "…"
    : item.content;

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 0, 300], [-12, 0, 12]);
  const aiOpacity = useTransform(x, [0, SWIPE_THRESHOLD], [0, 1]);
  const humanOpacity = useTransform(x, [-SWIPE_THRESHOLD, 0], [1, 0]);

  // Teal border when dragging right (AI), burnt orange when dragging left (Human)
  const borderColor = useTransform(
    x,
    [-SWIPE_THRESHOLD, 0, SWIPE_THRESHOLD],
    [
      "rgba(196, 101, 42, 0.7)",
      "rgba(224, 219, 211, 1)",
      "rgba(13, 115, 119, 0.7)",
    ]
  );
  const boxShadow = useTransform(
    x,
    [-SWIPE_THRESHOLD, 0, SWIPE_THRESHOLD],
    [
      "0 4px 20px rgba(196, 101, 42, 0.15)",
      "0 1px 3px rgba(0,0,0,0.04)",
      "0 4px 20px rgba(13, 115, 119, 0.15)",
    ]
  );

  const handleDragEnd = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      if (disabled) return;
      if (info.offset.x > SWIPE_THRESHOLD) {
        onSwipe(true); // AI
      } else if (info.offset.x < -SWIPE_THRESHOLD) {
        onSwipe(false); // Human
      }
    },
    [disabled, onSwipe]
  );

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (disabled) return;
      if (e.key === "ArrowRight") {
        onSwipe(true);
      } else if (e.key === "ArrowLeft") {
        onSwipe(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [disabled, onSwipe]);

  const renderContent = () => {
    if (item.contentType === "image") {
      if (item.imagePath) {
        return (
          <div className="flex justify-center">
            <img
              src={item.imagePath}
              alt={item.title}
              className="max-h-[350px] w-auto rounded-lg object-contain"
            />
          </div>
        );
      }
      return (
        <div className="flex min-h-[200px] items-center justify-center rounded-lg border border-dashed border-ed-border-dark bg-ed-warm/50 p-6">
          <p className="text-center text-sm text-ed-ink-muted italic">
            {item.imageDescription || "Image not available"}
          </p>
        </div>
      );
    }

    if (item.contentType === "code") {
      return (
        <pre className="overflow-x-auto rounded-lg bg-[#f8f6f1] p-5 font-mono text-[15px] leading-7 text-ed-teal">
          <code>{displayContent}</code>
        </pre>
      );
    }

    return (
      <div>
        {item.imagePath && (
          <div className="mb-3 flex justify-center">
            <img
              src={item.imagePath}
              alt={item.title}
              className="max-h-[200px] w-auto rounded-lg object-contain"
            />
          </div>
        )}
        <div className="prose max-w-none text-[15px] leading-7 text-ed-ink">
          {displayContent.split("\n").map((paragraph, i) => (
            <p key={i} className={paragraph.trim() === "" ? "h-3" : "mb-2"}>
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Swipeable card */}
      <motion.div
        drag={disabled ? false : "x"}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.8}
        onDragEnd={handleDragEnd}
        style={{ x, rotate, borderColor, boxShadow }}
        className="relative w-full max-w-2xl cursor-grab rounded-xl border border-ed-border bg-ed-card p-6 shadow-sm active:cursor-grabbing sm:p-8"
      >
        {/* Swipe labels */}
        <motion.div
          style={{ opacity: humanOpacity }}
          className="pointer-events-none absolute left-4 top-4 z-10 rounded-lg border-2 border-ed-burnt bg-ed-burnt/10 px-4 py-2 font-mono text-lg font-bold text-ed-burnt"
        >
          {t("human")}
        </motion.div>
        <motion.div
          style={{ opacity: aiOpacity }}
          className="pointer-events-none absolute right-4 top-4 z-10 rounded-lg border-2 border-ed-teal bg-ed-teal/10 px-4 py-2 font-mono text-lg font-bold text-ed-teal"
        >
          {t("ai")}
        </motion.div>

        {/* Content type badge */}
        <div className="mb-5 flex items-center gap-3">
          <span className="rounded-full border border-ed-border-dark bg-ed-warm px-3 py-1.5 text-sm font-semibold text-ed-ink-light">
            {contentTypeEmoji[item.contentType]}{" "}
            {tCt(contentTypeKey[item.contentType])}
          </span>
          {item.title && (
            <span className="text-base font-medium text-ed-ink-light">
              {item.title}
            </span>
          )}
        </div>

        {/* Content body */}
        <div className="min-h-[150px] max-h-[400px] overflow-y-auto pr-1 scrollbar-thin">
          {renderContent()}
          {isLong && (
            <button
              onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
              className="mt-2 text-xs font-semibold text-ed-teal hover:text-ed-teal/80 transition-colors"
            >
              {expanded ? t("showLess") : t("showMore")}
            </button>
          )}
        </div>
      </motion.div>

      {/* Desktop fallback buttons */}
      <div className="flex w-full max-w-2xl items-center justify-between gap-4">
        <button
          onClick={() => !disabled && onSwipe(false)}
          disabled={disabled}
          aria-label={t("human")}
          className="flex items-center gap-2 rounded-lg border border-ed-burnt/40 bg-ed-burnt/10 px-6 py-3 font-mono text-sm font-bold text-ed-burnt transition-all hover:bg-ed-burnt/20 hover:shadow-[0_4px_12px_rgba(196,101,42,0.15)] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <span>&larr;</span> {t("human")}
        </button>

        <span className="text-xs text-ed-ink-muted">
          {t("swipeLeftHuman")} / {t("swipeRightAI")}
        </span>

        <button
          onClick={() => !disabled && onSwipe(true)}
          disabled={disabled}
          aria-label={t("ai")}
          className="flex items-center gap-2 rounded-lg border border-ed-teal/40 bg-ed-teal/10 px-6 py-3 font-mono text-sm font-bold text-ed-teal transition-all hover:bg-ed-teal/20 hover:shadow-[0_4px_12px_rgba(13,115,119,0.15)] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {t("ai")} <span>&rarr;</span>
        </button>
      </div>
    </div>
  );
}
