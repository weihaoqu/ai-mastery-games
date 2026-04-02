"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import type { TycoonScenario, TycoonDecision, TycoonAnswer, Difficulty } from "@/lib/types";
import { scoreTycoonDecision, calculateTycoonSessionResult } from "@/lib/tycoon/scoring";
import { generateId } from "@/lib/storage";
import { GamePlaySkeleton } from "@/components/Skeleton";
import { trackGameStart, trackCaseAnswer, trackGameAbandon } from "@/lib/analytics";
import { playCorrect, playWrong, playComplete } from "@/lib/sounds";
import { basePath } from "@/lib/basePath";

import { beginnerScenarios } from "@/data/tycoon/beginner";
import { intermediateScenarios } from "@/data/tycoon/intermediate";
import { advancedScenarios } from "@/data/tycoon/advanced";
import { expertScenarios } from "@/data/tycoon/expert";

const scenariosByDifficulty: Record<string, TycoonScenario[]> = {
  beginner: beginnerScenarios,
  intermediate: intermediateScenarios,
  advanced: advancedScenarios,
  expert: expertScenarios,
};

const VALID_DIFFICULTIES = new Set(["beginner", "intermediate", "advanced", "expert"]);

type GamePhase = "scenario" | "reveal" | "complete";

const METER_COLORS: Record<string, string> = {
  revenue: "bg-primary",
  reputation: "bg-tertiary",
  trust: "bg-secondary",
  regulatory: "bg-[#5b4bb4]",
};

const METER_ICONS: Record<string, string> = {
  revenue: "payments",
  reputation: "star",
  trust: "handshake",
  regulatory: "gavel",
};

const METER_ICON_IMAGES: Record<string, string> = {
  revenue: "/images/tycoon/icon-revenue.png",
  reputation: "/images/tycoon/icon-reputation.png",
  trust: "/images/tycoon/icon-trust.png",
  regulatory: "/images/tycoon/icon-regulatory.png",
};

