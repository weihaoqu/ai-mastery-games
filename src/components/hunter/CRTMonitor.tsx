"use client";

import type { ReactNode } from "react";

interface CRTMonitorProps {
  children: ReactNode;
  flash?: "green" | "red" | null;
}

export default function CRTMonitor({ children, flash }: CRTMonitorProps) {
  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Monitor bezel */}
      <div className={`
        relative rounded-xl border-4 border-[#2a2a2a] bg-[#0a1a0a] p-1
        shadow-[0_0_30px_rgba(0,255,0,0.15),inset_0_0_60px_rgba(0,0,0,0.5)]
        ${flash === "green" ? "animate-[flash-green_0.3s_ease-out]" : ""}
        ${flash === "red" ? "animate-[flash-red_0.3s_ease-out]" : ""}
      `}>
        {/* Screen area */}
        <div className="relative rounded-lg overflow-hidden bg-[#0a1a0a] p-5">
          {/* Scanline overlay */}
          <div
            className="pointer-events-none absolute inset-0 z-10 opacity-[0.04]"
            style={{
              backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,255,0,0.03) 1px, rgba(0,255,0,0.03) 2px)",
              backgroundSize: "100% 2px",
            }}
          />

          {/* Phosphor glow */}
          <div className="pointer-events-none absolute inset-0 z-10 rounded-lg"
            style={{
              boxShadow: "inset 0 0 40px rgba(0,255,0,0.06)",
            }}
          />

          {/* Content */}
          <div className="relative z-0">
            {children}
          </div>
        </div>
      </div>

      {/* Monitor base */}
      <div className="mx-auto w-1/3 h-2 bg-[#2a2a2a] rounded-b-lg" />
    </div>
  );
}
