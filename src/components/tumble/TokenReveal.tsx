"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import type { TokenPuzzle, TokenAnswer } from "@/lib/types";

interface TokenRevealProps {
  puzzle: TokenPuzzle;
  answer: TokenAnswer;
  onNext: () => void;
  isLast: boolean;
}

export default function TokenReveal({ puzzle, answer, onNext, isLast }: TokenRevealProps) {
  const t = useTranslations("tumble");
  const correctSequence = puzzle.correctOrder.map(i => puzzle.scrambledTokens[i]);
  const playerSequence = answer.playerOrder.map(i => puzzle.scrambledTokens[i]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-2xl"
    >
      {/* Result Banner */}
      <div className={`text-center py-4 px-6 rounded-2xl mb-4 border-2 ${
        answer.isCorrect
          ? "bg-primary/10 border-primary/30 text-primary"
          : "bg-error/10 border-error/30 text-error"
      }`}>
        <div className="flex items-center justify-center gap-2 mb-1">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
            {answer.isCorrect ? "check_circle" : "cancel"}
          </span>
          <span className="font-headline font-bold text-lg">
            {answer.isCorrect ? t("perfectOrder") : t("notQuiteRight")}
          </span>
        </div>
        <p className="text-sm font-mono font-bold">+{answer.score} {t("pts")}</p>
        {answer.streak > 1 && (
          <p className="text-xs mt-1">{"\u{1F525}"} {t("streak", { streak: answer.streak })}</p>
        )}
      </div>

      {/* Correct Order */}
      <div className="bg-primary/5 border-2 border-primary/20 rounded-xl p-4 mb-3">
        <p className="text-xs font-label uppercase tracking-widest text-primary mb-2 font-bold">{t("correctOrder")}</p>
        <div className="space-y-1.5">
          {correctSequence.map((token, i) => {
            const isMatch = playerSequence[i] === token;
            return (
              <div key={i} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                isMatch ? "bg-primary/10" : "bg-error/10"
              }`}>
                <span className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center ${
                  isMatch ? "bg-primary text-on-primary" : "bg-error text-on-primary"
                }`}>
                  {i + 1}
                </span>
                <span className={`${isMatch ? "text-on-surface" : "text-error"}`}>{token}</span>
                {isMatch && (
                  <span className="material-symbols-outlined text-primary text-sm ml-auto">check</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Explanation */}
      <div className="bg-surface-container-lowest border-2 border-outline-variant rounded-xl p-4 mb-6">
        <p className="text-xs font-label uppercase tracking-widest text-on-surface-variant mb-1">{t("whyThisOrder")}</p>
        <p className="text-sm text-on-surface leading-relaxed">{puzzle.explanation}</p>
      </div>

      {/* Next Button */}
      <button
        onClick={onNext}
        aria-label={isLast ? t("viewResults") : t("nextPuzzle")}
        className="w-full px-6 py-3 rounded-xl bg-primary text-on-primary font-bold font-label text-sm shadow-[0_3px_0_0_rgba(0,80,25,1)] hover:shadow-[0_1px_0_0_rgba(0,80,25,1)] hover:translate-y-[2px] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      >
        {isLast ? t("viewResults") : t("nextPuzzle")}
      </button>
    </motion.div>
  );
}
