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
import { getMasteryEmoji } from "@/lib/tumble/scoring";
import { saveSession } from "@/lib/storage";
import { playComplete } from "@/lib/sounds";
import { ResultsSkeleton } from "@/components/Skeleton";
import CertificateModal from "@/components/CertificateModal";
import ShareButton from "@/components/ShareButton";
import Header from "@/components/Header";

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip);

export default function TumbleResultsPage() {
  const router = useRouter();
  const t = useTranslations("results");
  const tTumble = useTranslations("tumble");
  const tMastery = useTranslations("mastery");
  const tDim = useTranslations("dimensions");
  const tGames = useTranslations("games");
  const locale = useLocale();
  const [session, setSession] = useState<SessionResult | null>(null);
  const [displayScore, setDisplayScore] = useState(0);
  const [saved, setSaved] = useState(false);
  const [certModalOpen, setCertModalOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = sessionStorage.getItem("tumble-result");
    if (raw) {
      try { setSession(JSON.parse(raw)); return; } catch { /* fall through */ }
    }
    try {
      const stored = localStorage.getItem("ai-mastery-games");
      if (stored) {
        const data = JSON.parse(stored);
        const sessions = (data.sessions || []).filter((s: SessionResult) => s.game === "tumble");
        if (sessions.length > 0) { setSession(sessions[sessions.length - 1]); return; }
      }
    } catch { /* fall through */ }
    router.replace(`/${locale}/tumble`);
  }, [router, locale]);

  useEffect(() => {
    if (session && !saved) { saveSession(session); setSaved(true); playComplete(); }
  }, [session, saved]);

  useEffect(() => {
    if (!session) return;
    const target = session.overallScore;
    if (target === 0) return;
    let current = 0;
    const step = Math.max(1, Math.floor(target / 50));
    const id = setInterval(() => {
      current += step;
      if (current >= target) { current = target; clearInterval(id); }
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
    datasets: [{
      label: "Score",
      data: [dims.prompting, dims.concepts, dims.tools, dims.criticalThinking, dims.ethics],
      backgroundColor: "rgba(0, 106, 45, 0.15)",
      borderColor: "#006a2d",
      borderWidth: 2,
      pointBackgroundColor: "#006a2d",
      pointRadius: 4,
    }],
  };

  const radarOptions = {
    scales: {
      r: {
        beginAtZero: true, max: 100,
        ticks: { stepSize: 25, display: false },
        grid: { color: "rgba(152,182,125,0.3)" },
        angleLines: { color: "rgba(152,182,125,0.3)" },
        pointLabels: { font: { size: 11, family: "'Be Vietnam Pro', sans-serif", weight: "bold" as const }, color: "#486333" },
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
          <div className="bg-surface-container-lowest border-2 border-outline-variant rounded-2xl p-6 sm:p-8 shadow-[0_6px_0_0_rgba(152,182,125,1)] mb-8 text-center">
            <p className="text-sm font-label text-on-surface-variant uppercase tracking-widest mb-2">{t("overallScore")}</p>
            <p className="text-6xl sm:text-7xl font-headline font-extrabold text-primary mb-2">{displayScore}</p>
            <p className="text-on-surface-variant mb-4">{t("casesCorrect", { correct, total })}</p>
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full font-bold text-sm border border-primary/20">
              <span className="text-xl">{getMasteryEmoji(session.masteryLevel)}</span>
              {tMastery(session.masteryLevel)}
            </div>
          </div>

          <div className="bg-surface-container-lowest border-2 border-outline-variant rounded-2xl p-6 shadow-[0_4px_0_0_rgba(152,182,125,1)] mb-8">
            <h2 className="font-headline text-lg font-bold text-on-surface mb-4 text-center">{t("skillDimensions")}</h2>
            <div className="max-w-sm mx-auto">
              <Radar data={radarData} options={radarOptions} />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <Link href={`/${locale}/tumble`} className="flex-1">
              <button aria-label={t("playAgain")} className="w-full px-6 py-3 rounded-xl bg-primary text-on-primary font-bold font-label text-sm shadow-[0_3px_0_0_rgba(0,80,25,1)] hover:shadow-[0_1px_0_0_rgba(0,80,25,1)] hover:translate-y-[2px] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
                {t("playAgain")}
              </button>
            </Link>
            <button
              onClick={() => setCertModalOpen(true)}
              aria-label={tTumble("certificate")}
              className="flex-1 px-6 py-3 rounded-xl bg-surface-container border-2 border-outline-variant text-on-surface font-bold font-label text-sm shadow-[0_3px_0_0_rgba(152,182,125,0.5)] hover:shadow-[0_1px_0_0_rgba(152,182,125,0.5)] hover:translate-y-[2px] transition-all flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              <span className="material-symbols-outlined text-lg">workspace_premium</span>
              {tTumble("certificate")}
            </button>
            <ShareButton
              gameName={tGames("tumble.name")}
              score={session.overallScore}
              masteryLevel={tMastery(session.masteryLevel)}
              difficulty={session.difficulty}
            />
          </div>

          <div className="text-center">
            <Link href={`/${locale}`} className="text-sm text-on-surface-variant hover:text-primary transition-colors font-label">
              {t("backToHub")} &rarr;
            </Link>
          </div>
        </motion.div>

        <CertificateModal isOpen={certModalOpen} onClose={() => setCertModalOpen(false)} session={session} />
      </main>
    </>
  );
}
