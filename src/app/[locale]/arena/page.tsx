"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

const modeImages: Record<string, string> = {
  critique: "/images/arena/critique.png",
  battle: "/images/arena/battle.png",
  optimize: "/images/arena/optimize.png",
};

const modes = ["critique", "battle", "optimize"] as const;

const modeConfig: Record<(typeof modes)[number], { href: string }> = {
  critique: { href: "/arena/critique" },
  battle: { href: "/arena/battle" },
  optimize: { href: "/arena/optimize" },
};

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export default function ArenaPage() {
  const t = useTranslations("arena");
  const tMode = useTranslations("arenaMode");

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
            <Image src="/images/games/arena.png" alt="" width={64} height={64} className="h-full w-full object-cover" />
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
          className="grid grid-cols-1 gap-5 sm:grid-cols-3"
        >
          {modes.map((mode) => {
            const config = modeConfig[mode];
            return (
              <Link key={mode} href={config.href}>
                <motion.div
                  variants={cardVariants}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative rounded-xl border border-ed-border bg-ed-card p-6 transition-colors hover:border-ed-teal/40 hover:shadow-md cursor-pointer sm:p-8"
                >
                  <div className="mb-3 h-16 w-16 overflow-hidden rounded-lg">
                    <Image src={modeImages[mode]} alt={mode} width={64} height={64} className="h-full w-full object-cover" />
                  </div>
                  <h2 className="mb-1 font-display text-xl font-bold text-ed-ink">
                    {tMode(mode)}
                  </h2>
                  <p className="text-sm text-ed-ink-muted">{tMode(`${mode}Desc`)}</p>
                  <div className="mt-4 text-sm font-semibold text-ed-teal">
                    {t("selectMode")} &rarr;
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
