"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

type AccentColor = "cyan" | "magenta" | "green" | "purple";

interface GameCardProps {
  title: string;
  description: string;
  icon: string;
  iconSrc?: string;
  href: string;
  comingSoon?: boolean;
  accentColor: AccentColor;
  comingSoonLabel?: string;
}

const accentMap: Record<
  AccentColor,
  { border: string; hoverBorder: string; bg: string; text: string; tag: string; shadow: string }
> = {
  cyan: {
    border: "border-outline-variant",
    hoverBorder: "group-hover:border-primary",
    bg: "",
    text: "text-primary",
    tag: "bg-primary/15 text-primary border-2 border-primary/30",
    shadow: "shadow-[0_4px_0_#88b870]",
  },
  magenta: {
    border: "border-outline-variant",
    hoverBorder: "group-hover:border-secondary",
    bg: "",
    text: "text-secondary",
    tag: "bg-secondary/15 text-secondary border-2 border-secondary/30",
    shadow: "shadow-[0_4px_0_#88b870]",
  },
  green: {
    border: "border-outline-variant",
    hoverBorder: "group-hover:border-primary",
    bg: "",
    text: "text-primary",
    tag: "bg-primary/15 text-primary border-2 border-primary/30",
    shadow: "shadow-[0_4px_0_#88b870]",
  },
  purple: {
    border: "border-outline-variant",
    hoverBorder: "group-hover:border-[#7c6dd8]",
    bg: "",
    text: "text-[#7c6dd8]",
    tag: "bg-[#7c6dd8]/15 text-[#7c6dd8] border-2 border-[#7c6dd8]/30",
    shadow: "shadow-[0_4px_0_#88b870]",
  },
};

export default function GameCard({
  title,
  description,
  icon,
  iconSrc,
  href,
  comingSoon = false,
  accentColor,
  comingSoonLabel = "COMING SOON",
}: GameCardProps) {
  const accent = accentMap[accentColor];

  const card = (
    <motion.div
      whileHover={comingSoon ? {} : { y: 2 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className={`group relative overflow-hidden rounded-2xl border-3 bg-surface-container-lowest p-7 transition-all duration-200 ${accent.border} ${accent.hoverBorder} ${accent.shadow} hover:shadow-[0_2px_0_#88b870] ${comingSoon ? "cursor-default opacity-45" : "cursor-pointer"}`}
    >
      {/* Top accent line */}
      <div className={`absolute inset-x-0 top-0 h-[3px] ${accent.tag} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />

      {/* Icon + Tag row */}
      <div className="mb-5 flex items-center gap-3">
        {iconSrc ? (
          <div className="h-12 w-12 overflow-hidden rounded-lg shrink-0">
            <Image src={iconSrc} alt={title} width={48} height={48} className="h-full w-full object-cover" />
          </div>
        ) : (
          <span className="text-4xl">{icon}</span>
        )}
        <span className={`rounded-full px-3 py-1 text-xs font-semibold tracking-wider uppercase ${accent.tag}`}>
          {title}
        </span>
      </div>

      {/* Title */}
      <h3 className={`mb-3 font-headline text-2xl ${accent.text}`}>
        {title}
      </h3>

      {/* Description */}
      <p className="text-[15px] leading-7 text-on-surface-variant">{description}</p>

      {/* Coming Soon Badge */}
      {comingSoon && (
        <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-surface/90 via-surface/50 to-transparent pb-6">
          <span className="rounded-full border border-outline-variant bg-surface-container-lowest px-5 py-2 text-xs font-semibold tracking-widest text-on-surface-variant uppercase shadow-sm">
            {comingSoonLabel}
          </span>
        </div>
      )}
    </motion.div>
  );

  if (comingSoon) {
    return <div className="pointer-events-none">{card}</div>;
  }

  return <Link href={href}>{card}</Link>;
}
