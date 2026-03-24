"use client";

import { useTranslations } from "next-intl";

interface HintButtonProps {
  hint: string;
  penalty: number;
  used: boolean;
  onUseHint: () => void;
}

export default function HintButton({ hint, penalty, used, onUseHint }: HintButtonProps) {
  const t = useTranslations("escape");

  if (used) {
    return (
      <div className="rounded-2xl border-2 border-outline-variant/30 bg-surface-container-low p-5">
        <div className="mb-1 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-on-surface-variant">
          <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>lightbulb</span>
          {t("hintUsed")}
        </div>
        <p className="text-sm text-on-surface leading-relaxed">{hint}</p>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onUseHint}
      className="group flex items-center gap-2 px-5 py-3 bg-tertiary text-on-tertiary font-bold rounded-xl shadow-[0px_4px_0px_0px_#4f3ea7] transition-all active:translate-y-1 active:shadow-none"
    >
      <span className="material-symbols-outlined group-hover:rotate-12 transition-transform">lightbulb</span>
      <span className="font-label uppercase tracking-widest text-xs">{t("hint")} (-{penalty} pts)</span>
    </button>
  );
}
