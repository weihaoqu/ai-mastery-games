"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import type { ArenaMode } from "@/lib/types";

const VALID_MODES = new Set<string>(["critique", "battle", "optimize"]);

const tierKeys = ["beginner", "intermediate", "advanced", "expert"] as const;

const tierEmojis: Record<(typeof tierKeys)[number], string> = {
  beginner: "\u{1F331}",
  intermediate: "\u{1F4DA}",
  advanced: "\u26A1",
  expert: "\u{1F525}",
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export default function ArenaDifficultyPage() {
  const params = useParams<{ mode: string }>();
  const mode = params.mode as ArenaMode;
  const t = useTranslations("arena");
  const tMode = useTranslations("arenaMode");
  const tDiff = useTranslations("difficulty");

  if (!VALID_MODES.has(mode)) {
    return null;
  }

  return (
    <div className="min-h-screen bg-ed-cream">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Back link */}
        <Link
          href="/arena"
          className="mb-8 inline-flex items-center gap-2 text-sm text-ed-ink-muted transition-colors hover:text-ed-teal"
        >
          <span>&larr;</span> {t("backToArena")}
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h1 className="mb-3 font-display text-4xl font-bold tracking-tight text-ed-ink sm:text-5xl lg:text-6xl">
            {tMode(`${mode}Icon`)} {tMode(mode)}
          </h1>
          <p className="text-lg text-ed-ink-muted sm:text-xl">
            {tMode(`${mode}Desc`)}
          </p>
        </motion.div>

        {/* Difficulty grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 gap-5 sm:grid-cols-2"
        >
          {tierKeys.map((key) => (
            <Link key={key} href={`/arena/${mode}/play?difficulty=${key}`}>
              <motion.div
                variants={cardVariants}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="relative rounded-xl border border-ed-border bg-ed-card p-6 transition-colors hover:border-ed-teal/40 hover:shadow-md cursor-pointer sm:p-8"
              >
                <div className="mb-3 text-4xl">{tierEmojis[key]}</div>
                <h2 className="mb-1 font-display text-xl font-bold text-ed-ink">
                  {tDiff(key)}
                </h2>
                <p className="text-sm text-ed-ink-muted">{tDiff(`${key}Desc`)}</p>
                <div className="mt-4 text-sm font-semibold text-ed-teal">
                  {t("startChallenge")} &rarr;
                </div>
              </motion.div>
            </Link>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
