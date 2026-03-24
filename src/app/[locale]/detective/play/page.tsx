"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import type { Case, PlayerAnswer, Difficulty } from "@/lib/types";
import { scoreAnswer, calculateSessionResult } from "@/lib/detective/scoring";
import { beginnerCases } from "@/data/detective/beginner";
import { intermediateCases } from "@/data/detective/intermediate";
import { advancedCases } from "@/data/detective/advanced";
import { expertCases } from "@/data/detective/expert";
import { translateCases } from "@/lib/detective/translate-cases";
import { playCorrect, playWrong } from "@/lib/sounds";
import { GamePlaySkeleton } from "@/components/Skeleton";
import { trackGameStart, trackCaseAnswer, trackGameAbandon } from "@/lib/analytics";

const allCases: Case[] = [
  ...beginnerCases,
  ...intermediateCases,
  ...advancedCases,
  ...expertCases,
];

const typeIcon: Record<string, string> = {
  hallucination: "psychology",
  bias: "balance",
  "prompt-injection": "shield",
  ethics: "gavel",
};

const typeColor: Record<string, string> = {
  hallucination: "bg-teal-100 text-teal-800 border-teal-300",
  bias: "bg-orange-100 text-orange-800 border-orange-300",
  "prompt-injection": "bg-emerald-100 text-emerald-800 border-emerald-300",
  ethics: "bg-amber-100 text-amber-800 border-amber-300",
};

const evidenceIconMap: Record<string, string> = {
  document: "description",
  screenshot: "screenshot_monitor",
  data: "database",
  email: "mail",
  "chat-log": "chat",
  code: "code",
};

function markCaseCompleted(caseId: string) {
  try {
    const raw = localStorage.getItem("detective-completed");
    const set: string[] = raw ? JSON.parse(raw) : [];
    if (!set.includes(caseId)) {
      set.push(caseId);
      localStorage.setItem("detective-completed", JSON.stringify(set));
    }
  } catch { /* ignore */ }
}

function addAnswerToSession(answer: PlayerAnswer, difficulty: Difficulty) {
  try {
    const raw = sessionStorage.getItem("detective-session-answers");
    const data: { answers: PlayerAnswer[]; difficulty: Difficulty } = raw
      ? JSON.parse(raw)
      : { answers: [], difficulty };
    // Don't duplicate if same case already answered
    data.answers = data.answers.filter((a) => a.caseId !== answer.caseId);
    data.answers.push(answer);
    data.difficulty = difficulty;
    sessionStorage.setItem("detective-session-answers", JSON.stringify(data));
  } catch { /* ignore */ }
}

function PlayInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const t = useTranslations("detective");
  const tCase = useTranslations("caseType");
  const locale = useLocale();

  const caseId = searchParams.get("case");
  const [theCase, setTheCase] = useState<Case | null>(null);
  const [expandedEvidence, setExpandedEvidence] = useState<Set<string>>(new Set());
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [answer, setAnswer] = useState<PlayerAnswer | null>(null);
  const caseStartRef = useRef(Date.now());

  // Load the single case
  useEffect(() => {
    if (!caseId) {
      router.replace(`/${locale}/detective`);
      return;
    }
    const found = allCases.find((c) => c.id === caseId);
    if (!found) {
      router.replace(`/${locale}/detective`);
      return;
    }
    async function load() {
      const [translated] = await translateCases([found!], locale);
      setTheCase(translated);
      // Auto-expand key evidence
      const keyIds = new Set(found!.evidence.filter((e) => e.isKey).map((e) => e.id));
      setExpandedEvidence(keyIds);
    }
    load();
    trackGameStart("detective", found.difficulty);
  }, [caseId, locale, router]);

  const toggleEvidence = useCallback((id: string) => {
    setExpandedEvidence((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleSubmit = useCallback(() => {
    if (!selectedOption || !theCase || submitted) return;
    const timeSpent = Math.round((Date.now() - caseStartRef.current) / 1000);
    const result = scoreAnswer(theCase, selectedOption, "", timeSpent);
    setAnswer(result);
    setSubmitted(true);
    trackCaseAnswer("detective", theCase.id, result.isCorrect, timeSpent);
    markCaseCompleted(theCase.id);
    addAnswerToSession(result, theCase.difficulty as Difficulty);
    if (result.isCorrect) playCorrect();
    else playWrong();
  }, [selectedOption, theCase, submitted]);

  // Track game abandon on page leave
  const submittedRef = useRef(submitted);
  submittedRef.current = submitted;
  const theCaseRef = useRef(theCase);
  theCaseRef.current = theCase;

  useEffect(() => {
    const handler = () => {
      if (!submittedRef.current && theCaseRef.current) {
        trackGameAbandon("detective", theCaseRef.current.difficulty, 0);
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
  }, []);

  if (!theCase) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface">
        <p className="text-on-surface-variant animate-pulse">{t("loading")}</p>
      </div>
    );
  }

  const correctOpt = theCase.options.find((o) => o.isCorrect);

  return (
    <div className="min-h-screen bg-surface">
      {/* Top bar */}
      <div className="sticky top-0 z-30 bg-surface/90 backdrop-blur border-b border-outline-variant">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <Link href="/detective" className="flex items-center gap-1 text-sm text-on-surface-variant font-label hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-lg">arrow_back</span>
            {t("backToHub")}
          </Link>
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-xs font-bold ${typeColor[theCase.type]}`}>
            <span className="material-symbols-outlined text-sm">{typeIcon[theCase.type]}</span>
            {tCase(theCase.type)}
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        {/* Case Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-black font-headline text-on-surface mb-3 leading-tight">
            {theCase.title}
          </h1>
          <p className="text-base text-on-surface-variant leading-relaxed">
            {theCase.briefing}
          </p>
        </motion.div>

        {/* Evidence Cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="mb-10"
        >
          <h2 className="flex items-center gap-2 text-sm font-label font-bold text-on-surface-variant uppercase tracking-widest mb-4">
            <span className="material-symbols-outlined text-lg">folder_open</span>
            {t("evidenceBoard")}
          </h2>
          <div className="space-y-3">
            {theCase.evidence.map((ev, i) => {
              const isExpanded = expandedEvidence.has(ev.id);
              return (
                <motion.div
                  key={ev.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.08, duration: 0.3 }}
                >
                  <button
                    onClick={() => toggleEvidence(ev.id)}
                    className={`w-full text-left rounded-xl border-2 transition-all ${
                      ev.isKey
                        ? "border-amber-400/60 bg-amber-50/50"
                        : "border-outline-variant/50 bg-surface-container-lowest"
                    } ${isExpanded ? "shadow-md" : "shadow-sm hover:shadow-md"}`}
                  >
                    <div className="flex items-center gap-3 px-4 py-3">
                      <span className={`material-symbols-outlined text-xl ${ev.isKey ? "text-amber-600" : "text-on-surface-variant"}`}>
                        {evidenceIconMap[ev.type] ?? "description"}
                      </span>
                      <span className="font-bold text-on-surface text-sm flex-1">{ev.title}</span>
                      {ev.isKey && (
                        <span className="text-[10px] font-black bg-amber-400/30 text-amber-800 px-2 py-0.5 rounded-full uppercase tracking-wider">
                          {t("keyEvidence")}
                        </span>
                      )}
                      <span className={`material-symbols-outlined text-on-surface-variant text-lg transition-transform ${isExpanded ? "rotate-180" : ""}`}>
                        expand_more
                      </span>
                    </div>
                  </button>
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className={`px-4 pb-4 pt-2 ml-9 mr-4 text-sm leading-relaxed text-on-surface-variant ${
                          ev.isKey ? "" : ""
                        }`}>
                          {ev.content}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Question & Options */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="mb-10"
        >
          <h2 className="text-xl sm:text-2xl font-bold font-headline text-on-surface mb-5">
            {theCase.question}
          </h2>
          <div className="space-y-3">
            {theCase.options.map((opt) => {
              const isSelected = selectedOption === opt.id;
              const showResult = submitted;
              const isCorrectOpt = opt.isCorrect;

              let optClass = "border-outline-variant/50 bg-surface-container-lowest hover:border-primary/40 hover:bg-primary/5";
              if (showResult) {
                if (isCorrectOpt) optClass = "border-primary bg-primary/10";
                else if (isSelected && !isCorrectOpt) optClass = "border-error bg-error/10";
                else optClass = "border-outline-variant/30 bg-surface-container-lowest opacity-50";
              } else if (isSelected) {
                optClass = "border-primary bg-primary/5 ring-2 ring-primary/20";
              }

              return (
                <button
                  key={opt.id}
                  onClick={() => !submitted && setSelectedOption(opt.id)}
                  disabled={submitted}
                  className={`w-full text-left rounded-xl border-2 p-4 transition-all ${optClass}`}
                >
                  <div className="flex items-start gap-3">
                    {showResult && (
                      <span className={`material-symbols-outlined text-xl mt-0.5 ${isCorrectOpt ? "text-primary" : isSelected ? "text-error" : "text-on-surface-variant/30"}`}
                        style={isCorrectOpt ? { fontVariationSettings: "'FILL' 1" } : undefined}
                      >
                        {isCorrectOpt ? "check_circle" : isSelected ? "cancel" : "radio_button_unchecked"}
                      </span>
                    )}
                    {!showResult && (
                      <span className={`material-symbols-outlined text-xl mt-0.5 ${isSelected ? "text-primary" : "text-on-surface-variant/40"}`}
                        style={isSelected ? { fontVariationSettings: "'FILL' 1" } : undefined}
                      >
                        {isSelected ? "radio_button_checked" : "radio_button_unchecked"}
                      </span>
                    )}
                    <div className="flex-1">
                      <p className="text-sm font-medium text-on-surface leading-relaxed">{opt.text}</p>
                      {showResult && (isCorrectOpt || isSelected) && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className={`mt-2 text-xs leading-relaxed ${isCorrectOpt ? "text-primary" : "text-error"}`}
                        >
                          {opt.explanation}
                        </motion.p>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Submit / Result */}
        {!submitted ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.3 }}
          >
            <button
              onClick={handleSubmit}
              disabled={!selectedOption}
              className={`w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-base transition-all ${
                selectedOption
                  ? "bg-primary text-on-primary shadow-[0_4px_0_0_#004c1e] hover:translate-y-[2px] hover:shadow-[0_2px_0_0_#004c1e] active:translate-y-[4px] active:shadow-none"
                  : "bg-surface-container text-on-surface-variant/50 cursor-not-allowed"
              }`}
            >
              <span className="material-symbols-outlined">send</span>
              {t("submitDiagnosis")}
            </button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Score Banner */}
            <div className={`rounded-2xl p-6 flex items-center gap-4 ${
              answer?.isCorrect
                ? "bg-primary-container"
                : "bg-error-container/20"
            }`}>
              <span className={`material-symbols-outlined text-5xl ${answer?.isCorrect ? "text-primary" : "text-error"}`}
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                {answer?.isCorrect ? "emoji_events" : "close"}
              </span>
              <div>
                <p className={`text-2xl font-black font-headline ${answer?.isCorrect ? "text-on-primary-container" : "text-error"}`}>
                  {answer?.isCorrect ? t("correctDiagnosis") : t("incorrectDiagnosis")}
                </p>
                <p className="text-sm text-on-surface-variant font-label">
                  {answer?.score} {t("pts")}
                </p>
              </div>
            </div>

            {/* Brief Takeaway */}
            <div className="rounded-xl border-2 border-outline-variant/50 bg-surface-container-lowest p-5">
              <h3 className="flex items-center gap-2 text-sm font-label font-bold text-on-surface-variant uppercase tracking-widest mb-2">
                <span className="material-symbols-outlined text-base">lightbulb</span>
                {t("explanation")}
              </h3>
              <p className="text-sm text-on-surface leading-relaxed">
                {theCase.correctDiagnosis}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              <Link
                href="/detective"
                className="flex items-center gap-2 px-6 py-3 bg-surface-container-highest text-on-surface font-bold rounded-xl border-b-4 border-outline-variant active:translate-y-1 active:border-b-0 transition-all text-sm"
              >
                <span className="material-symbols-outlined text-lg">grid_view</span>
                {t("browseCases")}
              </Link>
              <Link
                href={`/detective/play?case=${getNextCaseId(theCase)}`}
                className="flex items-center gap-2 px-6 py-3 bg-primary text-on-primary font-bold rounded-xl border-b-4 border-[#004c1e] active:translate-y-1 active:border-b-0 transition-all text-sm"
              >
                <span className="material-symbols-outlined text-lg">skip_next</span>
                {t("nextCase")}
              </Link>
              <button
                onClick={() => {
                  try {
                    const raw = sessionStorage.getItem("detective-session-answers");
                    if (raw) {
                      const data = JSON.parse(raw);
                      const sessionResult = calculateSessionResult(data.answers, allCases, data.difficulty);
                      const fullResult = { ...sessionResult, id: crypto.randomUUID(), date: new Date().toISOString() };
                      sessionStorage.setItem("detective-result", JSON.stringify(fullResult));
                      sessionStorage.removeItem("detective-session-answers");
                      router.push(`/${locale}/detective/results`);
                    }
                  } catch { /* ignore */ }
                }}
                className="flex items-center gap-2 px-6 py-3 bg-tertiary text-on-tertiary font-bold rounded-xl border-b-4 border-[#4a3b9e] active:translate-y-1 active:border-b-0 transition-all text-sm"
              >
                <span className="material-symbols-outlined text-lg">assessment</span>
                {t("viewResults")}
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

/** Get the next case in the same difficulty */
function getNextCaseId(current: Case): string {
  const sameDiff = allCases.filter((c) => c.difficulty === current.difficulty);
  const idx = sameDiff.findIndex((c) => c.id === current.id);
  const next = sameDiff[(idx + 1) % sameDiff.length];
  return next.id;
}

export default function PlayPage() {
  const t = useTranslations("detective");
  return (
    <Suspense fallback={<GamePlaySkeleton />}>
      <PlayInner />
    </Suspense>
  );
}
