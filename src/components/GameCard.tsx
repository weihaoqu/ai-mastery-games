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
    border: "border-ed-border",
    hoverBorder: "group-hover:border-ed-teal",
    bg: "",
    text: "text-ed-teal",
    tag: "bg-ed-teal/15 text-ed-teal border-2 border-ed-teal/30",
    shadow: "shadow-[0_4px_0_#88b870]",
  },
  magenta: {
    border: "border-ed-border",
    hoverBorder: "group-hover:border-ed-burnt",
    bg: "",
    text: "text-ed-burnt",
    tag: "bg-ed-burnt/15 text-ed-burnt border-2 border-ed-burnt/30",
    shadow: "shadow-[0_4px_0_#88b870]",
  },
  green: {
    border: "border-ed-border",
    hoverBorder: "group-hover:border-ed-success",
    bg: "",
    text: "text-ed-success",
    tag: "bg-ed-success/15 text-ed-success border-2 border-ed-success/30",
    shadow: "shadow-[0_4px_0_#88b870]",
  },
  purple: {
    border: "border-ed-border",
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
      className={`group relative overflow-hidden rounded-2xl border-3 bg-ed-card p-7 transition-all duration-200 ${accent.border} ${accent.hoverBorder} ${accent.shadow} hover:shadow-[0_2px_0_#88b870] ${comingSoon ? "cursor-default opacity-45" : "cursor-pointer"}`}
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
      <h3 className={`mb-3 font-display text-2xl ${accent.text}`}>
        {title}
      </h3>

      {/* Description */}
      <p className="text-[15px] leading-7 text-ed-ink-muted">{description}</p>

      {/* Coming Soon Badge */}
      {comingSoon && (
        <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-ed-cream/90 via-ed-cream/50 to-transparent pb-6">
          <span className="rounded-full border border-ed-border bg-ed-card px-5 py-2 text-xs font-semibold tracking-widest text-ed-ink-muted uppercase shadow-sm">
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
