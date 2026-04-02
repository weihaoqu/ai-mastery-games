"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import type { Evidence } from "@/lib/types";

const evidenceIconMap: Record<string, string> = {
  document: "description",
  screenshot: "screenshot_monitor",
  data: "database",
  email: "mail",
  "chat-log": "chat",
  code: "code",
};

interface EvidenceModalProps {
  evidence: Evidence | null;
  onClose: () => void;
}

export default function EvidenceModal({ evidence, onClose }: EvidenceModalProps) {
  const t = useTranslations("detective");

  return (
    <AnimatePresence>
      {evidence && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-x-4 top-[10%] sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:w-full sm:max-w-lg z-50 max-h-[75vh] overflow-y-auto"
          >
            <div className="bg-surface-container-lowest border-2 border-outline-variant rounded-2xl shadow-2xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-xl">
                      {evidenceIconMap[evidence.type] ?? "description"}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-headline font-bold text-on-surface text-base">{evidence.title}</h3>
                    {evidence.isKey && (
                      <span className="text-[10px] font-black bg-amber-400/30 text-amber-800 px-2 py-0.5 rounded-full uppercase tracking-wider">
                        {t("keyEvidence")}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center hover:bg-surface-container-high transition-colors"
                  aria-label="Close"
                >
                  <span className="material-symbols-outlined text-on-surface-variant text-lg">close</span>
                </button>
              </div>
              <div className="text-sm text-on-surface-variant leading-relaxed">
                {evidence.content}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
