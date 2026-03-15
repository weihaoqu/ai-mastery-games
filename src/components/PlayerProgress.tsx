"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { getSessions } from "@/lib/storage";
import type { SessionResult } from "@/lib/types";

const gameIcons: Record<string, string> = {
  detective: "/images/games/detective.png",
  arena: "/images/games/arena.png",
  turing: "/images/games/turing.png",
  escape: "/images/escape/icon-beginner.png",
};

const gameKeys = ["detective", "arena", "turing", "escape"] as const;

export default function PlayerProgress() {
  const t = useTranslations("progress");
  const tGames = useTranslations("games");
  const tMastery = useTranslations("mastery");
  const [sessions, setSessions] = useState<SessionResult[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setSessions(getSessions());
    setLoaded(true);
  }, []);

  if (!loaded || sessions.length === 0) return null;

  // Best score per game
  const bestByGame = new Map<string, SessionResult>();
  for (const s of sessions) {
    const prev = bestByGame.get(s.game);
    if (!prev || s.overallScore > prev.overallScore) {
      bestByGame.set(s.game, s);
    }
  }

  const gamesPlayed = bestByGame.size;
  const totalGames = 4;

  // Overall average
  const avgScore = Math.round(
    [...bestByGame.values()].reduce((sum, s) => sum + s.overallScore, 0) / gamesPlayed
  );

  return (
    <AnimatePresence>
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mb-12 rounded-xl border border-ed-border bg-ed-card p-6"
      >
        {/* Header row */}
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="font-display text-lg text-ed-ink">
              {t("welcomeBack")}
            </h2>
            <p className="text-sm text-ed-ink-muted">
              {t("gamesCompleted", { played: gamesPlayed, total: totalGames })}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-ed-teal">{avgScore}%</p>
            <p className="text-[10px] uppercase tracking-wider text-ed-ink-muted">
              {t("avgScore")}
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-5 h-2 w-full overflow-hidden rounded-full bg-ed-parchment">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(gamesPlayed / totalGames) * 100}%` }}
            transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
            className="h-full rounded-full bg-ed-teal"
          />
        </div>

        {/* Game cards */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {gameKeys.map((key) => {
            const best = bestByGame.get(key);
            return (
              <div
                key={key}
                className={`rounded-lg border p-3 text-center transition-all ${
                  best
                    ? "border-ed-teal/30 bg-ed-teal/5"
                    : "border-ed-border bg-ed-parchment/50 opacity-60"
                }`}
              >
                <Image
                  src={gameIcons[key]}
                  alt=""
                  width={32}
                  height={32}
                  className="mx-auto mb-2 h-8 w-8 rounded object-cover"
                />
                <p className="text-xs font-medium text-ed-ink truncate">
                  {tGames(`${key}.name`)}
                </p>
                {best ? (
                  <>
                    <p className="text-lg font-bold text-ed-teal">
                      {best.overallScore}%
                    </p>
                    <p className="text-[9px] uppercase tracking-wider text-ed-ink-muted">
                      {tMastery(best.masteryLevel)}
                    </p>
                  </>
                ) : (
                  <p className="mt-1 text-[10px] text-ed-ink-muted">
                    {t("notPlayed")}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </motion.section>
    </AnimatePresence>
  );
}
