"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
} from "chart.js";
import { Radar } from "react-chartjs-2";
import type { SessionResult } from "@/lib/types";
import { getMasteryEmoji } from "@/lib/detective/scoring";
import { saveSession } from "@/lib/storage";
import { playComplete } from "@/lib/sounds";
import { ResultsSkeleton } from "@/components/Skeleton";
import CertificateModal from "@/components/CertificateModal";
import ShareButton from "@/components/ShareButton";

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip);

export default function TuringResultsPage() {
  const router = useRouter();
  const t = useTranslations("results");
  const tTuring = useTranslations("turing");
  const tCert = useTranslations("certificate");
  const tMastery = useTranslations("mastery");
  const tDim = useTranslations("dimensions");
  const tCt = useTranslations("contentType");
  const tGames = useTranslations("games");
  const [session, setSession] = useState<SessionResult | null>(null);
  const [displayScore, setDisplayScore] = useState(0);
  const [saved, setSaved] = useState(false);
  const [certModalOpen, setCertModalOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = sessionStorage.getItem("turing-result");
    if (raw) {
      try {
        setSession(JSON.parse(raw));
        return;
      } catch { /* fall through */ }
    }
    try {
      const stored = localStorage.getItem("ai-mastery-games");
      if (stored) {
        const data = JSON.parse(stored);
        const sessions = (data.sessions || []).filter(
          (s: SessionResult) => s.game === "turing"
        );
        if (sessions.length > 0) {
          setSession(sessions[sessions.length - 1]);
          return;
        }
      }
    } catch { /* fall through */ }
    router.replace("/turing");
  }, [router]);

  useEffect(() => {
    if (session && !saved) {
      saveSession(session);
      setSaved(true);
      playComplete();
    }
  }, [session, saved]);

  useEffect(() => {
    if (!session) return;
    const target = session.overallScore;
    if (target === 0) return;
    let current = 0;
    const step = Math.max(1, Math.floor(target / 50));
    const id = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(id);
      }
      setDisplayScore(current);
    }, 25);
    return () => clearInterval(id);
  }, [session]);

  const radarData = useMemo(() => {
    if (!session) return null;
    const d = session.dimensions;
    return {
      labels: [tDim("prompting"), tDim("concepts"), tDim("tools"), tDim("criticalThinking"), tDim("ethics")],
      datasets: [
        {
          label: t("yourScore"),
          data: [d.prompting, d.concepts, d.tools, d.criticalThinking, d.ethics],
          backgroundColor: "rgba(13, 115, 119, 0.15)",
          borderColor: "rgba(13, 115, 119, 0.8)",
          borderWidth: 2,
          pointBackgroundColor: "#0d7377",
          pointBorderColor: "#0d7377",
          pointRadius: 4,
        },
      ],
    };
  }, [session, tDim]);

  const radarOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: true,
      scales: {
        r: {
          beginAtZero: true,
          max: 100,
          ticks: { stepSize: 20, display: false },
          grid: { color: "rgba(224, 219, 211, 0.8)" },
          angleLines: { color: "rgba(224, 219, 211, 0.8)" },
          pointLabels: { color: "#6b6b80", font: { size: 12 } },
        },
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "#ffffff",
          borderColor: "#e0dbd3",
          borderWidth: 1,
          titleColor: "#0d7377",
          bodyColor: "#1a1a2e",
        },
      },
    }),
    []
  );

  if (!session) {
    return <ResultsSkeleton />;
  }

  const masteryEmoji = getMasteryEmoji(session.masteryLevel);
  const masteryLabel = tMastery(session.masteryLevel);
  const correctCount = session.cases.filter((c) => c.isCorrect).length;

  // Calculate best streak and category breakdown
  let bestStreak = 0;
  let currentStreak = 0;
  for (const c of session.cases) {
    if (c.isCorrect) {
      currentStreak++;
      bestStreak = Math.max(bestStreak, currentStreak);
    } else {
      currentStreak = 0;
    }
  }

  const contentTypeMap: Record<string, string> = {
    email: "email",
    essay: "essay",
    code: "code",
    "social-media": "socialMedia",
    "creative-writing": "creativeWriting",
    image: "image",
  };

  const categoryStats: Record<string, { correct: number; total: number }> = {};
  for (const c of session.cases) {
    const ct = c.caseType as string;
    if (!categoryStats[ct]) categoryStats[ct] = { correct: 0, total: 0 };
    categoryStats[ct].total++;
    if (c.isCorrect) categoryStats[ct].correct++;
  }

  return (
    <div className="min-h-screen bg-ed-cream">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center"
        >
          <h1 className="mb-2 text-3xl font-bold text-ed-ink sm:text-4xl">
            {t("title")}
          </h1>
          <p className="text-ed-ink-muted">
            {t("casesCorrect", { correct: correctCount, total: session.cases.length })}
          </p>
        </motion.div>

        {/* Score + Mastery */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-12"
        >
          <div className="text-center">
            <p className="text-6xl font-bold text-ed-teal sm:text-7xl">
              {displayScore}
            </p>
            <p className="text-sm uppercase tracking-wider text-ed-ink-muted">{t("overallScore")}</p>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex flex-col items-center"
          >
            <div className="mb-1 animate-pulse-glow text-5xl">{masteryEmoji}</div>
            <p className="text-lg font-bold text-ed-ink">{masteryLabel}</p>
            <p className="text-xs uppercase tracking-wider text-ed-ink-muted">{t("masteryLevel")}</p>
          </motion.div>
        </motion.div>

        {/* Turing-specific stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mb-10 flex justify-center gap-8"
        >
          <div className="text-center">
            <p className="text-2xl font-bold text-ed-success">{correctCount}/{session.cases.length}</p>
            <p className="text-xs uppercase tracking-wider text-ed-ink-muted">{tTuring("accuracy")}</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-ed-burnt">{"\u{1F525}"} {bestStreak}</p>
            <p className="text-xs uppercase tracking-wider text-ed-ink-muted">{tTuring("bestStreak")}</p>
          </div>
        </motion.div>

        {/* Category breakdown */}
        {Object.keys(categoryStats).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mb-10"
          >
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-ed-ink-muted">
              {tTuring("categoryBreakdown")}
            </h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {Object.entries(categoryStats).map(([type, stats]) => (
                <div
                  key={type}
                  className="rounded-lg border border-ed-border bg-ed-card p-3 text-center"
                >
                  <p className="text-xs text-ed-ink-muted">
                    {tCt(contentTypeMap[type] || type)}
                  </p>
                  <p className={`text-lg font-bold ${stats.correct === stats.total ? "text-ed-success" : "text-ed-ink-muted"}`}>
                    {stats.correct}/{stats.total}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Radar Chart */}
        {radarData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mx-auto mb-10 max-w-md rounded-xl border border-ed-border bg-ed-card p-6"
          >
            <h3 className="mb-4 text-center text-sm font-semibold uppercase tracking-wider text-ed-ink-muted">
              {t("skillDimensions")}
            </h3>
            <Radar data={radarData} options={radarOptions} />
          </motion.div>
        )}

        {/* Case breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mb-10"
        >
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-ed-ink-muted">
            {t("caseBreakdown")}
          </h3>
          <div className="space-y-2">
            {session.cases.map((answer, i) => (
              <motion.div
                key={`${i}-${answer.caseId}`}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + i * 0.05, duration: 0.3 }}
                className="flex items-center justify-between rounded-lg border border-ed-border bg-ed-card px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <span className={`text-lg ${answer.isCorrect ? "text-ed-success" : "text-ed-error"}`}>
                    {answer.isCorrect ? "\u2705" : "\u274C"}
                  </span>
                  <div className="min-w-0">
                    <span className="block truncate text-sm text-ed-ink">
                      {answer.caseTitle || `Item ${i + 1}`}
                    </span>
                    {answer.caseType && (
                      <span className="text-[10px] uppercase tracking-wider text-ed-ink-muted">
                        {answer.caseType.replace("-", " ")}
                      </span>
                    )}
                  </div>
                </div>
                <span className="ml-4 shrink-0 font-mono text-sm font-semibold text-ed-ink">
                  {answer.score} <span className="text-ed-ink-muted">pts</span>
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.4 }}
          className="flex flex-col gap-3 sm:flex-row sm:justify-center"
        >
          <button
            onClick={() => setCertModalOpen(true)}
            className="rounded-lg bg-ed-burnt/10 px-6 py-3 text-center font-semibold text-ed-burnt transition-colors hover:bg-ed-burnt/20"
          >
            {tCert("downloadCertificate")}
          </button>
          <ShareButton
            gameName={tGames("turing.name")}
            score={session.overallScore}
            masteryLevel={tMastery(session.masteryLevel)}
            difficulty={session.difficulty}
          />
          <Link
            href="/turing"
            className="rounded-lg bg-ed-teal/10 px-6 py-3 text-center font-semibold text-ed-teal border border-ed-teal/30 transition-colors hover:bg-ed-teal/20"
          >
            {t("playAgain")}
          </Link>
          <Link
            href="/"
            className="rounded-lg border border-ed-border bg-ed-card px-6 py-3 text-center font-semibold text-ed-ink-muted transition-colors hover:bg-ed-warm"
          >
            {t("backToHub")}
          </Link>
        </motion.div>

        {/* Certificate Modal */}
        <CertificateModal
          isOpen={certModalOpen}
          onClose={() => setCertModalOpen(false)}
          session={session}
        />
      </div>
    </div>
  );
}
