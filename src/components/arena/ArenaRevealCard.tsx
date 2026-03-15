"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import type {
  ArenaAnswer,
  CritiqueRound,
  BattleRound,
  OptimizeChallenge,
  ArenaMode,
} from "@/lib/types";
import { playCorrect, playWrong } from "@/lib/sounds";

interface CritiqueRevealData {
  mode: "critique";
  round: CritiqueRound;
  playerRanking: string[];
}
interface BattleRevealData {
  mode: "battle";
  round: BattleRound;
  playerPick: "A" | "B";
}
interface OptimizeRevealData {
  mode: "optimize";
  challenge: OptimizeChallenge;
  correctSteps: boolean[];
}

type RevealData = CritiqueRevealData | BattleRevealData | OptimizeRevealData;

interface ArenaRevealCardProps {
  answer: ArenaAnswer;
  revealData: RevealData;
  onNext: () => void;
}

/* ------------------------------------------------------------------ */
/* Mode-specific reveal sections                                      */
/* ------------------------------------------------------------------ */

function CritiqueReveal({
  data,
}: {
  data: CritiqueRevealData;
}) {
  const t = useTranslations("arena");
  const correctOrder = [...data.round.prompts].sort((a, b) => a.rank - b.rank);

  return (
    <div className="space-y-5">
      {/* Player ranking vs correct */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Player's ranking */}
        <div>
          <p className="mb-2 text-xs uppercase tracking-widest text-ed-ink-muted">
            {t("yourRanking")}
          </p>
          <ol className="space-y-2">
            {data.playerRanking.map((text, idx) => {
              const correctIdx = correctOrder.findIndex(
                (p) => p.text === text
              );
              const isRight = correctIdx === idx;
              return (
                <li
                  key={idx}
                  className={`rounded-lg border p-3 text-sm leading-6 ${
                    isRight
                      ? "border-ed-success/40 text-ed-success"
                      : "border-ed-error/40 text-ed-error"
                  }`}
                >
                  <span className="font-bold mr-2">{idx + 1}.</span>
                  {text}
                </li>
              );
            })}
          </ol>
        </div>

        {/* Correct ranking */}
        <div>
          <p className="mb-2 text-xs uppercase tracking-widest text-ed-ink-muted">
            {t("correctRanking")}
          </p>
          <ol className="space-y-2">
            {correctOrder.map((prompt, idx) => (
              <li
                key={idx}
                className="rounded-lg border border-ed-border bg-ed-warm p-3 text-sm leading-6 text-ed-ink"
              >
                <span className="font-bold mr-2">{idx + 1}.</span>
                {prompt.text}
                <p className="mt-1 text-xs text-ed-ink-muted">
                  {prompt.explanation}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

function BattleReveal({ data }: { data: BattleRevealData }) {
  const t = useTranslations("arena");
  const isWinnerA = data.round.winner === "A";

  const sides = [
    {
      key: "A" as const,
      label: t("promptA"),
      prompt: data.round.promptA,
      isWinner: isWinnerA,
    },
    {
      key: "B" as const,
      label: t("promptB"),
      prompt: data.round.promptB,
      isWinner: !isWinnerA,
    },
  ];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {sides.map(({ key, label, prompt, isWinner }) => (
          <div
            key={key}
            className={`rounded-xl border-2 p-4 transition-all ${
              isWinner
                ? "border-ed-teal bg-ed-teal/5"
                : "border-ed-border opacity-60"
            }`}
          >
            <p className="mb-1 font-display text-sm text-ed-ink-muted">
              {label}
              {isWinner && (
                <span className="ml-2 text-ed-teal font-bold">
                  &#x2713; {t("winner")}
                </span>
              )}
            </p>
            <p className="mb-3 text-[15px] leading-7 text-ed-ink">
              {prompt.text}
            </p>
            <div className="rounded-lg border border-ed-border bg-ed-warm p-3">
              <p className="mb-1 text-xs uppercase tracking-widest text-ed-ink-muted">
                {t("output")}
              </p>
              <p className="text-sm leading-6 text-ed-ink whitespace-pre-wrap">
                {prompt.output}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Explanation */}
      <div className="rounded-lg border border-ed-border bg-ed-parchment p-5">
        <p className="text-[15px] leading-7 text-ed-ink">
          {data.round.explanation}
        </p>
      </div>
    </div>
  );
}

function OptimizeReveal({ data }: { data: OptimizeRevealData }) {
  const t = useTranslations("arena");
  const steps = data.challenge.steps;
  const firstPrompt = steps[0]?.prompt ?? "";
  const lastStep = steps[steps.length - 1];
  // The "final" prompt is the correct option of the last step
  const finalCorrectOption = lastStep?.options.find((o) => o.isCorrect);

  return (
    <div className="space-y-5">
      {/* Before / After */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-ed-border bg-ed-warm p-4">
          <p className="mb-2 text-xs uppercase tracking-widest text-ed-ink-muted">
            {t("startingPrompt")}
          </p>
          <p className="text-sm leading-6 text-ed-ink">{firstPrompt}</p>
        </div>
        {finalCorrectOption && (
          <div className="rounded-lg border border-ed-teal/40 bg-ed-teal/5 p-4">
            <p className="mb-2 text-xs uppercase tracking-widest text-ed-teal">
              {t("finalImprovement")}
            </p>
            <p className="text-sm leading-6 text-ed-ink">
              {finalCorrectOption.text}
            </p>
          </div>
        )}
      </div>

      {/* Step summary */}
      <div className="flex flex-wrap gap-3">
        {data.correctSteps.map((correct, idx) => (
          <div
            key={idx}
            className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm ${
              correct
                ? "border-ed-success/40 text-ed-success"
                : "border-ed-error/40 text-ed-error"
            }`}
          >
            <span className="font-bold">
              {t("stepOf", { current: idx + 1, total: steps.length })}
            </span>
            <span>{correct ? "\u2713" : "\u2717"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Main reveal card                                                   */
/* ------------------------------------------------------------------ */

export default function ArenaRevealCard({
  answer,
  revealData,
  onNext,
}: ArenaRevealCardProps) {
  const t = useTranslations("arena");
  const isCorrect = answer.isCorrect;

  useEffect(() => {
    if (isCorrect) playCorrect();
    else playWrong();
  }, [isCorrect]);

  const borderClass = isCorrect
    ? "border-ed-success/50"
    : "border-ed-error/50";
  const glowClass = isCorrect
    ? "shadow-[0_0_20px_rgba(26,122,76,0.12)]"
    : "shadow-[0_0_20px_rgba(181,52,42,0.12)]";

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`w-full max-w-3xl rounded-xl border-2 bg-ed-card ${borderClass} ${glowClass}`}
    >
      {/* Result banner */}
      <div
        className={`flex items-center justify-between rounded-t-xl px-6 py-4 ${
          isCorrect ? "bg-ed-success/10" : "bg-ed-error/10"
        }`}
      >
        <div className="flex items-center gap-3">
          <span
            className={`text-2xl font-bold ${
              isCorrect ? "text-ed-success" : "text-ed-error"
            }`}
          >
            {isCorrect ? "\u2713" : "\u2717"}
          </span>
          <span
            className={`font-display text-lg font-bold ${
              isCorrect ? "text-ed-success" : "text-ed-error"
            }`}
          >
            {isCorrect ? t("correct") : t("incorrect")}
          </span>
        </div>

        {isCorrect && (
          <div className="text-right">
            <div className="font-sans text-xl font-bold text-ed-success">
              +{answer.score}
            </div>
            {answer.multiplier > 1 && (
              <div className="text-xs text-ed-success/70">
                {t("multiplier")}: x{answer.multiplier}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="space-y-6 p-6 sm:p-8">
        {/* Mode-specific content */}
        {revealData.mode === "critique" && (
          <CritiqueReveal data={revealData} />
        )}
        {revealData.mode === "battle" && <BattleReveal data={revealData} />}
        {revealData.mode === "optimize" && (
          <OptimizeReveal data={revealData} />
        )}

        {/* Streak info */}
        {answer.streak > 0 && (
          <div className="flex items-center justify-center gap-4 text-sm">
            <span className="text-ed-ink-muted">
              {t("streak")}:{" "}
              <span className="font-sans font-bold text-ed-teal">
                {answer.streak}
              </span>
            </span>
            {answer.multiplier > 1 && (
              <span className="text-ed-ink-muted">
                {t("multiplier")}:{" "}
                <span className="font-sans font-bold text-ed-success">
                  x{answer.multiplier}
                </span>
              </span>
            )}
          </div>
        )}

        {/* Next button */}
        <button
          onClick={onNext}
          className="w-full rounded-lg border border-ed-teal/40 bg-ed-teal/10 px-6 py-3 font-sans text-sm font-bold text-ed-teal transition-all hover:bg-ed-teal/20 hover:shadow-[0_0_15px_rgba(13,115,119,0.15)]"
        >
          {t("next")} &rarr;
        </button>
      </div>
    </motion.div>
  );
}
