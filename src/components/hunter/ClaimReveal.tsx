"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import type { HunterClaim, HunterAnswer } from "@/lib/types";

interface ClaimRevealProps {
  claim: HunterClaim;
  answer: HunterAnswer;
  onNext: () => void;
  isLast: boolean;
}

export default function ClaimReveal({ claim, answer, onNext, isLast }: ClaimRevealProps) {
  const t = useTranslations("hunter");
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-2xl mx-auto"
    >
      {/* Result banner */}
      <div className={`rounded-t-xl px-5 py-3 flex items-center gap-3 ${
        answer.isCorrect
          ? "bg-primary text-on-primary"
          : "bg-error text-on-error"
      }`}>
        <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
          {answer.isCorrect ? "check_circle" : "cancel"}
        </span>
        <div>
          <p className="font-headline font-bold text-lg">
            {answer.isCorrect ? t("correct") : t("wrong")}
          </p>
          <p className="text-sm opacity-90">
            {answer.isCorrect
              ? `+${answer.score} pts${answer.streak > 1 ? ` (${t("streakMultiplier", { multiplier: answer.multiplier })})` : ""}`
              : t("streakBroken")}
          </p>
        </div>
      </div>

      {/* Claim + explanation */}
      <div className="bg-surface-container-lowest border-2 border-t-0 border-outline-variant rounded-b-xl p-5">
        <p className="text-on-surface font-body text-base leading-relaxed mb-3 font-medium">
          &ldquo;{claim.text}&rdquo;
        </p>

        <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold mb-4 ${
          claim.isHallucination
            ? "bg-error/10 text-error border border-error/30"
            : "bg-primary/10 text-primary border border-primary/30"
        }`}>
          <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
            {claim.isHallucination ? "warning" : "verified"}
          </span>
          {claim.isHallucination ? t("hallucination") : t("legitimate")}
        </div>

        <p className="text-on-surface-variant text-sm leading-relaxed mb-5">
          {claim.explanation}
        </p>

        {claim.source && (
          <p className="text-xs text-on-surface-variant/70 mb-4">
            {t("source", { source: claim.source })}
          </p>
        )}

        <button
          onClick={onNext}
          aria-label={isLast ? t("viewResults") : t("nextClaim")}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary text-on-primary font-bold font-label text-sm shadow-[0_3px_0_0_rgba(0,80,25,1)] hover:shadow-[0_1px_0_0_rgba(0,80,25,1)] hover:translate-y-[2px] transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          {isLast ? t("viewResults") : t("nextClaim")}
          <span className="material-symbols-outlined text-base" aria-hidden="true">arrow_forward</span>
        </button>
      </div>
    </motion.div>
  );
}
