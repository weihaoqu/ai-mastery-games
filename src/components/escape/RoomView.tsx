"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import type { EscapeRoom, EscapeAnswer } from "@/lib/types";
import { basePath } from "@/lib/basePath";

interface RoomViewProps {
  room: EscapeRoom;
  solvedPuzzles: Map<string, EscapeAnswer>;
  collectedCodes: string[];
  totalPuzzles: number;
  onObjectClick: (objectId: string) => void;
}

export default function RoomView({
  room,
  solvedPuzzles,
  collectedCodes,
  totalPuzzles,
  onObjectClick,
}: RoomViewProps) {
  const t = useTranslations("escape");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [discoveredIds, setDiscoveredIds] = useState<Set<string>>(new Set());

  const hasBackground = room.backgroundImage && room.backgroundImage.length > 0;

  function handleMouseEnter(id: string) {
    setHoveredId(id);
    setDiscoveredIds((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }

  return (
    <div
      className={`relative w-full aspect-video rounded-2xl overflow-hidden border-3 border-outline-variant shadow-[4px_4px_0px_0px_#98b67d] ${
        hasBackground ? "" : "bg-gradient-to-br from-surface-container-low to-surface"
      }`}
      style={{
        cursor: "crosshair",
        ...(hasBackground
          ? {
              backgroundImage: `url(${basePath}${room.backgroundImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : undefined),
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/20 pointer-events-none" />

      {/* Instruction badge */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
        <span className="rounded-full bg-surface-container-lowest/90 border-2 border-outline-variant px-4 py-1.5 text-xs font-label font-bold text-on-surface shadow-sm backdrop-blur-sm uppercase tracking-wider">
          {t("clickToInvestigate")}
        </span>
      </div>

      {/* Discovery counter */}
      <div className="absolute top-3 right-3 z-20 pointer-events-none">
        <span className="rounded-full bg-surface-container-lowest/90 border-2 border-outline-variant px-3 py-1 text-[10px] font-label font-bold text-on-surface-variant backdrop-blur-sm uppercase tracking-widest">
          {discoveredIds.size} / {room.objects.length} {t("discovered") ?? "found"}
        </span>
      </div>

      {/* Interactive hotspots */}
      {room.objects.map((obj) => {
        const answer = solvedPuzzles.get(obj.id);
        const isSolved = !!answer;
        const isExit = obj.puzzleType === "exit";
        const codesRemaining = totalPuzzles - collectedCodes.length;
        const exitReady = isExit && codesRemaining <= 0;
        const exitLocked = isExit && codesRemaining > 0;
        const isHovered = hoveredId === obj.id;
        const isDiscovered = discoveredIds.has(obj.id);

        return (
          <motion.button
            key={obj.id}
            onClick={() => onObjectClick(obj.id)}
            disabled={isSolved && !isExit}
            onMouseEnter={() => handleMouseEnter(obj.id)}
            onFocus={() => handleMouseEnter(obj.id)}
            onMouseLeave={() => setHoveredId(null)}
            onBlur={() => setHoveredId(null)}
            aria-label={`${obj.name}${isSolved && !isExit ? " (solved)" : ""}${exitLocked ? " (locked)" : ""}${exitReady ? " (ready)" : ""}`}
            className="absolute z-10 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-primary/60"
            style={{
              left: `${obj.position.x}%`,
              top: `${obj.position.y}%`,
              width: `${obj.position.width}%`,
              height: `${obj.position.height}%`,
              cursor:
                isSolved && !isExit ? "default" : "pointer",
            }}
            animate={
              isSolved && !isExit
                ? {}
                : isHovered
                  ? {
                      boxShadow: "0 0 20px 4px rgba(0, 106, 45, 0.4)",
                      backgroundColor: "rgba(0, 106, 45, 0.08)",
                      borderColor: "rgba(0, 106, 45, 0.5)",
                    }
                  : exitReady
                    ? {
                        boxShadow: [
                          "0 0 0 0 rgba(0, 106, 45, 0)",
                          "0 0 24px 6px rgba(0, 106, 45, 0.4)",
                          "0 0 0 0 rgba(0, 106, 45, 0)",
                        ],
                        backgroundColor: "rgba(0, 106, 45, 0.05)",
                      }
                    : !isDiscovered
                      ? {
                          boxShadow: [
                            "0 0 0 0 rgba(255, 255, 255, 0)",
                            "0 0 8px 2px rgba(255, 255, 255, 0.12)",
                            "0 0 0 0 rgba(255, 255, 255, 0)",
                          ],
                        }
                      : {
                          boxShadow: [
                            "0 0 0 0 rgba(0, 106, 45, 0)",
                            "0 0 6px 1px rgba(0, 106, 45, 0.1)",
                            "0 0 0 0 rgba(0, 106, 45, 0)",
                          ],
                        }
            }
            transition={
              isHovered
                ? { duration: 0.2 }
                : exitReady || !isSolved
                  ? { duration: 2.5, repeat: Infinity, ease: "easeInOut" }
                  : undefined
            }
          >
            {/* Hover tooltip */}
            <AnimatePresence>
              {isHovered && !isSolved && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute -top-12 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-0.5 rounded-xl bg-on-surface/85 px-4 py-2 shadow-lg backdrop-blur-sm whitespace-nowrap"
                >
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm leading-none">{obj.icon}</span>
                    <span className="text-[11px] font-label font-bold text-white uppercase tracking-wider">
                      {obj.name}
                    </span>
                  </div>
                  {exitLocked && (
                    <span className="text-[9px] text-amber-300">
                      {t("exitLocked", { remaining: codesRemaining })}
                    </span>
                  )}
                  {exitReady && (
                    <span className="text-[9px] text-emerald-300">
                      {t("exitReady")}
                    </span>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Solved badge */}
            {isSolved && !isExit && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full shadow-md border-2 border-surface ${
                  answer?.isCorrect
                    ? "bg-primary"
                    : "bg-error"
                }`}
              >
                <span className="material-symbols-outlined text-white text-sm">
                  {answer?.isCorrect ? "check" : "close"}
                </span>
              </motion.div>
            )}

            {/* Exit lock badge */}
            {exitLocked && (
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-secondary-container border-2 border-secondary/30 shadow-md"
              >
                <span className="material-symbols-outlined text-secondary text-sm">lock</span>
              </motion.div>
            )}

            {/* Exit ready badge */}
            {exitReady && (
              <motion.div
                animate={{
                  scale: [1, 1.15, 1],
                  boxShadow: [
                    "0 0 0 0 rgba(0, 106, 45, 0)",
                    "0 0 16px 4px rgba(0, 106, 45, 0.4)",
                    "0 0 0 0 rgba(0, 106, 45, 0)",
                  ],
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-primary shadow-lg"
              >
                <span className="material-symbols-outlined text-on-primary text-lg">door_open</span>
              </motion.div>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
