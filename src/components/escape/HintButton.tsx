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
      <div className="rounded-lg border border-ed-border bg-ed-parchment p-4">
        <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-ed-ink-muted">
          {"\uD83D\uDCA1"} {t("hintUsed")}
        </div>
        <p className="text-sm text-ed-ink">{hint}</p>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onUseHint}
      className="inline-flex items-center gap-2 rounded-lg border border-amber-300 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-700 transition-colors hover:bg-amber-100"
    >
      {"\uD83D\uDCA1"} {t("hint")}
      <span className="text-xs text-ed-error">-{penalty}s</span>
    </button>
  );
}
