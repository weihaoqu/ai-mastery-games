"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
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
import { getSessions } from "@/lib/storage";
import { ProfileSkeleton } from "@/components/Skeleton";
import type { SessionResult } from "@/lib/types";

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip);

const gameKeys = ["detective", "arena", "turing", "escape"] as const;

const gameIcons: Record<string, string> = {
  detective: "/images/games/detective.png",
  arena: "/images/games/arena.png",
  turing: "/images/games/turing.png",
  escape: "/images/escape/icon-beginner.png",
};

const gameColors: Record<string, string> = {
  detective: "text-ed-teal",
  arena: "text-ed-burnt",
  turing: "text-ed-success",
  escape: "text-[#6c5ce7]",
};

export default function ProfilePage() {
  const t = useTranslations("profile");
  const tGames = useTranslations("games");
  const tMastery = useTranslations("mastery");
  const tDim = useTranslations("dimensions");
  const [sessions, setSessions] = useState<SessionResult[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setSessions(getSessions());
    setLoaded(true);
  }, []);

  // Best score per game
  const bestByGame = useMemo(() => {
    const map = new Map<string, SessionResult>();
    for (const s of sessions) {
      const prev = map.get(s.game);
      if (!prev || s.overallScore > prev.overallScore) {
        map.set(s.game, s);
      }
    }
    return map;
  }, [sessions]);

  // Average dimensions across all sessions
  const avgDimensions = useMemo(() => {
    if (sessions.length === 0)
      return { prompting: 0, concepts: 0, tools: 0, criticalThinking: 0, ethics: 0 };
    const sum = { prompting: 0, concepts: 0, tools: 0, criticalThinking: 0, ethics: 0 };
    for (const s of sessions) {
      sum.prompting += s.dimensions.prompting;
      sum.concepts += s.dimensions.concepts;
      sum.tools += s.dimensions.tools;
      sum.criticalThinking += s.dimensions.criticalThinking;
      sum.ethics += s.dimensions.ethics;
    }
    const n = sessions.length;
    return {
      prompting: Math.round(sum.prompting / n),
      concepts: Math.round(sum.concepts / n),
      tools: Math.round(sum.tools / n),
      criticalThinking: Math.round(sum.criticalThinking / n),
      ethics: Math.round(sum.ethics / n),
    };
  }, [sessions]);

  const radarData = useMemo(() => {
    const d = avgDimensions;
    return {
      labels: [tDim("prompting"), tDim("concepts"), tDim("tools"), tDim("criticalThinking"), tDim("ethics")],
      datasets: [
        {
          label: t("avgSkills"),
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
  }, [avgDimensions, tDim, t]);

  const radarOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: true,
      scales: {
        r: {
          beginAtZero: true,
          max: 100,
          ticks: { stepSize: 20, display: false },
          grid: { color: "rgba(224, 219, 211, 0.6)" },
          angleLines: { color: "rgba(224, 219, 211, 0.6)" },
          pointLabels: { color: "#6b6b80", font: { size: 12 } },
        },
      },
      plugins: { legend: { display: false } },
    }),
    []
  );

  // Sorted sessions (newest first)
  const sortedSessions = useMemo(
    () => [...sessions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [sessions]
  );

  if (!loaded) {
    return <ProfileSkeleton />;
  }

  const totalSessions = sessions.length;
  const gamesPlayed = bestByGame.size;
  const avgScore =
    totalSessions > 0
      ? Math.round(sessions.reduce((sum, s) => sum + s.overallScore, 0) / totalSessions)
      : 0;

  return (
    <div className="min-h-screen bg-ed-cream">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Back link */}
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-ed-ink-muted transition-colors hover:text-ed-teal"
        >
          <span>&larr;</span> {t("backToHub")}
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center"
        >
          <h1 className="mb-2 font-display text-4xl font-bold tracking-tight text-ed-ink sm:text-5xl">
            {t("title")}
          </h1>
          <p className="text-lg text-ed-ink-muted">{t("subtitle")}</p>
        </motion.div>

        {sessions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-xl border border-ed-border bg-ed-card p-12 text-center"
          >
            <p className="mb-4 text-lg text-ed-ink-muted">{t("noSessions")}</p>
            <Link
              href="/"
              className="inline-block rounded-lg bg-ed-teal/10 px-6 py-3 font-semibold text-ed-teal transition-colors hover:bg-ed-teal/20"
            >
              {t("startPlaying")}
            </Link>
          </motion.div>
        ) : (
          <>
            {/* Stats overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="mb-8 grid grid-cols-3 gap-4"
            >
              <div className="rounded-xl border border-ed-border bg-ed-card p-5 text-center">
                <p className="text-3xl font-bold text-ed-teal">{totalSessions}</p>
                <p className="text-xs uppercase tracking-wider text-ed-ink-muted">
                  {t("totalSessions")}
                </p>
              </div>
              <div className="rounded-xl border border-ed-border bg-ed-card p-5 text-center">
                <p className="text-3xl font-bold text-ed-teal">{gamesPlayed}/4</p>
                <p className="text-xs uppercase tracking-wider text-ed-ink-muted">
                  {t("gamesPlayed")}
                </p>
              </div>
              <div className="rounded-xl border border-ed-border bg-ed-card p-5 text-center">
                <p className="text-3xl font-bold text-ed-teal">{avgScore}%</p>
                <p className="text-xs uppercase tracking-wider text-ed-ink-muted">
                  {t("avgScore")}
                </p>
              </div>
            </motion.div>

            {/* Best per game */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mb-8"
            >
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-ed-ink-muted">
                {t("bestScores")}
              </h3>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {gameKeys.map((key) => {
                  const best = bestByGame.get(key);
                  return (
                    <div
                      key={key}
                      className={`rounded-xl border p-4 text-center ${
                        best
                          ? "border-ed-teal/30 bg-ed-card"
                          : "border-ed-border bg-ed-parchment/50 opacity-60"
                      }`}
                    >
                      <Image
                        src={gameIcons[key]}
                        alt=""
                        width={40}
                        height={40}
                        className="mx-auto mb-2 h-10 w-10 rounded-lg object-cover"
                      />
                      <p className="text-xs font-medium text-ed-ink">
                        {tGames(`${key}.name`)}
                      </p>
                      {best ? (
                        <>
                          <p className={`text-2xl font-bold ${gameColors[key]}`}>
                            {best.overallScore}%
                          </p>
                          <p className="text-[10px] uppercase tracking-wider text-ed-ink-muted">
                            {tMastery(best.masteryLevel)} · {best.difficulty}
                          </p>
                        </>
                      ) : (
                        <p className="mt-2 text-xs text-ed-ink-muted">—</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Radar chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mx-auto mb-8 max-w-md rounded-xl border border-ed-border bg-ed-card p-6"
            >
              <h3 className="mb-4 text-center text-sm font-semibold uppercase tracking-wider text-ed-ink-muted">
                {t("avgSkills")}
              </h3>
              <Radar data={radarData} options={radarOptions} />
            </motion.div>

            {/* Session history */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-ed-ink-muted">
                {t("history")}
              </h3>
              <div className="space-y-2">
                {sortedSessions.map((s, i) => (
                  <motion.div
                    key={s.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.03, duration: 0.3 }}
                    className="flex items-center gap-4 rounded-lg border border-ed-border bg-ed-card px-4 py-3"
                  >
                    <Image
                      src={gameIcons[s.game]}
                      alt=""
                      width={28}
                      height={28}
                      className="h-7 w-7 shrink-0 rounded object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-ed-ink">
                        {tGames(`${s.game}.name`)}
                      </p>
                      <p className="text-[10px] text-ed-ink-muted">
                        {s.difficulty} · {new Date(s.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className={`text-lg font-bold ${gameColors[s.game]}`}>
                        {s.overallScore}%
                      </p>
                      <p className="text-[9px] uppercase tracking-wider text-ed-ink-muted">
                        {tMastery(s.masteryLevel)}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
