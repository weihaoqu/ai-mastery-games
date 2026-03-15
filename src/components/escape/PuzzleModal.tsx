"use client";

import { useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import type { Puzzle } from "@/lib/types";
import HintButton from "./HintButton";
import PromptFixPuzzleComponent from "./PromptFixPuzzle";
import SpotErrorPuzzleComponent from "./SpotErrorPuzzle";
import MatchPuzzleComponent from "./MatchPuzzle";
import QuizPuzzleComponent from "./QuizPuzzle";
import ChatFixPuzzleComponent from "./ChatFixPuzzle";
import ExitPuzzleComponent from "./ExitPuzzle";

interface PuzzleModalProps {
  objectName: string;
  objectIcon: string;
  puzzle: Puzzle;
  hintText: string;
  hintUsed: boolean;
  onUseHint: () => void;
  onSolve: (correct: boolean) => void;
  onClose: () => void;
  collectedCodes?: string[];
}

export default function PuzzleModal({
  objectName,
  objectIcon,
  puzzle,
  hintText,
  hintUsed,
  onUseHint,
  onSolve,
  onClose,
  collectedCodes = [],
}: PuzzleModalProps) {
  const t = useTranslations("escape");
  const isExit = puzzle.type === "exit";
  const modalRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    modalRef.current?.focus();
  }, []);

  // Focus trap: keep Tab within the modal
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab" || !contentRef.current) return;

      const focusable = contentRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    },
    [onClose]
  );

  return (
    <AnimatePresence>
      <motion.div
        ref={modalRef}
        tabIndex={-1}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        role="dialog"
        aria-modal="true"
        aria-label={objectName}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 outline-none"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
        onKeyDown={handleKeyDown}
      >
        <motion.div
          ref={contentRef}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="max-w-2xl w-full max-h-[85vh] overflow-y-auto rounded-xl bg-ed-card border border-ed-border p-6 shadow-xl scrollbar-thin"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{objectIcon}</span>
              <h2 className="font-display text-lg font-bold text-ed-ink">
                {objectName}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-ed-border text-ed-ink-muted transition-colors hover:bg-ed-warm hover:text-ed-ink"
              aria-label={t("close")}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M1 1l12 12M13 1L1 13" />
              </svg>
            </button>
          </div>

          {/* Hint button (not for exit puzzle) */}
          {!isExit && (
            <div className="mb-5">
              <HintButton
                hint={hintText}
                penalty={60}
                used={hintUsed}
                onUseHint={onUseHint}
              />
            </div>
          )}

          {/* Puzzle content */}
          {puzzle.type === "prompt-fix" && (
            <PromptFixPuzzleComponent puzzle={puzzle} onSolve={onSolve} />
          )}
          {puzzle.type === "spot-error" && (
            <SpotErrorPuzzleComponent puzzle={puzzle} onSolve={onSolve} />
          )}
          {puzzle.type === "match-concepts" && (
            <MatchPuzzleComponent puzzle={puzzle} onSolve={onSolve} />
          )}
          {puzzle.type === "quiz" && (
            <QuizPuzzleComponent puzzle={puzzle} onSolve={onSolve} />
          )}
          {puzzle.type === "chat-fix" && (
            <ChatFixPuzzleComponent puzzle={puzzle} onSolve={onSolve} />
          )}
          {puzzle.type === "exit" && (
            <ExitPuzzleComponent
              puzzle={puzzle}
              collectedCodes={collectedCodes}
              onSolve={onSolve}
            />
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
