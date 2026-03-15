"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { generateCertificate, type CertificateData } from "@/lib/certificate";
import type { SessionResult } from "@/lib/types";

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: SessionResult;
}

export default function CertificateModal({ isOpen, onClose, session }: CertificateModalProps) {
  const t = useTranslations("certificate");
  const tMastery = useTranslations("mastery");
  const tDim = useTranslations("dimensions");
  const tGames = useTranslations("games");

  const contentRef = useRef<HTMLDivElement>(null);
  const [playerName, setPlayerName] = useState("");
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    const trimmed = playerName.trim();
    if (!trimmed) {
      setError(t("nameRequired"));
      return;
    }
    setError("");
    setGenerating(true);

    try {
      const certData: CertificateData = {
        playerName: trimmed,
        date: new Date(session.date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        overallScore: session.overallScore,
        masteryLevel: session.masteryLevel,
        masteryLabel: tMastery(session.masteryLevel),
        dimensions: session.dimensions,
        dimensionLabels: {
          prompting: tDim("prompting"),
          concepts: tDim("concepts"),
          tools: tDim("tools"),
          criticalThinking: tDim("criticalThinking"),
          ethics: tDim("ethics"),
        },
        gameName: tGames(`${session.game}.name`),
      };

      const blob = await generateCertificate(certData);

      // Trigger download
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `AI-Mastery-Certificate-${trimmed.replace(/\s+/g, "-")}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      onClose();
    } catch (err) {
      console.error("Certificate generation failed:", err);
      setError(t("generateError"));
    } finally {
      setGenerating(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-label={t("title")}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
          onKeyDown={(e) => {
            if (e.key === "Escape") { onClose(); return; }
            if (e.key !== "Tab" || !contentRef.current) return;
            const focusable = contentRef.current.querySelectorAll<HTMLElement>(
              'button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
            );
            if (focusable.length === 0) return;
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (e.shiftKey && document.activeElement === first) {
              e.preventDefault();
              last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
              e.preventDefault();
              first.focus();
            }
          }}
        >
          <motion.div
            ref={contentRef}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="mx-4 w-full max-w-md rounded-xl border border-ed-border bg-ed-card p-6 shadow-2xl"
          >
            {/* Header */}
            <div className="mb-6 text-center">
              <h2 className="mb-1 font-display text-xl font-bold text-ed-ink">{t("title")}</h2>
              <p className="text-sm text-ed-ink-muted">{t("subtitle")}</p>
            </div>

            {/* Score preview */}
            <div className="mb-6 flex items-center justify-center gap-6 rounded-lg border border-ed-border bg-ed-warm p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-ed-teal">{session.overallScore}</p>
                <p className="text-[10px] uppercase tracking-wider text-ed-ink-muted">{t("score")}</p>
              </div>
              <div className="h-8 w-px bg-ed-border" />
              <div className="text-center">
                <p className="text-lg font-bold text-ed-burnt">
                  {tMastery(session.masteryLevel)}
                </p>
                <p className="text-[10px] uppercase tracking-wider text-ed-ink-muted">{t("level")}</p>
              </div>
            </div>

            {/* Name input */}
            <div className="mb-4">
              <label htmlFor="cert-name" className="mb-1.5 block text-sm font-medium text-ed-ink-light">
                {t("nameLabel")}
              </label>
              <input
                id="cert-name"
                type="text"
                value={playerName}
                onChange={(e) => {
                  setPlayerName(e.target.value);
                  if (error) setError("");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleGenerate();
                }}
                placeholder={t("namePlaceholder")}
                className="w-full rounded-lg border border-ed-border bg-ed-warm px-4 py-2.5 text-ed-ink placeholder-ed-ink-muted/50 outline-none transition-colors focus:border-ed-teal"
                maxLength={50}
                autoFocus
              />
              {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 rounded-lg border border-ed-border bg-ed-warm px-4 py-2.5 text-sm font-semibold text-ed-ink-muted transition-colors hover:bg-ed-parchment"
              >
                {t("cancel")}
              </button>
              <button
                onClick={handleGenerate}
                disabled={generating}
                className="flex-1 rounded-lg bg-ed-teal/10 px-4 py-2.5 text-sm font-semibold text-ed-teal transition-colors hover:bg-ed-teal/20 disabled:opacity-50"
              >
                {generating ? t("generating") : t("generate")}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
