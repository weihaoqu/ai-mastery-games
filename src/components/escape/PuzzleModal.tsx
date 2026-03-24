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
        className="fixed inset-0 z-50 flex items-center justify-center bg-on-surface/40 backdrop-blur-md p-4 outline-none"
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
          className="max-w-2xl w-full max-h-[85vh] overflow-y-auto rounded-3xl bg-surface-container-lowest border-4 border-outline-variant shadow-[4px_4px_0px_0px_#98b67d] scrollbar-thin flex flex-col"
        >
          {/* Header */}
          <div className="bg-surface-container px-4 sm:px-8 py-4 sm:py-6 flex items-center justify-between border-b-4 border-outline-variant">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{objectIcon}</span>
              <h2 className="font-headline text-2xl font-extrabold text-on-surface tracking-tight">
                {objectName}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="w-11 h-11 rounded-full bg-surface-container-lowest flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors border-2 border-outline-variant active:translate-y-0.5"
              aria-label={t("close")}
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-8 space-y-6">
            {/* Hint button (not for exit puzzle) */}
            {!isExit && (
              <HintButton
                hint={hintText}
                penalty={60}
                used={hintUsed}
                onUseHint={onUseHint}
              />
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
          </div>

          {/* Footer branding */}
          <div className="bg-surface-container px-8 py-3 flex justify-center items-center gap-2 opacity-50">
            <span className="material-symbols-outlined text-sm">security</span>
            <span className="font-label text-[10px] uppercase tracking-widest font-bold">Encrypted Session</span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
