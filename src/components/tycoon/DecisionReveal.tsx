"use client";

import { motion } from "framer-motion";
import type { TycoonScenario, TycoonDecision, TycoonAnswer } from "@/lib/types";

interface DecisionRevealProps {
  scenario: TycoonScenario;
  decision: TycoonDecision;
  answer: TycoonAnswer;
  prevMeters: { revenue: number; reputation: number; trust: number; regulatory: number };
  onNext: () => void;
  isLast: boolean;
  labels?: {
    optimal: string;
    suboptimal: string;
    reasoning: string;
    next: string;
    viewResults: string;
    pts: string;
    meterRevenue: string;
    meterReputation: string;
    meterTrust: string;
    meterRegulatory: string;
  };
}

const METER_LABELS: Record<string, string> = {
  revenue: "Revenue",
  reputation: "Reputation",
  trust: "Trust",
  regulatory: "Regulatory",
};

export default function DecisionReveal({
  decision,
  answer,
  onNext,
  isLast,
  labels,
}: DecisionRevealProps) {
  const meterLabels = {
    revenue: labels?.meterRevenue ?? METER_LABELS.revenue,
    reputation: labels?.meterReputation ?? METER_LABELS.reputation,
    trust: labels?.meterTrust ?? METER_LABELS.trust,
    regulatory: labels?.meterRegulatory ?? METER_LABELS.regulatory,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="w-full"
    >
      {/* Outcome card */}
      <div
        className={`bg-surface-container-lowest border-2 rounded-2xl p-6 sm:p-8 shadow-[0_4px_0_0_rgba(155,63,0,0.6)] mb-6 ${
          decision.isOptimal ? "border-primary" : "border-error"
        }`}
      >
        <div className="flex items-center gap-2 mb-3">
          <span
            className={`material-symbols-outlined text-2xl ${decision.isOptimal ? "text-primary" : "text-error"}`}
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            {decision.isOptimal ? "trending_up" : "trending_down"}
          </span>
          <span className={`font-headline text-lg font-bold ${decision.isOptimal ? "text-primary" : "text-error"}`}>
            {decision.isOptimal ? (labels?.optimal ?? "Great Decision!") : (labels?.suboptimal ?? "Risky Move")}
          </span>
          <span className="ml-auto font-mono text-sm font-bold text-on-surface">
            +{answer.score} {labels?.pts ?? "pts"}
          </span>
        </div>

        <p className="text-on-surface text-sm mb-4 leading-relaxed">{decision.outcome}</p>

        {/* Impact indicators */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          {(["revenue", "reputation", "trust", "regulatory"] as const).map((key) => {
            const impact = decision.impact[key];
            const isPositive = impact > 0;
            const isNegative = impact < 0;
            return (
              <div
                key={key}
                className={`text-center p-2 rounded-lg ${
                  isPositive ? "bg-primary/10" : isNegative ? "bg-error/10" : "bg-surface-container"
                }`}
              >
                <span
                  className={`text-xs font-bold font-mono ${
                    isPositive ? "text-primary" : isNegative ? "text-error" : "text-on-surface-variant"
                  }`}
                >
                  {impact > 0 ? "+" : ""}
                  {impact}
                </span>
                <p className="text-[9px] font-label uppercase tracking-wider text-on-surface-variant mt-0.5">
                  {meterLabels[key]}
                </p>
              </div>
            );
          })}
        </div>

        {/* Reasoning */}
        <div className="bg-surface-container rounded-xl p-4">
          <p className="text-xs font-label font-bold uppercase tracking-wider text-on-surface-variant mb-1">
            {labels?.reasoning ?? "Analysis"}
          </p>
          <p className="text-sm text-on-surface leading-relaxed">{decision.reasoning}</p>
        </div>
      </div>

      {/* Next button */}
      <button
        onClick={onNext}
        className="w-full py-3 rounded-xl bg-secondary text-on-secondary font-bold font-label text-sm shadow-[0_3px_0_0_rgba(120,40,0,1)] hover:shadow-[0_1px_0_0_rgba(120,40,0,1)] hover:translate-y-[2px] transition-all"
      >
        {isLast ? (labels?.viewResults ?? "VIEW RESULTS") : (labels?.next ?? "NEXT QUARTER")}
      </button>
    </motion.div>
  );
}
