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
  "bg-ed-teal/15 border-ed-teal/40",
  "bg-purple-100 border-purple-300",
  "bg-amber-100 border-amber-300",
  "bg-rose-100 border-rose-300",
  "bg-blue-100 border-blue-300",
  "bg-emerald-100 border-emerald-300",
  "bg-orange-100 border-orange-300",
  "bg-cyan-100 border-cyan-300",
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

  // Map: term -> definition (user's pairing)
  const [pairs, setPairs] = useState<Map<string, string>>(new Map());
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null);
  const [result, setResult] = useState<Map<string, boolean> | null>(null);

  const pairedDefinitions = new Set(pairs.values());

  function handleTermClick(term: string) {
    if (result) return;
    // If already paired, unpair
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
    // If this def is already paired, unpair it
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
    <div className="flex flex-col gap-5">
      {/* Instruction */}
      <div className="rounded-lg border border-ed-border bg-ed-parchment p-4">
        <p className="text-sm leading-relaxed text-ed-ink">
          {puzzle.instruction}
        </p>
      </div>

      <p className="text-center text-xs text-ed-ink-muted">
        {t("matchPairs")}
      </p>

      {/* Two columns */}
      <div className="grid grid-cols-2 gap-3">
        {/* Terms (left) */}
        <div className="space-y-2">
          {puzzle.pairs.map((pair) => {
            const isPaired = pairs.has(pair.term);
            const isSelected = selectedTerm === pair.term;
            const isCorrect = result?.get(pair.term);

            return (
              <motion.button
                key={pair.term}
                onClick={() => handleTermClick(pair.term)}
                whileHover={{ scale: 1.02 }}
                className={`w-full rounded-lg border p-3 text-left text-sm transition-all ${
                  result
                    ? isCorrect
                      ? "border-ed-success/40 bg-ed-success/10"
                      : "border-ed-error/40 bg-ed-error/10"
                    : isSelected
                      ? "border-ed-teal bg-ed-teal/10 ring-2 ring-ed-teal/20"
                      : isPaired
                        ? getColorForTerm(pair.term)
                        : "border-ed-border bg-ed-card hover:border-ed-teal/30"
                }`}
              >
                {pair.term}
              </motion.button>
            );
          })}
        </div>

        {/* Definitions (right, shuffled) */}
        <div className="space-y-2">
          {shuffledDefinitions.map((def) => {
            const color = getColorForDef(def);
            const isPaired = pairedDefinitions.has(def);

            // Check result for this def
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
                className={`w-full rounded-lg border p-3 text-left text-sm transition-all ${
                  result
                    ? defResult === true
                      ? "border-ed-success/40 bg-ed-success/10"
                      : defResult === false
                        ? "border-ed-error/40 bg-ed-error/10"
                        : "border-ed-border bg-ed-card"
                    : isPaired && color
                      ? color
                      : "border-ed-border bg-ed-card hover:border-ed-teal/30"
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
          className="w-full rounded-lg border border-ed-teal/40 bg-ed-teal/10 px-6 py-3 font-sans text-sm font-bold text-ed-teal transition-all hover:bg-ed-teal/20 hover:shadow-[0_0_15px_rgba(13,115,119,0.15)] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {t("submit")}
        </button>
      )}
    </div>
  );
}
