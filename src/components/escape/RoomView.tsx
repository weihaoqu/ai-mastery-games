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
    // Mark as discovered once hovered
    setDiscoveredIds((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }

  return (
    <div
      className={`relative w-full aspect-video rounded-xl overflow-hidden border border-ed-border ${
        hasBackground ? "" : "bg-gradient-to-br from-ed-warm to-ed-cream"
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
        <span className="rounded-full bg-ed-card/90 border border-ed-border px-4 py-1.5 text-xs font-medium text-ed-ink shadow-sm backdrop-blur-sm">
          {t("clickToInvestigate")}
        </span>
      </div>

      {/* Discovery counter */}
      <div className="absolute top-3 right-3 z-20 pointer-events-none">
        <span className="rounded-full bg-ed-card/90 border border-ed-border px-3 py-1 text-[10px] font-medium text-ed-ink-muted backdrop-blur-sm">
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
            className="absolute z-10 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-ed-teal/60"
            style={{
              left: `${obj.position.x}%`,
              top: `${obj.position.y}%`,
              width: `${obj.position.width}%`,
              height: `${obj.position.height}%`,
              cursor:
                isSolved && !isExit ? "default" : "pointer",
            }}
            animate={
              // Solved: no animation
              isSolved && !isExit
                ? {}
                : // Hovered: bright glow
                  isHovered
                  ? {
                      boxShadow: "0 0 20px 4px rgba(13, 115, 119, 0.4)",
                      backgroundColor: "rgba(13, 115, 119, 0.08)",
                      borderColor: "rgba(13, 115, 119, 0.5)",
                    }
                  : // Exit ready: strong pulse
                    exitReady
                    ? {
                        boxShadow: [
                          "0 0 0 0 rgba(13, 115, 119, 0)",
                          "0 0 24px 6px rgba(13, 115, 119, 0.4)",
                          "0 0 0 0 rgba(13, 115, 119, 0)",
                        ],
                        backgroundColor: "rgba(13, 115, 119, 0.05)",
                      }
                    : // Undiscovered: very faint shimmer to hint something is there
                      !isDiscovered
                      ? {
                          boxShadow: [
                            "0 0 0 0 rgba(255, 255, 255, 0)",
                            "0 0 8px 2px rgba(255, 255, 255, 0.12)",
                            "0 0 0 0 rgba(255, 255, 255, 0)",
                          ],
                        }
                      : // Discovered but not hovered: subtle idle glow
                        {
                          boxShadow: [
                            "0 0 0 0 rgba(13, 115, 119, 0)",
                            "0 0 6px 1px rgba(13, 115, 119, 0.1)",
                            "0 0 0 0 rgba(13, 115, 119, 0)",
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
                  className="absolute -top-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-0.5 rounded-lg bg-ed-ink/85 px-3 py-1.5 shadow-lg backdrop-blur-sm whitespace-nowrap"
                >
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm leading-none">{obj.icon}</span>
                    <span className="text-[11px] font-medium text-white">
                      {obj.name}
                    </span>
                  </div>
                  {exitLocked && (
                    <span className="text-[9px] text-amber-300">
                      🔒 {t("exitLocked", { remaining: codesRemaining })}
                    </span>
                  )}
                  {exitReady && (
                    <span className="text-[9px] text-emerald-300">
                      ✨ {t("exitReady")}
                    </span>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Solved badge — small floating indicator */}
            {isSolved && !isExit && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full shadow-md ${
                  answer?.isCorrect
                    ? "bg-ed-success/90"
                    : "bg-ed-error/90"
                }`}
              >
                <span className="text-base text-white">
                  {answer?.isCorrect ? "✓" : "✗"}
                </span>
              </motion.div>
            )}

            {/* Exit lock badge — always visible */}
            {exitLocked && (
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-amber-100/90 border border-amber-300 shadow-md"
              >
                <span className="text-sm">🔒</span>
              </motion.div>
            )}

            {/* Exit ready badge — glowing */}
            {exitReady && (
              <motion.div
                animate={{
                  scale: [1, 1.15, 1],
                  boxShadow: [
                    "0 0 0 0 rgba(13, 115, 119, 0)",
                    "0 0 16px 4px rgba(13, 115, 119, 0.4)",
                    "0 0 0 0 rgba(13, 115, 119, 0)",
                  ],
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-ed-teal/90 shadow-lg"
              >
                <span className="text-lg">🚪</span>
              </motion.div>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
