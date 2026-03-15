"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import type { TuringItem, TuringAnswer, Difficulty } from "@/lib/types";
import { scoreTuringAnswer, calculateTuringSessionResult } from "@/lib/turing/scoring";
import { generateId } from "@/lib/storage";
import SwipeCard from "@/components/turing/SwipeCard";
import RevealCard from "@/components/turing/RevealCard";
import { beginnerItems } from "@/data/turing/beginner";
import { intermediateItems } from "@/data/turing/intermediate";
import { advancedItems } from "@/data/turing/advanced";
import { expertItems } from "@/data/turing/expert";
import { GamePlaySkeleton } from "@/components/Skeleton";

const itemsByDifficulty: Record<string, TuringItem[]> = {
  beginner: beginnerItems,
  intermediate: intermediateItems,
  advanced: advancedItems,
  expert: expertItems,
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const VALID_DIFFICULTIES = new Set(["beginner", "intermediate", "advanced", "expert"]);
const SAVE_KEY = "turing-progress";

type GamePhase = "playing" | "reveal" | "complete";

interface SavedProgress {
  itemIds: string[];
  index: number;
  phase: GamePhase;
  answers: TuringAnswer[];
  streak: number;
  difficulty: Difficulty;
}

function PlayInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const t = useTranslations("turing");
  const locale = useLocale();
  const rawDifficulty = searchParams.get("difficulty") ?? "beginner";
  const difficulty = (VALID_DIFFICULTIES.has(rawDifficulty) ? rawDifficulty : "beginner") as Difficulty;

  const [items, setItems] = useState<TuringItem[]>([]);
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<GamePhase>("playing");
  const [answers, setAnswers] = useState<TuringAnswer[]>([]);
  const [streak, setStreak] = useState(0);
  const itemStartRef = useRef(Date.now());

  // Initialize items
  useEffect(() => {
    const source = itemsByDifficulty[difficulty];
    if (!source || source.length === 0) return;

    const saved = sessionStorage.getItem(SAVE_KEY);
    if (saved) {
      try {
        const progress: SavedProgress = JSON.parse(saved);
        if (progress.difficulty === difficulty && progress.itemIds.length > 0) {
          const itemMap = new Map(source.map(i => [i.id, i]));
          const restored = progress.itemIds.map(id => itemMap.get(id)).filter(Boolean) as TuringItem[];
          if (restored.length === progress.itemIds.length) {
            setItems(restored);
            setIndex(progress.index);
            setPhase(progress.phase === "reveal" ? "playing" : progress.phase);
            setAnswers(progress.answers);
            setStreak(progress.streak);
            sessionStorage.removeItem("turing-result");
            return;
          }
        }
      } catch { /* ignore corrupt data */ }
    }

    const selected = shuffle(source).slice(0, 10);
    setItems(selected);
    sessionStorage.removeItem("turing-result");
    sessionStorage.removeItem(SAVE_KEY);
  }, [difficulty]);

  // Save progress
  useEffect(() => {
    if (items.length === 0) return;
    const progress: SavedProgress = {
      itemIds: items.map(i => i.id),
      index,
      phase,
      answers,
      streak,
      difficulty,
    };
    sessionStorage.setItem(SAVE_KEY, JSON.stringify(progress));
  }, [items, index, phase, answers, streak, difficulty]);

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

  const currentItem = items[index] as TuringItem | undefined;
  const totalItems = items.length;
  const progress = totalItems > 0 ? ((index + (phase === "reveal" ? 1 : 0)) / totalItems) * 100 : 0;
  const lastAnswer = answers.length > 0 ? answers[answers.length - 1] : null;

  const handleSwipe = useCallback((guessedAI: boolean) => {
    if (!currentItem || phase !== "playing") return;
    const timeSpent = Math.round((Date.now() - itemStartRef.current) / 1000);
    const answer = scoreTuringAnswer(currentItem, guessedAI, streak, timeSpent);
    setAnswers(prev => [...prev, answer]);
    setStreak(answer.streak);
    setPhase("reveal");
  }, [currentItem, phase, streak]);

  const handleNext = useCallback(() => {
    if (index >= totalItems - 1) {
      // Complete
      const result = calculateTuringSessionResult(answers, items, difficulty);
      const session = { ...result, id: generateId(), date: new Date().toISOString() };
      sessionStorage.setItem("turing-result", JSON.stringify(session));
      sessionStorage.removeItem(SAVE_KEY);
      router.push(`/${locale}/turing/results`);
    } else {
      setIndex(i => i + 1);
      setPhase("playing");
    }
  }, [index, totalItems, answers, items, difficulty, router]);

  if (!currentItem) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ed-cream">
        <p className="text-ed-ink-muted animate-pulse">{t("shuffling")}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ed-cream">
      {/* Top bar */}
      <div className="sticky top-0 z-30 border-b border-ed-border bg-ed-cream/90 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <Link href="/turing" className="text-sm text-ed-ink-muted transition-colors hover:text-ed-teal">
            &larr; {t("backToHub")}
          </Link>
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
              {t("itemOf", { current: index + 1, total: totalItems })}
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
              <SwipeCard
                item={currentItem}
                onSwipe={handleSwipe}
              />
            </motion.div>
          )}

          {phase === "reveal" && lastAnswer && (
            <motion.div
              key={`reveal-${index}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full flex flex-col items-center"
            >
              <RevealCard
                item={currentItem}
                answer={lastAnswer}
                onNext={handleNext}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function TuringPlayPage() {
  const t = useTranslations("turing");
  return (
    <Suspense fallback={<GamePlaySkeleton />}>
      <PlayInner />
    </Suspense>
  );
}
