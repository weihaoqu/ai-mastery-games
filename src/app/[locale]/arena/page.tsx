"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Header from "@/components/Header";

const modes = [
  {
    key: "critique",
    icon: "trophy",
    href: "/arena/critique",
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
    btnBg: "bg-primary text-on-primary",
  },
  {
    key: "battle",
    icon: "swords",
    href: "/arena/battle",
    iconBg: "bg-secondary/10",
    iconColor: "text-secondary",
    btnBg: "bg-secondary text-on-secondary",
  },
  {
    key: "optimize",
    icon: "build",
    href: "/arena/optimize",
    iconBg: "bg-tertiary/10",
    iconColor: "text-tertiary",
    btnBg: "bg-tertiary text-on-tertiary",
  },
];

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
    <>
      <Header />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 pt-20 sm:pt-24">
        {/* Back link */}
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm text-on-surface-variant transition-colors hover:text-primary font-label"
        >
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          Back to Hub
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center">
              <span className="material-symbols-outlined text-5xl text-secondary">swords</span>
            </div>
            <div>
              <h1 className="font-headline text-4xl md:text-5xl font-extrabold text-on-surface tracking-tight">
                {t("title")}
              </h1>
            </div>
          </div>
          <p className="text-on-surface-variant text-lg max-w-2xl">
            {t("subtitle")}
          </p>
        </motion.div>

        {/* Mode Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
        >
          {modes.map((mode) => (
            <Link key={mode.key} href={mode.href}>
              <motion.div
                variants={cardVariants}
                className="tactile-card bg-surface-container-lowest p-6 rounded-xl outline outline-3 outline-outline-variant shadow-[6px_6px_0_0_rgba(152,182,125,1)] hover:shadow-[2px_2px_0_0_rgba(152,182,125,1)] hover:translate-y-[4px] cursor-pointer h-full flex flex-col"
              >
                <div className={`w-14 h-14 ${mode.iconBg} rounded-xl flex items-center justify-center mb-6`}>
                  <span className={`material-symbols-outlined text-3xl ${mode.iconColor}`}>{mode.icon}</span>
                </div>
                <h3 className="font-headline text-2xl font-bold text-on-surface mb-2">
                  {tMode(mode.key)}
                </h3>
                <p className="text-on-surface-variant text-sm mb-8 flex-1">
                  {tMode(`${mode.key}Desc`)}
                </p>
                <span className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm ${mode.btnBg} hover:opacity-90 transition-all active:scale-95 w-full`}>
                  Select
                  <span className="material-symbols-outlined">arrow_forward</span>
                </span>
              </motion.div>
            </Link>
          ))}
        </motion.div>
      </main>
    </>
  );
}
