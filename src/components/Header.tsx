"use client";

import { useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { locales } from "@/i18n/config";
import type { Locale } from "@/i18n/config";
import { basePath } from "@/lib/basePath";

const gameNav = [
  { key: "detective", href: "/detective", icon: `${basePath}/images/games/detective.png` },
  { key: "arena", href: "/arena", icon: `${basePath}/images/games/arena.png` },
  { key: "turing", href: "/turing", icon: `${basePath}/images/games/turing.png` },
  { key: "escape", href: "/escape-room", icon: `${basePath}/images/escape/icon-beginner.png` },
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
    <header className="fixed top-0 z-50 w-full border-b-4 border-[#2d8a47] bg-gradient-to-r from-[#3ba85a] to-[#4ec06a] shadow-[0_4px_0_#2d6e3a]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        {/* Logo */}
        <a href={`${basePath}/`} className="flex items-center gap-3 shrink-0">
          <span className="font-display text-xl text-white tracking-wide">
            AI Mastery
          </span>
          <span className="hidden sm:inline-block rounded-full bg-[#ffe066] px-2.5 py-0.5 text-xs font-extrabold text-[#7a5d00] tracking-wider uppercase shadow-sm">
            Games
          </span>
        </a>

        {/* Desktop Game Nav */}
        <nav className="hidden lg:flex items-center gap-1 ml-8">
          {gameNav.map((game) => (
            <a
              key={game.key}
              href={`${basePath}${game.href}`}
              className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                isActive(game.href)
                  ? "bg-white/25 text-white"
                  : "text-white/70 hover:bg-white/15 hover:text-white"
              }`}
            >
              <Image
                src={game.icon}
                alt=""
                width={20}
                height={20}
                className="h-5 w-5 rounded object-cover"
              />
              <span className="hidden lg:inline">{tGames(`${game.key}.name`)}</span>
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {/* Profile link */}
          <a
            href={`${basePath}/profile`}
            className={`hidden lg:flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
              isActive("/profile")
                ? "bg-white/25 text-white"
                : "text-white/70 hover:bg-white/15 hover:text-white"
            }`}
            aria-label="Profile"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </a>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden flex h-8 w-8 items-center justify-center rounded-lg text-white/70 hover:bg-white/15 hover:text-white"
            aria-label="Menu"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {menuOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <path d="M3 12h18M3 6h18M3 18h18" />
              )}
            </svg>
          </button>

          {/* Language Selector */}
          <select
            value={locale}
            onChange={(e) => handleLocaleChange(e.target.value)}
            className="rounded-lg border-2 border-white/20 bg-white/15 px-3 py-1.5 text-sm text-white font-semibold outline-none transition-colors hover:border-white/30 focus:border-white/40"
          >
            {locales.map((l) => (
              <option key={l} value={l} className="bg-[#2d5016] text-white">
                {tLang(l as Locale)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="lg:hidden border-t-2 border-[#2d8a47] bg-gradient-to-b from-[#3ba85a] to-[#2d9048] px-6 py-3">
          <nav className="flex flex-col gap-1">
            {gameNav.map((game) => (
              <a
                key={game.key}
                href={`${basePath}${game.href}`}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                  isActive(game.href)
                    ? "bg-white/25 text-white"
                    : "text-white/70 hover:bg-white/15 hover:text-white"
                }`}
              >
                <Image
                  src={game.icon}
                  alt=""
                  width={24}
                  height={24}
                  className="h-6 w-6 rounded object-cover"
                />
                {tGames(`${game.key}.name`)}
              </a>
            ))}
            <a
              href={`${basePath}/profile`}
              onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                isActive("/profile")
                  ? "bg-white/25 text-white"
                  : "text-white/70 hover:bg-white/15 hover:text-white"
              }`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              Profile
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
