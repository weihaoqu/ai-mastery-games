"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import type { Case, PlayerAnswer, Difficulty } from "@/lib/types";
import { scoreAnswer, calculateSessionResult } from "@/lib/detective/scoring";
import { generateId } from "@/lib/storage";
import { beginnerCases } from "@/data/detective/beginner";
import { intermediateCases } from "@/data/detective/intermediate";
import { advancedCases } from "@/data/detective/advanced";
import { expertCases } from "@/data/detective/expert";
import { translateCases } from "@/lib/detective/translate-cases";
import { playCorrect, playWrong } from "@/lib/sounds";
import { GamePlaySkeleton } from "@/components/Skeleton";

const casesByDifficulty: Record<string, Case[]> = {
  beginner: beginnerCases,
  intermediate: intermediateCases,
  advanced: advancedCases,
  expert: expertCases,
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

function CaseTypeBadge({ type, label }: { type: Case["type"]; label: string }) {
  const clsMap: Record<Case["type"], string> = {
    hallucination: "bg-teal-50 text-ed-teal border-ed-teal/40",
    bias: "bg-orange-50 text-ed-burnt border-ed-burnt/40",
    "prompt-injection": "bg-emerald-50 text-ed-success border-ed-success/40",
    ethics: "bg-amber-50 text-amber-700 border-amber-400/40",
  };
  return (
    <span className={`inline-block rounded-full border px-3 py-0.5 text-xs font-semibold uppercase tracking-wider ${clsMap[type]}`}>
      {label}
    </span>
  );
}

const evidenceIcon: Record<string, string> = {
  document: "\u{1F4C4}",
  screenshot: "\u{1F4F8}",
  data: "\u{1F4CA}",
  email: "\u{1F4E7}",
  "chat-log": "\u{1F4AC}",
  code: "\u{1F4BB}",
};

type GamePhase = "briefing" | "investigating" | "diagnosing" | "result" | "complete";

const SAVE_KEY = "detective-progress";

interface SavedProgress {
  caseIds: string[];
  index: number;
  phase: GamePhase;
  answers: PlayerAnswer[];
  difficulty: Difficulty;
}

function PlayInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const t = useTranslations("detective");
  const tCase = useTranslations("caseType");
  const locale = useLocale();
  const rawDifficulty = searchParams.get("difficulty") ?? "beginner";
  const difficulty = (VALID_DIFFICULTIES.has(rawDifficulty) ? rawDifficulty : "beginner") as Difficulty;

  useEffect(() => {
    if (!VALID_DIFFICULTIES.has(difficulty)) {
      router.replace("/detective");
    }
  }, [difficulty, router]);

  const [cases, setCases] = useState<Case[]>([]);
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<GamePhase>("briefing");
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [reasoning, setReasoning] = useState("");
  const [answers, setAnswers] = useState<PlayerAnswer[]>([]);
  const caseStartRef = useRef(Date.now());

  useEffect(() => {
    const source = casesByDifficulty[difficulty];
    if (!source) return;

    async function initCases() {
      const saved = sessionStorage.getItem(SAVE_KEY);
      if (saved) {
        try {
          const progress: SavedProgress = JSON.parse(saved);
          if (progress.difficulty === difficulty && progress.caseIds.length > 0) {
            const caseMap = new Map(source.map(c => [c.id, c]));
            const restoredCases = progress.caseIds.map(id => caseMap.get(id)).filter(Boolean) as Case[];
            if (restoredCases.length === progress.caseIds.length) {
              const translated = await translateCases(restoredCases, locale);
              setCases(translated);
              setIndex(progress.index);
              setPhase(progress.phase === "result" ? "briefing" : progress.phase);
              setAnswers(progress.answers);
              sessionStorage.removeItem("detective-result");
              return;
            }
          }
        } catch { /* ignore corrupt data */ }
      }

      const selected = shuffle(source).slice(0, 10);
      const translated = await translateCases(selected, locale);
      setCases(translated);
      sessionStorage.removeItem("detective-result");
      sessionStorage.removeItem(SAVE_KEY);
    }

    initCases();
  }, [difficulty, locale]);

  useEffect(() => {
    if (cases.length === 0) return;
    const progress: SavedProgress = {
      caseIds: cases.map(c => c.id),
      index,
      phase,
      answers,
      difficulty,
    };
    sessionStorage.setItem(SAVE_KEY, JSON.stringify(progress));
  }, [cases, index, phase, answers, difficulty]);

  useEffect(() => {
    if (phase === "briefing") {
      caseStartRef.current = Date.now();
      setSelectedOption(null);
      setReasoning("");
    }
  }, [phase, index]);

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (answers.length > 0 && phase !== "complete") {
        e.preventDefault();
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [answers, phase]);

  const currentCase = cases[index] as Case | undefined;
  const totalCases = cases.length;
  const progress = totalCases > 0 ? ((index + (phase === "result" ? 1 : 0)) / totalCases) * 100 : 0;

  const handleSubmit = useCallback(() => {
    if (!selectedOption || !currentCase) return;
    const timeSpent = Math.round((Date.now() - caseStartRef.current) / 1000);
    const answer = scoreAnswer(currentCase, selectedOption, reasoning, timeSpent);
    setAnswers((prev) => [...prev, answer]);
    setPhase("result");
  }, [selectedOption, reasoning, currentCase]);

  const handleComplete = useCallback(() => {
    const result = calculateSessionResult(answers, cases, difficulty);
    const session = { ...result, id: generateId(), date: new Date().toISOString() };
    sessionStorage.setItem("detective-result", JSON.stringify(session));
    sessionStorage.removeItem(SAVE_KEY);
    router.push("/detective/results");
  }, [answers, cases, difficulty, router]);

  const handleNext = useCallback(() => {
    setIndex((i) => i + 1);
    setPhase("briefing");
  }, []);

  if (!currentCase) {
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
          <Link href="/detective" className="text-sm text-ed-ink-muted transition-colors hover:text-ed-teal">
            &larr; {t("exit")}
          </Link>
          <span className="text-xs font-semibold uppercase tracking-widest text-ed-ink-muted">
            {t("caseOf", { current: index + 1, total: totalCases })}
          </span>
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

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <AnimatePresence mode="wait">
          {/* BRIEFING */}
          {phase === "briefing" && (
            <motion.div
              key={`briefing-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="mb-4">
                <CaseTypeBadge type={currentCase.type} label={tCase(currentCase.type)} />
              </div>
              <h2 className="mb-6 text-2xl font-bold text-ed-ink sm:text-3xl">
                {currentCase.title}
              </h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="mb-4 text-base leading-7 text-ed-ink-light sm:text-lg sm:leading-8"
              >
                {currentCase.briefing}
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="mb-8 rounded-lg border border-ed-border bg-ed-parchment p-5 text-[15px] leading-7 text-ed-ink-muted"
              >
                {currentCase.context}
              </motion.p>
              <button
                onClick={() => setPhase("investigating")}
                className="rounded-lg bg-ed-teal/10 px-6 py-3 font-semibold text-ed-teal transition-colors hover:bg-ed-teal/20"
              >
                {t("investigate")} &rarr;
              </button>
            </motion.div>
          )}

          {/* INVESTIGATING */}
          {phase === "investigating" && (
            <motion.div
              key={`investigating-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <h3 className="mb-6 text-lg font-semibold text-ed-ink-light">
                {t("evidenceBoard")}
              </h3>
              <motion.div
                className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2"
                initial="hidden"
                animate="visible"
                variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
              >
                {currentCase.evidence.map((ev) => (
                  <motion.div
                    key={ev.id}
                    variants={{
                      hidden: { opacity: 0, y: 16 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
                    }}
                    className={`rounded-lg border p-4 ${
                      ev.isKey
                        ? "border-amber-500/40 bg-amber-50"
                        : "border-ed-border bg-ed-card"
                    }`}
                  >
                    <div className="mb-2 flex items-center gap-2">
                      <span className="text-xl">{evidenceIcon[ev.type] ?? "\u{1F4C4}"}</span>
                      <span className="text-base font-semibold text-ed-ink">{ev.title}</span>
                      {ev.isKey && (
                        <span className="ml-auto rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-600">
                          {t("keyEvidence")}
                        </span>
                      )}
                    </div>
                    <div className="relative">
                      <div className="max-h-52 overflow-y-auto text-[15px] leading-7 text-ed-ink-muted scrollbar-thin pr-1">
                        {ev.content}
                      </div>
                      {ev.content.length > 300 && (
                        <div className={`pointer-events-none absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t ${ev.isKey ? "from-amber-50" : "from-ed-card"} to-transparent`} />
                      )}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
              <button
                onClick={() => setPhase("diagnosing")}
                className="rounded-lg bg-ed-burnt/10 px-6 py-3 font-semibold text-ed-burnt transition-colors hover:bg-ed-burnt/20"
              >
                {t("makeDiagnosis")} &rarr;
              </button>
            </motion.div>
          )}

          {/* DIAGNOSING */}
          {phase === "diagnosing" && (
            <motion.div
              key={`diagnosing-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <h3 className="mb-6 text-xl font-bold text-ed-ink sm:text-2xl">
                {currentCase.question}
              </h3>

              <div className="mb-6 space-y-3">
                {currentCase.options.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setSelectedOption(opt.id)}
                    aria-pressed={selectedOption === opt.id}
                    className={`w-full rounded-lg border p-4 text-left text-[15px] leading-7 transition-all sm:text-base ${
                      selectedOption === opt.id
                        ? "border-ed-teal bg-ed-teal/5 text-ed-ink"
                        : "border-ed-border bg-ed-card text-ed-ink-muted hover:border-ed-ink-muted/30 hover:bg-ed-warm"
                    }`}
                  >
                    {opt.text}
                  </button>
                ))}
              </div>

              <div className="mb-6">
                <label className="mb-2 block text-base text-ed-ink-muted">
                  {t("reasoningLabel")}
                </label>
                <textarea
                  value={reasoning}
                  onChange={(e) => setReasoning(e.target.value)}
                  rows={3}
                  aria-label={t("reasoningLabel")}
                  placeholder={t("reasoningPlaceholder")}
                  className="w-full resize-none rounded-lg border border-ed-border bg-ed-card px-4 py-3 text-base text-ed-ink placeholder-ed-ink-muted/50 outline-none transition-colors focus:border-ed-teal"
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={!selectedOption}
                className={`rounded-lg px-6 py-3 font-semibold transition-colors ${
                  selectedOption
                    ? "bg-ed-success/10 text-ed-success hover:bg-ed-success/20"
                    : "cursor-not-allowed bg-ed-parchment text-ed-ink-muted/50"
                }`}
              >
                {t("submitDiagnosis")} &rarr;
              </button>
            </motion.div>
          )}

          {/* RESULT */}
          {phase === "result" && (
            <motion.div
              key={`result-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <ResultPhase
                answer={answers[answers.length - 1]}
                case_={currentCase}
                isLast={index === totalCases - 1}
                onNext={handleNext}
                onComplete={handleComplete}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function ResultPhase({
  answer,
  case_,
  isLast,
  onNext,
  onComplete,
}: {
  answer: PlayerAnswer;
  case_: Case;
  isLast: boolean;
  onNext: () => void;
  onComplete: () => void;
}) {
  const t = useTranslations("detective");
  const [displayScore, setDisplayScore] = useState(0);
  const correct = answer.isCorrect;

  useEffect(() => {
    if (correct) playCorrect();
    else playWrong();
  }, [correct]);
  const selectedOpt = case_.options.find((o) => o.id === answer.selectedOptionId);
  const correctOpt = case_.options.find((o) => o.isCorrect);

  useEffect(() => {
    const target = answer.score;
    if (target === 0) return;
    let current = 0;
    const step = Math.max(1, Math.floor(target / 30));
    const id = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(id);
      }
      setDisplayScore(current);
    }, 25);
    return () => clearInterval(id);
  }, [answer.score]);

  return (
    <div>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="mb-6 flex items-center gap-4"
      >
        <span className={`text-5xl ${correct ? "text-ed-success" : "text-ed-error"}`}>
          {correct ? "\u2713" : "\u2717"}
        </span>
        <div>
          <p className={`text-xl font-bold ${correct ? "text-ed-success" : "text-ed-error"}`}>
            {correct ? t("correctDiagnosis") : t("incorrectDiagnosis")}
          </p>
          <p className="text-3xl font-bold text-ed-ink">
            {displayScore} <span className="text-base text-ed-ink-muted">{t("pts")}</span>
          </p>
        </div>
      </motion.div>

      <div className="mb-4 rounded-lg border border-ed-border bg-ed-card p-5">
        <p className="mb-1.5 text-sm font-semibold uppercase tracking-wider text-ed-ink-muted">{t("yourAnswer")}</p>
        <p className={`text-base leading-7 ${correct ? "text-ed-success" : "text-ed-error"}`}>
          {selectedOpt?.text}
        </p>
      </div>

      {!correct && correctOpt && (
        <div className="mb-4 rounded-lg border border-ed-success/30 bg-ed-success/5 p-5">
          <p className="mb-1.5 text-sm font-semibold uppercase tracking-wider text-ed-success">{t("correctAnswer")}</p>
          <p className="text-base leading-7 text-ed-ink">{correctOpt.text}</p>
        </div>
      )}

      <div className="mb-4 rounded-lg border border-ed-border bg-ed-card p-5">
        <p className="mb-1.5 text-sm font-semibold uppercase tracking-wider text-ed-ink-muted">{t("explanation")}</p>
        <p className="text-[15px] leading-7 text-ed-ink">{case_.correctDiagnosis}</p>
      </div>

      <div className="mb-8 rounded-lg border border-ed-border bg-ed-card p-5">
        <p className="mb-1.5 text-sm font-semibold uppercase tracking-wider text-ed-ink-muted">{t("recommendedFix")}</p>
        <p className="text-[15px] leading-7 text-ed-ink">{case_.recommendedFix}</p>
      </div>

      {isLast ? (
        <button
          onClick={onComplete}
          className="rounded-lg bg-ed-teal/10 px-6 py-3 font-semibold text-ed-teal transition-colors hover:bg-ed-teal/20"
        >
          {t("viewResults")} &rarr;
        </button>
      ) : (
        <button
          onClick={onNext}
          className="rounded-lg bg-ed-teal/10 px-6 py-3 font-semibold text-ed-teal transition-colors hover:bg-ed-teal/20"
        >
          {t("nextCase")} &rarr;
        </button>
      )}
    </div>
  );
}

export default function PlayPage() {
  const t = useTranslations("detective");
  return (
    <Suspense fallback={<GamePlaySkeleton />}>
      <PlayInner />
    </Suspense>
  );
}
