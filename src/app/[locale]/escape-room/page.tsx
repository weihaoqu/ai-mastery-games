"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import type { Difficulty } from "@/lib/types";
import Header from "@/components/Header";
import { track } from "@/lib/analytics";

const difficulties: Difficulty[] = ["beginner", "intermediate", "advanced", "expert"];

const timeLimits: Record<Difficulty, number> = {
  beginner: 15,
  intermediate: 12,
  advanced: 10,
  expert: 8,
};

const tierConfig: Record<Difficulty, { emoji: string; tier: string; tagColor: string; tagLabel: string; btnBg: string }> = {
  beginner: {
    emoji: "🌱",
    tier: "TIER 01",
    tagColor: "text-primary",
    tagLabel: "Warm up",
    btnBg: "bg-primary text-on-primary shadow-[4px_4px_0_0_#004c1e]",
  },
  intermediate: {
    emoji: "📚",
    tier: "TIER 02",
    tagColor: "text-tertiary",
    tagLabel: "Puzzle solver",
    btnBg: "bg-tertiary text-on-tertiary shadow-[4px_4px_0_0_#2f1887]",
  },
  advanced: {
    emoji: "⚡",
    tier: "TIER 03",
    tagColor: "text-secondary",
    tagLabel: "Code breaker",
    btnBg: "bg-secondary text-on-secondary shadow-[4px_4px_0_0_#5c2300]",
  },
  expert: {
    emoji: "🔥",
    tier: "TIER 04",
    tagColor: "text-error",
    tagLabel: "Master escape",
    btnBg: "bg-error text-on-error shadow-[4px_4px_0_0_#520c00]",
  },
};

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export default function EscapeRoomPage() {
  const t = useTranslations("escape");
  const tScenario = useTranslations("escapeScenario");

  return (
    <>
      <Header />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 pt-20 sm:pt-24">
        {/* Header */}
        <section className="flex flex-col items-center text-center mb-16">
          <div className="mb-6 p-6 bg-surface-container-highest rounded-3xl shadow-[4px_4px_0_0_#98b67d] relative">
            <span className="material-symbols-outlined text-tertiary text-4xl sm:text-6xl" style={{ fontVariationSettings: "'opsz' 48" }}>lock</span>
          </div>
          <h1 className="font-headline text-3xl sm:text-5xl md:text-6xl font-extrabold text-on-surface tracking-tight mb-4">
            {t("title")}
          </h1>
          <p className="max-w-2xl text-on-surface-variant text-lg font-body leading-relaxed">
            {t("subtitle")}
          </p>
        </section>

        {/* Difficulty Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20"
        >
          {difficulties.map((difficulty) => {
            const tier = tierConfig[difficulty];
            return (
              <Link key={difficulty} href={`/escape-room/play?difficulty=${difficulty}`} onClick={() => track('difficulty_select', { game: 'escape', difficulty })}>
                <motion.div
                  variants={cardVariants}
                  className="tactile-card group bg-surface-container-lowest p-8 rounded-[2rem] border-2 border-outline-variant shadow-[6px_6px_0_0_#98b67d] hover:shadow-[2px_2px_0_0_#98b67d] hover:translate-x-[4px] hover:translate-y-[4px] cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="bg-surface-container p-4 rounded-2xl group-hover:bg-tertiary/10 transition-colors">
                      <span className="text-4xl">{tier.emoji}</span>
                    </div>
                    <span className="font-label text-xs font-bold px-3 py-1 bg-surface-container text-on-surface-variant rounded-full tracking-widest uppercase">
                      {tier.tier}
                    </span>
                  </div>
                  <h3 className="font-headline text-2xl font-bold text-on-surface mb-2">
                    {tScenario(difficulty)}
                  </h3>
                  <p className="font-body text-on-surface-variant mb-4 min-h-[48px]">
                    {tScenario(`${difficulty}Desc`)}
                  </p>
                  {/* Time limit */}
                  <div className="flex items-center gap-2 mb-6 text-on-surface-variant">
                    <span className="material-symbols-outlined text-lg">timer</span>
                    <span className="font-label text-xs font-bold">{timeLimits[difficulty]} MIN</span>
                  </div>
                  <div className="flex items-center justify-between mt-auto">
                    <span className={`font-label text-sm font-semibold ${tier.tagColor}`}>
                      {tier.tagLabel}
                    </span>
                    <span className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm ${tier.btnBg} hover:opacity-90 transition-all active:scale-95`}>
                      {t("selectScenario") || "Enter"}
                      <span className="material-symbols-outlined">arrow_forward</span>
                    </span>
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </motion.div>
      </main>
    </>
  );
}
