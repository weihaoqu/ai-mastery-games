"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import type { TuringItem, TuringAnswer, Difficulty } from "@/lib/types";
import { scoreTuringAnswer, calculateTuringSessionResult } from "@/lib/turing/scoring";
import { generateId } from "@/lib/storage";
import { trackGameStart, trackCaseAnswer, trackGameAbandon } from "@/lib/analytics";
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

const contentTypeIcon: Record<string, string> = {
  email: "mail",
  essay: "description",
  code: "code",
  "social-media": "share",
  "creative-writing": "edit_note",
  image: "image",
};

const contentTypeKey: Record<string, string> = {
  email: "email",
  essay: "essay",
  code: "code",
  "social-media": "socialMedia",
  "creative-writing": "creativeWriting",
  image: "image",
};

function PlayInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const t = useTranslations("turing");
  const tCt = useTranslations("contentType");
  const locale = useLocale();
  const rawDifficulty = searchParams.get("difficulty") ?? "beginner";
  const difficulty = (VALID_DIFFICULTIES.has(rawDifficulty) ? rawDifficulty : "beginner") as Difficulty;

  const [items, setItems] = useState<TuringItem[]>([]);
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<GamePhase>("playing");
  const [answers, setAnswers] = useState<TuringAnswer[]>([]);
  const [streak, setStreak] = useState(0);
  const itemStartRef = useRef(Date.now());

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
      } catch { /* ignore */ }
    }

    const selected = shuffle(source).slice(0, 10);
    setItems(selected);
    sessionStorage.removeItem("turing-result");
    sessionStorage.removeItem(SAVE_KEY);
    trackGameStart("turing", difficulty);
  }, [difficulty]);

  useEffect(() => {
    if (items.length === 0) return;
    const progress: SavedProgress = {
      itemIds: items.map(i => i.id),
      index, phase, answers, streak, difficulty,
    };
    sessionStorage.setItem(SAVE_KEY, JSON.stringify(progress));
  }, [items, index, phase, answers, streak, difficulty]);

  useEffect(() => {
    if (phase === "playing") itemStartRef.current = Date.now();
  }, [phase, index]);

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (answers.length > 0 && phase !== "complete") e.preventDefault();
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [answers, phase]);

  // Track game abandon on page leave
  const phaseRef = useRef(phase);
  phaseRef.current = phase;
  const indexRef = useRef(index);
  indexRef.current = index;
  const itemsRef = useRef(items);
  itemsRef.current = items;

  useEffect(() => {
    const handler = () => {
      if (phaseRef.current !== "complete" && itemsRef.current.length > 0) {
        const prog = Math.round((indexRef.current / itemsRef.current.length) * 100);
        trackGameAbandon("turing", difficulty, prog);
      }
    };
    const visibilityHandler = () => {
      if (document.visibilityState === "hidden") handler();
    };
    window.addEventListener("beforeunload", handler);
    document.addEventListener("visibilitychange", visibilityHandler);
    return () => {
      window.removeEventListener("beforeunload", handler);
      document.removeEventListener("visibilitychange", visibilityHandler);
    };
  }, [difficulty]);

  const currentItem = items[index] as TuringItem | undefined;
  const totalItems = items.length;
  const progress = totalItems > 0 ? ((index + (phase === "reveal" ? 1 : 0)) / totalItems) * 100 : 0;
  const lastAnswer = answers.length > 0 ? answers[answers.length - 1] : null;

  const multiplier = streak >= 5 ? 3 : streak >= 4 ? 2.5 : streak >= 3 ? 2 : streak >= 2 ? 1.5 : 1;

  const handleSwipe = useCallback((guessedAI: boolean) => {
    if (!currentItem || phase !== "playing") return;
    const timeSpent = Math.round((Date.now() - itemStartRef.current) / 1000);
    const answer = scoreTuringAnswer(currentItem, guessedAI, streak, timeSpent);
    setAnswers(prev => [...prev, answer]);
    setStreak(answer.streak);
    trackCaseAnswer("turing", currentItem.id, answer.isCorrect, 0);
    setPhase("reveal");
  }, [currentItem, phase, streak]);

  const handleNext = useCallback(() => {
    if (index >= totalItems - 1) {
      const result = calculateTuringSessionResult(answers, items, difficulty);
      const session = { ...result, id: generateId(), date: new Date().toISOString() };
      sessionStorage.setItem("turing-result", JSON.stringify(session));
      sessionStorage.removeItem(SAVE_KEY);
      router.push(`/${locale}/turing/results`);
    } else {
      setIndex(i => i + 1);
      setPhase("playing");
    }
  }, [index, totalItems, answers, items, difficulty, router, locale]);

  if (!currentItem) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface">
        <p className="text-on-surface-variant animate-pulse">{t("shuffling")}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* Stitch Header */}
      <header className="w-full flex justify-between items-center px-3 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-green-600 to-green-400 shadow-[0_4px_0_0_rgba(168,204,136,1)] sticky top-0 z-50">
        <Link href="/turing" className="flex items-center gap-2 text-white font-bold transition-all hover:scale-95">
          <span className="material-symbols-outlined">close</span>
          <span className="font-headline tracking-tight">{t("exit")}</span>
        </Link>

        <div className="flex-1 max-w-md mx-2 sm:mx-8">
          <div className="flex justify-between items-end mb-1">
            <span className="text-[10px] sm:text-xs font-label font-bold text-white uppercase tracking-widest">
              {t("itemOf", { current: index + 1, total: totalItems })}
            </span>
            <span className="text-[10px] sm:text-xs font-label font-bold text-white">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="h-2.5 sm:h-3 w-full bg-white/20 rounded-full overflow-hidden p-0.5 border border-white/20">
            <motion.div
              className="h-full bg-yellow-400 rounded-full"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          {currentItem && (
            <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/20 flex items-center gap-2">
              <span className="material-symbols-outlined text-white text-sm">
                {contentTypeIcon[currentItem.contentType] || "description"}
              </span>
              <span className="font-label text-sm font-bold text-white tracking-wider uppercase">
                {tCt(contentTypeKey[currentItem.contentType] || "essay")}
              </span>
            </div>
          )}
        </div>
      </header>

      {/* Main Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden">
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
              <SwipeCard item={currentItem} onSwipe={handleSwipe} />
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
              <RevealCard item={currentItem} answer={lastAnswer} onNext={handleNext} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Stitch Footer */}
      <footer className="w-full bg-surface-container-highest/80 backdrop-blur-md p-4 sm:p-6 flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 bg-surface-container-lowest px-4 py-2.5 rounded-xl border-2 border-outline-variant shadow-[4px_4px_0_0_#98b67d]">
            <span className="material-symbols-outlined text-error text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
            <div className="flex flex-col">
              <span className="text-[10px] font-label font-bold text-on-surface-variant leading-none uppercase">Streak</span>
              <span className="text-xl font-headline font-black text-on-surface leading-none">{streak}</span>
            </div>
          </div>
          {multiplier > 1 && (
            <div className="flex items-center gap-3 bg-primary-container px-4 py-2.5 rounded-xl border-2 border-primary shadow-[4px_4px_0_0_#006a2d]">
              <span className="material-symbols-outlined text-primary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
              <div className="flex flex-col">
                <span className="text-[10px] font-label font-bold text-on-primary-fixed-variant leading-none uppercase">Multiplier</span>
                <span className="text-xl font-headline font-black text-on-primary-container leading-none">x{multiplier}</span>
              </div>
            </div>
          )}
        </div>
      </footer>
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
