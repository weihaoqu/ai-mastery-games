"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { basePath } from "@/lib/basePath";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";

interface VerificationRecord {
  code: string;
  playerName: string;
  date: string;
  overallScore: number;
  masteryLevel: string;
  gameName: string;
  createdAt: string;
}

const VERIFICATION_KEY = "ai-mastery-certificates";

const masteryEmojis: Record<string, string> = {
  novice: "\u{1F331}",
  apprentice: "\u{1F527}",
  practitioner: "\u26A1",
  expert: "\u{1F525}",
  master: "\u{1F451}",
};

export default function VerifyPage() {
  const t = useTranslations("verify");
  const tMastery = useTranslations("mastery");
  const params = useParams();
  const code = params.code as string;

  const [record, setRecord] = useState<VerificationRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Try localStorage first
    try {
      const raw = localStorage.getItem(VERIFICATION_KEY);
      if (raw) {
        const records: VerificationRecord[] = JSON.parse(raw);
        const found = records.find(
          (r) => r.code.toUpperCase() === code.toUpperCase()
        );
        if (found) {
          setRecord(found);
          setLoading(false);
          return;
        }
      }
    } catch {
      // ignore
    }

    // Fall back to server API
    fetch(`${basePath}/api/verify/${encodeURIComponent(code)}`)
      .then((res) => {
        if (!res.ok) throw new Error("not found");
        return res.json();
      })
      .then((data) => {
        setRecord({
          code: data.code,
          playerName: data.playerName,
          date: data.date,
          overallScore: data.overallScore,
          masteryLevel: data.masteryLevel,
          gameName: data.gameName,
          createdAt: data.createdAt || "",
        });
        setLoading(false);
      })
      .catch(() => {
        setNotFound(true);
        setLoading(false);
      });
  }, [code]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cyber-dark">
        <p className="text-gray-500">{t("loading")}</p>
      </div>
    );
  }

  if (notFound || !record) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-cyber-dark bg-grid px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md text-center"
        >
          <div className="mb-4 text-5xl">🔍</div>
          <h1 className="mb-2 text-2xl font-bold text-white">{t("notFoundTitle")}</h1>
          <p className="mb-2 text-gray-400">{t("notFoundMessage")}</p>
          <p className="mb-6 font-mono text-sm text-gray-500">
            {t("code")}: {code}
          </p>
          <p className="mb-8 text-xs text-gray-600">{t("notFoundHint")}</p>
          <Link
            href="/"
            className="rounded-lg bg-cyber-cyan/10 px-6 py-3 font-semibold text-cyber-cyan transition-colors hover:bg-cyber-cyan/20"
          >
            {t("backToHub")}
          </Link>
        </motion.div>
      </div>
    );
  }

  const emoji = masteryEmojis[record.masteryLevel] || "\u{1F31F}";
  const masteryLabel = tMastery(record.masteryLevel);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cyber-dark bg-grid px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Verified badge */}
        <div className="mb-6 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mb-3 inline-block rounded-full border-2 border-cyber-green bg-cyber-green/10 px-4 py-1.5"
          >
            <span className="text-sm font-bold text-cyber-green">
              ✓ {t("verified")}
            </span>
          </motion.div>
          <h1 className="text-2xl font-bold text-white">{t("title")}</h1>
        </div>

        {/* Certificate card */}
        <div className="rounded-xl border border-cyber-border bg-cyber-card p-6">
          {/* Player name */}
          <div className="mb-6 text-center">
            <p className="mb-1 text-xs uppercase tracking-wider text-gray-500">
              {t("awardedTo")}
            </p>
            <p className="text-2xl font-bold text-cyber-green">
              {record.playerName}
            </p>
          </div>

          {/* Score + Mastery */}
          <div className="mb-6 flex items-center justify-center gap-8">
            <div className="text-center">
              <p className="text-4xl font-bold text-cyber-cyan">{record.overallScore}</p>
              <p className="text-xs uppercase tracking-wider text-gray-500">
                {t("score")}
              </p>
            </div>
            <div className="text-center">
              <p className="mb-0.5 text-3xl">{emoji}</p>
              <p className="text-sm font-bold text-white">{masteryLabel}</p>
              <p className="text-xs uppercase tracking-wider text-gray-500">
                {t("level")}
              </p>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-2 border-t border-cyber-border pt-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">{t("game")}</span>
              <span className="text-gray-200">{record.gameName}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">{t("date")}</span>
              <span className="text-gray-200">{record.date}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">{t("code")}</span>
              <span className="font-mono text-gray-200">{record.code}</span>
            </div>
          </div>
        </div>

        {/* Back link */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-sm text-gray-500 transition-colors hover:text-cyber-cyan"
          >
            {t("backToHub")}
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
