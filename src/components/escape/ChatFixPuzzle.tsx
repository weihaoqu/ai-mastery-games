"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import type { ChatFixPuzzle } from "@/lib/types";

interface ChatFixPuzzleProps {
  puzzle: ChatFixPuzzle;
  onSolve: (correct: boolean) => void;
}

export default function ChatFixPuzzleComponent({
  puzzle,
  onSolve,
}: ChatFixPuzzleProps) {
  const t = useTranslations("escape");

  // Build set of broken message indices from fixes array
  const brokenIndices = useMemo(
    () => new Set(puzzle.fixes.map((f) => f.index)),
    [puzzle.fixes],
  );

  // Track which broken messages have been fixed
  const [fixedMessages, setFixedMessages] = useState<Map<number, string>>(
    new Map(),
  );
  // Which message is currently being fixed (showing options)
  const [activeFixIndex, setActiveFixIndex] = useState<number | null>(null);
  // Track shake animation on wrong picks
  const [shakeIndex, setShakeIndex] = useState<number | null>(null);
  // Track first-attempt correctness
  const [allFirstTry, setAllFirstTry] = useState(true);
  const [finished, setFinished] = useState(false);

  const totalBroken = brokenIndices.size;

  function handleFixClick(msgIndex: number) {
    if (fixedMessages.has(msgIndex) || finished) return;
    setActiveFixIndex(activeFixIndex === msgIndex ? null : msgIndex);
  }

  function handleOptionSelect(msgIndex: number, optionIdx: number) {
    const fix = puzzle.fixes.find((f) => f.index === msgIndex);
    if (!fix) return;

    if (optionIdx === fix.correctIndex) {
      // Correct fix
      setFixedMessages((prev) => {
        const next = new Map(prev);
        next.set(msgIndex, fix.options[optionIdx]);
        return next;
      });
      setActiveFixIndex(null);
    } else {
      // Wrong fix - shake
      setAllFirstTry(false);
      setShakeIndex(msgIndex);
      setTimeout(() => setShakeIndex(null), 500);
    }
  }

  // Stable ref for onSolve to avoid infinite re-render loop
  const onSolveRef = useRef(onSolve);
  onSolveRef.current = onSolve;

  // Check if all fixed
  useEffect(() => {
    if (fixedMessages.size === totalBroken && totalBroken > 0 && !finished) {
      setFinished(true);
      setTimeout(() => {
        onSolveRef.current(allFirstTry);
      }, 800);
    }
  }, [fixedMessages.size, totalBroken, finished, allFirstTry]);

  return (
    <div className="flex flex-col gap-4">
      {/* Instruction */}
      <div className="rounded-lg border border-ed-border bg-ed-parchment p-4">
        <p className="text-sm leading-relaxed text-ed-ink">
          {puzzle.instruction}
        </p>
      </div>

      {/* Progress */}
      <p className="text-center text-xs text-ed-ink-muted">
        {fixedMessages.size} / {totalBroken} {t("solved")}
      </p>

      {/* Chat conversation */}
      <div className="space-y-3">
        {puzzle.conversation.map((msg, idx) => {
          const isBroken = brokenIndices.has(idx);
          const isFixed = fixedMessages.has(idx);
          const isUser = msg.role === "user";
          const isShaking = shakeIndex === idx;
          const isShowingOptions = activeFixIndex === idx;
          const displayContent = isFixed
            ? fixedMessages.get(idx)!
            : msg.content;

          return (
            <motion.div
              key={idx}
              animate={isShaking ? { x: [0, -6, 6, -6, 6, 0] } : {}}
              transition={{ duration: 0.4 }}
              className={`flex ${isUser ? "justify-end" : "justify-start"}`}
            >
              <div className="max-w-[85%] space-y-2">
                {/* Role label */}
                <p
                  className={`text-[10px] font-bold uppercase tracking-widest ${
                    isUser ? "text-right text-ed-teal" : "text-ed-ink-muted"
                  }`}
                >
                  {msg.role}
                </p>

                {/* Message bubble */}
                <div
                  className={`rounded-xl px-4 py-3 text-sm leading-relaxed ${
                    isUser
                      ? "bg-ed-teal/10 text-ed-ink"
                      : "bg-ed-card text-ed-ink"
                  } ${
                    isBroken && !isFixed
                      ? "border-2 border-dashed border-ed-error/50"
                      : isFixed
                        ? "border-2 border-ed-success/40"
                        : "border border-ed-border"
                  }`}
                >
                  {displayContent}

                  {/* Fix button */}
                  {isBroken && !isFixed && (
                    <button
                      onClick={() => handleFixClick(idx)}
                      className="mt-2 inline-flex items-center gap-1 rounded-md border border-ed-error/30 bg-ed-error/5 px-2 py-1 text-xs font-medium text-ed-error transition-colors hover:bg-ed-error/10"
                    >
                      {t("fixThis")}
                    </button>
                  )}
                </div>

                {/* Fix options */}
                <AnimatePresence>
                  {isShowingOptions && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-1 overflow-hidden"
                    >
                      {puzzle.fixes
                        .find((f) => f.index === idx)
                        ?.options.map((option, optIdx) => (
                          <button
                            key={optIdx}
                            onClick={() => handleOptionSelect(idx, optIdx)}
                            className="w-full rounded-lg border border-ed-border bg-ed-warm p-2 text-left text-xs text-ed-ink transition-all hover:border-ed-teal/30 hover:bg-ed-teal/5"
                          >
                            {option}
                          </button>
                        ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Finished feedback */}
      <AnimatePresence>
        {finished && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-lg border border-ed-success/30 bg-ed-success/5 p-3 text-center"
          >
            <p className="text-sm font-medium text-ed-success">
              {t("allFixed")}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
