"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Header from "@/components/Header";
import GameCard from "@/components/GameCard";
import PlayerProgress from "@/components/PlayerProgress";
import { basePath } from "@/lib/basePath";

const gameKeys = ["detective", "arena", "turing", "escape"] as const;

const gameConfig: Record<
  (typeof gameKeys)[number],
  { href: string; comingSoon?: boolean; accentColor: "cyan" | "magenta" | "green" | "purple"; iconSrc: string }
> = {
  detective: { href: "/detective", accentColor: "cyan", iconSrc: `${basePath}/images/games/detective.png` },
  arena: { href: "/arena", accentColor: "magenta", iconSrc: `${basePath}/images/games/arena.png` },
  turing: { href: "/turing", accentColor: "green", iconSrc: `${basePath}/images/games/turing.png` },
  escape: { href: "/escape-room", accentColor: "purple", iconSrc: `${basePath}/images/escape/icon-beginner.png` },
};

export default function Home() {
  const tHub = useTranslations("hub");
  const tGames = useTranslations("games");

  return (
    <>
      <Header />

      {/* Subtle grid background */}
      <div className="bg-grid fixed inset-0 -z-10" />

      <main className="mx-auto w-full max-w-5xl flex-1 px-6 pt-28 pb-16">
        {/* Hero Section */}
        <section className="mb-20 flex flex-col items-center text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-4 text-sm font-semibold tracking-[0.2em] uppercase text-ed-teal"
          >
            Interactive Learning
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display mb-5 text-5xl text-ed-ink sm:text-6xl md:text-7xl"
          >
            {tHub("title")}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="max-w-lg text-lg leading-8 text-ed-ink-muted"
          >
            {tHub("subtitle")}
          </motion.p>

          {/* Decorative divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-8 flex items-center gap-3 origin-center"
          >
            <div className="h-px w-16 bg-ed-border" />
            <div className="h-1.5 w-1.5 rounded-full bg-ed-teal" />
            <div className="h-px w-16 bg-ed-border" />
          </motion.div>
        </section>

        {/* Returning user progress */}
        <PlayerProgress />

        {/* Game Cards Grid */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-20 grid gap-6 sm:grid-cols-2"
        >
          {gameKeys.map((key) => {
            const config = gameConfig[key];
            return (
              <GameCard
                key={key}
                title={tGames(`${key}.name`)}
                description={tGames(`${key}.description`)}
                icon={tGames(`${key}.icon`)}
                iconSrc={config.iconSrc}
                href={config.href}
                comingSoon={config.comingSoon}
                accentColor={config.accentColor}
                comingSoonLabel={tHub("comingSoon")}
              />
            );
          })}
        </motion.section>

        {/* AI IQ Test Link */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-20"
        >
          <a
            href="/ai-iq-test/"
            className="group flex items-center justify-between rounded-2xl border-3 border-[#ffe066] bg-gradient-to-r from-[#fffbea] to-[#fff3c4] p-6 shadow-[0_4px_0_#e6c84a] transition-all duration-200 hover:translate-y-[2px] hover:shadow-[0_2px_0_#e6c84a]"
          >
            <div className="flex items-center gap-4">
              <span className="text-4xl">🧠</span>
              <div>
                <h3 className="font-display text-xl text-[#7a5d00]">
                  AI IQ Test
                </h3>
                <p className="text-sm text-[#a08020]">
                  {tHub("aiIqTestDesc")}
                </p>
              </div>
            </div>
            <span className="text-2xl text-[#c4a020] transition-transform group-hover:translate-x-1">
              →
            </span>
          </a>
        </motion.section>

        {/* Stats Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="flex items-center justify-center gap-3 text-sm tracking-wide text-ed-ink-muted"
        >
          <span>
            {tHub("stats", { games: "4", dimensions: "5", levels: "4" })}
          </span>
        </motion.section>
      </main>
    </>
  );
}
