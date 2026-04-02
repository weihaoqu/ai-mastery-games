"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
} from "chart.js";
import { Radar } from "react-chartjs-2";
import type { SessionResult } from "@/lib/types";
import { getMasteryEmoji } from "@/lib/ethics/scoring";
import { saveSession } from "@/lib/storage";
import { playComplete } from "@/lib/sounds";
import { ResultsSkeleton } from "@/components/Skeleton";
import CertificateModal from "@/components/CertificateModal";
import ShareButton from "@/components/ShareButton";
import Header from "@/components/Header";
import MeterBar from "@/components/ethics/MeterBar";

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip);

const METER_COLORS: Record<string, string> = {
  trust: "#006a2d",
  profit: "#9b3f00",
  safety: "#0061a4",
  equity: "#5b4bb4",
};

export default function EthicsResultsPage() {
  const router = useRouter();
  const t = useTranslations("results");
  const tMastery = useTranslations("mastery");
  const tDim = useTranslations("dimensions");
  const tGames = useTranslations("games");
  const tEthics = useTranslations("ethics");
  const locale = useLocale();
  const [session, setSession] = useState<SessionResult | null>(null);
  const [displayScore, setDisplayScore] = useState(0);
  const [saved, setSaved] = useState(false);
  const [certModalOpen, setCertModalOpen] = useState(false);
  const [finalMeters, setFinalMeters] = useState({ trust: 5, profit: 5, safety: 5, equity: 5 });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = sessionStorage.getItem("ethics-result");
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setSession(parsed);
        // Extract final meters from the last case's extra data or reconstruct
        if (parsed._finalMeters) {
          setFinalMeters(parsed._finalMeters);
        }
        return;
      } catch { /* fall through */ }
    }
    try {
      const stored = localStorage.getItem("ai-mastery-games");
      if (stored) {
        const data = JSON.parse(stored);
        const sessions = (data.sessions || []).filter(
          (s: SessionResult) => s.game === "ethics"
        );
        if (sessions.length > 0) {
          setSession(sessions[sessions.length - 1]);
          return;
        }
      }
    } catch { /* fall through */ }
    router.replace(`/${locale}/ethics`);
  }, [router, locale]);

  useEffect(() => {
    if (session && !saved) {
      saveSession(session);
      setSaved(true);
      playComplete();
    }
  }, [session, saved]);

  useEffect(() => {
    if (!session) return;
    const target = session.overallScore;
    if (target === 0) return;
    let current = 0;
    const step = Math.max(1, Math.floor(target / 50));
    const id = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(id);
      }
      setDisplayScore(current);
    }, 20);
    return () => clearInterval(id);
  }, [session]);

  if (!session) return <ResultsSkeleton />;

  const correct = session.cases.filter((c) => c.isCorrect).length;
  const total = session.cases.length;
  const dims = session.dimensions;

  const radarData = {
    labels: [tDim("prompting"), tDim("concepts"), tDim("tools"), tDim("criticalThinking"), tDim("ethics")],
    datasets: [
      {
        label: t("overallScore"),
        data: [dims.prompting, dims.concepts, dims.tools, dims.criticalThinking, dims.ethics],
        backgroundColor: "rgba(91, 75, 180, 0.15)",
        borderColor: "#5b4bb4",
        borderWidth: 2,
        pointBackgroundColor: "#5b4bb4",
        pointRadius: 4,
      },
    ],
  };

  const radarOptions = {
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        ticks: { stepSize: 25, display: false },
        grid: { color: "rgba(91,75,180,0.2)" },
        angleLines: { color: "rgba(91,75,180,0.2)" },
        pointLabels: { font: { size: 11, family: "'Be Vietnam Pro', sans-serif", weight: "bold" as const }, color: "#5b4bb4" },
      },
    },
    plugins: { legend: { display: false } },
    responsive: true,
    maintainAspectRatio: true,
  };

  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12 pt-20 sm:pt-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          {/* Score Card */}
          <div className="bg-surface-container-lowest border-2 border-outline-variant rounded-2xl p-6 sm:p-8 shadow-[0_6px_0_0_rgba(91,75,180,0.6)] mb-8 text-center">
            <p className="text-sm font-label text-on-surface-variant uppercase tracking-widest mb-2">
              {t("overallScore")}
            </p>
            <p className="text-6xl sm:text-7xl font-headline font-extrabold text-tertiary mb-2" aria-live="polite">
              {displayScore}
            </p>
            <p className="text-on-surface-variant mb-4">
              {t("casesCorrect", { correct, total })}
            </p>

            {/* Mastery badge */}
            <div className="inline-flex items-center gap-2 bg-tertiary/10 text-tertiary px-4 py-2 rounded-full font-bold text-sm border border-tertiary/20">
              <span className="text-xl">{getMasteryEmoji(session.masteryLevel)}</span>
              {tMastery(session.masteryLevel)}
            </div>
          </div>

          {/* Final Meters */}
          <div className="bg-surface-container-lowest border-2 border-outline-variant rounded-2xl p-6 shadow-[0_4px_0_0_rgba(91,75,180,0.4)] mb-8">
            <h2 className="font-headline text-lg font-bold text-on-surface mb-4 text-center">{tEthics("meterBalance")}</h2>
            <div className="space-y-3">
              <MeterBar label={tEthics("trust")} value={finalMeters.trust} max={10} color={METER_COLORS.trust} />
              <MeterBar label={tEthics("profit")} value={finalMeters.profit} max={10} color={METER_COLORS.profit} />
              <MeterBar label={tEthics("safety")} value={finalMeters.safety} max={10} color={METER_COLORS.safety} />
              <MeterBar label={tEthics("equity")} value={finalMeters.equity} max={10} color={METER_COLORS.equity} />
            </div>
          </div>

          {/* Radar Chart */}
          <div className="bg-surface-container-lowest border-2 border-outline-variant rounded-2xl p-6 shadow-[0_4px_0_0_rgba(91,75,180,0.4)] mb-8">
            <h2 className="font-headline text-lg font-bold text-on-surface mb-4 text-center">{t("skillDimensions")}</h2>
            <div className="max-w-sm mx-auto">
              <Radar data={radarData} options={radarOptions} />
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <Link href={`/${locale}/ethics`} className="flex-1">
              <button className="w-full px-6 py-3 rounded-xl bg-tertiary text-on-tertiary font-bold font-label text-sm shadow-[0_3px_0_0_rgba(60,50,120,1)] hover:shadow-[0_1px_0_0_rgba(60,50,120,1)] hover:translate-y-[2px] transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tertiary">
                {t("playAgain")}
              </button>
            </Link>
            <button
              onClick={() => setCertModalOpen(true)}
              aria-label={tEthics("certificateBtn")}
              className="flex-1 px-6 py-3 rounded-xl bg-surface-container border-2 border-outline-variant text-on-surface font-bold font-label text-sm shadow-[0_3px_0_0_rgba(91,75,180,0.4)] hover:shadow-[0_1px_0_0_rgba(91,75,180,0.4)] hover:translate-y-[2px] transition-all flex items-center justify-center gap-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tertiary"
            >
              <span className="material-symbols-outlined text-lg" aria-hidden="true">workspace_premium</span>
              {tEthics("certificateBtn")}
            </button>
            <ShareButton
              gameName={tGames("ethics.name")}
              score={session.overallScore}
              masteryLevel={tMastery(session.masteryLevel)}
              difficulty={session.difficulty}
            />
          </div>

          <div className="text-center">
            <Link
              href={`/${locale}`}
              className="text-sm text-on-surface-variant hover:text-tertiary transition-colors font-label focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tertiary rounded"
            >
              {t("backToHub")} &rarr;
            </Link>
          </div>
        </motion.div>

        <CertificateModal
          isOpen={certModalOpen}
          onClose={() => setCertModalOpen(false)}
          session={session}
        />
      </main>
    </>
  );
}
