"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import type {
  ArenaAnswer,
  CritiqueRound,
  BattleRound,
  OptimizeChallenge,
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

function CritiqueReveal({ data }: { data: CritiqueRevealData }) {
  const t = useTranslations("arena");
  const correctOrder = [...data.round.prompts].sort((a, b) => a.rank - b.rank);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <p className="mb-2 text-xs uppercase tracking-widest text-on-surface-variant font-label font-bold">
            {t("yourRanking")}
          </p>
          <ol className="space-y-2">
            {data.playerRanking.map((text, idx) => {
              const correctIdx = correctOrder.findIndex((p) => p.text === text);
              const isRight = correctIdx === idx;
              return (
                <li
                  key={idx}
                  className={`rounded-xl border-b-4 p-4 text-sm leading-6 ${
                    isRight
                      ? "border-primary/40 bg-primary-container/20 text-primary"
                      : "border-error/40 bg-error/5 text-error"
                  }`}
                >
                  <span className="font-bold mr-2">{idx + 1}.</span>
                  {text}
                </li>
              );
            })}
          </ol>
        </div>

        <div>
          <p className="mb-2 text-xs uppercase tracking-widest text-on-surface-variant font-label font-bold">
            {t("correctRanking")}
          </p>
          <ol className="space-y-2">
            {correctOrder.map((prompt, idx) => (
              <li
                key={idx}
                className="rounded-xl border-b-4 border-outline-variant bg-surface-container-low p-4 text-sm leading-6 text-on-surface"
              >
                <span className="font-bold mr-2">{idx + 1}.</span>
                {prompt.text}
                <p className="mt-1 text-xs text-on-surface-variant">
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
    { key: "A" as const, label: t("promptA"), prompt: data.round.promptA, isWinner: isWinnerA },
    { key: "B" as const, label: t("promptB"), prompt: data.round.promptB, isWinner: !isWinnerA },
  ];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {sides.map(({ key, label, prompt, isWinner }) => (
          <div
            key={key}
            className={`rounded-2xl border-b-4 p-5 transition-all ${
              isWinner
                ? "border-primary bg-primary-container/20"
                : "border-outline-variant opacity-60"
            }`}
          >
            <p className="mb-1 font-label text-sm text-on-surface-variant uppercase tracking-wider">
              {label}
              {isWinner && (
                <span className="ml-2 text-primary font-bold">
                  <span className="material-symbols-outlined text-sm align-middle" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span> {t("winner")}
                </span>
              )}
            </p>
            <p className="mb-3 text-base leading-7 text-on-surface">
              {prompt.text}
            </p>
            <div className="rounded-xl border-2 border-outline-variant/30 bg-surface-container-low p-4">
              <p className="mb-1 text-xs uppercase tracking-widest text-on-surface-variant font-label font-bold">
                {t("output")}
              </p>
              <p className="text-sm leading-6 text-on-surface whitespace-pre-wrap font-mono">
                {prompt.output}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Explanation */}
      <div className="rounded-2xl border-2 border-outline-variant/30 bg-surface-container-low p-6">
        <p className="text-base leading-7 text-on-surface">
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
  const finalCorrectOption = lastStep?.options.find((o) => o.isCorrect);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl border-b-4 border-outline-variant bg-surface-container-low p-5">
          <p className="mb-2 text-xs uppercase tracking-widest text-on-surface-variant font-label font-bold">
            {t("startingPrompt")}
          </p>
          <p className="text-sm leading-6 text-on-surface">{firstPrompt}</p>
        </div>
        {finalCorrectOption && (
          <div className="rounded-xl border-b-4 border-primary/40 bg-primary-container/20 p-5">
            <p className="mb-2 text-xs uppercase tracking-widest text-primary font-label font-bold">
              {t("finalImprovement")}
            </p>
            <p className="text-sm leading-6 text-on-surface">
              {finalCorrectOption.text}
            </p>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        {data.correctSteps.map((correct, idx) => (
          <div
            key={idx}
            className={`flex items-center gap-2 rounded-xl border-b-4 px-4 py-2 text-sm font-label font-bold ${
              correct
                ? "border-primary/40 bg-primary-container/20 text-primary"
                : "border-error/40 bg-error/5 text-error"
            }`}
          >
            <span>{t("stepOf", { current: idx + 1, total: steps.length })}</span>
            <span className="material-symbols-outlined text-sm">
              {correct ? "check" : "close"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`w-full max-w-4xl rounded-3xl bg-surface-container-lowest border-4 border-outline-variant shadow-[4px_4px_0px_0px_#98b67d]`}
    >
      {/* Result banner */}
      <div
        className={`flex items-center justify-between rounded-t-[calc(1.5rem-4px)] px-8 py-5 border-b-4 border-outline-variant ${
          isCorrect ? "bg-primary-container/30" : "bg-error/10"
        }`}
      >
        <div className="flex items-center gap-3">
          <span className={`material-symbols-outlined text-2xl ${isCorrect ? "text-primary" : "text-error"}`} style={{ fontVariationSettings: "'FILL' 1" }}>
            {isCorrect ? "check_circle" : "cancel"}
          </span>
          <span className={`font-headline text-xl font-extrabold ${isCorrect ? "text-primary" : "text-error"}`}>
            {isCorrect ? t("correct") : t("incorrect")}
          </span>
        </div>

        {isCorrect && (
          <div className="text-right">
            <div className="font-headline text-2xl font-extrabold text-primary">
              +{answer.score}
            </div>
            {answer.multiplier > 1 && (
              <div className="text-xs text-primary/70 font-label font-bold">
                {t("multiplier")}: x{answer.multiplier}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="space-y-6 p-8">
        {revealData.mode === "critique" && <CritiqueReveal data={revealData} />}
        {revealData.mode === "battle" && <BattleReveal data={revealData} />}
        {revealData.mode === "optimize" && <OptimizeReveal data={revealData} />}

        {/* Streak info */}
        {answer.streak > 0 && (
          <div className="flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2 bg-secondary-container px-4 py-1.5 rounded-full shadow-[0_3px_0_0_#893700]">
              <span className="material-symbols-outlined text-secondary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
              <span className="font-label text-on-secondary-container font-bold">{answer.streak}</span>
            </div>
            {answer.multiplier > 1 && (
              <div className="flex items-center gap-2 bg-tertiary-container px-4 py-1.5 rounded-full shadow-[0_3px_0_0_#382490]">
                <span className="font-label text-on-tertiary-container font-bold">x{answer.multiplier}</span>
              </div>
            )}
          </div>
        )}

        {/* Next button */}
        <button
          onClick={onNext}
          className="w-full py-4 bg-primary text-on-primary font-headline font-extrabold rounded-xl shadow-[0px_4px_0px_0px_#004c1e] active:translate-y-1 active:shadow-none transition-all border-b-4 border-primary-dim flex items-center justify-center gap-2"
        >
          {t("next")}
          <span className="material-symbols-outlined">arrow_forward</span>
        </button>
      </div>
    </motion.div>
  );
}
