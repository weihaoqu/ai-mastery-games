"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import type { TokenPuzzle, TokenAnswer, Difficulty } from "@/lib/types";
import { basePath } from "@/lib/basePath";
import { scoreTokenArrangement, calculateTumbleSessionResult } from "@/lib/tumble/scoring";
import { generateId } from "@/lib/storage";
import TokenBoard from "@/components/tumble/TokenBoard";
import TokenReveal from "@/components/tumble/TokenReveal";
import { GamePlaySkeleton } from "@/components/Skeleton";
import { trackGameStart, trackCaseAnswer, trackGameAbandon } from "@/lib/analytics";
import { playCorrect, playWrong } from "@/lib/sounds";

import { beginnerPuzzles } from "@/data/tumble/beginner";
import { intermediatePuzzles } from "@/data/tumble/intermediate";
import { advancedPuzzles } from "@/data/tumble/advanced";
import { expertPuzzles } from "@/data/tumble/expert";

const puzzlesByDifficulty: Record<string, TokenPuzzle[]> = {
  beginner: beginnerPuzzles,
  intermediate: intermediatePuzzles,
  advanced: advancedPuzzles,
  expert: expertPuzzles,
};

const PUZZLES_PER_SESSION = 10;
const VALID_DIFFICULTIES = new Set(["beginner", "intermediate", "advanced", "expert"]);

// Time per puzzle by difficulty
const PUZZLE_TIME: Record<string, number> = {
  beginner: 30,
  intermediate: 25,
  advanced: 20,
  expert: 15,
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type GamePhase = "playing" | "reveal";

function PlayInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("tumble");

  const rawDiff = searchParams.get("difficulty") ?? "beginner";
  const difficulty = (VALID_DIFFICULTIES.has(rawDiff) ? rawDiff : "beginner") as Difficulty;
  const maxTime = PUZZLE_TIME[difficulty] ?? 25;

  const [puzzles, setPuzzles] = useState<TokenPuzzle[]>([]);
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<GamePhase>("playing");
  const [answers, setAnswers] = useState<TokenAnswer[]>([]);
  const [streak, setStreak] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(maxTime);
  const startRef = useRef(Date.now());
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const source = puzzlesByDifficulty[difficulty] ?? [];
    if (source.length === 0) return;
    const selected = shuffle(source).slice(0, PUZZLES_PER_SESSION);
    setPuzzles(selected);
    trackGameStart("tumble", difficulty);
  }, [difficulty]);

  // Timer countdown
  useEffect(() => {
    if (phase === "playing" && puzzles.length > 0 && index < puzzles.length) {
      startRef.current = Date.now();
      setTimeLeft(maxTime);
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startRef.current) / 1000);
        const remaining = Math.max(0, maxTime - elapsed);
        setTimeLeft(remaining);
        if (remaining <= 0) {
          // Auto-submit current order when time runs out
          clearInterval(timerRef.current!);
        }
      }, 200);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase, index, puzzles.length, maxTime]);

  // Track abandon
  const phaseRef = useRef(phase);
  phaseRef.current = phase;
  const indexRef = useRef(index);
  indexRef.current = index;
  const puzzlesRef = useRef(puzzles);
  puzzlesRef.current = puzzles;

  useEffect(() => {
    const handler = () => {
      if (phaseRef.current !== "playing" || puzzlesRef.current.length === 0) return;
      const prog = Math.round((indexRef.current / puzzlesRef.current.length) * 100);
      trackGameAbandon("tumble", difficulty, prog);
    };
    window.addEventListener("beforeunload", handler);
    return () => {
      window.removeEventListener("beforeunload", handler);
    };
  }, [difficulty]);

  const handleSubmit = useCallback((playerOrder: number[]) => {
    if (phase !== "playing" || !puzzles[index]) return;
    if (timerRef.current) clearInterval(timerRef.current);

    const timeSpent = Math.round((Date.now() - startRef.current) / 1000);
    const answer = scoreTokenArrangement(puzzles[index], playerOrder, streak, timeSpent);

    setAnswers(prev => [...prev, answer]);
    setStreak(answer.streak);
    setTotalScore(prev => prev + answer.score);

    if (answer.isCorrect) {
      playCorrect();
    } else {
      playWrong();
    }

    trackCaseAnswer("tumble", puzzles[index].id, answer.isCorrect, 0);
    setPhase("reveal");
  }, [phase, puzzles, index, streak]);

  const handleNext = useCallback(() => {
    const nextIndex = index + 1;

    if (nextIndex >= puzzles.length) {
      const result = calculateTumbleSessionResult(answers, puzzles, difficulty);
      const session = { ...result, id: generateId(), date: new Date().toISOString() };
      sessionStorage.setItem("tumble-result", JSON.stringify(session));
      router.push(`/${locale}/tumble/results`);
    } else {
      setIndex(nextIndex);
      setPhase("playing");
    }
  }, [index, answers, puzzles, difficulty, router, locale]);

  const currentPuzzle = puzzles[index];
  const totalPuzzles = puzzles.length;
  const progress = totalPuzzles > 0 ? ((index + (phase === "reveal" ? 1 : 0)) / totalPuzzles) * 100 : 0;
  const lastAnswer = answers.length > 0 ? answers[answers.length - 1] : null;

  if (!currentPuzzle) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface">
        <p className="text-on-surface-variant animate-pulse">{t("loading")}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      {/* Top bar */}
      <div className="sticky top-0 z-30 border-b border-outline-variant bg-surface/90 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <a
            href={`${basePath}/${locale}/tumble`}
            className="text-sm text-on-surface-variant transition-colors hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:rounded-md"
            aria-label={t("backToHub")}
          >
            &larr; {t("backToHub")}
          </a>
          <div className="flex items-center gap-4">
            {/* Streak */}
            {streak > 0 && (
              <span className="font-mono text-sm">
                <span className="text-secondary">{"\u{1F525}"}</span>{" "}
                <span className="font-bold text-primary">{streak}</span>
              </span>
            )}
            {/* Score */}
            <span className="font-mono text-sm font-bold text-on-surface">
              {totalScore} {t("pts")}
            </span>
            {/* Puzzle counter */}
            <span className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
              {index + 1}/{totalPuzzles}
            </span>
          </div>
        </div>
        <div className="h-0.5 bg-outline-variant">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </div>

      <div className="mx-auto flex max-w-4xl flex-col items-center px-4 py-8 sm:px-6">
        <AnimatePresence mode="wait">
          {phase === "playing" && (
            <TokenBoard
              key={`puzzle-${index}`}
              puzzle={currentPuzzle}
              onSubmit={handleSubmit}
              timeLeft={timeLeft}
              maxTime={maxTime}
            />
          )}

          {phase === "reveal" && lastAnswer && (
            <TokenReveal
              key={`reveal-${index}`}
              puzzle={currentPuzzle}
              answer={lastAnswer}
              onNext={handleNext}
              isLast={index >= totalPuzzles - 1}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function TumblePlayPage() {
  return (
    <Suspense fallback={<GamePlaySkeleton />}>
      <PlayInner />
    </Suspense>
  );
}
