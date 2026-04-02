"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import type { EthicsScenario, EthicsChoice, EthicsAnswer, Difficulty } from "@/lib/types";
import { basePath } from "@/lib/basePath";
import { scoreEthicsChoice, calculateEthicsSessionResult } from "@/lib/ethics/scoring";
import { generateId } from "@/lib/storage";
import ScenarioCard from "@/components/ethics/ScenarioCard";
import ChoiceReveal from "@/components/ethics/ChoiceReveal";
import MeterBar from "@/components/ethics/MeterBar";
import { GamePlaySkeleton } from "@/components/Skeleton";
import { trackGameStart, trackCaseAnswer, trackGameAbandon } from "@/lib/analytics";
import { playCorrect, playWrong } from "@/lib/sounds";

import { beginnerScenarios } from "@/data/ethics/beginner";
import { intermediateScenarios } from "@/data/ethics/intermediate";
import { advancedScenarios } from "@/data/ethics/advanced";
import { expertScenarios } from "@/data/ethics/expert";

const scenariosByDifficulty: Record<string, EthicsScenario[]> = {
  beginner: beginnerScenarios,
  intermediate: intermediateScenarios,
  advanced: advancedScenarios,
  expert: expertScenarios,
};

const SCENARIOS_PER_SESSION = 6;
const VALID_DIFFICULTIES = new Set(["beginner", "intermediate", "advanced", "expert"]);

const METER_COLORS: Record<string, string> = {
  trust: "#006a2d",
  profit: "#9b3f00",
  safety: "#0061a4",
  equity: "#5b4bb4",
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
  const t = useTranslations("ethics");

  const rawDiff = searchParams.get("difficulty") ?? "beginner";
  const difficulty = (VALID_DIFFICULTIES.has(rawDiff) ? rawDiff : "beginner") as Difficulty;

  const [scenarios, setScenarios] = useState<EthicsScenario[]>([]);
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<GamePhase>("playing");
  const [answers, setAnswers] = useState<EthicsAnswer[]>([]);
  const [currentMeters, setCurrentMeters] = useState({ trust: 5, profit: 5, safety: 5, equity: 5 });
  const [lastChoice, setLastChoice] = useState<EthicsChoice | null>(null);
  const scenarioStartRef = useRef(Date.now());

  // Initialize scenarios
  useEffect(() => {
    const source = scenariosByDifficulty[difficulty] ?? [];
    if (source.length === 0) return;
    const selected = shuffle(source).slice(0, SCENARIOS_PER_SESSION);
    setScenarios(selected);
    trackGameStart("ethics", difficulty);
  }, [difficulty]);

  // Reset timer on new scenario
  useEffect(() => {
    if (phase === "playing" && scenarios.length > 0 && index < scenarios.length) {
      scenarioStartRef.current = Date.now();
    }
  }, [phase, index, scenarios.length]);

  // Track abandon
  const phaseRef = useRef(phase);
  phaseRef.current = phase;
  const indexRef = useRef(index);
  indexRef.current = index;
  const scenariosRef = useRef(scenarios);
  scenariosRef.current = scenarios;

  useEffect(() => {
    const handler = () => {
      if (phaseRef.current !== "playing" || scenariosRef.current.length === 0) return;
      const prog = Math.round((indexRef.current / scenariosRef.current.length) * 100);
      trackGameAbandon("ethics", difficulty, prog);
    };
    window.addEventListener("beforeunload", handler);
    return () => {
      window.removeEventListener("beforeunload", handler);
    };
  }, [difficulty]);

  const handleChoose = useCallback((choice: EthicsChoice) => {
    if (phase !== "playing" || !scenarios[index]) return;

    const timeSpent = Math.round((Date.now() - scenarioStartRef.current) / 1000);
    const answer = scoreEthicsChoice(scenarios[index], choice, timeSpent, currentMeters);

    setAnswers(prev => [...prev, answer]);
    setCurrentMeters(answer.meters);
    setLastChoice(choice);

    if (choice.isOptimal) {
      playCorrect();
    } else {
      playWrong();
    }

    trackCaseAnswer("ethics", scenarios[index].id, choice.isOptimal, timeSpent);
    setPhase("reveal");
  }, [phase, scenarios, index, currentMeters]);

  const handleNext = useCallback(() => {
    const nextIndex = index + 1;

    if (nextIndex >= scenarios.length) {
      const result = calculateEthicsSessionResult(answers, scenarios, difficulty);
      const session = { ...result, id: generateId(), date: new Date().toISOString(), _finalMeters: currentMeters };
      sessionStorage.setItem("ethics-result", JSON.stringify(session));
      router.push(`/${locale}/ethics/results`);
    } else {
      setIndex(nextIndex);
      setPhase("playing");
      setLastChoice(null);
    }
  }, [index, answers, scenarios, difficulty, router, locale]);

  const currentScenario = scenarios[index];
  const totalScenarios = scenarios.length;
  const progress = totalScenarios > 0 ? ((index + (phase === "reveal" ? 1 : 0)) / totalScenarios) * 100 : 0;
  const lastAnswer = answers.length > 0 ? answers[answers.length - 1] : null;

  if (!currentScenario) {
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
            href={`${basePath}/${locale}/ethics`}
            className="text-sm text-on-surface-variant transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tertiary rounded"
            aria-label={t("backToHub")}
          >
            &larr; {t("backToHub")}
          </a>
          <div className="flex items-center gap-2 sm:gap-4 min-w-0">
            {/* Score */}
            <span className="font-mono text-sm font-bold text-on-surface whitespace-nowrap">
              {answers.reduce((s, a) => s + a.score, 0)} {t("pts")}
            </span>
            {/* Round counter */}
            <span className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant whitespace-nowrap">
              {t("scenarioOf", { current: index + 1, total: totalScenarios })}
            </span>
          </div>
        </div>
        <div className="h-0.5 bg-outline-variant">
          <motion.div
            className="h-full bg-tertiary"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </div>

      {/* Mini meters bar */}
      <div className="mx-auto max-w-4xl px-4 py-3 border-b border-outline-variant/50">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <MeterBar label={t("trust")} value={currentMeters.trust} max={10} color={METER_COLORS.trust} />
          <MeterBar label={t("profit")} value={currentMeters.profit} max={10} color={METER_COLORS.profit} />
          <MeterBar label={t("safety")} value={currentMeters.safety} max={10} color={METER_COLORS.safety} />
          <MeterBar label={t("equity")} value={currentMeters.equity} max={10} color={METER_COLORS.equity} />
        </div>
      </div>

      <div className="mx-auto flex max-w-4xl flex-col items-center px-4 py-8 sm:px-6">
        <AnimatePresence mode="wait">
          {phase === "playing" && (
            <ScenarioCard
              key={`scenario-${index}`}
              scenario={currentScenario}
              onChoose={handleChoose}
            />
          )}

          {phase === "reveal" && lastAnswer && lastChoice && (
            <ChoiceReveal
              key={`reveal-${index}`}
              scenario={currentScenario}
              choice={lastChoice}
              answer={lastAnswer}
              onNext={handleNext}
              isLast={index >= totalScenarios - 1}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function EthicsPlayPage() {
  return (
    <Suspense fallback={<GamePlaySkeleton />}>
      <PlayInner />
    </Suspense>
  );
}
