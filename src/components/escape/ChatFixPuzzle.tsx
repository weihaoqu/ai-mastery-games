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

  const brokenIndices = useMemo(
    () => new Set(puzzle.fixes.map((f) => f.index)),
    [puzzle.fixes],
  );

  const [fixedMessages, setFixedMessages] = useState<Map<number, string>>(
    new Map(),
  );
  const [activeFixIndex, setActiveFixIndex] = useState<number | null>(null);
  const [shakeIndex, setShakeIndex] = useState<number | null>(null);
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
      setFixedMessages((prev) => {
        const next = new Map(prev);
        next.set(msgIndex, fix.options[optionIdx]);
        return next;
      });
      setActiveFixIndex(null);
    } else {
      setAllFirstTry(false);
      setShakeIndex(msgIndex);
      setTimeout(() => setShakeIndex(null), 500);
    }
  }

  const onSolveRef = useRef(onSolve);
  onSolveRef.current = onSolve;

  useEffect(() => {
    if (fixedMessages.size === totalBroken && totalBroken > 0 && !finished) {
      setFinished(true);
      setTimeout(() => {
        onSolveRef.current(allFirstTry);
      }, 800);
    }
  }, [fixedMessages.size, totalBroken, finished, allFirstTry]);

  return (
    <div className="flex flex-col gap-5">
      {/* Instruction */}
      <div className="space-y-2">
        <p className="text-base font-medium leading-relaxed text-on-surface">
          {puzzle.instruction}
        </p>
        <span className="inline-flex px-3 py-1 bg-surface-container-high text-on-surface-variant rounded-full text-xs font-label uppercase tracking-widest font-bold">
          {fixedMessages.size} / {totalBroken} {t("solved")}
        </span>
      </div>

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
                  className={`text-[10px] font-bold uppercase tracking-widest font-label ${
                    isUser ? "text-right text-primary" : "text-on-surface-variant"
                  }`}
                >
                  {msg.role}
                </p>

                {/* Message bubble */}
                <div
                  className={`rounded-2xl px-5 py-4 text-sm leading-relaxed ${
                    isUser
                      ? "bg-primary-container/20 text-on-surface"
                      : "bg-surface-container-lowest text-on-surface"
                  } ${
                    isBroken && !isFixed
                      ? "border-2 border-dashed border-error/50"
                      : isFixed
                        ? "border-2 border-primary/40"
                        : "border-2 border-outline-variant/30"
                  }`}
                >
                  {displayContent}

                  {/* Fix button */}
                  {isBroken && !isFixed && (
                    <button
                      onClick={() => handleFixClick(idx)}
                      className="mt-3 inline-flex items-center gap-2 rounded-lg bg-error/10 px-3 py-2 text-xs font-label font-bold text-error transition-colors hover:bg-error/20 uppercase tracking-wider"
                    >
                      <span className="material-symbols-outlined text-sm">build</span>
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
                      className="space-y-2 overflow-hidden"
                    >
                      {puzzle.fixes
                        .find((f) => f.index === idx)
                        ?.options.map((option, optIdx) => (
                          <button
                            key={optIdx}
                            onClick={() => handleOptionSelect(idx, optIdx)}
                            className="w-full rounded-xl border-b-4 border-outline-variant bg-surface-container-low p-3 text-left text-xs text-on-surface transition-all hover:border-primary/30 hover:bg-surface-container"
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
            className="rounded-xl border-2 border-primary/30 bg-primary-container/30 p-4 text-center"
          >
            <p className="text-sm font-headline font-bold text-primary">
              {t("allFixed")}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
