"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import Header from "@/components/Header";
import { track } from "@/lib/analytics";

const difficulties = ["beginner", "intermediate", "advanced", "expert"] as const;

const diffColor: Record<string, string> = {
  beginner: "bg-primary text-on-primary",
  intermediate: "bg-tertiary text-on-tertiary",
  advanced: "bg-secondary text-on-secondary",
  expert: "bg-error text-on-error",
};

const diffIcon: Record<string, string> = {
  beginner: "kid_star",
  intermediate: "star_half",
  advanced: "star",
  expert: "auto_awesome",
};

export default function HunterPage() {
  const t = useTranslations("hunter");
  const tDiff = useTranslations("difficulty");
  const locale = useLocale();

  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 pt-20 sm:pt-24">
        {/* Header */}
        <section className="flex flex-col items-center text-center mb-10">
          <div className="mb-4 p-4 bg-surface-container-highest rounded-2xl shadow-[4px_4px_0_0_#98b67d]">
            <span className="material-symbols-outlined text-primary text-5xl" style={{ fontVariationSettings: "'opsz' 48" }}>target</span>
          </div>
          <h1 className="font-headline text-4xl md:text-5xl font-extrabold text-on-surface tracking-tight mb-2">
            {t("title")}
          </h1>
          <p className="max-w-xl text-on-surface-variant text-base font-body">
            {t("subtitle")}
          </p>
        </section>

        {/* How to Play */}
        <div className="bg-surface-container-lowest border-2 border-outline-variant rounded-xl p-6 mb-8 shadow-[0_4px_0_0_rgba(152,182,125,1)]">
          <h2 className="font-headline text-lg font-bold text-on-surface mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">help</span>
            {t("howToPlay")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-on-surface-variant">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-error text-xl mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>close</span>
              <p>{t("rule1")}</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-primary text-xl mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
              <p>{t("rule2")}</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-secondary text-xl mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
              <p>{t("rule3")}</p>
            </div>
          </div>
        </div>

        {/* Difficulty Selection */}
        <h2 className="font-headline text-xl font-bold text-on-surface mb-4 text-center">{t("chooseDifficulty")}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
          {difficulties.map((d, i) => (
            <motion.div
              key={d}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.3 }}
            >
              <Link
                href={`/${locale}/hunter/play?difficulty=${d}`}
                onClick={() => track('difficulty_select', { game: 'hunter', difficulty: d })}
                aria-label={`${tDiff(d)} - ${tDiff(`${d}Desc`)}`}
              >
                <div className="group bg-surface-container-lowest p-5 rounded-xl border-2 border-outline-variant shadow-[0_4px_0_0_rgba(152,182,125,1)] hover:shadow-[0_2px_0_0_rgba(152,182,125,1)] hover:translate-y-[2px] transition-all cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${diffColor[d]}`}>
                      <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>{diffIcon[d]}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-headline text-lg font-bold text-on-surface">{tDiff(d)}</h3>
                      <p className="text-sm text-on-surface-variant">{tDiff(`${d}Desc`)}</p>
                    </div>
                    <span className="material-symbols-outlined text-primary text-xl group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </main>
    </>
  );
}
