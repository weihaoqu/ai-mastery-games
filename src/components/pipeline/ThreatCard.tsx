"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import type { PipelineThreat, DefenseOption } from "@/lib/types";

const THREAT_ICONS: Record<string, string> = {
  bias: "balance",
  drift: "trending_down",
  adversarial: "shield",
  leakage: "water_drop",
  hallucination: "psychology_alt",
  overfit: "data_usage",
};

interface ThreatCardProps {
  threat: PipelineThreat;
  onDefend: (defense: DefenseOption) => void;
}

export default function ThreatCard({ threat, onDefend }: ThreatCardProps) {
  const t = useTranslations("pipeline");

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 30 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-2xl"
    >
      {/* Threat Header */}
      <div className="bg-error/10 border-2 border-error/30 rounded-2xl p-5 sm:p-6 mb-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-error/20 flex items-center justify-center" aria-hidden="true">
            <span className="material-symbols-outlined text-error">
              {THREAT_ICONS[threat.threatType] || "warning"}
            </span>
          </div>
          <div>
            <p className="font-headline font-bold text-on-surface">{threat.title}</p>
            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
              <span className="text-[10px] font-label uppercase tracking-widest text-error font-bold px-2 py-0.5 bg-error/10 rounded-full">
                {t("wavePrefix", { wave: threat.wave })}
              </span>
              <span className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant px-2 py-0.5 bg-surface-container rounded-full">
                {t(`stage_${threat.affectedStage}`)}
              </span>
            </div>
          </div>
        </div>
        <p className="text-on-surface text-sm leading-relaxed">{threat.description}</p>
      </div>

      {/* Defense Options */}
      <div className="space-y-3">
        <p className="font-label text-xs uppercase tracking-widest text-on-surface-variant font-bold">
          {t("chooseDefense")}
        </p>
        {threat.defenses.map((defense, i) => (
          <motion.button
            key={defense.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.1 }}
            onClick={() => onDefend(defense)}
            aria-label={defense.text}
            className="w-full text-left px-5 py-4 rounded-xl bg-surface-container-lowest border-2 border-outline-variant hover:border-primary hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-all shadow-[0_3px_0_0_rgba(152,182,125,0.5)] hover:shadow-[0_1px_0_0_rgba(152,182,125,0.5)] hover:translate-y-[2px]"
          >
            <p className="text-sm font-bold text-on-surface">{defense.text}</p>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