function MeterBar({ label, value, color, icon, iconImage }: { label: string; value: number; color: string; icon: string; iconImage?: string }) {
  return (
    <div className="flex items-center gap-2 flex-1 min-w-0">
      {iconImage ? (
        <img src={`${basePath}${iconImage}`} alt="" className="w-5 h-5 object-contain" aria-hidden="true" />
      ) : (
        <span className="material-symbols-outlined text-sm text-on-surface-variant" style={{ fontVariationSettings: "'FILL' 1" }} aria-hidden="true">{icon}</span>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between mb-0.5">
          <span className="text-[10px] font-label font-bold uppercase tracking-wider text-on-surface-variant truncate">{label}</span>
          <span className="text-[10px] font-mono font-bold text-on-surface">{value}</span>
        </div>
        <div className="h-2 bg-surface-container rounded-full overflow-hidden">
          <motion.div
            className={`h-full ${color} rounded-full`}
            initial={{ width: "50%" }}
            animate={{ width: `${value}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        </div>
      </div>
    </div>
  );
}

function PlayInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("tycoon");

  const rawDiff = searchParams.get("difficulty") ?? "beginner";
  const difficulty = (VALID_DIFFICULTIES.has(rawDiff) ? rawDiff : "beginner") as Difficulty;

  const [scenarios, setScenarios] = useState<TycoonScenario[]>([]);
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<GamePhase>("scenario");
  const [answers, setAnswers] = useState<TycoonAnswer[]>([]);
  const [meters, setMeters] = useState({ revenue: 50, reputation: 50, trust: 50, regulatory: 50 });
  const [selectedDecision, setSelectedDecision] = useState<TycoonDecision | null>(null);
  const [lastAnswer, setLastAnswer] = useState<TycoonAnswer | null>(null);
  const [totalScore, setTotalScore] = useState(0);
  const scenarioStartRef = useRef(Date.now());

  // Initialize scenarios
  useEffect(() => {
    const source = scenariosByDifficulty[difficulty] ?? [];
    if (source.length === 0) return;
    // Sort by quarter to maintain order
    const sorted = [...source].sort((a, b) => a.quarter - b.quarter);
    setScenarios(sorted);
    trackGameStart("tycoon", difficulty);
  }, [difficulty]);

  // Reset timer on new scenario
  useEffect(() => {
    if (phase === "scenario") {
      scenarioStartRef.current = Date.now();
    }
  }, [phase, index]);

  // Track abandon
  const phaseRef = useRef(phase);
  phaseRef.current = phase;
  const indexRef = useRef(index);
  indexRef.current = index;
  const scenariosRef = useRef(scenarios);
  scenariosRef.current = scenarios;

  useEffect(() => {
    const handler = () => {
      if (phaseRef.current !== "complete" && scenariosRef.current.length > 0) {
        const prog = Math.round((indexRef.current / scenariosRef.current.length) * 100);
        trackGameAbandon("tycoon", difficulty, prog);
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => {
      window.removeEventListener("beforeunload", handler);
    };
  }, [difficulty]);

  const handleDecision = useCallback((decision: TycoonDecision) => {
    if (phase !== "scenario" || !scenarios[index]) return;

    const timeSpent = Math.round((Date.now() - scenarioStartRef.current) / 1000);
    const answer = scoreTycoonDecision(scenarios[index], decision, meters, timeSpent);

    setAnswers(prev => [...prev, answer]);
    setMeters(answer.meters);
    setSelectedDecision(decision);
    setLastAnswer(answer);
    setTotalScore(prev => prev + answer.score);

    if (decision.isOptimal) {
      playCorrect();
    } else {
      playWrong();
    }

    trackCaseAnswer("tycoon", scenarios[index].id, decision.isOptimal, 0);
    setPhase("reveal");
  }, [phase, scenarios, index, meters]);

  const handleNext = useCallback(() => {
    const nextIndex = index + 1;

    if (nextIndex >= scenarios.length) {
      const result = calculateTycoonSessionResult(answers, scenarios, difficulty);
      const session = { ...result, id: generateId(), date: new Date().toISOString() };
      sessionStorage.setItem("tycoon-result", JSON.stringify(session));
      playComplete();
      router.push(`/${locale}/tycoon/results`);
    } else {
      setIndex(nextIndex);
      setPhase("scenario");
      setSelectedDecision(null);
      setLastAnswer(null);
    }
  }, [index, answers, scenarios, difficulty, router, locale]);

  const currentScenario = scenarios[index];
  const totalScenarios = scenarios.length;
  const progress = totalScenarios > 0 ? ((index + (phase === "reveal" ? 1 : 0)) / totalScenarios) * 100 : 0;

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
        <div className="mx-auto max-w-4xl px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <Link
              href={`/${locale}/tycoon`}
              className="text-sm text-on-surface-variant transition-colors hover:text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 rounded"
              aria-label={t("backToHub")}
            >
              &larr; {t("backToHub")}
            </Link>
            <div className="flex items-center gap-4">
              <span className="font-mono text-sm font-bold text-on-surface">
                {totalScore} {t("pts")}
              </span>
              <span className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
                Q{index + 1}/{totalScenarios}
              </span>
            </div>
          </div>
          {/* Meters */}
          <div className="grid grid-cols-2 sm:flex gap-3">
            <MeterBar label={t("meterRevenue")} value={meters.revenue} color={METER_COLORS.revenue} icon={METER_ICONS.revenue} iconImage={METER_ICON_IMAGES.revenue} />
            <MeterBar label={t("meterReputation")} value={meters.reputation} color={METER_COLORS.reputation} icon={METER_ICONS.reputation} iconImage={METER_ICON_IMAGES.reputation} />
            <MeterBar label={t("meterTrust")} value={meters.trust} color={METER_COLORS.trust} icon={METER_ICONS.trust} iconImage={METER_ICON_IMAGES.trust} />
            <MeterBar label={t("meterRegulatory")} value={meters.regulatory} color={METER_COLORS.regulatory} icon={METER_ICONS.regulatory} iconImage={METER_ICON_IMAGES.regulatory} />
          </div>
        </div>
        <div className="h-0.5 bg-outline-variant" role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100}>
          <motion.div
            className="h-full bg-secondary"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </div>

      <div className="mx-auto flex max-w-3xl flex-col items-center px-4 py-8 sm:px-6">
        <AnimatePresence mode="wait">
          {phase === "scenario" && (
            <motion.div
              key={`scenario-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="w-full"
            >
              {/* Scene Illustration */}
              {currentScenario.imagePath && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="w-full rounded-2xl overflow-hidden border-2 border-outline-variant shadow-[0_4px_0_0_rgba(155,63,0,0.6)] mb-4"
                >
                  <img
                    src={`${basePath}${currentScenario.imagePath}`}
                    alt={currentScenario.title}
                    className="w-full h-auto object-cover"
                  />
                </motion.div>
              )}

              {/* Quarter label */}
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-bold font-label uppercase tracking-wider">
                  {t("quarter", { n: currentScenario.quarter })}
                </span>
              </div>

              {/* Scenario card */}
              <div className="bg-surface-container-lowest border-2 border-outline-variant rounded-2xl p-6 sm:p-8 shadow-[0_4px_0_0_rgba(155,63,0,0.6)] mb-6">
                <h2 className="font-headline text-2xl font-extrabold text-on-surface mb-3">
                  {currentScenario.title}
                </h2>
                <p className="text-on-surface-variant text-sm leading-relaxed">
                  {currentScenario.context}
                </p>
              </div>

              {/* Decision buttons */}
              <div className="space-y-3">
                {currentScenario.decisions.map((d, i) => (
                  <motion.button
                    key={d.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.08 }}
                    onClick={() => handleDecision(d)}
                    aria-label={`${String.fromCharCode(65 + i)}: ${d.text}`}
                    className="w-full text-left p-4 bg-surface-container-lowest border-2 border-outline-variant rounded-xl hover:border-secondary hover:shadow-[0_2px_0_0_rgba(155,63,0,0.4)] transition-all group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2"
                  >
                    <div className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center font-headline font-bold text-sm">
                        {String.fromCharCode(65 + i)}
                      </span>
                      <p className="text-on-surface text-sm font-body group-hover:text-secondary transition-colors">
                        {d.text}
                      </p>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {phase === "reveal" && selectedDecision && lastAnswer && (
            <motion.div
              key={`reveal-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="w-full"
            >
              {/* Outcome card */}
              <div className={`bg-surface-container-lowest border-2 rounded-2xl p-6 sm:p-8 shadow-[0_4px_0_0_rgba(155,63,0,0.6)] mb-6 ${
                selectedDecision.isOptimal ? "border-primary" : "border-error"
              }`}>
                <div className="flex items-center gap-2 mb-3">
                  <span className={`material-symbols-outlined text-2xl ${selectedDecision.isOptimal ? "text-primary" : "text-error"}`} style={{ fontVariationSettings: "'FILL' 1" }} aria-hidden="true">
                    {selectedDecision.isOptimal ? "trending_up" : "trending_down"}
                  </span>
                  <span className={`font-headline text-lg font-bold ${selectedDecision.isOptimal ? "text-primary" : "text-error"}`}>
                    {selectedDecision.isOptimal ? t("optimalChoice") : t("suboptimalChoice")}
                  </span>
                  <span className="ml-auto font-mono text-sm font-bold text-on-surface">
                    +{lastAnswer.score} {t("pts")}
                  </span>
                </div>

                <p className="text-on-surface text-sm mb-4 leading-relaxed">
                  {selectedDecision.outcome}
                </p>

                {/* Impact indicators */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                  {(["revenue", "reputation", "trust", "regulatory"] as const).map((key) => {
                    const impact = selectedDecision.impact[key];
                    const isPositive = impact > 0;
                    const isNegative = impact < 0;
                    return (
                      <div key={key} className={`text-center p-2 rounded-lg ${
                        isPositive ? "bg-primary/10" : isNegative ? "bg-error/10" : "bg-surface-container"
                      }`}>
                        <span className={`text-xs font-bold font-mono ${
                          isPositive ? "text-primary" : isNegative ? "text-error" : "text-on-surface-variant"
                        }`}>
                          {impact > 0 ? "+" : ""}{impact}
                        </span>
                        <p className="text-[9px] font-label uppercase tracking-wider text-on-surface-variant mt-0.5">
                          {t(`meter${key.charAt(0).toUpperCase() + key.slice(1)}`)}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Reasoning */}
                <div className="bg-surface-container rounded-xl p-4">
                  <p className="text-xs font-label font-bold uppercase tracking-wider text-on-surface-variant mb-1">
                    {t("reasoning")}
                  </p>
                  <p className="text-sm text-on-surface leading-relaxed">
                    {selectedDecision.reasoning}
                  </p>
                </div>
              </div>

              {/* Next button */}
              <button
                onClick={handleNext}
                className="w-full py-3 rounded-xl bg-secondary text-on-secondary font-bold font-label text-sm shadow-[0_3px_0_0_rgba(120,40,0,1)] hover:shadow-[0_1px_0_0_rgba(120,40,0,1)] hover:translate-y-[2px] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2"
              >
                {index < totalScenarios - 1 ? t("nextQuarter") : t("viewResults")}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function TycoonPlayPage() {
  return (
    <Suspense fallback={<GamePlaySkeleton />}>
      <PlayInner />
    </Suspense>
  );
}
