"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { locales } from "@/i18n/config";
import type { Locale } from "@/i18n/config";

const gameNav = [
  { key: "detective", href: "/detective", icon: "search", label: "Detective" },
  { key: "arena", href: "/arena", icon: "swords", label: "Arena" },
  { key: "turing", href: "/turing", icon: "smart_toy", label: "Turing" },
  { key: "escape", href: "/escape-room", icon: "lock", label: "Escape" },
];

export default function Header() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const tLang = useTranslations("language");
  const tGames = useTranslations("games");
  const [menuOpen, setMenuOpen] = useState(false);

  function handleLocaleChange(newLocale: string) {
    let pathWithoutLocale = pathname;
    for (const l of locales) {
      if (pathname === `/${l}` || pathname.startsWith(`/${l}/`)) {
        pathWithoutLocale = pathname.slice(`/${l}`.length) || "/";
        break;
      }
    }

    if (newLocale === "en") {
      router.push(pathWithoutLocale);
    } else {
      router.push(`/${newLocale}${pathWithoutLocale === "/" ? "" : pathWithoutLocale}`);
    }
  }

  function isActive(href: string) {
    const stripped = pathname.replace(`/${locale}`, "") || "/";
    return stripped.startsWith(href);
  }

  return (
    <header className="fixed top-0 z-50 w-full bg-gradient-to-r from-green-600 to-green-400 shadow-[0_4px_0_0_rgba(168,204,136,1)]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        {/* Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="text-2xl font-black text-white italic font-headline">
              AI Mastery
            </span>
          </Link>

          {/* Desktop Game Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {gameNav.map((game) => (
              <Link
                key={game.key}
                href={game.href}
                className={`text-sm font-medium transition-colors ${
                  isActive(game.href)
                    ? "text-white font-bold border-b-[3px] border-yellow-400 pb-0.5"
                    : "text-emerald-50/80 hover:text-white"
                }`}
              >
                {tGames(`${game.key}.name`)}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {/* Games badge */}
          <div className="hidden sm:flex items-center gap-1 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold font-label shadow-[2px_2px_0_0_#b89a00]">
            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
            Games
          </div>

          {/* Language Selector */}
          <button
            onClick={() => {
              const currentIndex = locales.indexOf(locale as Locale);
              const nextLocale = locales[(currentIndex + 1) % locales.length];
              handleLocaleChange(nextLocale);
            }}
            className="text-emerald-50/80 hover:bg-white/10 p-2 rounded-lg transition-all"
            aria-label="Change language"
          >
            <span className="material-symbols-outlined">language</span>
          </button>

          {/* Profile */}
          <Link
            href="/profile"
            className="w-11 h-11 rounded-full border-2 border-white/50 overflow-hidden bg-green-700 flex items-center justify-center text-white hover:border-white transition-all"
          >
            <span className="material-symbols-outlined text-xl">person</span>
          </Link>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden flex h-11 w-11 items-center justify-center rounded-lg text-white/80 hover:bg-white/15 hover:text-white"
            aria-label="Menu"
          >
            <span className="material-symbols-outlined">
              {menuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden border-t border-white/20 bg-gradient-to-b from-green-500 to-green-600 px-6 py-3">
          <nav className="flex flex-col gap-1">
            {gameNav.map((game) => (
              <Link
                key={game.key}
                href={game.href}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                  isActive(game.href)
                    ? "bg-white/20 text-white font-bold"
                    : "text-emerald-50/80 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span className="material-symbols-outlined text-xl">{game.icon}</span>
                {tGames(`${game.key}.name`)}
              </Link>
            ))}
            <Link
              href="/profile"
              onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                isActive("/profile")
                  ? "bg-white/20 text-white font-bold"
                  : "text-emerald-50/80 hover:bg-white/10 hover:text-white"
              }`}
            >
              <span className="material-symbols-outlined text-xl">person</span>
              Profile
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
