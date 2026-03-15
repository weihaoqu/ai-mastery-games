"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter, useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import type {
  ArenaMode,
  ArenaAnswer,
  CritiqueRound,
  BattleRound,
  OptimizeChallenge,
  Difficulty,
} from "@/lib/types";
import {
  scoreCritiqueRound,
  scoreBattleRound,
  scoreOptimizeChallenge,
  calculateArenaSessionResult,
} from "@/lib/arena/scoring";
import { generateId } from "@/lib/storage";
import CritiqueCard from "@/components/arena/CritiqueCard";
import BattleCard from "@/components/arena/BattleCard";
import OptimizeCard from "@/components/arena/OptimizeCard";
import ArenaRevealCard from "@/components/arena/ArenaRevealCard";

// --- Critique data ---
import { beginnerCritiqueRounds } from "@/data/arena/critique/beginner";
import { intermediateCritiqueRounds } from "@/data/arena/critique/intermediate";
import { advancedCritiqueRounds } from "@/data/arena/critique/advanced";
import { expertCritiqueRounds } from "@/data/arena/critique/expert";

// --- Battle data ---
import { beginnerBattleRounds } from "@/data/arena/battle/beginner";
import { intermediateBattleRounds } from "@/data/arena/battle/intermediate";
import { advancedBattleRounds } from "@/data/arena/battle/advanced";
import { expertBattleRounds } from "@/data/arena/battle/expert";

// --- Optimize data ---
import { beginnerOptimizeChallenges } from "@/data/arena/optimize/beginner";
import { intermediateOptimizeChallenges } from "@/data/arena/optimize/intermediate";
import { advancedOptimizeChallenges } from "@/data/arena/optimize/advanced";
import { expertOptimizeChallenges } from "@/data/arena/optimize/expert";
import { GamePlaySkeleton } from "@/components/Skeleton";

// --- Lookup tables ---

const critiqueByDifficulty: Record<string, CritiqueRound[]> = {
  beginner: beginnerCritiqueRounds,
  intermediate: intermediateCritiqueRounds,
  advanced: advancedCritiqueRounds,
  expert: expertCritiqueRounds,
};

const battleByDifficulty: Record<string, BattleRound[]> = {
  beginner: beginnerBattleRounds,
  intermediate: intermediateBattleRounds,
  advanced: advancedBattleRounds,
  expert: expertBattleRounds,
};

const optimizeByDifficulty: Record<string, OptimizeChallenge[]> = {
  beginner: beginnerOptimizeChallenges,
  intermediate: intermediateOptimizeChallenges,
  advanced: advancedOptimizeChallenges,
  expert: expertOptimizeChallenges,
};

// --- Item counts per mode ---
const ITEMS_PER_MODE: Record<ArenaMode, number> = {
  critique: 8,
  battle: 5,
  optimize: 4,
};

type ArenaItem = CritiqueRound | BattleRound | OptimizeChallenge;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const VALID_MODES = new Set<string>(["critique", "battle", "optimize"]);
const VALID_DIFFICULTIES = new Set<string>(["beginner", "intermediate", "advanced", "expert"]);

type GamePhase = "playing" | "reveal" | "complete";

interface RevealState {
  playerRanking?: string[];
  playerPick?: "A" | "B";
  correctSteps?: boolean[];
}

interface SavedProgress {
  itemIds: string[];
  index: number;
  phase: GamePhase;
  answers: ArenaAnswer[];
  streak: number;
  difficulty: Difficulty;
  mode: ArenaMode;
}

function getItemsForMode(
  mode: ArenaMode,
  difficulty: string
): ArenaItem[] {
  switch (mode) {
    case "critique":
      return critiqueByDifficulty[difficulty] ?? [];
    case "battle":
      return battleByDifficulty[difficulty] ?? [];
    case "optimize":
      return optimizeByDifficulty[difficulty] ?? [];
  }
}

function PlayInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const params = useParams();
  const t = useTranslations("arena");
  const locale = useLocale();

  // Validate mode
  const rawMode = (params.mode as string) ?? "";
  const mode = (VALID_MODES.has(rawMode) ? rawMode : null) as ArenaMode | null;

  // Validate difficulty
  const rawDifficulty = searchParams.get("difficulty") ?? "beginner";
  const difficulty = (VALID_DIFFICULTIES.has(rawDifficulty) ? rawDifficulty : "beginner") as Difficulty;

  const SAVE_KEY = `arena-${rawMode}-progress`;

  const [items, setItems] = useState<ArenaItem[]>([]);
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<GamePhase>("playing");
  const [answers, setAnswers] = useState<ArenaAnswer[]>([]);
  const [streak, setStreak] = useState(0);
  const [revealState, setRevealState] = useState<RevealState>({});
  const itemStartRef = useRef(Date.now());

  // Redirect if invalid mode
  useEffect(() => {
    if (!mode) {
      router.replace(`/${locale}/arena`);
    }
  }, [mode, router, locale]);

  // Initialize items
  useEffect(() => {
    if (!mode) return;
    const source = getItemsForMode(mode, difficulty);
    if (!source || source.length === 0) return;

    const saved = sessionStorage.getItem(SAVE_KEY);
    if (saved) {
      try {
        const progress: SavedProgress = JSON.parse(saved);
        if (
          progress.difficulty === difficulty &&
          progress.mode === mode &&
          progress.itemIds.length > 0
        ) {
          const itemMap = new Map(source.map((i) => [i.id, i]));
          const restored = progress.itemIds
            .map((id) => itemMap.get(id))
            .filter(Boolean) as ArenaItem[];
          if (restored.length === progress.itemIds.length) {
            setItems(restored);
            setIndex(progress.index);
            setPhase(progress.phase === "reveal" ? "playing" : progress.phase);
            setAnswers(progress.answers);
            setStreak(progress.streak);
            sessionStorage.removeItem("arena-result");
            return;
          }
        }
      } catch {
        /* ignore corrupt data */
      }
    }

    const count = ITEMS_PER_MODE[mode];
    const selected = shuffle(source).slice(0, count);
    setItems(selected);
    sessionStorage.removeItem("arena-result");
    sessionStorage.removeItem(SAVE_KEY);
  }, [difficulty, mode, SAVE_KEY]);

  // Save progress
  useEffect(() => {
    if (items.length === 0 || !mode) return;
    const progress: SavedProgress = {
      itemIds: items.map((i) => i.id),
      index,
      phase,
      answers,
      streak,
      difficulty,
      mode,
    };
    sessionStorage.setItem(SAVE_KEY, JSON.stringify(progress));
  }, [items, index, phase, answers, streak, difficulty, mode, SAVE_KEY]);

  // Reset timer on new item
  useEffect(() => {
    if (phase === "playing") {
      itemStartRef.current = Date.now();
    }
  }, [phase, index]);

  // Beforeunload warning
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (answers.length > 0 && phase !== "complete") {
        e.preventDefault();
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [answers, phase]);

  const currentItem = items[index] as ArenaItem | undefined;
  const totalItems = items.length;
  const progress =
    totalItems > 0
      ? ((index + (phase === "reveal" ? 1 : 0)) / totalItems) * 100
      : 0;
  const lastAnswer = answers.length > 0 ? answers[answers.length - 1] : null;

  // --- Mode handlers ---

  const handleCritiqueSubmit = useCallback(
    (playerRanking: string[]) => {
      if (!currentItem || phase !== "playing" || mode !== "critique") return;
      const timeSpent = Math.round((Date.now() - itemStartRef.current) / 1000);
      const answer = scoreCritiqueRound(
        currentItem as CritiqueRound,
        playerRanking,
        streak,
        timeSpent
      );
      setAnswers((prev) => [...prev, answer]);
      setStreak(answer.streak);
      setRevealState({ playerRanking });
      setPhase("reveal");
    },
    [currentItem, phase, streak, mode]
  );

  const handleBattlePick = useCallback(
    (pick: "A" | "B") => {
      if (!currentItem || phase !== "playing" || mode !== "battle") return;
      const timeSpent = Math.round((Date.now() - itemStartRef.current) / 1000);
      const answer = scoreBattleRound(
        currentItem as BattleRound,
        pick,
        streak,
        timeSpent
      );
      setAnswers((prev) => [...prev, answer]);
      setStreak(answer.streak);
      setRevealState({ playerPick: pick });
      setPhase("reveal");
    },
    [currentItem, phase, streak, mode]
  );

  const handleOptimizeComplete = useCallback(
    (correctSteps: boolean[]) => {
      if (!currentItem || phase !== "playing" || mode !== "optimize") return;
      const timeSpent = Math.round((Date.now() - itemStartRef.current) / 1000);
      const answer = scoreOptimizeChallenge(
        currentItem as OptimizeChallenge,
        correctSteps,
        streak,
        timeSpent
      );
      setAnswers((prev) => [...prev, answer]);
      setStreak(answer.streak);
      setRevealState({ correctSteps });
      setPhase("reveal");
    },
    [currentItem, phase, streak, mode]
  );

  const handleNext = useCallback(() => {
    if (!mode) return;
    if (index >= totalItems - 1) {
      // Complete
      const result = calculateArenaSessionResult(answers, items, difficulty, mode);
      const session = { ...result, id: generateId(), date: new Date().toISOString() };
      sessionStorage.setItem("arena-result", JSON.stringify(session));
      sessionStorage.removeItem(SAVE_KEY);
      router.push(`/${locale}/arena/results`);
    } else {
      setIndex((i) => i + 1);
      setRevealState({});
      setPhase("playing");
    }
  }, [index, totalItems, answers, items, difficulty, mode, router, locale, SAVE_KEY]);

  // Build reveal data for ArenaRevealCard
  function getRevealData() {
    if (!currentItem || !mode) return null;
    switch (mode) {
      case "critique":
        return {
          mode: "critique" as const,
          round: currentItem as CritiqueRound,
          playerRanking: revealState.playerRanking ?? [],
        };
      case "battle":
        return {
          mode: "battle" as const,
          round: currentItem as BattleRound,
          playerPick: revealState.playerPick ?? ("A" as const),
        };
      case "optimize":
        return {
          mode: "optimize" as const,
          challenge: currentItem as OptimizeChallenge,
          correctSteps: revealState.correctSteps ?? [],
        };
    }
  }

  if (!mode) return null;

  if (!currentItem) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ed-cream">
        <p className="text-ed-ink-muted animate-pulse">{t("shuffling")}</p>
      </div>
    );
  }

  const revealData = getRevealData();

  return (
    <div className="min-h-screen bg-ed-cream">
      {/* Top bar */}
      <div className="sticky top-0 z-30 border-b border-ed-border bg-ed-cream/90 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <a
            href={`/${locale}/arena`}
            className="text-sm text-ed-ink-muted transition-colors hover:text-ed-teal"
          >
            &larr; {t("backToArena")}
          </a>
          <div className="flex items-center gap-4">
            {streak > 0 && (
              <span className="font-mono text-sm">
                <span className="text-ed-burnt">{"\u{1F525}"}</span>{" "}
                <span className="font-bold text-ed-teal">{streak}</span>
                {streak >= 2 && (
                  <span className="ml-1 text-xs text-ed-success">
                    x{[1, 1.5, 2, 2.5, 3][Math.min(streak - 1, 4)]}
                  </span>
                )}
              </span>
            )}
            <span className="text-xs font-semibold uppercase tracking-widest text-ed-ink-muted">
              {t("roundOf", { current: index + 1, total: totalItems })}
            </span>
          </div>
          <span className="w-14" />
        </div>
        <div className="h-0.5 bg-ed-border">
          <motion.div
            className="h-full bg-ed-teal"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </div>

      <div className="mx-auto flex max-w-4xl flex-col items-center px-4 py-8 sm:px-6">
        <AnimatePresence mode="wait">
          {phase === "playing" && (
            <motion.div
              key={`play-${index}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="w-full flex flex-col items-center"
            >
              {mode === "critique" && (
                <CritiqueCard
                  round={currentItem as CritiqueRound}
                  onSubmit={handleCritiqueSubmit}
                />
              )}
              {mode === "battle" && (
                <BattleCard
                  round={currentItem as BattleRound}
                  onPick={handleBattlePick}
                />
              )}
              {mode === "optimize" && (
                <OptimizeCard
                  challenge={currentItem as OptimizeChallenge}
                  onComplete={handleOptimizeComplete}
                />
              )}
            </motion.div>
          )}

          {phase === "reveal" && lastAnswer && revealData && (
            <motion.div
              key={`reveal-${index}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full flex flex-col items-center"
            >
              <ArenaRevealCard
                answer={lastAnswer}
                revealData={revealData}
                onNext={handleNext}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function ArenaPlayPage() {
  const t = useTranslations("arena");
  return (
    <Suspense fallback={<GamePlaySkeleton />}>
      <PlayInner />
    </Suspense>
  );
}
