"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import type { HunterClaim } from "@/lib/types";
import CRTMonitor from "./CRTMonitor";
import RadarSweep from "./RadarSweep";
import { basePath } from "@/lib/basePath";

const categoryScene: Record<string, string> = {
  factual: "/images/hunter/scene-factual.png",
  citation: "/images/hunter/scene-citation.png",
  code: "/images/hunter/scene-code.png",
  temporal: "/images/hunter/scene-temporal.png",
  entity: "/images/hunter/scene-entity.png",
  statistical: "/images/hunter/scene-statistical.png",
};

const signalLabel: Record<string, string> = {
  factual: "FACTUAL",
  citation: "CITATION",
  code: "CODE",
  temporal: "TEMPORAL",
  entity: "ENTITY",
  statistical: "STATISTICAL",
};

interface ClaimBubbleProps {
  claim: HunterClaim;
  index: number;
  onShoot: () => void;
  onPass: () => void;
  lifetime: number;
  disabled?: boolean;
}

export default function ClaimBubble({ claim, index, onShoot, onPass, lifetime, disabled }: ClaimBubbleProps) {
  const t = useTranslations("hunter");
  const scene = categoryScene[claim.category];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -30, scale: 0.8 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="w-full max-w-2xl mx-auto"
    >
      {/* War room scene background */}
      {scene && (
        <div className="w-full rounded-t-2xl overflow-hidden border-2 border-b-0 border-outline-variant">
          <img
            src={`${basePath}${scene}`}
            alt=""
            className="w-full h-auto object-cover"
          />
        </div>
      )}

      {/* CRT Monitor with claim */}
      <CRTMonitor>
        {/* Signal type badge + Radar */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[#00ff41] animate-pulse" />
            <span className="font-mono text-[11px] font-bold tracking-widest text-[#00ff41] uppercase">
              SIGNAL: {signalLabel[claim.category] ?? claim.category}
            </span>
          </div>
          <RadarSweep lifetime={lifetime} size={40} />
        </div>

        {/* Intercepted transmission */}
        <div className="mb-4">
          <p className="font-mono text-[10px] text-[#00ff41]/50 uppercase tracking-wider mb-2">
            &gt; INTERCEPTED TRANSMISSION:
          </p>
          <p className="font-mono text-sm text-[#00ff41] leading-relaxed">
            &gt; &ldquo;{claim.text}&rdquo;
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          <button
            onClick={onShoot}
            disabled={disabled}
            aria-label={t("hallucination")}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 border-red-500/50 bg-red-950/50 text-red-400 font-mono font-bold text-xs uppercase tracking-wider hover:bg-red-900/50 hover:border-red-400 active:scale-95 transition-all disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500"
          >
            <span className="material-symbols-outlined text-lg" aria-hidden="true">close</span>
            {t("hallucination")}
          </button>
          <button
            onClick={onPass}
            disabled={disabled}
            aria-label={t("legit")}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 border-[#00ff41]/50 bg-green-950/50 text-[#00ff41] font-mono font-bold text-xs uppercase tracking-wider hover:bg-green-900/50 hover:border-[#00ff41] active:scale-95 transition-all disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500"
          >
            <span className="material-symbols-outlined text-lg" aria-hidden="true">check</span>
            {t("legit")}
          </button>
        </div>
      </CRTMonitor>
    </motion.div>
  );
}
