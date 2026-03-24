"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import type { MatchConceptsPuzzle } from "@/lib/types";

interface MatchPuzzleProps {
  puzzle: MatchConceptsPuzzle;
  onSolve: (correct: boolean) => void;
}

const PAIR_COLORS = [
  "bg-primary-container/30 border-primary/40",
  "bg-tertiary-container/30 border-tertiary/40",
  "bg-secondary-container/30 border-secondary/40",
  "bg-surface-container-high border-outline",
  "bg-primary-container/20 border-primary/30",
  "bg-tertiary-container/20 border-tertiary/30",
  "bg-secondary-container/20 border-secondary/30",
  "bg-surface-container border-outline-variant",
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function MatchPuzzleComponent({
  puzzle,
  onSolve,
}: MatchPuzzleProps) {
  const t = useTranslations("escape");

  const shuffledDefinitions = useMemo(
    () => shuffle(puzzle.pairs.map((p) => p.definition)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [puzzle.instruction],
  );

  const [pairs, setPairs] = useState<Map<string, string>>(new Map());
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null);
  const [result, setResult] = useState<Map<string, boolean> | null>(null);

  const pairedDefinitions = new Set(pairs.values());

  function handleTermClick(term: string) {
    if (result) return;
    if (pairs.has(term)) {
      setPairs((prev) => {
        const next = new Map(prev);
        next.delete(term);
        return next;
      });
      setSelectedTerm(null);
      return;
    }
    setSelectedTerm(term);
  }

  function handleDefClick(def: string) {
    if (result) return;
    if (pairedDefinitions.has(def)) {
      setPairs((prev) => {
        const next = new Map(prev);
        for (const [k, v] of next) {
          if (v === def) {
            next.delete(k);
            break;
          }
        }
        return next;
      });
      return;
    }

    if (!selectedTerm) return;

    setPairs((prev) => {
      const next = new Map(prev);
      next.set(selectedTerm, def);
      return next;
    });
    setSelectedTerm(null);
  }

  function getColorForTerm(term: string): string {
    const terms = puzzle.pairs.map((p) => p.term);
    const idx = terms.indexOf(term);
    return PAIR_COLORS[idx % PAIR_COLORS.length];
  }

  function getColorForDef(def: string): string | null {
    for (const [term, d] of pairs) {
      if (d === def) return getColorForTerm(term);
    }
    return null;
  }

  function handleSubmit() {
    const results = new Map<string, boolean>();
    for (const pair of puzzle.pairs) {
      const userDef = pairs.get(pair.term);
      results.set(pair.term, userDef === pair.definition);
    }
    setResult(results);

    const allCorrect = [...results.values()].every(Boolean);
    setTimeout(() => {
      onSolve(allCorrect);
    }, 1500);
  }

  const allPaired = pairs.size === puzzle.pairs.length;

  return (
    <div className="flex flex-col gap-6">
      {/* Instruction */}
      <div className="space-y-2">
        <p className="text-base font-medium leading-relaxed text-on-surface">
          {puzzle.instruction}
        </p>
        <span className="inline-flex px-3 py-1 bg-tertiary-container text-on-tertiary-container rounded-full text-xs font-label uppercase tracking-widest font-bold">
          {t("matchPairs")}
        </span>
      </div>

      {/* Two columns */}
      <div className="grid grid-cols-2 gap-3">
        {/* Terms (left) */}
        <div className="space-y-3">
          {puzzle.pairs.map((pair) => {
            const isPaired = pairs.has(pair.term);
            const isSelected = selectedTerm === pair.term;
            const isCorrect = result?.get(pair.term);

            return (
              <motion.button
                key={pair.term}
                onClick={() => handleTermClick(pair.term)}
                whileHover={{ scale: 1.02 }}
                className={`w-full rounded-xl border-b-4 p-3 text-left text-sm font-medium transition-all ${
                  result
                    ? isCorrect
                      ? "border-primary/40 bg-primary-container/30"
                      : "border-error/40 bg-error/10"
                    : isSelected
                      ? "border-primary bg-primary-container/30 ring-2 ring-primary/20"
                      : isPaired
                        ? getColorForTerm(pair.term)
                        : "border-outline-variant bg-surface-container-lowest hover:border-primary/30"
                }`}
              >
                {pair.term}
              </motion.button>
            );
          })}
        </div>

        {/* Definitions (right, shuffled) */}
        <div className="space-y-3">
          {shuffledDefinitions.map((def) => {
            const color = getColorForDef(def);
            const isPaired = pairedDefinitions.has(def);

            let defResult: boolean | null = null;
            if (result) {
              for (const [term, d] of pairs) {
                if (d === def) {
                  defResult = result.get(term) ?? null;
                  break;
                }
              }
            }

            return (
              <motion.button
                key={def}
                onClick={() => handleDefClick(def)}
                whileHover={{ scale: 1.02 }}
                className={`w-full rounded-xl border-b-4 p-3 text-left text-sm transition-all ${
                  result
                    ? defResult === true
                      ? "border-primary/40 bg-primary-container/30"
                      : defResult === false
                        ? "border-error/40 bg-error/10"
                        : "border-outline-variant bg-surface-container-lowest"
                    : isPaired && color
                      ? color
                      : "border-outline-variant bg-surface-container-lowest hover:border-primary/30"
                }`}
              >
                {def}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Submit */}
      {!result && (
        <button
          onClick={handleSubmit}
          disabled={!allPaired}
          className="w-full py-4 bg-primary text-on-primary font-headline font-extrabold rounded-xl shadow-[0px_4px_0px_0px_#004c1e] active:translate-y-1 active:shadow-none transition-all border-b-4 border-primary-dim disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {t("submit")}
        </button>
      )}
    </div>
  );
}
