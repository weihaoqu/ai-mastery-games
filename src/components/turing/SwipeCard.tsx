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
import { basePath } from "@/lib/basePath";

const SWIPE_THRESHOLD = 100;

const contentTypeIcon: Record<ContentType, string> = {
  email: "mail",
  essay: "description",
  code: "code",
  "social-media": "share",
  "creative-writing": "edit_note",
  image: "image",
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

const CHAR_LIMIT = 500;

export default function SwipeCard({ item, onSwipe, disabled }: SwipeCardProps) {
  const t = useTranslations("turing");
  const tCt = useTranslations("contentType");
  const [expanded, setExpanded] = useState(false);

  useEffect(() => { setExpanded(false); }, [item.id]);

  const isLong = item.content.length > CHAR_LIMIT;
  const displayContent = (!expanded && isLong)
    ? item.content.slice(0, CHAR_LIMIT).replace(/\s+\S*$/, "") + "\u2026"
    : item.content;

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 0, 300], [-8, 0, 8]);
  const aiOpacity = useTransform(x, [0, SWIPE_THRESHOLD], [0, 1]);
  const humanOpacity = useTransform(x, [-SWIPE_THRESHOLD, 0], [1, 0]);

  const borderColor = useTransform(
    x,
    [-SWIPE_THRESHOLD, 0, SWIPE_THRESHOLD],
    ["rgba(0, 106, 45, 0.8)", "rgba(152, 182, 125, 1)", "rgba(155, 63, 0, 0.8)"]
  );

  const handleDragEnd = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      if (disabled) return;
      if (info.offset.x > SWIPE_THRESHOLD) onSwipe(true);
      else if (info.offset.x < -SWIPE_THRESHOLD) onSwipe(false);
    },
    [disabled, onSwipe]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (disabled) return;
      if (e.key === "ArrowRight") onSwipe(true);
      else if (e.key === "ArrowLeft") onSwipe(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [disabled, onSwipe]);

  const renderContent = () => {
    if (item.contentType === "image") {
      if (item.imagePath) {
        return (
          <div className="flex justify-center">
            <img src={`${basePath}${item.imagePath}`} alt={item.title} className="max-h-[200px] sm:max-h-[300px] w-auto rounded-lg object-contain" />
          </div>
        );
      }
      return (
        <div className="flex min-h-[120px] sm:min-h-[180px] items-center justify-center rounded-lg border-2 border-dashed border-outline-variant bg-surface-container-low/30 p-4 sm:p-6">
          <p className="text-center text-sm text-on-surface-variant italic">{item.imageDescription || "Image not available"}</p>
        </div>
      );
    }

    if (item.contentType === "code") {
      return (
        <pre className="overflow-x-auto rounded-lg bg-surface-container-low/30 p-5 font-mono text-sm leading-7 text-on-surface">
          <code>{displayContent}</code>
        </pre>
      );
    }

    return (
      <div>
        {item.imagePath && (
          <div className="mb-3 flex justify-center">
            <img src={`${basePath}${item.imagePath}`} alt={item.title} className="max-h-[140px] sm:max-h-[180px] w-auto rounded-lg object-contain" />
          </div>
        )}
        <div className="bg-surface-container-low/30 p-4 sm:p-6 rounded-lg min-h-[140px] sm:min-h-[200px]">
          <p className="font-label text-base leading-relaxed text-on-surface italic">
            &ldquo;{displayContent.split("\n").map((para, i) => (
              <span key={i}>{i > 0 && <><br /><br /></>}{para}</span>
            ))}&rdquo;
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      {/* Background HUMAN / AI labels */}
      <div className="absolute inset-0 flex justify-between items-center px-4 md:px-12 pointer-events-none">
        <motion.div style={{ opacity: humanOpacity }} className="flex flex-col items-center gap-3 -rotate-12 translate-y-8">
          <span className="material-symbols-outlined text-7xl md:text-8xl text-primary">arrow_back</span>
          <h2 className="font-headline text-4xl md:text-5xl font-black text-primary tracking-tighter">{t("human").toUpperCase()}</h2>
        </motion.div>
        <motion.div style={{ opacity: aiOpacity }} className="flex flex-col items-center gap-3 rotate-12 -translate-y-8">
          <h2 className="font-headline text-4xl md:text-5xl font-black text-secondary tracking-tighter">{t("ai").toUpperCase()}</h2>
          <span className="material-symbols-outlined text-7xl md:text-8xl text-secondary">arrow_forward</span>
        </motion.div>
      </div>

      {/* Stacked card effect */}
      <div className="relative z-10 w-full max-w-md">
        <div className="absolute inset-0 bg-surface-container translate-x-2 translate-y-2 rounded-xl border-2 border-outline-variant -z-10" />
        <div className="absolute inset-0 bg-surface-container-high translate-x-4 translate-y-4 rounded-xl border-2 border-outline-variant -z-20" />

        <motion.div
          drag={disabled ? false : "x"}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.8}
          onDragEnd={handleDragEnd}
          style={{ x, rotate, borderColor }}
          className="bg-surface-container-lowest border-4 border-outline-variant rounded-xl p-4 sm:p-8 shadow-[4px_4px_0_0_#98b67d] sm:shadow-[8px_8px_0_0_#98b67d] transition-shadow cursor-grab active:cursor-grabbing"
        >
          {/* Content type header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-tertiary-container flex items-center justify-center">
              <span className="material-symbols-outlined text-on-tertiary-container">{contentTypeIcon[item.contentType]}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-label text-on-surface-variant font-bold uppercase tracking-wider">
                {tCt(contentTypeKey[item.contentType])}
              </p>
              {item.title && (
                <h3 className="font-headline font-bold text-on-surface truncate">{item.title}</h3>
              )}
            </div>
          </div>

          {/* Content body */}
          <div className="max-h-[250px] sm:max-h-[350px] overflow-y-auto scrollbar-thin pr-1">
            {renderContent()}
          </div>

          {/* Show more */}
          {isLong && (
            <button
              onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
              className="w-full mt-4 py-3 border-2 border-dashed border-outline-variant rounded-lg flex items-center justify-center gap-2 group hover:bg-surface-container-low transition-colors"
            >
              <span className="font-headline font-bold text-outline uppercase tracking-tight text-sm">
                {expanded ? t("showLess") : t("showMore")}
              </span>
              <span className={`material-symbols-outlined text-outline transition-transform ${expanded ? "rotate-180" : ""}`}>
                keyboard_arrow_down
              </span>
            </button>
          )}
        </motion.div>
      </div>

      {/* Mobile swipe buttons */}
      <div className="flex items-center justify-center gap-6 sm:gap-8 md:hidden">
        <button
          onClick={() => !disabled && onSwipe(false)}
          disabled={disabled}
          className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-surface-container-lowest border-4 border-primary text-primary flex items-center justify-center shadow-[4px_4px_0_0_#006a2d] active:translate-y-0.5 active:shadow-none transition-all disabled:opacity-40 shrink-0"
        >
          <span className="material-symbols-outlined text-3xl sm:text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
        </button>
        <div className="flex flex-col items-center shrink">
          <span className="material-symbols-outlined text-outline animate-bounce">swap_horiz</span>
        </div>
        <button
          onClick={() => !disabled && onSwipe(true)}
          disabled={disabled}
          className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-surface-container-lowest border-4 border-secondary text-secondary flex items-center justify-center shadow-[4px_4px_0_0_#9b3f00] active:translate-y-0.5 active:shadow-none transition-all disabled:opacity-40 shrink-0"
        >
          <span className="material-symbols-outlined text-3xl sm:text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
        </button>
      </div>

      {/* Desktop buttons */}
      <div className="hidden md:flex w-full max-w-md items-center justify-between gap-4">
        <button
          onClick={() => !disabled && onSwipe(false)}
          disabled={disabled}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-surface-container-lowest border-2 border-primary text-primary font-bold font-label shadow-[4px_4px_0_0_#006a2d] hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_#006a2d] active:translate-y-1 active:shadow-none transition-all disabled:opacity-40"
        >
          <span className="material-symbols-outlined">arrow_back</span>
          {t("human")}
        </button>
        <span className="text-xs text-on-surface-variant font-label">{t("swipeLeftHuman")}</span>
        <button
          onClick={() => !disabled && onSwipe(true)}
          disabled={disabled}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-surface-container-lowest border-2 border-secondary text-secondary font-bold font-label shadow-[4px_4px_0_0_#9b3f00] hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_#9b3f00] active:translate-y-1 active:shadow-none transition-all disabled:opacity-40"
        >
          {t("ai")}
          <span className="material-symbols-outlined">arrow_forward</span>
        </button>
      </div>
    </div>
  );
}
