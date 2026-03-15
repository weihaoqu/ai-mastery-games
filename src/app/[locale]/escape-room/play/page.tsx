"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import type {
  EscapeRoom,
  EscapeAnswer,
  EscapeResult,
  Puzzle,
  Difficulty,
} from "@/lib/types";
import { scorePuzzle, calculateEscapeSessionResult } from "@/lib/escape/scoring";
import { generateId } from "@/lib/storage";
import { playCorrect, playWrong, playCollect, playTick } from "@/lib/sounds";
import { EscapeRoomSkeleton } from "@/components/Skeleton";
import TimerBar from "@/components/escape/TimerBar";
import RoomView from "@/components/escape/RoomView";
import PuzzleModal from "@/components/escape/PuzzleModal";

// --- Room data ---
import { beginnerRoom } from "@/data/escape/beginner";
import { intermediateRoom } from "@/data/escape/intermediate";
import { advancedRoom } from "@/data/escape/advanced";
import { expertRoom } from "@/data/escape/expert";

const roomByDifficulty: Record<string, EscapeRoom> = {
  beginner: beginnerRoom,
  intermediate: intermediateRoom,
  advanced: advancedRoom,
  expert: expertRoom,
};

const VALID_DIFFICULTIES = new Set<string>([
  "beginner",
  "intermediate",
  "advanced",
  "expert",
]);

const SAVE_KEY = "escape-progress";

interface SavedProgress {
  difficulty: Difficulty;
  remainingTime: number;
  solvedPuzzles: [string, EscapeAnswer][];
  collectedCodes: string[];
  hintsUsed: string[];
}

function PlayInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const t = useTranslations("escape");
  const locale = useLocale();

  // Validate difficulty
  const rawDifficulty = searchParams.get("difficulty") ?? "beginner";
  const difficulty = (
    VALID_DIFFICULTIES.has(rawDifficulty) ? rawDifficulty : "beginner"
  ) as Difficulty;

  const room = roomByDifficulty[difficulty] ?? null;

  // --- State ---
  const [remainingTime, setRemainingTime] = useState<number>(
    room?.timeLimit ?? 900
  );
  const [solvedPuzzles, setSolvedPuzzles] = useState<Map<string, EscapeAnswer>>(
    new Map()
  );
  const [collectedCodes, setCollectedCodes] = useState<string[]>([]);
  const [activePuzzle, setActivePuzzle] = useState<string | null>(null);
  const [hintsUsed, setHintsUsed] = useState<Set<string>>(new Set());
  const [gameOver, setGameOver] = useState(false);
  const [escaped, setEscaped] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const puzzleStartRef = useRef(Date.now());

  // Total non-exit puzzles
  const totalPuzzles = room
    ? room.objects.filter((o) => o.puzzleType !== "exit").length
    : 0;

  // --- Restore progress from sessionStorage ---
  useEffect(() => {
    if (!room || initialized) return;
    try {
      const raw = sessionStorage.getItem(SAVE_KEY);
      if (raw) {
        const saved: SavedProgress = JSON.parse(raw);
        if (saved.difficulty === difficulty) {
          setRemainingTime(saved.remainingTime);
          setSolvedPuzzles(new Map(saved.solvedPuzzles));
          setCollectedCodes(saved.collectedCodes);
          setHintsUsed(new Set(saved.hintsUsed));
          setInitialized(true);
          return;
        }
      }
    } catch {
      /* ignore corrupt data */
    }
    // Fresh start
    setRemainingTime(room.timeLimit);
    sessionStorage.removeItem("escape-result");
    setInitialized(true);
  }, [room, difficulty, initialized]);

  // --- Save progress to sessionStorage ---
  useEffect(() => {
    if (!initialized || gameOver || escaped) return;
    const progress: SavedProgress = {
      difficulty,
      remainingTime,
      solvedPuzzles: Array.from(solvedPuzzles.entries()),
      collectedCodes,
      hintsUsed: Array.from(hintsUsed),
    };
    sessionStorage.setItem(SAVE_KEY, JSON.stringify(progress));
  }, [
    initialized,
    difficulty,
    remainingTime,
    solvedPuzzles,
    collectedCodes,
    hintsUsed,
    gameOver,
    escaped,
  ]);

  // --- Helper: build result & redirect ---
  const finishGame = useCallback(
    (didEscape: boolean, timeLeft: number) => {
      if (!room) return;
      const escapeResult: EscapeResult = {
        roomId: room.id,
        escaped: didEscape,
        puzzlesSolved: solvedPuzzles.size,
        totalPuzzles,
        timeRemaining: timeLeft,
        hintsUsed: hintsUsed.size,
        answers: Array.from(solvedPuzzles.values()),
      };
      const sessionResult = calculateEscapeSessionResult(escapeResult, room);
      const session = {
        ...sessionResult,
        id: generateId(),
        date: new Date().toISOString(),
      };
      sessionStorage.setItem(
        "escape-result",
        JSON.stringify({ escapeResult, session })
      );
      sessionStorage.removeItem(SAVE_KEY);
      router.push(`/${locale}/escape-room/results`);
    },
    [room, solvedPuzzles, totalPuzzles, hintsUsed, router, locale]
  );

  // --- Timer ---
  useEffect(() => {
    if (!initialized || gameOver || escaped) return;
    const id = setInterval(() => {
      setRemainingTime((prev) => {
        const next = prev - 1;
        if (next <= 0) {
          clearInterval(id);
          return 0;
        }
        if (next <= 30 && next > 0) playTick();
        return next;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [initialized, gameOver, escaped]);

  // Watch for time running out
  useEffect(() => {
    if (remainingTime <= 0 && initialized && !gameOver && !escaped) {
      setGameOver(true);
      setActivePuzzle(null);
      // Small delay so state settles before redirect
      setTimeout(() => {
        finishGame(false, 0);
      }, 100);
    }
  }, [remainingTime, initialized, gameOver, escaped, finishGame]);

  // --- Beforeunload warning ---
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (initialized && !gameOver && !escaped && solvedPuzzles.size > 0) {
        e.preventDefault();
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [initialized, gameOver, escaped, solvedPuzzles]);

  // --- Hint handler ---
  const handleUseHint = useCallback(
    (puzzleId: string) => {
      setHintsUsed((prev) => {
        const next = new Set(prev);
        next.add(puzzleId);
        return next;
      });
      // Penalty: -60 seconds
      setRemainingTime((prev) => Math.max(0, prev - 60));
    },
    []
  );

  // --- Object click handler ---
  const handleObjectClick = useCallback(
    (objectId: string) => {
      if (!room || gameOver || escaped) return;

      const obj = room.objects.find((o) => o.id === objectId);
      if (!obj) return;

      // Already solved (non-exit)?
      if (obj.puzzleType !== "exit" && solvedPuzzles.has(objectId)) return;

      // Exit door: only openable when all codes collected
      if (obj.puzzleType === "exit" && collectedCodes.length < totalPuzzles) {
        return;
      }

      puzzleStartRef.current = Date.now();
      setActivePuzzle(objectId);
    },
    [room, gameOver, escaped, solvedPuzzles, collectedCodes, totalPuzzles]
  );

  // --- Puzzle solve handler ---
  const handlePuzzleSolve = useCallback(
    (correct: boolean) => {
      if (!room || !activePuzzle) return;

      const puzzle = room.puzzles[activePuzzle];
      if (!puzzle) return;

      const timeSpent = Math.round(
        (Date.now() - puzzleStartRef.current) / 1000
      );
      const hintWasUsed = hintsUsed.has(activePuzzle);

      if (puzzle.type === "exit") {
        if (correct) {
          // Escaped!
          setEscaped(true);
          setActivePuzzle(null);
          setTimeout(() => {
            finishGame(true, remainingTime);
          }, 1000);
        }
        // If incorrect on exit, modal stays open for retry (don't close)
        return;
      }

      // Non-exit puzzle
      if (correct) {
        playCorrect();
        const answer = scorePuzzle(
          activePuzzle,
          puzzle.type,
          true,
          hintWasUsed,
          timeSpent
        );
        setSolvedPuzzles((prev) => {
          const next = new Map(prev);
          next.set(activePuzzle, answer);
          return next;
        });

        // Collect the code
        if ("code" in puzzle && puzzle.code) {
          setCollectedCodes((prev) => [...prev, puzzle.code]);
          setTimeout(() => playCollect(), 300);
        }

        // Close modal after brief delay for success animation
        setTimeout(() => {
          setActivePuzzle(null);
        }, 1000);
      } else {
        // Wrong answer on non-exit puzzle: record as incorrect but still give code
        // so the game remains winnable (player gets 0 points for this puzzle)
        playWrong();
        const answer = scorePuzzle(
          activePuzzle,
          puzzle.type,
          false,
          hintWasUsed,
          timeSpent
        );
        setSolvedPuzzles((prev) => {
          const next = new Map(prev);
          next.set(activePuzzle, answer);
          return next;
        });

        // Still collect the code so exit is reachable
        if ("code" in puzzle && puzzle.code) {
          setCollectedCodes((prev) => [...prev, puzzle.code]);
        }

        setTimeout(() => {
          setActivePuzzle(null);
        }, 1000);
      }
    },
    [room, activePuzzle, hintsUsed, finishGame, remainingTime]
  );

  // --- Close modal ---
  const handleCloseModal = useCallback(() => {
    setActivePuzzle(null);
  }, []);

  // --- Redirect if no room ---
  useEffect(() => {
    if (!room) {
      router.replace(`/${locale}/escape-room`);
    }
  }, [room, router, locale]);

  if (!room) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ed-cream">
        <p className="text-ed-ink-muted animate-pulse">{t("loading")}</p>
      </div>
    );
  }

  // Get active puzzle data
  const activeObject = activePuzzle
    ? room.objects.find((o) => o.id === activePuzzle)
    : null;
  const activePuzzleData = activePuzzle
    ? room.puzzles[activePuzzle]
    : null;

  // Get hint text for active puzzle
  const activeHintText =
    activePuzzleData && "hint" in activePuzzleData
      ? (activePuzzleData as Puzzle & { hint?: string }).hint ?? ""
      : "";

  return (
    <div className="flex min-h-screen flex-col bg-ed-cream">
      {/* Top bar */}
      <div className="sticky top-0 z-30 border-b border-ed-border bg-ed-cream/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center gap-4 px-4 py-3">
          <a
            href={`/${locale}/escape-room`}
            className="shrink-0 text-sm text-ed-ink-muted transition-colors hover:text-ed-teal"
          >
            &larr; {t("backToHub")}
          </a>

          <div className="min-w-0 flex-1">
            <TimerBar
              totalSeconds={room.timeLimit}
              remainingSeconds={remainingTime}
            />
          </div>

          <span className="shrink-0 text-xs font-semibold uppercase tracking-widest text-ed-ink-muted">
            {t("puzzlesSolved", {
              solved: collectedCodes.length,
              total: totalPuzzles,
            })}
          </span>
        </div>
      </div>

      {/* Main area */}
      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-6">
        <div className="relative flex-1">
          <RoomView
            room={room}
            solvedPuzzles={solvedPuzzles}
            collectedCodes={collectedCodes}
            totalPuzzles={totalPuzzles}
            onObjectClick={handleObjectClick}
          />
        </div>

        {/* Scenario text bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="mt-4 rounded-lg border border-ed-border bg-ed-card px-4 py-3"
        >
          <p className="text-center text-sm italic text-ed-ink-muted">
            {room.scenario}
          </p>
          {collectedCodes.length < totalPuzzles && (
            <p className="mt-1 text-center text-xs text-ed-ink-muted">
              {t("clickToInvestigate")}
            </p>
          )}
          {collectedCodes.length >= totalPuzzles && !escaped && (
            <p className="mt-1 text-center text-xs font-semibold text-ed-teal">
              {t("exitReady")}
            </p>
          )}
          {collectedCodes.length > 0 &&
            collectedCodes.length < totalPuzzles && (
              <p className="mt-1 text-center text-xs text-amber-600">
                {t("exitLocked", {
                  remaining: totalPuzzles - collectedCodes.length,
                })}
              </p>
            )}
        </motion.div>
      </div>

      {/* Puzzle Modal */}
      <AnimatePresence>
        {activePuzzle && activeObject && activePuzzleData && (
          <PuzzleModal
            objectName={activeObject.name}
            objectIcon={activeObject.icon}
            puzzle={activePuzzleData}
            hintText={activeHintText}
            hintUsed={hintsUsed.has(activePuzzle)}
            onUseHint={() => handleUseHint(activePuzzle)}
            onSolve={handlePuzzleSolve}
            onClose={handleCloseModal}
            collectedCodes={collectedCodes}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default function EscapePlayPage() {
  const t = useTranslations("escape");
  return (
    <Suspense fallback={<EscapeRoomSkeleton />}>
      <PlayInner />
    </Suspense>
  );
}
