"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import type { HunterClaim, HunterAnswer, Difficulty } from "@/lib/types";
import { scoreHunterAction, calculateHunterSessionResult } from "@/lib/hunter/scoring";
import { generateId } from "@/lib/storage";
import ClaimBubble from "@/components/hunter/ClaimBubble";
import ClaimReveal from "@/components/hunter/ClaimReveal";
import { GamePlaySkeleton } from "@/components/Skeleton";
import { trackGameStart, trackCaseAnswer, trackGameAbandon } from "@/lib/analytics";
import { playCorrect, playWrong } from "@/lib/sounds";
import { basePath } from "@/lib/basePath";

import { beginnerClaims } from "@/data/hunter/beginner";
import { intermediateClaims } from "@/data/hunter/intermediate";
import { advancedClaims } from "@/data/hunter/advanced";
import { expertClaims } from "@/data/hunter/expert";

const claimsByDifficulty: Record<string, HunterClaim[]> = {
  beginner: beginnerClaims,
  intermediate: intermediateClaims,
  advanced: advancedClaims,
  expert: expertClaims,
};

const CLAIMS_PER_SESSION = 10;
const VALID_DIFFICULTIES = new Set(["beginner", "intermediate", "advanced", "expert"]);

// Time per claim decreases with difficulty
const CLAIM_LIFETIME: Record<string, number> = {
  beginner: 20,
  intermediate: 15,
  advanced: 12,
  expert: 9,
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type GamePhase = "playing" | "reveal" | "complete";

function PlayInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("hunter");

  const rawDiff = searchParams.get("difficulty") ?? "beginner";
  const difficulty = (VALID_DIFFICULTIES.has(rawDiff) ? rawDiff : "beginner") as Difficulty;

  const [claims, setClaims] = useState<HunterClaim[]>([]);
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<GamePhase>("playing");
  const [answers, setAnswers] = useState<HunterAnswer[]>([]);
  const [streak, setStreak] = useState(0);
  const [lives, setLives] = useState(3);
  const [totalScore, setTotalScore] = useState(0);
  const claimStartRef = useRef(Date.now());
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Initialize claims
  useEffect(() => {
    const source = claimsByDifficulty[difficulty] ?? [];
    if (source.length === 0) return;
    const selected = shuffle(source).slice(0, CLAIMS_PER_SESSION);
    setClaims(selected);
    trackGameStart("hunter", difficulty);
  }, [difficulty]);

  // Reset timer on new claim
  useEffect(() => {
    if (phase === "playing" && claims.length > 0 && index < claims.length) {
      claimStartRef.current = Date.now();
      // Auto-pass after lifetime expires
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        if (phase === "playing") {
          handleAction("passed");
        }
      }, (CLAIM_LIFETIME[difficulty] ?? 15) * 1000);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [phase, index, claims.length]);

  // Track abandon
  const phaseRef = useRef(phase);
  phaseRef.current = phase;
  const indexRef = useRef(index);
  indexRef.current = index;
  const claimsRef = useRef(claims);
  claimsRef.current = claims;

  useEffect(() => {
    const handler = () => {
      if (phaseRef.current !== "complete" && claimsRef.current.length > 0) {
        const prog = Math.round((indexRef.current / claimsRef.current.length) * 100);
        trackGameAbandon("hunter", difficulty, prog);
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => {
      window.removeEventListener("beforeunload", handler);
    };
  }, [difficulty]);

  const handleAction = useCallback((action: "shot" | "passed") => {
    if (phase !== "playing" || !claims[index]) return;
    if (timerRef.current) clearTimeout(timerRef.current);

    const timeSpent = Math.round((Date.now() - claimStartRef.current) / 1000);
    const answer = scoreHunterAction(claims[index], action, streak, timeSpent);

    setAnswers(prev => [...prev, answer]);
    setStreak(answer.streak);
    setTotalScore(prev => prev + answer.score);

    if (!answer.isCorrect) {
      setLives(prev => prev - 1);
      playWrong();
    } else {
      playCorrect();
    }

    trackCaseAnswer("hunter", claims[index].id, answer.isCorrect, 0);
    setPhase("reveal");
  }, [phase, claims, index, streak]);

  const handleNext = useCallback(() => {
    const nextIndex = index + 1;

    // Game over: out of lives or out of claims
    if (lives <= (answers.length > 0 && !answers[answers.length - 1].isCorrect ? 1 : 0) || nextIndex >= claims.length) {
      const result = calculateHunterSessionResult(answers, claims, difficulty);
      const session = { ...result, id: generateId(), date: new Date().toISOString() };
      sessionStorage.setItem("hunter-result", JSON.stringify(session));
      router.push(`/${locale}/hunter/results`);
    } else {
      setIndex(nextIndex);
      setPhase("playing");
    }
  }, [index, lives, answers, claims, difficulty, router, locale]);

  const currentClaim = claims[index];
  const totalClaims = claims.length;
  const progress = totalClaims > 0 ? ((index + (phase === "reveal" ? 1 : 0)) / totalClaims) * 100 : 0;
  const lastAnswer = answers.length > 0 ? answers[answers.length - 1] : null;

  if (!currentClaim) {
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
          <Link
            href={`/${locale}/hunter`}
            className="text-sm text-on-surface-variant transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded"
            aria-label={t("backToHub")}
          >
            &larr; {t("backToHub")}
          </Link>
          <div className="flex items-center gap-4">
            {/* Lives */}
            <div className="flex items-center gap-1" role="status" aria-label={`${lives} ${t("livesRemaining")}`}>
              {Array.from({ length: 3 }).map((_, i) => (
                <img
                  key={i}
                  src={`${basePath}/images/hunter/icon-heart.png`}
                  alt=""
                  className={`w-5 h-5 object-contain ${i < lives ? "opacity-100" : "opacity-20 grayscale"}`}
                  aria-hidden="true"
                />
              ))}
            </div>
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
            {/* Round counter */}
            <span className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
              {index + 1}/{totalClaims}
            </span>
          </div>
        </div>
        <div className="h-0.5 bg-outline-variant" role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100}>
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
            <ClaimBubble
              key={`claim-${index}`}
              claim={currentClaim}
              index={0}
              onShoot={() => handleAction("shot")}
              onPass={() => handleAction("passed")}
              lifetime={CLAIM_LIFETIME[difficulty] ?? 15}
            />
          )}

          {phase === "reveal" && lastAnswer && (
            <ClaimReveal
              key={`reveal-${index}`}
              claim={currentClaim}
              answer={lastAnswer}
              onNext={handleNext}
              isLast={index >= totalClaims - 1 || lives <= (lastAnswer.isCorrect ? 0 : 1)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function HunterPlayPage() {
  return (
    <Suspense fallback={<GamePlaySkeleton />}>
      <PlayInner />
    </Suspense>
  );
}
