"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import type { PipelineThreat, DefenseOption, PipelineAnswer, Difficulty } from "@/lib/types";
import { basePath } from "@/lib/basePath";
import { scorePipelineDefense, calculatePipelineSessionResult } from "@/lib/pipeline/scoring";
import { generateId } from "@/lib/storage";
import ThreatCard from "@/components/pipeline/ThreatCard";
import DefenseReveal from "@/components/pipeline/DefenseReveal";
import { GamePlaySkeleton } from "@/components/Skeleton";
import { trackGameStart, trackCaseAnswer, trackGameAbandon } from "@/lib/analytics";
import { playCorrect, playWrong } from "@/lib/sounds";

import { beginnerThreats } from "@/data/pipeline/beginner";
import { intermediateThreats } from "@/data/pipeline/intermediate";
import { advancedThreats } from "@/data/pipeline/advanced";
import { expertThreats } from "@/data/pipeline/expert";

const threatsByDifficulty: Record<string, PipelineThreat[]> = {
  beginner: beginnerThreats,
  intermediate: intermediateThreats,
  advanced: advancedThreats,
  expert: expertThreats,
};

const WAVES_PER_SESSION = 10;
const VALID_DIFFICULTIES = new Set(["beginner", "intermediate", "advanced", "expert"]);

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
  const t = useTranslations("pipeline");

  const rawDiff = searchParams.get("difficulty") ?? "beginner";
  const difficulty = (VALID_DIFFICULTIES.has(rawDiff) ? rawDiff : "beginner") as Difficulty;

  const [threats, setThreats] = useState<PipelineThreat[]>([]);
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<GamePhase>("playing");
  const [answers, setAnswers] = useState<PipelineAnswer[]>([]);
  const [pipelineHealth, setPipelineHealth] = useState(100);
  const [totalScore, setTotalScore] = useState(0);
  const [lastDefense, setLastDefense] = useState<DefenseOption | null>(null);
  const startRef = useRef(Date.now());

  useEffect(() => {
    const source = threatsByDifficulty[difficulty] ?? [];
    if (source.length === 0) return;
    const selected = shuffle(source).slice(0, WAVES_PER_SESSION);
    setThreats(selected);
    trackGameStart("pipeline", difficulty);
  }, [difficulty]);

  useEffect(() => {
    if (phase === "playing" && threats.length > 0 && index < threats.length) {
      startRef.current = Date.now();
    }
  }, [phase, index, threats.length]);

  // Track abandon
  const phaseRef = useRef(phase);
  phaseRef.current = phase;
  const indexRef = useRef(index);
  indexRef.current = index;
  const threatsRef = useRef(threats);
  threatsRef.current = threats;

  useEffect(() => {
    const handler = () => {
      if (phaseRef.current !== "complete" && threatsRef.current.length > 0) {
        const prog = Math.round((indexRef.current / threatsRef.current.length) * 100);
        trackGameAbandon("pipeline", difficulty, prog);
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => {
      window.removeEventListener("beforeunload", handler);
    };
  }, [difficulty]);

  const handleDefend = useCallback((defense: DefenseOption) => {
    if (phase !== "playing" || !threats[index]) return;

    const timeSpent = Math.round((Date.now() - startRef.current) / 1000);
    const answer = scorePipelineDefense(threats[index], defense.id, pipelineHealth, timeSpent);

    setAnswers(prev => [...prev, answer]);
    setTotalScore(prev => prev + answer.score);
    setPipelineHealth(answer.pipelineHealth);
    setLastDefense(defense);

    if (!answer.isCorrect) {
      playWrong();
    } else {
      playCorrect();
    }

    trackCaseAnswer("pipeline", threats[index].id, answer.isCorrect, 0);
    setPhase("reveal");
  }, [phase, threats, index, pipelineHealth]);

  const handleNext = useCallback(() => {
    const nextIndex = index + 1;
    const lastAnswer = answers[answers.length - 1];

    // Game over: pipeline destroyed or out of waves
    if (lastAnswer.pipelineHealth <= 0 || nextIndex >= threats.length) {
      const result = calculatePipelineSessionResult(answers, threats, difficulty);
      const session = { ...result, id: generateId(), date: new Date().toISOString() };
      sessionStorage.setItem("pipeline-result", JSON.stringify(session));
      router.push(`/${locale}/pipeline/results`);
    } else {
      setIndex(nextIndex);
      setPhase("playing");
    }
  }, [index, answers, threats, difficulty, router, locale]);

  const currentThreat = threats[index];
  const totalWaves = threats.length;
  const progress = totalWaves > 0 ? ((index + (phase === "reveal" ? 1 : 0)) / totalWaves) * 100 : 0;
  const lastAnswer = answers.length > 0 ? answers[answers.length - 1] : null;

  if (!currentThreat) {
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
            href={`${basePath}/${locale}/pipeline`}
            className="text-sm text-on-surface-variant transition-colors hover:text-primary"
          >
            &larr; {t("backToHub")}
          </a>
          <div className="flex items-center gap-4">
            {/* Pipeline Health */}
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-sm text-primary" aria-hidden="true">monitor_heart</span>
              <div className="w-20 h-2 bg-outline-variant/30 rounded-full overflow-hidden" role="progressbar" aria-valuenow={pipelineHealth} aria-valuemin={0} aria-valuemax={100} aria-label={t("pipelineHealth")}>
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    pipelineHealth > 60 ? "bg-primary" : pipelineHealth > 30 ? "bg-secondary" : "bg-error"
                  }`}
                  style={{ width: `${pipelineHealth}%` }}
                />
              </div>
              <span className="text-xs font-mono font-bold text-on-surface">{pipelineHealth}%</span>
            </div>
            {/* Score */}
            <span className="font-mono text-sm font-bold text-on-surface">
              {totalScore} pts
            </span>
            {/* Wave counter */}
            <span className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
              {index + 1}/{totalWaves}
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
            <ThreatCard
              key={`threat-${index}`}
              threat={currentThreat}
              onDefend={handleDefend}
            />
          )}

          {phase === "reveal" && lastAnswer && lastDefense && (
            <DefenseReveal
              key={`reveal-${index}`}
              threat={currentThreat}
              defense={lastDefense}
              answer={lastAnswer}
              onNext={handleNext}
              isLast={index >= totalWaves - 1 || lastAnswer.pipelineHealth <= 0}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function PipelinePlayPage() {
  return (
    <Suspense fallback={<GamePlaySkeleton />}>
      <PlayInner />
    </Suspense>
  );
}
