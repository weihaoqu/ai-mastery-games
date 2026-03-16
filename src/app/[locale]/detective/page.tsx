"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

import { basePath } from "@/lib/basePath";

const tierImages: Record<string, string> = {
  beginner: `${basePath}/images/tiers/beginner.png`,
  intermediate: `${basePath}/images/tiers/intermediate.png`,
  advanced: `${basePath}/images/tiers/advanced.png`,
  expert: `${basePath}/images/tiers/expert.png`,
};

const tierKeys = ["beginner", "intermediate", "advanced", "expert"] as const;

const tierConfig: Record<
  (typeof tierKeys)[number],
  {
    emoji: string;
    active: boolean;
    href: string;
  }
> = {
  beginner: {
    emoji: "\u{1F331}",
    active: true,
    href: "/detective/play?difficulty=beginner",
  },
  intermediate: {
    emoji: "\u{1F4DA}",
    active: true,
    href: "/detective/play?difficulty=intermediate",
  },
  advanced: {
    emoji: "\u26A1",
    active: true,
    href: "/detective/play?difficulty=advanced",
  },
  expert: {
    emoji: "\u{1F525}",
    active: true,
    href: "/detective/play?difficulty=expert",
  },
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

export default function DetectivePage() {
  const t = useTranslations("detective");
  const tDiff = useTranslations("difficulty");

  return (
    <div className="min-h-screen bg-ed-cream">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Back link */}
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-ed-ink-muted transition-colors hover:text-ed-teal"
        >
          <span>&larr;</span> {t("backToHub")}
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <div className="mx-auto mb-4 h-16 w-16 overflow-hidden rounded-xl">
            <Image src={`${basePath}/images/games/detective.png`} alt="" width={64} height={64} className="h-full w-full object-cover" />
          </div>
          <h1 className="mb-3 font-display text-4xl font-bold tracking-tight text-ed-ink sm:text-5xl lg:text-6xl">
            {t("title")}
          </h1>
          <p className="text-lg text-ed-ink-muted sm:text-xl">
            {t("subtitle")}
          </p>
        </motion.div>

        {/* Difficulty grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 gap-5 sm:grid-cols-2"
        >
          {tierKeys.map((key) => {
            const tier = tierConfig[key];
            const inner = (
              <motion.div
                variants={cardVariants}
                whileHover={tier.active ? { scale: 1.03 } : {}}
                whileTap={tier.active ? { scale: 0.98 } : {}}
                className={`relative rounded-xl border bg-ed-card p-6 transition-colors sm:p-8 ${
                  tier.active
                    ? "border-ed-border cursor-pointer hover:border-ed-teal/40 hover:shadow-md"
                    : "border-ed-border cursor-default opacity-60"
                }`}
              >
                {!tier.active && (
                  <span className="absolute right-4 top-4 rounded-full border border-ed-border bg-ed-parchment px-3 py-1 text-xs font-semibold uppercase tracking-wider text-ed-ink-muted">
                    Coming Soon
                  </span>
                )}

                <div className="mb-3 h-16 w-16 overflow-hidden rounded-lg">
                  <Image src={tierImages[key]} alt={key} width={64} height={64} className="h-full w-full object-cover" />
                </div>
                <h2 className="mb-1 font-display text-xl font-bold text-ed-ink">
                  {tDiff(key)}
                </h2>
                <p className="text-sm text-ed-ink-muted">{tDiff(`${key}Desc`)}</p>

                {tier.active && (
                  <div className="mt-4 text-sm font-semibold text-ed-teal">
                    {t("startInvestigation")} &rarr;
                  </div>
                )}
              </motion.div>
            );

            return tier.active ? (
              <Link key={key} href={tier.href}>
                {inner}
              </Link>
            ) : (
              <div key={key}>{inner}</div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
