"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Header from "@/components/Header";
import Link from "next/link";
import { getSessions } from "@/lib/storage";
import { basePath } from "@/lib/basePath";
import type { SessionResult } from "@/lib/types";

const gameHotspots = [
  {
    key: "detective",
    href: "/detective",
    icon: "search",
    image: "/images/icons/detective.png",
    borderColor: "border-primary",
    shadowColor: "shadow-[6px_6px_0_0_#006a2d]",
    hoverShadow: "group-hover:shadow-[8px_8px_0_0_#006a2d]",
    badgeBg: "bg-primary",
    position: "bottom-[28%] left-[12%]",
    size: "w-28 h-32",
    iconColor: "text-primary",
  },
  {
    key: "arena",
    href: "/arena",
    icon: "swords",
    image: "/images/icons/arena.png",
    borderColor: "border-secondary",
    shadowColor: "shadow-[8px_8px_0_0_#9b3f00]",
    hoverShadow: "group-hover:shadow-[10px_10px_0_0_#9b3f00]",
    badgeBg: "bg-primary",
    position: "top-[30%] left-[38%]",
    size: "w-32 h-36",
    iconColor: "text-secondary",
  },
  {
    key: "turing",
    href: "/turing",
    icon: "smart_toy",
    image: "/images/icons/turing.png",
    borderColor: "border-primary",
    shadowColor: "shadow-[6px_6px_0_0_#006a2d]",
    hoverShadow: "group-hover:shadow-[8px_8px_0_0_#006a2d]",
    badgeBg: "bg-primary",
    position: "bottom-[12%] right-[15%]",
    size: "w-28 h-32",
    iconColor: "text-primary",
  },
  {
    key: "escape",
    href: "/escape-room",
    icon: "lock",
    image: "/images/icons/escape.png",
    borderColor: "border-tertiary",
    shadowColor: "shadow-[10px_10px_0_0_#5b4bb4]",
    hoverShadow: "group-hover:shadow-[12px_12px_0_0_#5b4bb4]",
    badgeBg: "bg-tertiary",
    position: "top-[10%] right-[12%]",
    size: "w-32 h-40",
    iconColor: "text-tertiary",
    specialShape: true,
  },
];

