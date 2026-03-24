"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
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
  const locale = useLocale();
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
    router.replace(`/${locale}/turing`);
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
          backgroundColor: "rgba(0, 106, 45, 0.15)",
          borderColor: "rgba(0, 106, 45, 0.8)",
          borderWidth: 2,
          pointBackgroundColor: "#006a2d",
          pointBorderColor: "#006a2d",
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
          grid: { color: "rgba(152, 182, 125, 0.3)" },
          angleLines: { color: "rgba(152, 182, 125, 0.3)" },
          pointLabels: { color: "#486333", font: { size: 12 } },
        },
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "#ffffff",
          borderColor: "#98b67d",
          borderWidth: 1,
          titleColor: "#006a2d",
          bodyColor: "#1c3509",
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
    <div className="min-h-screen bg-surface">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center"
        >
          <h1 className="mb-2 text-3xl font-headline font-bold text-on-surface sm:text-4xl">
            {t("title")}
          </h1>
          <p className="text-on-surface-variant">
            {t("casesCorrect", { correct: correctCount, total: session.cases.length })}
          </p>
        </motion.div>

        {/* Score + Mastery */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-10 grid grid-cols-1 md:grid-cols-12 gap-6"
        >
          <div className="md:col-span-4 bg-surface-container-lowest p-5 sm:p-8 rounded-xl border-b-4 border-r-4 border-outline-variant text-center">
            <p className="text-4xl font-bold text-primary sm:text-6xl md:text-7xl">
              {displayScore}
            </p>
            <p className="text-sm uppercase tracking-wider text-on-surface-variant">{t("overallScore")}</p>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="md:col-span-8 bg-surface-container-high p-8 rounded-xl flex flex-col items-center justify-center"
          >
            <div className="mb-1 animate-pulse-glow text-5xl">{masteryEmoji}</div>
            <p className="text-lg font-bold text-on-surface">{masteryLabel}</p>
            <p className="text-xs uppercase tracking-wider text-on-surface-variant">{t("masteryLevel")}</p>
          </motion.div>
        </motion.div>

        {/* Turing-specific stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mb-10 grid grid-cols-2 gap-4"
        >
          <div className="bg-surface-container-lowest rounded-xl border-b-4 border-outline-variant p-5 text-center">
            <p className="text-2xl font-bold text-primary">{correctCount}/{session.cases.length}</p>
            <p className="text-xs uppercase tracking-wider text-on-surface-variant">{tTuring("accuracy")}</p>
          </div>
          <div className="bg-surface-container-lowest rounded-xl border-b-4 border-outline-variant p-5 text-center">
            <p className="text-2xl font-bold text-secondary flex items-center justify-center gap-1">
              <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
              {bestStreak}
            </p>
            <p className="text-xs uppercase tracking-wider text-on-surface-variant">{tTuring("bestStreak")}</p>
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
            <h3 className="mb-4 font-headline font-bold text-xl text-on-surface-variant">
              {tTuring("categoryBreakdown")}
            </h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {Object.entries(categoryStats).map(([type, stats]) => (
                <div
                  key={type}
                  className="rounded-xl border-b-4 border-outline-variant bg-surface-container-lowest p-4 text-center"
                >
                  <p className="text-xs text-on-surface-variant">
                    {tCt(contentTypeMap[type] || type)}
                  </p>
                  <p className={`text-lg font-bold ${stats.correct === stats.total ? "text-primary" : "text-on-surface-variant"}`}>
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
            className="mx-auto mb-10 max-w-md bg-surface-container p-8 rounded-xl border-b-4 border-outline-variant"
          >
            <h3 className="mb-4 text-center font-headline font-bold text-xl text-on-surface-variant">
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
          <h3 className="mb-4 font-headline font-bold text-xl text-on-surface-variant">
            {t("caseBreakdown")}
          </h3>
          <div className="space-y-2">
            {session.cases.map((answer, i) => (
              <motion.div
                key={`${i}-${answer.caseId}`}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + i * 0.05, duration: 0.3 }}
                className={`flex items-center justify-between rounded-xl border-b-4 ${answer.isCorrect ? "border-primary" : "border-error"} bg-surface-container-lowest px-4 py-3 hover:-translate-y-1 transition-transform`}
              >
                <div className="flex items-center gap-3">
                  <span>
                    {answer.isCorrect
                      ? <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                      : <span className="material-symbols-outlined text-error">cancel</span>}
                  </span>
                  <div className="min-w-0">
                    <span className="block truncate text-sm font-bold text-on-surface">
                      {answer.caseTitle || `Item ${i + 1}`}
                    </span>
                    {answer.caseType && (
                      <span className="text-[10px] uppercase tracking-wider text-on-surface-variant">
                        {answer.caseType.replace("-", " ")}
                      </span>
                    )}
                  </div>
                </div>
                <span className="ml-4 shrink-0 font-mono text-sm font-semibold text-on-surface">
                  {answer.score} <span className="text-on-surface-variant">pts</span>
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
            className="flex items-center gap-2 px-6 py-4 bg-tertiary text-on-tertiary font-bold rounded-xl border-b-4 border-tertiary-dim active:translate-y-1 active:shadow-none transition-all"
          >
            <span className="material-symbols-outlined">description</span>
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
            className="flex items-center gap-2 px-8 py-4 bg-primary text-on-primary font-bold font-headline rounded-xl border-b-4 border-primary-dim active:translate-y-1 active:shadow-none transition-all"
          >
            <span className="material-symbols-outlined">replay</span>
            {t("playAgain")}
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 px-6 py-4 bg-surface-container-highest text-on-surface font-bold rounded-xl border-b-4 border-outline-variant active:translate-y-1 active:border-b-0 transition-all"
          >
            <span className="material-symbols-outlined">arrow_back</span>
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
