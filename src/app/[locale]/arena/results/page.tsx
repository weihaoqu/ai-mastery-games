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
import ShareButton from "@/components/ShareButton";

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip);

export default function ArenaResultsPage() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("results");
  const tArena = useTranslations("arena");
  const tMastery = useTranslations("mastery");
  const tDim = useTranslations("dimensions");
  const tTips = useTranslations("skillTips");
  const tGames = useTranslations("games");
  const [session, setSession] = useState<SessionResult | null>(null);
  const [displayScore, setDisplayScore] = useState(0);
  const [saved, setSaved] = useState(false);

  // Load result from sessionStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = sessionStorage.getItem("arena-result");
    if (raw) {
      try {
        setSession(JSON.parse(raw));
        return;
      } catch {
        /* fall through */
      }
    }
    // Fallback: check localStorage for last arena session
    try {
      const stored = localStorage.getItem("ai-mastery-games");
      if (stored) {
        const data = JSON.parse(stored);
        const sessions = (data.sessions || []).filter(
          (s: SessionResult) => s.game === "arena"
        );
        if (sessions.length > 0) {
          setSession(sessions[sessions.length - 1]);
          return;
        }
      }
    } catch {
      /* fall through */
    }
    router.replace(`/${locale}/arena`);
  }, [router, locale]);

  // Save session to localStorage (once)
  useEffect(() => {
    if (session && !saved) {
      saveSession(session);
      setSaved(true);
      playComplete();
    }
  }, [session, saved]);

  // Animate score counter
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

  // Radar chart data
  const radarData = useMemo(() => {
    if (!session) return null;
    const d = session.dimensions;
    return {
      labels: [
        tDim("prompting"),
        tDim("concepts"),
        tDim("tools"),
        tDim("criticalThinking"),
        tDim("ethics"),
      ],
      datasets: [
        {
          label: tArena("yourScore"),
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

  // Calculate best streak
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
          <div className="inline-flex items-center gap-2 bg-primary-container text-on-primary-container px-3 py-1 rounded-full text-xs font-bold font-label uppercase tracking-wider mb-3">
            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
            {tArena("title")}
          </div>
          <h1 className="mb-2 font-headline text-3xl font-bold text-on-surface sm:text-4xl">
            {tArena("title")}
          </h1>
          <p className="text-on-surface-variant">
            {tArena("roundsCorrect", { correct: correctCount, total: session.cases.length })}
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
            <p className="font-headline text-4xl font-bold text-primary sm:text-6xl md:text-7xl">
              {displayScore}
            </p>
            <p className="text-sm uppercase tracking-wider text-on-surface-variant">
              {t("overallScore")}
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="md:col-span-8 bg-surface-container-high p-8 rounded-xl flex flex-col items-center justify-center"
          >
            <div className="mb-1 animate-pulse-glow text-5xl">{masteryEmoji}</div>
            <p className="text-lg font-bold text-on-surface">{masteryLabel}</p>
            <p className="text-xs uppercase tracking-wider text-on-surface-variant">
              {t("masteryLevel")}
            </p>
          </motion.div>
        </motion.div>

        {/* Arena-specific stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mb-10 grid grid-cols-2 gap-4"
        >
          <div className="bg-surface-container-lowest rounded-xl border-b-4 border-outline-variant p-5 text-center">
            <p className="text-2xl font-bold text-primary">
              {correctCount}/{session.cases.length}
            </p>
            <p className="text-xs uppercase tracking-wider text-on-surface-variant">
              {tArena("score")}
            </p>
          </div>
          <div className="bg-surface-container-lowest rounded-xl border-b-4 border-outline-variant p-5 text-center">
            <p className="text-2xl font-bold text-secondary">
              <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span> {bestStreak}
            </p>
            <p className="text-xs uppercase tracking-wider text-on-surface-variant">
              {tArena("streak")}
            </p>
          </div>
        </motion.div>

        {/* Radar Chart */}
        {radarData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mx-auto mb-10 max-w-md border-b-4 border-outline-variant bg-surface-container p-8 rounded-xl"
          >
            <h3 className="mb-4 text-center font-headline font-bold text-xl text-on-surface-variant">
              {t("skillDimensions")}
            </h3>
            <Radar data={radarData} options={radarOptions} />
          </motion.div>
        )}

        {/* Skill tips for weak dimensions */}
        {session && (() => {
          const dims = ["prompting", "concepts", "tools", "criticalThinking", "ethics"] as const;
          const weak = dims.filter((d) => session.dimensions[d] < 60);
          if (weak.length === 0) return null;
          return (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.5 }}
              className="mb-10"
            >
              <h3 className="mb-4 font-headline font-bold text-xl text-on-surface-variant flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>tips_and_updates</span>
                {t("improvementTips")}
              </h3>
              <div className="space-y-2">
                {weak.map((d) => (
                  <div key={d} className="flex items-start gap-3 bg-surface-container-lowest rounded-xl border-b-4 border-secondary/30 px-4 py-3">
                    <span className="material-symbols-outlined text-secondary mt-0.5 shrink-0">lightbulb</span>
                    <div>
                      <p className="text-sm font-bold text-on-surface">{tDim(d)} <span className="font-normal text-on-surface-variant">({session.dimensions[d]}%)</span></p>
                      <p className="text-sm text-on-surface-variant">{tTips(d)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })()}

        {/* Round breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
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
                transition={{ delay: 0.6 + i * 0.05, duration: 0.3 }}
                className={`flex items-center justify-between bg-surface-container-lowest px-4 py-3 hover:-translate-y-1 transition-transform ${
                  answer.isCorrect
                    ? "rounded-xl border-b-4 border-primary"
                    : "rounded-xl border-b-4 border-error"
                }`}
              >
                <div className="flex items-center gap-3">
                  {answer.isCorrect ? (
                    <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-error/10 flex items-center justify-center">
                      <span className="material-symbols-outlined text-error">cancel</span>
                    </div>
                  )}
                  <div className="min-w-0">
                    <span className="block truncate text-sm font-bold text-on-surface">
                      {answer.caseTitle || `Round ${i + 1}`}
                    </span>
                  </div>
                </div>
                <span className={`ml-4 shrink-0 font-mono text-sm font-label font-bold ${
                  answer.isCorrect ? "text-primary" : "text-error"
                }`}>
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
          transition={{ delay: 0.9, duration: 0.4 }}
          className="flex flex-col gap-3 sm:flex-row sm:justify-center"
        >
          <ShareButton
            gameName={tGames("arena.name")}
            score={session.overallScore}
            masteryLevel={tMastery(session.masteryLevel)}
            difficulty={session.difficulty}
          />
          <Link
            href={`/${locale}/arena`}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-primary text-on-primary font-bold font-headline rounded-xl border-b-4 border-primary-dim active:translate-y-1 active:shadow-none transition-all"
          >
            <span className="material-symbols-outlined text-sm">replay</span>
            {t("playAgain")}
          </Link>
          <Link
            href={`/${locale}`}
            className="flex items-center justify-center gap-2 px-6 py-4 bg-surface-container-highest text-on-surface font-bold rounded-xl border-b-4 border-outline-variant active:translate-y-1 active:border-b-0 transition-all"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            {t("backToHub")}
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
