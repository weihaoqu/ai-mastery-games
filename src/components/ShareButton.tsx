"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

interface ShareButtonProps {
  gameName: string;
  score: number;
  masteryLevel: string;
  difficulty: string;
}

export default function ShareButton({
  gameName,
  score,
  masteryLevel,
  difficulty,
}: ShareButtonProps) {
  const t = useTranslations("share");
  const [copied, setCopied] = useState(false);

  const shareText = `${t("prefix")} ${score}% ${t("on")} ${gameName} (${difficulty}) — ${masteryLevel}! ${t("suffix")}`;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textarea = document.createElement("textarea");
      textarea.value = shareText;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  function handleTwitter() {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
    window.open(url, "_blank", "noopener,noreferrer,width=600,height=400");
  }

  function handleLinkedIn() {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent("https://ai-mastery-games.com")}&summary=${encodeURIComponent(shareText)}`;
    window.open(url, "_blank", "noopener,noreferrer,width=600,height=600");
  }

  return (
    <div className="flex items-center gap-2">
      {/* Copy */}
      <button
        onClick={handleCopy}
        className={`rounded-lg border px-4 py-3 text-center text-sm font-semibold transition-all ${
          copied
            ? "border-ed-success/40 bg-ed-success/10 text-ed-success"
            : "border-ed-border bg-ed-card text-ed-ink-muted hover:bg-ed-warm"
        }`}
      >
        {copied ? t("copied") : t("copyScore")}
      </button>

      {/* Twitter/X */}
      <button
        onClick={handleTwitter}
        className="rounded-lg border border-ed-border bg-ed-card px-3 py-3 text-sm text-ed-ink-muted transition-colors hover:bg-ed-warm"
        aria-label={t("shareTwitter")}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </button>

      {/* LinkedIn */}
      <button
        onClick={handleLinkedIn}
        className="rounded-lg border border-ed-border bg-ed-card px-3 py-3 text-sm text-ed-ink-muted transition-colors hover:bg-ed-warm"
        aria-label={t("shareLinkedIn")}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      </button>
    </div>
  );
}
