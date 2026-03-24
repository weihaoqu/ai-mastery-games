"use client";

import { useEffect, useMemo, useState } from "react";
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
import { getMasteryEmoji } from "@/lib/detective/scoring";
import { saveSession } from "@/lib/storage";
import { playComplete } from "@/lib/sounds";
import { ResultsSkeleton } from "@/components/Skeleton";
import CertificateModal from "@/components/CertificateModal";
import ShareButton from "@/components/ShareButton";
import Header from "@/components/Header";

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip);

export default function ResultsPage() {
  const router = useRouter();
  const t = useTranslations("results");
  const tCert = useTranslations("certificate");
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
    const raw = sessionStorage.getItem("detective-result");
    if (raw) {
      try {
        setSession(JSON.parse(raw));
        return;
      } catch { /* fall through */ }
    }
    try {
      const stored = localStorage.getItem("ai-mastery-games");
      if (stored) {
        const data = JSON.parse(stored);
        const sessions = (data.sessions || []).filter(
          (s: SessionResult) => s.game === "detective"
        );
        if (sessions.length > 0) {
          setSession(sessions[sessions.length - 1]);
          return;
        }
      }
    } catch { /* fall through */ }
    router.replace(`/${locale}/detective`);
  }, [router]);

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
    }, 25);
    return () => clearInterval(id);
  }, [session]);

  const radarData = useMemo(() => {
    if (!session) return null;
    const d = session.dimensions;
    return {
      labels: [tDim("prompting"), tDim("concepts"), tDim("tools"), tDim("criticalThinking"), tDim("ethics")],
      datasets: [
        {
          label: t("yourScore"),
          data: [d.prompting, d.concepts, d.tools, d.criticalThinking, d.ethics],
          backgroundColor: "rgba(0, 106, 45, 0.15)",
          borderColor: "rgba(0, 106, 45, 0.8)",
          borderWidth: 2,
          pointBackgroundColor: "#006a2d",
          pointBorderColor: "#006a2d",
          pointRadius: 4,
        },
      ],
    };
  }, [session, tDim, t]);

  const radarOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: true,
      scales: {
        r: {
          beginAtZero: true,
          max: 100,
          ticks: { stepSize: 20, display: false },
          grid: { color: "rgba(152, 182, 125, 0.4)" },
          angleLines: { color: "rgba(152, 182, 125, 0.4)" },
          pointLabels: { color: "#486333", font: { size: 11, weight: 700 as const } },
        },
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "#ffffff",
          borderColor: "#98b67d",
          borderWidth: 1,
          titleColor: "#006a2d",
          bodyColor: "#1c3509",
        },
      },
    }),
    []
  );

  if (!session) {
    return <ResultsSkeleton />;
  }

  const masteryEmoji = getMasteryEmoji(session.masteryLevel);
  const masteryLabel = tMastery(session.masteryLevel);
  const correctCount = session.cases.filter((c) => c.isCorrect).length;
  const scoreColor = session.overallScore >= 80 ? "text-primary" : session.overallScore >= 50 ? "text-secondary" : "text-error";

  return (
    <>
      <Header />
      <main className="flex-grow px-6 pt-24 pb-12 lg:px-12">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Hero Header */}
          <motion.section
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-2"
          >
            <div className="inline-flex items-center gap-2 bg-primary-container text-on-primary-container px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider font-label">
              <span className="material-symbols-outlined text-sm">verified</span>
              {t("missionComplete") || "Mission Complete"}
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black font-headline text-on-surface tracking-tight leading-none">
              {t("title")}
            </h1>
            <p className="text-xl text-on-surface-variant font-medium">
              {t("casesCorrect", { correct: correctCount, total: session.cases.length })}
            </p>
          </motion.section>

          {/* Bento Grid Results */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Score Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="md:col-span-4 bg-surface-container-lowest p-8 rounded-xl border-b-4 border-r-4 border-outline-variant flex flex-col items-center justify-center text-center relative overflow-hidden"
            >
              <span className="text-xs font-label text-on-surface-variant uppercase tracking-widest mb-2">
                {t("overallScore")}
              </span>
              <div className={`text-8xl font-black font-headline ${scoreColor}`}>
                {displayScore}
              </div>
            </motion.div>

            {/* Mastery Rank Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="md:col-span-8 bg-surface-container-high p-8 rounded-xl flex flex-col md:flex-row items-center gap-8 relative overflow-hidden"
            >
              <div className="flex-shrink-0 text-6xl">{masteryEmoji}</div>
              <div className="flex-grow space-y-3">
                <h3 className="text-3xl font-black font-headline text-on-surface">
                  {masteryLabel}
                </h3>
                <div className="w-full bg-white/50 h-3 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${session.overallScore}%` }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="bg-primary h-full rounded-full"
                  />
                </div>
                <div className="flex justify-between text-xs font-label font-bold text-on-surface-variant">
                  <span>{t("masteryLevel")}</span>
                </div>
              </div>
            </motion.div>

            {/* Skill Radar */}
            {radarData && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="md:col-span-6 bg-surface-container p-8 rounded-xl flex flex-col items-center justify-center"
              >
                <h4 className="font-headline font-bold text-xl mb-4 self-start">
                  {t("skillDimensions")}
                </h4>
                <div className="w-full max-w-[280px]">
                  <Radar data={radarData} options={radarOptions} />
                </div>
              </motion.div>
            )}

            {/* Case Breakdown */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="md:col-span-6 space-y-4"
            >
              <h4 className="font-headline font-bold text-xl mb-4">
                {t("caseBreakdown")}
              </h4>
              {session.cases.map((answer, i) => (
                <motion.div
                  key={`${i}-${answer.caseId}`}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + i * 0.05, duration: 0.3 }}
                  className={`bg-white p-4 rounded-xl flex items-center justify-between border-b-4 ${
                    answer.isCorrect ? "border-primary" : "border-error"
                  } transition-transform hover:-translate-y-1`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full ${
                      answer.isCorrect ? "bg-primary-container" : "bg-error-container/20"
                    } flex items-center justify-center`}>
                      <span className={`material-symbols-outlined ${
                        answer.isCorrect ? "text-primary" : "text-error"
                      }`} style={answer.isCorrect ? { fontVariationSettings: "'FILL' 1" } : undefined}>
                        {answer.isCorrect ? "check_circle" : "cancel"}
                      </span>
                    </div>
                    <div>
                      <p className="font-bold text-on-surface">{answer.caseTitle || `Case ${i + 1}`}</p>
                      <p className="text-xs font-label text-on-surface-variant uppercase tracking-tighter">
                        {answer.caseType?.replace("-", " ") || "Case"} · {answer.score}pts
                      </p>
                    </div>
                  </div>
                  <span className={`font-label font-bold ${answer.isCorrect ? "text-primary" : "text-error"}`}>
                    {answer.isCorrect ? `+${answer.score}` : "0"}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Footer Actions */}
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.4 }}
            className="flex flex-wrap justify-center md:justify-end gap-4 pb-12"
          >
            <Link
              href="/"
              className="flex items-center gap-2 px-6 py-4 bg-surface-container-highest text-on-surface font-bold rounded-xl border-b-4 border-outline-variant hover:translate-y-1 hover:border-b-0 transition-all"
            >
              <span className="material-symbols-outlined">arrow_back</span>
              {t("backToHub")}
            </Link>
            <ShareButton
              gameName={tGames("detective.name")}
              score={session.overallScore}
              masteryLevel={tMastery(session.masteryLevel)}
              difficulty={session.difficulty}
            />
            <button
              onClick={() => setCertModalOpen(true)}
              className="flex items-center gap-2 px-6 py-4 bg-tertiary text-on-tertiary font-bold rounded-xl border-b-4 border-[#3a2f85] hover:translate-y-1 hover:border-b-0 transition-all"
            >
              <span className="material-symbols-outlined">description</span>
              {tCert("downloadCertificate")}
            </button>
            <Link
              href="/detective"
              className="flex items-center gap-2 px-8 py-4 bg-primary text-on-primary font-bold rounded-xl border-b-4 border-[#004c1e] hover:translate-y-1 hover:border-b-0 transition-all"
            >
              <span className="material-symbols-outlined">replay</span>
              {t("playAgain")}
            </Link>
          </motion.section>
        </div>

        {/* Certificate Modal */}
        <CertificateModal
          isOpen={certModalOpen}
          onClose={() => setCertModalOpen(false)}
          session={session}
        />
      </main>
    </>
  );
}
