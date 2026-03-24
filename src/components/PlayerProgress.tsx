"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { getSessions } from "@/lib/storage";
import type { SessionResult } from "@/lib/types";

const gameIcons: Record<string, string> = {
  detective: "search",
  arena: "swords",
  turing: "smart_toy",
  escape: "lock",
};

const gameKeys = ["detective", "arena", "turing", "escape"] as const;

export default function PlayerProgress() {
  const t = useTranslations("progress");
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
  const avgScore = Math.round(
    [...bestByGame.values()].reduce((sum, s) => sum + s.overallScore, 0) / gamesPlayed
  );
  const progressPct = Math.round((gamesPlayed / totalGames) * 100);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-surface-container p-8 rounded-xl outline outline-3 outline-outline-variant relative overflow-hidden"
      >
        <div className="relative z-10">
          <h2 className="text-2xl font-headline font-bold text-on-surface mb-1">
            {t("welcomeBack")}
          </h2>
          <p className="text-on-surface-variant font-label text-sm mb-6">
            {t("gamesCompleted", { played: gamesPlayed, total: totalGames })} · Avg {avgScore}% Mastery
          </p>

          {/* Game completion circles */}
          <div className="flex gap-3 mb-8">
            {gameKeys.map((key) => {
              const best = bestByGame.get(key);
              return best ? (
                <div
                  key={key}
                  className="w-12 h-12 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-md"
                >
                  <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                </div>
              ) : (
                <div
                  key={key}
                  className="w-12 h-12 rounded-full bg-white/50 text-on-surface/30 flex items-center justify-center outline outline-2 outline-outline-variant"
                >
                  <span className="material-symbols-outlined text-xl">remove</span>
                </div>
              );
            })}
          </div>

          {/* Season progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold font-label">
              <span>SEASON PROGRESS</span>
              <span>{progressPct}%</span>
            </div>
            <div className="w-full h-3 bg-white/40 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
                className="h-full bg-primary rounded-full"
              />
            </div>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute -right-4 -bottom-4 opacity-10">
          <span className="material-symbols-outlined text-[120px]" style={{ fontVariationSettings: "'FILL' 1" }}>cognition</span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
