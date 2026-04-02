"use client";

import { motion } from "framer-motion";
import type { TycoonScenario, TycoonDecision } from "@/lib/types";

interface QuarterCardProps {
  scenario: TycoonScenario;
  quarterNum: number;
  onDecide: (decision: TycoonDecision) => void;
  quarterLabel?: string;
}

export default function QuarterCard({ scenario, quarterNum, onDecide, quarterLabel }: QuarterCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="w-full"
    >
      {/* Quarter label */}
      <div className="flex items-center gap-2 mb-4">
        <span className="px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-bold font-label uppercase tracking-wider">
          {quarterLabel ?? `Q${quarterNum}`}
        </span>
      </div>

      {/* Scenario card */}
      <div className="bg-surface-container-lowest border-2 border-outline-variant rounded-2xl p-6 sm:p-8 shadow-[0_4px_0_0_rgba(155,63,0,0.6)] mb-6">
        <h2 className="font-headline text-2xl font-extrabold text-on-surface mb-3">
          {scenario.title}
        </h2>
        <p className="text-on-surface-variant text-sm leading-relaxed">
          {scenario.context}
        </p>
      </div>

      {/* Decision buttons */}
      <div className="space-y-3">
        {scenario.decisions.map((d, i) => (
          <motion.button
            key={d.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + i * 0.08 }}
            onClick={() => onDecide(d)}
            className="w-full text-left p-4 bg-surface-container-lowest border-2 border-outline-variant rounded-xl hover:border-secondary hover:shadow-[0_2px_0_0_rgba(155,63,0,0.4)] transition-all group"
          >
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center font-headline font-bold text-sm">
                {String.fromCharCode(65 + i)}
              </span>
              <p className="text-on-surface text-sm font-body group-hover:text-secondary transition-colors">
                {d.text}
              </p>
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
