"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Header from "@/components/Header";
import { beginnerCases } from "@/data/detective/beginner";
import { intermediateCases } from "@/data/detective/intermediate";
import { advancedCases } from "@/data/detective/advanced";
import { expertCases } from "@/data/detective/expert";
import type { Case } from "@/lib/types";
import { track } from "@/lib/analytics";

const difficulties = ["beginner", "intermediate", "advanced", "expert"] as const;

const casesByDifficulty: Record<string, Case[]> = {
  beginner: beginnerCases,
  intermediate: intermediateCases,
  advanced: advancedCases,
  expert: expertCases,
};

const typeIcon: Record<Case["type"], string> = {
  hallucination: "psychology",
  bias: "balance",
  "prompt-injection": "shield",
  ethics: "gavel",
};

const typeColor: Record<Case["type"], string> = {
  hallucination: "bg-teal-100 text-teal-800 border-teal-300",
  bias: "bg-orange-100 text-orange-800 border-orange-300",
  "prompt-injection": "bg-emerald-100 text-emerald-800 border-emerald-300",
  ethics: "bg-amber-100 text-amber-800 border-amber-300",
};

const diffColor: Record<string, string> = {
  beginner: "bg-primary text-on-primary",
  intermediate: "bg-tertiary text-on-tertiary",
  advanced: "bg-secondary text-on-secondary",
  expert: "bg-error text-on-error",
};

function getCompletedCases(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem("detective-completed");
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

export default function DetectivePage() {
  const t = useTranslations("detective");
  const tDiff = useTranslations("difficulty");
  const tCase = useTranslations("caseType");
  const [activeDiff, setActiveDiff] = useState<string>("beginner");
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  useEffect(() => {
    setCompleted(getCompletedCases());
    const handler = () => setCompleted(getCompletedCases());
    window.addEventListener("focus", handler);
    return () => window.removeEventListener("focus", handler);
  }, []);

  const cases = casesByDifficulty[activeDiff] || [];
  const completedCount = cases.filter((c) => completed.has(c.id)).length;

  return (
    <>
      <Header />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 pt-20 sm:pt-24">
        {/* Header */}
        <section className="flex flex-col items-center text-center mb-10">
          <div className="mb-4 p-4 bg-surface-container-highest rounded-2xl shadow-[4px_4px_0_0_#98b67d]">
            <span className="material-symbols-outlined text-primary text-5xl" style={{ fontVariationSettings: "'opsz' 48" }}>search_check</span>
          </div>
          <h1 className="font-headline text-4xl md:text-5xl font-extrabold text-on-surface tracking-tight mb-2">
            {t("title")}
          </h1>
          <p className="max-w-xl text-on-surface-variant text-base font-body">
            {t("subtitle")}
          </p>
        </section>

        {/* Difficulty Tabs */}
        <div className="flex justify-center gap-2 mb-3 flex-wrap">
          {difficulties.map((d) => (
            <button
              key={d}
              onClick={() => setActiveDiff(d)}
              className={`px-5 py-2 rounded-full font-label text-sm font-bold transition-all ${
                activeDiff === d
                  ? `${diffColor[d]} shadow-md scale-105`
                  : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
              }`}
            >
              {tDiff(d)}
            </button>
          ))}
        </div>

        {/* Progress */}
        <p className="text-center text-sm text-on-surface-variant mb-8 font-label">
          {completedCount}/{cases.length} {t("completed")}
        </p>

        {/* Case Grid */}
        <motion.div
          key={activeDiff}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-16"
        >
          {cases.map((c, i) => {
            const isDone = completed.has(c.id);
            const excerpt = c.briefing.length > 100 ? c.briefing.slice(0, 100) + "..." : c.briefing;
            return (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.3 }}
              >
                <Link href={`/detective/play?case=${c.id}`} onClick={() => track('difficulty_select', { game: 'detective', difficulty: activeDiff })}>
                  <div className={`group relative bg-surface-container-lowest p-5 rounded-xl border-2 transition-all cursor-pointer h-full flex flex-col ${
                    isDone
                      ? "border-primary/30 shadow-[0_3px_0_0_rgba(0,106,45,0.3)]"
                      : "border-outline-variant shadow-[0_4px_0_0_rgba(152,182,125,1)] hover:shadow-[0_2px_0_0_rgba(152,182,125,1)] hover:translate-y-[2px]"
                  }`}>
                    {isDone && (
                      <div className="absolute top-3 right-3">
                        <span className="material-symbols-outlined text-primary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                      </div>
                    )}

                    {/* Type badge */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-xs font-bold ${typeColor[c.type]}`}>
                        <span className="material-symbols-outlined text-sm">{typeIcon[c.type]}</span>
                        {tCase(c.type)}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-headline text-lg font-bold text-on-surface mb-2 leading-snug">
                      {c.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-sm text-on-surface-variant leading-relaxed flex-1 mb-4">
                      {excerpt}
                    </p>

                    {/* CTA */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-label text-on-surface-variant">{t("estimatedTime")}</span>
                      <span className="text-primary font-bold text-sm font-label group-hover:gap-3 flex items-center gap-1 transition-all">
                        {isDone ? t("replay") : t("investigateCase")}
                        <span className="material-symbols-outlined text-base">arrow_forward</span>
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </main>
    </>
  );
}
