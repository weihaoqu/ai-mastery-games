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
import type { SessionResult, EscapeResult } from "@/lib/types";
import { getMasteryEmoji } from "@/lib/detective/scoring";
import { saveSession } from "@/lib/storage";
import { playComplete } from "@/lib/sounds";
import { ResultsSkeleton } from "@/components/Skeleton";
import ShareButton from "@/components/ShareButton";

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip);

interface StoredResult {
  escapeResult: EscapeResult;
  session: SessionResult;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function EscapeResultsPage() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("escape");
  const tResults = useTranslations("results");
  const tMastery = useTranslations("mastery");
  const tDim = useTranslations("dimensions");
  const tGames = useTranslations("games");

  const [session, setSession] = useState<SessionResult | null>(null);
  const [escapeResult, setEscapeResult] = useState<EscapeResult | null>(null);
  const [displayScore, setDisplayScore] = useState(0);
  const [saved, setSaved] = useState(false);

  // Load result from sessionStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = sessionStorage.getItem("escape-result");
    if (raw) {
      try {
        const data: StoredResult = JSON.parse(raw);
        setSession(data.session);
        setEscapeResult(data.escapeResult);
        return;
      } catch {
        /* fall through */
      }
    }
    // Fallback: check localStorage for last escape session
    try {
      const stored = localStorage.getItem("ai-mastery-games");
      if (stored) {
        const storageData = JSON.parse(stored);
        const sessions = (storageData.sessions || []).filter(
          (s: SessionResult) => s.game === "escape"
        );
        if (sessions.length > 0) {
          setSession(sessions[sessions.length - 1]);
          return;
        }
      }
    } catch {
      /* fall through */
    }
    router.replace(`/${locale}/escape-room`);
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
  const didEscape = escapeResult?.escaped ?? false;
  const puzzlesSolved = escapeResult?.puzzlesSolved ?? session.cases.filter((c) => c.isCorrect).length;
  const totalPuzzles = escapeResult?.totalPuzzles ?? session.cases.length;
  const timeRemaining = escapeResult?.timeRemaining ?? 0;
  const hintsUsedCount = escapeResult?.hintsUsed ?? 0;

  return (
    <div className="min-h-screen bg-ed-cream">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        {/* Escaped / Trapped banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          {didEscape ? (
            <div className="rounded-xl border-2 border-ed-teal bg-ed-teal/5 p-6 text-center">
              <div className="mb-2 text-5xl">{"\u2705"}</div>
              <h1 className="font-display text-3xl font-bold text-ed-teal sm:text-4xl">
                {t("escaped")}
              </h1>
              <p className="mt-2 text-ed-ink-muted">{t("escapedDesc")}</p>
            </div>
          ) : (
            <div className="rounded-xl border-2 border-ed-error bg-ed-error/5 p-6 text-center">
              <div className="mb-2 text-5xl">{"\u23F0"}</div>
              <h1 className="font-display text-3xl font-bold text-ed-error sm:text-4xl">
                {t("trapped")}
              </h1>
              <p className="mt-2 text-ed-ink-muted">{t("trappedDesc")}</p>
            </div>
          )}
        </motion.div>

        {/* Score + Mastery */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-12"
        >
          <div className="text-center">
            <p className="font-display text-6xl font-bold text-ed-teal sm:text-7xl">
              {displayScore}
            </p>
            <p className="text-sm uppercase tracking-wider text-ed-ink-muted">
              {tResults("overallScore")}
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex flex-col items-center"
          >
            <div className="mb-1 animate-pulse-glow text-5xl">
              {masteryEmoji}
            </div>
            <p className="text-lg font-bold text-ed-ink">{masteryLabel}</p>
            <p className="text-xs uppercase tracking-wider text-ed-ink-muted">
              {tResults("masteryLevel")}
            </p>
          </motion.div>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mb-10 flex justify-center gap-8"
        >
          <div className="text-center">
            <p className="text-2xl font-bold text-ed-success">
              {puzzlesSolved}/{totalPuzzles}
            </p>
            <p className="text-xs uppercase tracking-wider text-ed-ink-muted">
              {t("puzzles")}
            </p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-ed-teal">
              {timeRemaining > 0 ? formatTime(timeRemaining) : "0:00"}
            </p>
            <p className="text-xs uppercase tracking-wider text-ed-ink-muted">
              {t("timeRemaining")}
            </p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-amber-600">
              {"\uD83D\uDCA1"} {hintsUsedCount}
            </p>
            <p className="text-xs uppercase tracking-wider text-ed-ink-muted">
              {t("hintsUsed")}
            </p>
          </div>
        </motion.div>

        {/* Radar Chart */}
        {radarData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mx-auto mb-10 max-w-md rounded-xl border border-ed-border bg-ed-card p-6"
          >
            <h3 className="mb-4 text-center text-sm font-semibold uppercase tracking-wider text-ed-ink-muted">
              {tResults("skillDimensions")}
            </h3>
            <Radar data={radarData} options={radarOptions} />
          </motion.div>
        )}

        {/* Puzzle breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mb-10"
        >
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-ed-ink-muted">
            {tResults("caseBreakdown")}
          </h3>
          <div className="space-y-2">
            {session.cases.map((answer, i) => {
              // Check if hint was used for this puzzle
              const escapeAnswer = escapeResult?.answers.find(
                (a) => a.puzzleId === answer.caseId
              );
              const hintWasUsed = escapeAnswer?.usedHint ?? false;

              return (
                <motion.div
                  key={`${i}-${answer.caseId}`}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + i * 0.05, duration: 0.3 }}
                  className="flex items-center justify-between rounded-lg border border-ed-border bg-ed-card px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-lg ${
                        answer.isCorrect ? "text-ed-success" : "text-ed-error"
                      }`}
                    >
                      {answer.isCorrect ? "\u2705" : "\u274C"}
                    </span>
                    <div className="min-w-0">
                      <span className="block truncate text-sm text-ed-ink">
                        {answer.caseTitle || `Puzzle ${i + 1}`}
                      </span>
                    </div>
                    {hintWasUsed && (
                      <span
                        className="text-xs text-amber-600"
                        title="Hint used"
                      >
                        {"\uD83D\uDCA1"}
                      </span>
                    )}
                  </div>
                  <span className="ml-4 shrink-0 font-mono text-sm font-semibold text-ed-ink">
                    {answer.score}{" "}
                    <span className="text-ed-ink-muted">pts</span>
                  </span>
                </motion.div>
              );
            })}
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
            gameName={tGames("escape.name")}
            score={session.overallScore}
            masteryLevel={tMastery(session.masteryLevel)}
            difficulty={session.difficulty}
          />
          <Link
            href={`/${locale}/escape-room`}
            className="rounded-lg bg-ed-teal/10 px-6 py-3 text-center font-semibold text-ed-teal border border-ed-teal/30 transition-colors hover:bg-ed-teal/20"
          >
            {tResults("playAgain")}
          </Link>
          <Link
            href={`/${locale}`}
            className="rounded-lg border border-ed-border bg-ed-card px-6 py-3 text-center font-semibold text-ed-ink-muted transition-colors hover:bg-ed-warm"
          >
            {tResults("backToHub")}
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
