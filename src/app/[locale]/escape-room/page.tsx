"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import type { Difficulty } from "@/lib/types";

const difficulties: Difficulty[] = ["beginner", "intermediate", "advanced", "expert"];

const timeLimits: Record<Difficulty, number> = {
  beginner: 15,
  intermediate: 12,
  advanced: 10,
  expert: 8,
};

const roomIcons: Record<Difficulty, string> = {
  beginner: "/images/escape/icon-beginner.png",
  intermediate: "/images/escape/icon-intermediate.png",
  advanced: "/images/escape/icon-advanced.png",
  expert: "/images/escape/icon-expert.png",
};

const difficultyColors: Record<Difficulty, string> = {
  beginner: "bg-emerald-100 text-emerald-700",
  intermediate: "bg-amber-100 text-amber-700",
  advanced: "bg-orange-100 text-orange-700",
  expert: "bg-red-100 text-red-700",
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
    <div className="min-h-screen bg-ed-cream">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-ed-ink-muted transition-colors hover:text-ed-teal"
        >
          <span>&larr;</span> {t("backToHub")}
        </Link>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <div className="mx-auto mb-4 h-16 w-16 overflow-hidden rounded-xl">
            <Image src="/images/escape/icon-beginner.png" alt="" width={64} height={64} className="h-full w-full object-cover" />
          </div>
          <h1 className="mb-3 font-display text-4xl font-bold tracking-tight text-ed-ink sm:text-5xl lg:text-6xl">
            {t("title")}
          </h1>
          <p className="text-lg text-ed-ink-muted sm:text-xl">{t("subtitle")}</p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 gap-5 sm:grid-cols-2"
        >
          {difficulties.map((difficulty) => (
            <Link key={difficulty} href={`/escape-room/play?difficulty=${difficulty}`}>
              <motion.div
                variants={cardVariants}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="relative rounded-xl border border-ed-border bg-ed-card p-6 transition-colors hover:border-ed-teal/40 hover:shadow-md cursor-pointer sm:p-8"
              >
                {/* Difficulty badge */}
                <span
                  className={`absolute top-4 right-4 rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${difficultyColors[difficulty]}`}
                >
                  {difficulty}
                </span>

                <div className="mb-3 overflow-hidden rounded-lg w-20 h-20 sm:w-24 sm:h-24">
                  <Image
                    src={roomIcons[difficulty]}
                    alt={tScenario(difficulty)}
                    width={96}
                    height={96}
                    className="h-full w-full object-cover"
                  />
                </div>
                <h2 className="mb-1 font-display text-xl font-bold text-ed-ink">
                  {tScenario(difficulty)}
                </h2>
                <p className="text-sm text-ed-ink-muted">{tScenario(`${difficulty}Desc`)}</p>

                {/* Time limit badge */}
                <div className="mt-4 flex items-center gap-3">
                  <span className="inline-flex items-center gap-1 rounded-full bg-ed-parchment px-3 py-1 text-xs font-medium text-ed-ink-muted">
                    {"\u23F1\uFE0F"} {timeLimits[difficulty]} min
                  </span>
                  <span className="text-sm font-semibold text-ed-teal">
                    {t("selectScenario")} &rarr;
                  </span>
                </div>
              </motion.div>
            </Link>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