export default function Home() {
  const tHub = useTranslations("hub");
  const tGames = useTranslations("games");
  const [completedGames, setCompletedGames] = useState<Set<string>>(new Set());
  const [gamesPlayed, setGamesPlayed] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const sessions = getSessions();
    const played = new Set<string>();
    for (const s of sessions) {
      played.add(s.game);
    }
    setCompletedGames(played);
    setGamesPlayed(played.size);
    setLoaded(true);
  }, []);

  return (
    <>
      <Header />

      <main className="relative w-full max-w-7xl mx-auto px-4 md:px-8 pt-20 pb-24">
        {/* Interactive Village Map */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative aspect-[16/10] md:aspect-[21/9] w-full bg-surface-container-low rounded-[2rem] border-4 border-outline-variant overflow-hidden shadow-inner mt-8"
          style={{
            backgroundImage: "radial-gradient(#98b67d 0.5px, transparent 0.5px)",
            backgroundSize: "24px 24px",
          }}
        >
          {/* Map Decorative Blurs */}
          <div className="absolute top-1/4 left-1/3 w-32 h-16 bg-surface-container-high rounded-full blur-3xl opacity-50" />
          <div className="absolute bottom-1/4 right-1/4 w-48 h-24 bg-primary-container rounded-full blur-3xl opacity-30" />

          {/* SVG Dashed Paths connecting game locations */}
          <svg className="absolute inset-0 w-full h-full opacity-25 pointer-events-none" viewBox="0 0 1000 500">
            {/* Detective → Arena */}
            <path d="M180,360 Q300,300 420,200" fill="none" stroke="#627f4c" strokeDasharray="12 8" strokeWidth="3" />
            {/* Arena → Escape */}
            <path d="M500,180 Q650,120 800,100" fill="none" stroke="#627f4c" strokeDasharray="12 8" strokeWidth="3" />
            {/* Arena → Turing */}
            <path d="M500,250 Q600,380 780,400" fill="none" stroke="#627f4c" strokeDasharray="12 8" strokeWidth="3" />
            {/* Detective → Turing */}
            <path d="M200,380 Q450,450 760,420" fill="none" stroke="#627f4c" strokeDasharray="8 12" strokeWidth="2" />
          </svg>

          {/* Floating Progress Indicator */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="absolute top-6 left-6 z-20 hidden lg:block"
          >
            <div className="bg-surface-container-lowest border-2 border-outline-variant p-5 rounded-xl shadow-[4px_4px_0_0_#98b67d] max-w-xs">
              <div className="font-label text-xs uppercase tracking-[0.2em] text-on-surface-variant mb-1">
                {tHub("heroLabel")}
              </div>
              <h2 className="font-headline text-xl font-extrabold text-on-surface leading-tight mb-3">
                {tHub("title")}
              </h2>
              <div className="flex items-center gap-3 mb-2">
                <div className="flex-1 h-3 bg-surface-container rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-700"
                    style={{ width: `${(gamesPlayed / 4) * 100}%` }}
                  />
                </div>
                <span className="font-label font-bold text-primary">{gamesPlayed}/4</span>
              </div>
              <p className="text-xs text-on-surface-variant italic">
                {tHub("subtitle")}
              </p>
            </div>
          </motion.div>

          {/* Game Hotspots */}
          {gameHotspots.map((spot, i) => {
            const isCompleted = loaded && completedGames.has(spot.key);
            return (
              <motion.div
                key={spot.key}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
                className={`absolute ${spot.position} group`}
              >
                <Link href={spot.href}>
                  <div className="relative cursor-pointer transform hover:-translate-y-3 hover:scale-105 transition-all duration-300">

                    {/* Hotspot Card */}
                    {spot.specialShape ? (
                      <div className={`${spot.size} bg-tertiary-container border-4 ${spot.borderColor} rounded-t-[3rem] rounded-b-xl flex flex-col items-center justify-center ${spot.shadowColor} ${spot.hoverShadow} transition-shadow overflow-hidden`}>
                        <img src={`${basePath}${spot.image}`} alt={spot.key} className="w-20 h-20 object-contain drop-shadow-md" />
                        <p className="mt-1 font-label text-[9px] font-bold uppercase tracking-widest text-on-tertiary-container opacity-80 text-center px-2 leading-tight">
                          {tGames(`${spot.key}.name`)}
                        </p>
                      </div>
                    ) : (
                      <div className={`${spot.size} bg-surface-container-lowest border-3 ${spot.borderColor} rounded-2xl flex flex-col items-center justify-center ${spot.shadowColor} ${spot.hoverShadow} transition-shadow overflow-hidden`}>
                        <img src={`${basePath}${spot.image}`} alt={spot.key} className="w-16 h-16 object-contain drop-shadow-md" />
                        <p className="mt-1 font-label text-[9px] font-bold uppercase tracking-widest text-on-surface-variant text-center px-2 leading-tight">
                          {tGames(`${spot.key}.name`)}
                        </p>
                      </div>
                    )}

                    {/* Completion Badge */}
                    {isCompleted && (
                      <div className={`absolute -bottom-2 -right-2 ${spot.badgeBg} text-on-primary w-8 h-8 rounded-full flex items-center justify-center border-2 border-surface shadow-sm`}>
                        <span className="material-symbols-outlined text-sm">check</span>
                      </div>
                    )}
                  </div>
                </Link>
              </motion.div>
            );
          })}

          {/* Map Coordinates */}
          <div className="absolute bottom-4 left-6 font-label text-[10px] tracking-widest text-on-surface/40 uppercase hidden md:block">
            AI Mastery Village // Sector 4B // Interactive Map
          </div>

          {/* Zoom Controls */}
          <div className="absolute bottom-4 right-6 flex gap-2 hidden md:flex">
            <button className="w-10 h-10 bg-surface-container-lowest border-2 border-outline-variant rounded-lg flex items-center justify-center hover:bg-surface-bright transition-colors">
              <span className="material-symbols-outlined text-on-surface text-sm">add</span>
            </button>
            <button className="w-10 h-10 bg-surface-container-lowest border-2 border-outline-variant rounded-lg flex items-center justify-center hover:bg-surface-bright transition-colors">
              <span className="material-symbols-outlined text-on-surface text-sm">remove</span>
            </button>
          </div>
        </motion.div>

        {/* Mobile Map Label (shows game names since hotspots are small on mobile) */}
        <div className="md:hidden mt-4 grid grid-cols-2 gap-3">
          {gameHotspots.map((spot) => {
            const isCompleted = loaded && completedGames.has(spot.key);
            return (
              <Link key={spot.key} href={spot.href}>
                <div className={`bg-surface-container-lowest border-2 border-outline-variant rounded-xl p-4 flex items-center gap-3 shadow-[4px_4px_0_0_#98b67d] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_#98b67d] transition-all ${isCompleted ? "opacity-80" : ""}`}>
                  <img src={`${basePath}${spot.image}`} alt={spot.key} className="w-10 h-10 object-contain" />
                  <div className="flex-1 min-w-0">
                    <p className="font-headline font-bold text-on-surface text-sm truncate">{tGames(`${spot.key}.name`)}</p>
                    <p className="font-label text-[10px] text-on-surface-variant uppercase tracking-wider">
                      {tGames(`${spot.key}.cta`)}
                    </p>
                  </div>
                  {isCompleted && (
                    <span className="material-symbols-outlined text-primary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        {/* Village Chronicles Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 items-start"
        >
          <div className="md:col-span-2 space-y-6">
            <h3 className="font-headline text-3xl font-extrabold text-on-surface tracking-tight">
              {tHub("hubName")}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Stats Card */}
              <div className="p-6 bg-surface-container-highest rounded-2xl border-2 border-transparent hover:border-outline-variant transition-all">
                <div className="flex items-center gap-4 mb-3">
                  <span className="material-symbols-outlined text-secondary">history</span>
                  <span className="font-label text-sm uppercase tracking-wider text-secondary">{tHub("statsActiveGames")}</span>
                </div>
                <div className="flex gap-8">
                  <div>
                    <p className="text-3xl font-black text-on-surface font-headline">4</p>
                    <p className="text-xs font-label text-on-surface-variant uppercase tracking-widest">{tHub("statsActiveGames")}</p>
                  </div>
                  <div>
                    <p className="text-3xl font-black text-on-surface font-headline">5</p>
                    <p className="text-xs font-label text-on-surface-variant uppercase tracking-widest">{tHub("statsSkillDimensions")}</p>
                  </div>
                  <div>
                    <p className="text-3xl font-black text-on-surface font-headline">4</p>
                    <p className="text-xs font-label text-on-surface-variant uppercase tracking-widest">{tHub("statsDifficultyLevels")}</p>
                  </div>
                </div>
              </div>

              {/* AI IQ Test Card */}
              <a
                href="/ai-iq-test/"
                className="p-6 bg-[#ffe066] rounded-2xl border-2 border-transparent hover:border-yellow-600/30 transition-all"
              >
                <div className="flex items-center gap-4 mb-3">
                  <span className="material-symbols-outlined text-yellow-800" style={{ fontVariationSettings: "'FILL' 1" }}>quiz</span>
                  <span className="font-label text-sm uppercase tracking-wider text-yellow-800">{tHub("externalLink")}</span>
                </div>
                <p className="text-sm text-yellow-900 font-headline font-bold leading-relaxed">
                  {tHub("aiIqTestTitle")}
                </p>
              </a>
            </div>
          </div>

          {/* Legend Panel */}
          <div className="bg-surface-container-lowest border-3 border-outline-variant p-5 sm:p-8 rounded-2xl sm:rounded-[2rem] shadow-[4px_4px_0_0_#98b67d] sm:shadow-[8px_8px_0_0_#98b67d] sm:-rotate-1">
            <h4 className="font-headline text-xl font-bold mb-4">Legend</h4>
            <ul className="space-y-4 font-label text-sm">
              <li className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span>{tGames("detective.name")}</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-secondary" />
                <span>{tGames("arena.name")}</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-tertiary" />
                <span>{tGames("escape.name")}</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-green-600" />
                <span>{tGames("turing.name")}</span>
              </li>
            </ul>

            <div className="mt-6 pt-4 border-t border-outline-variant/30">
              <p className="text-xs text-on-surface-variant italic">{tHub("hubTagline")}</p>
            </div>
          </div>
        </motion.div>
      </main>
    </>
  );
}
